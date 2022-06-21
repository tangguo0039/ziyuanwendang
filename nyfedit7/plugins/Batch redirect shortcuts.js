
//sValidation=nyfjs
//sCaption=Batch redirect shortcuts ...
//sHint=Replace file path of shortcuts in current branch
//sCategory=MainMenu.Attachments
//sID=p.RedirShortcuts
//sAppVerMin=7.0
//sShortcutKey=
//sAuthor=wjjsoft

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

try{
	var xNyf=new CNyfDb(-1);

	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			if(plugin.getCurNavigationTab()=='Outline'){

				var sCurItem=plugin.getCurInfoItem()||plugin.getDefRootContainer();
				if(sCurItem){

					var _srcfn_of_shortcut=function(xDb, sSsgFn){
						var sSrcFn='';
						var xTmpFn=new CLocalFile(platform.getTempFile()); platform.deferDeleteFile(xTmpFn);
						if(xDb.exportFile(sSsgFn, xTmpFn)>0){
							var vLines=(xTmpFn.loadText()||'').split('\n');
							for(var i in vLines){
								var sLine=_trim(vLines[i]), sKey='url=file://';
								if(sLine.toLowerCase().indexOf(sKey)==0){
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

					var sCfgKey='RedirShortcuts.OldPath';
					var sMsg=_lc2('OldPath', 'Enter the old file path of shortcuts to replace ( * to match all):');
					var sOld=prompt(sMsg, localStorage.getItem(sCfgKey)||''); sOld=_trim(sOld);
					if(sOld){
						localStorage.setItem(sCfgKey, sOld);

						sCfgKey='RedirShortcuts.NewPath';
						sMsg=_lc2('NewPath', 'Enter the new file path in which the linked files are now located:');
						var sNew=prompt(sMsg, localStorage.getItem(sCfgKey)||''); sNew=_trim(sNew);
						if(sNew){
							localStorage.setItem(sCfgKey, sNew);

							var nFolders=0;

							//To estimate the progress range;
							xNyf.traverseOutline(sCurItem, true, function(){
								nFolders++;
							});

							plugin.initProgressRange(plugin.getScriptTitle(), nFolders);

							var bAll=(sOld=='*');
							if(!bAll){
								//eliminate trailing slashes if any;
								sOld=new CLocalDir(sOld).toString();
							}

							var _add_shortcut=function(sSsgFn, sSrcFn){
								var sTxt='[InternetShortcut]\r\nURL=file://'+sSrcFn+'\r\n';
								return xNyf.createTextFile(sSsgFn, sTxt);
							};

							var sResults='', nDone=0;
							var _act_on_treeitem=function(sSsgPath, iLevel){

								if(xNyf.folderExists(sSsgPath, false)){

									var sTitle=xNyf.getFolderHint(sSsgPath); if(!sTitle) sTitle='== Untitled ==';
									var bContinue=plugin.ctrlProgressBar(sTitle, 1, true);
									if(!bContinue) return true;

									var sFilesDone='';
									var vFiles=xNyf.listFiles(sSsgPath);
									for(var i in vFiles){
										var sName=vFiles[i];
										var xSsgFn=new CLocalFile(sSsgPath); xSsgFn.append(sName);
										if(xNyf.isShortcut(xSsgFn)){
											var sSrcFn=_srcfn_of_shortcut(xNyf, xSsgFn);
											var xSrcFn=new CLocalFile(sSrcFn);
											var sPathSrc=''+xSrcFn.getDirectory(false);//, sName=xSrcFn.getLeafName();
											if( bAll || (sPathSrc.toLowerCase()==sOld.toLowerCase()) ){
												var xNew=new CLocalFile(sNew); xNew.append(sName);
												if(0<_add_shortcut(''+xSsgFn, xNew.toString())){
													if(xNyf.setShortcut(xSsgFn)){
														if(sFilesDone) sFilesDone+='\n';
														sFilesDone+=sSrcFn;
														sFilesDone+=' -> ';
														sFilesDone+=xNew;
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
							alert('The new source file path of shortcuts must be specified.');
						}
					}else{
						alert('The old source file path of shortcuts must be specified.');
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
}catch(e){
	alert(e);
}
