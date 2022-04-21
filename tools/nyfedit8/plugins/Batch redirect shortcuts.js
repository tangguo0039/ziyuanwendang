
//sValidation=nyfjs
//sCaption=Batch redirect shortcuts ...
//sHint=Replace local file path of shortcuts in current branch
//sCategory=MainMenu.Attachments; MainMenu.Tools
//sCondition=CURDB; DBRW; OUTLINE; CURINFOITEM
//sID=p.RedirShortcuts
//sAppVerMin=8.0
//sShortcutKey=
//sAuthor=wjjsoft

/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////


var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

//try{
	var xNyf=new CNyfDb(-1);

	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			if(plugin.getCurNavigationTab()==='Outline'){

				var sCurItem=plugin.getCurInfoItem()||plugin.getDefRootContainer();
				if(sCurItem){

					var _srcfn_of_shortcut=function(sSsgFn){
						var sSrcFn='';
						var xTmpFn=new CLocalFile(platform.getTempFile()); plugin.deferDeleteFile(xTmpFn.toStr());
						if(xNyf.exportFile(sSsgFn, xTmpFn.toStr())>0){
							var vLines=(xTmpFn.loadText()||'').split('\n');
							for(var i in vLines){
								var sLine=_trim(vLines[i]), sKey='url=file://';
								if(sLine.toLowerCase().indexOf(sKey)===0){
									var sSrc=sLine.substr(sKey.length);
									if(sSrc){
										sSrcFn=sSrc;
										break;
									}
								}
							}
						}
						xTmpFn.remove();
						return sSrcFn;
					};

					var sCfgKey1='RedirShortcuts.OldPath', sCfgKey2='RedirShortcuts.NewPath';
					var vFields = [
						{sField: 'lineedit', sLabel: _lc2('OldPath', 'Enter the old file path of shortcuts to replace (A * matches all)'), sInit: localStorage.getItem(sCfgKey1)||''}
						, {sField: 'lineedit', sLabel: _lc2('NewPath', 'Enter the new file path in which the linked files are now located'), sInit: localStorage.getItem(sCfgKey2)||''}
						];
					var vRes=input(plugin.getScriptTitle(), vFields, {nMinSize: 500, vMargins: [6, 0, 30, 0], bVert: true});
					if(vRes && vRes.length===2){

						var sOld=vRes[0], sNew=vRes[1];

						if(sOld){

							localStorage.setItem(sCfgKey1, sOld);

							if(sNew){

								localStorage.setItem(sCfgKey2, sNew);

								var nFolders=0;

								//To estimate the progress range;
								xNyf.traverseOutline(sCurItem, true, function(){
									nFolders++;
								});

								plugin.initProgressRange(plugin.getScriptTitle(), nFolders);

								var bAll=(sOld==='*');
								if(!bAll){
									//eliminate trailing slashes if any;
									//2020.6.6 avoid calling CLocalDir, that may alter paths like: file:///...
									sOld=sOld.replace(/[\/\\]+$/g, ''); //sOld=new CLocalDir(sOld).toStr();
								}

								var _add_shortcut=function(sSsgFn, sSrcFn){
									var sTxt='[InternetShortcut]\r\nURL=file://'+sSrcFn+'\r\n';
									return xNyf.createTextFile(sSsgFn, sTxt);
								};

								var sResults='', nDone=0;
								var _act_on_treeitem=function(sSsgPath, iLevel){

									if(xNyf.folderExists(sSsgPath)){

										var sTitle=xNyf.getFolderHint(sSsgPath); if(!sTitle) sTitle='== Untitled ==';
										var bContinue=plugin.ctrlProgressBar(sTitle, 1, true);
										if(!bContinue) return true;

										var sFilesDone='';
										var vFiles=xNyf.listFiles(sSsgPath);
										for(var i in vFiles){
											var sName=vFiles[i];
											var xSsgFn=new CLocalFile(sSsgPath, sName);
											if(xNyf.isShortcut(xSsgFn.toStr())){
												var sSrcFn=_srcfn_of_shortcut(xSsgFn.toStr());
												var xSrcFn=new CLocalFile(sSrcFn);
												var sPathSrc=''+xSrcFn.getDirectory(false);//, sName=xSrcFn.getLeafName();
												if( bAll || (sPathSrc.toLowerCase()===sOld.toLowerCase()) ){
													var xNew=new CLocalFile(sNew, sName);
													if(_add_shortcut(xSsgFn.toStr(), xNew.toStr())>0){
														if(xNyf.setShortcut(xSsgFn.toStr())){
															if(sFilesDone) sFilesDone+='\n';
															sFilesDone+=sSrcFn;
															sFilesDone+=' -> ';
															sFilesDone+=xNew.toStr();
															nDone++;
														}
													}
												}
											}
										}

										if(sFilesDone){
											if(sResults) sResults+='\n\n';
											sResults+='[ '+sTitle+' ]';
											sResults+='\n';
											sResults+=sFilesDone;
										}
									}
								};

								xNyf.traverseOutline(sCurItem, true, _act_on_treeitem);

								if(nDone>0){
									plugin.refreshDocViews(-1, sCurItem);

									var sMsg=_lc2('Done', 'Total %nDone% shortcut(s) have been updated.').replace('%nDone%', nDone);
									textbox({
										sTitle: plugin.getScriptTitle()
										, sDescr: sMsg
										, sDefTxt: sResults
										, bReadonly: true
										, bWordwrap: false
										, nWidth: 40
										, nHeight: 70
									});
								}else{
									alert('No shortcuts matched the source file path:'+'\n\n'+sOld);
								}

							}else{
								alert(_lc2('BadNewPath', 'The new source file path of shortcuts must be specified.'));
							}
						}else{
							alert(_lc2('BadOldPath', 'The old source file path of shortcuts must be specified.'));
						}

					}

				}else{
					alert(_lc('Prompt.Warn.NoInfoItemSelected', 'No info item is currently selected.'));
				}

			}else{
				alert(_lc('Prompt.Warn.OutlineNotSelected', 'The outline tree view is currently not selected.'));
			}

		}else{
			alert(_lc('Prompt.Warn.ReadonlyDb', 'Cannot modify the database opened as Readonly.'));
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}
//}catch(e){
//	alert(e);
//}
