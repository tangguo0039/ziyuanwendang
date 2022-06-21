
//sValidation=nyfjs
//sCaption=Import directory tree ...
//sHint=Import directory tree with files saved as attachments/hyperlinks
//sCategory=MainMenu.Tools
//sID=p.ImportDirTree
//sAppVerMin=7.0
//sShortcutKey=
//sAuthor=wjjsoft

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

try{

	var xNyf=new CNyfDb(-1);

	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			var vSel=plugin.getSelectedInfoItems(-1);
			var nSel=(vSel ? vSel.length : 0);
			if(nSel==1){

				var sCfgKey='ImportDirTree.sSrcDir';
				var sDirToImport=platform.browseForFolder(_lc2('SelSrc', 'Select a source directory to import.'), localStorage.getItem(sCfgKey));

				if(sDirToImport){

					localStorage.setItem(sCfgKey, sDirToImport);

					var vActs=[
						  _lc2('Attach', '1. Insert files as attachments')
						, _lc2('Hyperlink', '2. Insert files as hyperlinks')
						];

					sCfgKey='ImportDirTree.iAction';
					var sMsg=_lc('p.Common.SelAction', 'Please select an action from within the dropdown list');
					var iSel=dropdown(sMsg, vActs, localStorage.getItem(sCfgKey), false);
					if(iSel>=0){

						localStorage.setItem(sCfgKey, ''+iSel);

						plugin.initProgressRange(plugin.getScriptTitle());

						var nFolders=0, nFiles=0;
						var sCurItem=plugin.getCurInfoItem(-1)||plugin.getDefRootContainer();

						var _find_unique_id=function(sSsgPath){
							return xNyf.getChildEntry(sSsgPath, 0);
						};

						var _fix_bad_controlwords=function(s)
						{
							//2011.8.19 alter the obsolete word '\chcbpat#' to '\highlight#';
							//return (s||'').replace(/(\\chcbpat)(\d+)/g, '\\highlight$2');
							return s;
						}

						var _encode_filename=function(sFn){
							var p=(''+sFn).indexOf(':'), sDrv='', sPath=''+sFn;
							if(p>=0){
								sDrv=sFn.substring(0, p+1);
								sPath=sFn.substring(p+1);
							}
							var sUrl=sDrv, v=sPath.replace(/\\/g, '/').split('/');
							for(var i in v){
								var sTmp=v[i];
								if(sTmp){
									//2012.9.25 bug-fix: the first back-slash makes 'sTmp' empty, 
									//consequently results in duplicate slashes in 'sUrl';
									if(sUrl) sUrl+='/';
									sUrl+=encodeURIComponent(sTmp);
								}
							}
							return sUrl;
						};

						var vFails=[], bContinue=true;
						var sDefNoteFn=plugin.getDefNoteFn();
						var sRenameDefNote='defnote.html';

						var _defnote_ifany=function(v){
							var sDef, sHtml;
							for(var i in v){
								var sName=v[i]||'';
								var xFn=new CLocalFile(sName);
								if(xFn.getExtension(true).toLowerCase()=='.html' && !sHtml){
									sHtml=sName;
								}
								if(sRenameDefNote==sName.toLowerCase()){
									sDef=sName;
									break;
								}
							}
							return sDef||sHtml;
						};

						var _import_files_as_attachments=function(xSsgPath, xWinPath){
							var v=xWinPath.listFiles('');
							var sDefRtf=_defnote_ifany(v)||''; //2011.9.13 detect if any file can be the default rtf note;
							for(var i in v){
								var sName=v[i];
								var xWinFn=new CLocalFile(xWinPath); xWinFn.append(sName);
								var xSsgFn=new CLocalFile(xSsgPath); xSsgFn.append((sDefRtf==sName) ? sDefNoteFn : sName);

								bContinue=plugin.ctrlProgressBar(sName, 1, true);
								if(!bContinue) return false;

								var bHtml=xWinFn.getExtension(true).toLowerCase()=='.html';
								if(bHtml){
									//2011.9.13 fix bad control words in RTF text;
									//var sHtml=xWinFn.loadText('');
									//var sNew=_fix_bad_controlwords(sHtml);
									//if(sHtml!=sNew){
									//	var xTmpFn=new CLocalFile(platform.getTempFile('', '', '.tmp')); platform.deferDeleteFile(xTmpFn);
									//	xTmpFn.saveAnsi(sNew);
									//	xWinFn=xTmpFn;
									//}
								}

								var nBytes=xNyf.createFile(xSsgFn, xWinFn);
								if(nBytes<0) vFails[vFails.length]=sName; else nFiles++;
							}
							return true;
						};

						var _import_files_as_hyperlinks=function(xSsgPath, xWinPath){
							var v=xWinPath.listFiles('');
							if(v.length>0){
								var sHtml='<html><body>'
									+ '<style>'
									+ 'body{font-family: Tahoma, Verdana, Arial; font-size: 10pt;}'
									+ '</style>'
									+ '<dl>'
									;
								for(var i in v){
									var xWinFn=new CLocalFile(xWinPath); xWinFn.append(v[i]);

									bContinue=plugin.ctrlProgressBar(xWinFn, 1, true);
									if(!bContinue) return false;

									var sUri='file:///'+_encode_filename(''+xWinFn);
									var tMod=xWinFn.getModifyTime();
									var sDate=tMod.toDateString()+' at '+tMod.toTimeString(); //2014.10.25 toLocaleDateString() somehow returns garbages in Linux;
									sHtml+='\n<dt style="margin: 1em 0 0 0;"><a href="'+sUri+'">'+v[i]+'</a></dt>';
									sHtml+='\n<dd style="margin: 0 0 0 0;">Size: '+xWinFn.getFileSize()+' bytes, Updated: '+sDate+'</dd>';
								}
								sHtml+='</dl></body></html>';

								var xSsgFn=new CLocalFile(xSsgPath); xSsgFn.append(plugin.getDefNoteFn());
								var nBytes=xNyf.createTextFile(xSsgFn, sHtml);
							}

							return true;
						};

						var _import_folder=function(sSsgPath, sWinPath, xActOnFile){

							bContinue=plugin.ctrlProgressBar(sWinPath, 1, true);
							if(!bContinue) return false;

							var xWinPath=new CLocalDir(sWinPath);
							var xSubItem=new CLocalFile(sSsgPath); xSubItem.append(_find_unique_id(sSsgPath));
							if(xNyf.createFolder(xSubItem)){
								xNyf.setFolderHint(xSubItem, xWinPath.getLeafName());

								bContinue=xActOnFile(xSubItem, xWinPath);
								if(!bContinue) return false;

								var v=xWinPath.listFolders('*');
								for(var i in v){
									if( v[i]=='.' || v[i]=='..' ) continue;
									var xSubDir=new CLocalFile(xWinPath); xSubDir.append(v[i]);
									if(!_import_folder(xSubItem, xSubDir, xActOnFile)){
										return false;
									}
								}
								nFolders++;
							}
							return true;
						};

						var xAct=(iSel==0) ? _import_files_as_attachments : _import_files_as_hyperlinks;
						_import_folder(sCurItem, sDirToImport, xAct);

						if(nFolders>0){
							plugin.refreshOutline(-1, sCurItem);
						}

						plugin.destroyProgressBar();
						if(vFails.length>0){
							alert(_lc2('Failure', 'Failed to import the following files.')+'\n\n'+vFails);
						}else{
							alert(_lc2('Done', 'Successfully imported the directory tree.')+'\n\n'+sDirToImport);
						}
					}
				}
			}else{
				alert('Please be sure to select a single destination info item to import the content.');
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
