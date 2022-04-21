
//sValidation=nyfjs
//sCaption=Apply relative path variables ...
//sHint=Apply relative path variables to local file:// links and shortcuts
//sCategory=MainMenu.RelativePath
//sCondition=CURDB; DBRW; OUTLINE; CURINFOITEM
//sID=p.ApplyRelativePath
//sAppVerMin=8.0
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

				if(plugin.isContentEditable()) plugin.commitCurrentChanges();

				var sVars='';
				{
					var vTmp=xNyf.listRelativePaths('predefined, userdefined').split('\n');
					for(var i in vTmp){
						var sLine=_trim(vTmp[i]);
						if(sLine){
							var f=sLine.split('\t');
							if(f.length>=2){
								var k=_trim(f[0]), v=_trim(f[1]);
								if(k){
									if(sVars) sVars+='\n';
									sVars+=(k+'\t'+v);
								}
							}
						}
					}
				}

				var vRange=[
							_lc('p.Common.CurBranch', 'Current branch')
							, _lc('p.Common.CurDB', 'Current database')
						];

				var vLinkTypes=[
							_lc2('AllFileLinks', 'Hyperlinks and shortcuts')
							, _lc2('OnlyHyperlinks', 'Hyperlinks only')
							, _lc2('OnlyShortcuts', 'Shortcuts only')
						];


				var sCfgKey1='ApplyRelativePath.iRange', sCfgKey2='ApplyRelativePath.iLinkType';

				var vFields = [
							{sField: 'combolist', sLabel: _lc2('Range', 'Range'), vItems: vRange, sInit: localStorage.getItem(sCfgKey1)||'', bReq: true}
							, {sField: 'combolist', sLabel: _lc2('LinkType', 'Link type'), vItems: vLinkTypes, sInit: localStorage.getItem(sCfgKey2)||'', bReq: true}
							, {sField: 'textarea', sLabel: _lc2('VarList', 'Relative path variables already defined'), sInit: sVars, bWordwrap: false, bReadonly: true, bReq: false}
						];

				var vRes=input(plugin.getScriptTitle(), vFields, {nMinSize: 650, vMargins: [6, 0, 30, 0], bVert: true});
				if(vRes && vRes.length>=2){

					var iRange=parseInt(vRes[0]), iLinkType=parseInt(vRes[1]);

					var bCurBranch=(iRange===0), bHyperlinks=(iLinkType===0 || iLinkType===1), bShortcuts=(iLinkType===0 || iLinkType===2);

					var sCurItem=plugin.getCurInfoItem();
					var sStartItem=bCurBranch ? (sCurItem||plugin.getDefRootContainer()) : plugin.getDefRootContainer();

					localStorage.setItem(sCfgKey1, iRange);
					localStorage.setItem(sCfgKey2, iLinkType);

					plugin.initProgressRange(plugin.getScriptTitle(), 0);

					include('comutils');

					var vLog0=[];
					var _log=function(vLog, sTag, sUri0, sSrcFn0, sUri2, sLocation){
						vLog.push({sTag: sTag, sUri0: sUri0, sSrcFn0: sSrcFn0, sUri2: sUri2, sLocation: sLocation});
					};

					var _location_info=function(sSsgPath, sName){
						var sLoc='@{' + xNyf.getLocationText(sSsgPath, ' - ') + '}';
						if(!plugin.isReservedNoteFn(sName)){
							sLoc=sName + ' ' + sLoc;
						}
						return sLoc;
					};

					var _act_on_shortcut=function(xDb, sSsgFn, sLocation){
						var bSucc=false;
						var bPercentDecoding=false, sUri0=xDb.getShortcutLink(sSsgFn, bPercentDecoding);
						var bResolve=false, sSrcFn0=xDb.getShortcutFile(sSsgFn, bResolve), sSrcFn2=xDb.getShortcutFile(sSsgFn, true);
						if(sUri0){
							if(sSrcFn2){
								var sUri2=xDb.makeFileLinkWithRelativePath(sSrcFn2);
								if(sUri0!==sUri2){
									//var sTxt='[InternetShortcut]\r\nURL='+sUri2+'\r\n';
									//if(xDb.saveUtf8(sSsgFn, sTxt, true)){
									//	if(xDb.setShortcut(sSsgFn)){
									//		_log(vLog0, _lc2('Shortcut', 'Shortcut'), sUri0, sSrcFn0, sUri2, sLocation);
									//		bSucc=true;
									//	}
									//}
									if(xDb.createShortcut(sSsgFn, sUri2)){
										_log(vLog0, _lc2('Shortcut', 'Shortcut'), sUri0, sSrcFn0, sUri2, sLocation);
										bSucc=true;
									}
								}
							}
						}
						return bSucc;
					};

					var _act_on_htmldoc=function(xDb, sSsgFn, sLocation){
						var bSucc=false;
						var sHtml=xDb.loadText(sSsgFn, 'html');
						if(sHtml){
							var vTmpLog=[];
							var sNew=substituteUrisWithinHtml(sHtml, 'img,a,link', function(sUri0, sTagName){
								var u=sUri0 || '';
								if(u.search(/^file:\/\//i)===0){
									var sSrcFn0=localFileFromUrl(sUri0, true); //with percent-decoding;
									var sSrcFn2=xDb.evalRelativePath(sSrcFn0);
									if(sSrcFn2){
										var sUri2=xDb.makeFileLinkWithRelativePath(sSrcFn2);
										if(sUri0!==sUri2){
											u=sUri2;
											_log(vTmpLog, _lc2('Hyperlink', 'Hyperlink'), sUri0, sSrcFn0, sUri2, sLocation);
										}
									}
								}
								return u;
							});

							if(sHtml!==sNew){
								var nBytes=xDb.saveUtf8(sSsgFn, sNew, true);
								if(nBytes>0){
									vLog0=vLog0.concat(vTmpLog);
									bSucc=true;
								}
							}
						}
						return bSucc;
					};

					var vExtsHtml='html|htm|qrich'.split('|');
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
								var sExt=xSsgFn.getExtension(false).toLowerCase();
								if(bShortcuts && xNyf.isShortcut(xSsgFn.toStr())){
									if(_act_on_shortcut(xNyf, xSsgFn.toStr(), _location_info(sSsgPath, sName))){
										//succeeded;
									}
								}else if(bHyperlinks && sExt && vExtsHtml.indexOf(sExt)>=0){
									if(_act_on_htmldoc(xNyf, xSsgFn.toStr(), _location_info(sSsgPath, sName))){
										//succeeded;
									}
								}
							}

						}
					};

					xNyf.traverseOutline(sStartItem, bCurBranch, _act_on_treeitem);

					if(vLog0.length>0){

						if(sCurItem) plugin.refreshDocViews(-1, sCurItem);

						var sRes='', sLocationTrack, sIndent='\t';
						for(var i in vLog0){
							var d=vLog0[i];
							if(sRes) sRes+='\n';
							if(sLocationTrack){
								if(sLocationTrack!==d.sLocation){
									sRes += d.sTag + ': ' + d.sLocation;
									sRes +='\n';
								}
							}else{
								sRes += d.sTag + ': ' + d.sLocation;
								sRes +='\n';
							}
							sRes += sIndent + '=> ' + d.sUri0;
							sRes += '\n';
							sRes += sIndent + '=> ' + d.sSrcFn0;
							sRes += '\n';
							sRes += sIndent + '=> ' + d.sUri2;
							sRes += '\n';
							sLocationTrack=d.sLocation;
						}

						var sMsg=_lc2('Done', 'Total %nDone% hyperlink/shortcut(s) have been updated with the existing relative path variables.').replace('%nDone%', vLog0.length);
						textbox({
								sTitle: plugin.getScriptTitle()
								, sDescr: sMsg
								, sDefTxt: sRes
								, bReadonly: true
								, bWordwrap: false
								, nWidth: 80
								, nHeight: 70
							});
					}else{
						alert(_lc2('Unchanged', 'No hyperlink/shortcuts changed.'));
					}


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
