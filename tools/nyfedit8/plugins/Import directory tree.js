
//sValidation=nyfjs
//sCaption=Import directory tree ...
//sHint=Import directory tree with files saved as attachments/hyperlinks
//sCategory=MainMenu.Capture
//sCondition=CURDB; DBRW; OUTLINE; CURINFOITEM
//sID=p.ImportDirTree
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

//try{

	var xNyf=new CNyfDb(-1);

	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			var vSel=plugin.getSelectedInfoItems(-1);
			var nSel=(vSel ? vSel.length : 0);
			if(nSel===1){

				var sCfgKey1='ImportDirTree.sDir', sCfgKey2='ImportDirTree.iSave';
				var vOpts=[
					  _lc2('Attachments', 'Attachments')
					, _lc2('Hyperlinks', 'Hyperlinks')
					];

				var vFields = [
					{sField: "folder", sLabel: _lc2('Directory', 'Directory to import'), sInit: localStorage.getItem(sCfgKey1)||''}
					, {sField: "combolist", sLabel: _lc2('SaveAs', 'Import files as'), vItems: vOpts, sInit: localStorage.getItem(sCfgKey2)||''}
				];

				var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 500, vMargins: [2, 0, 30, 0], bVert: true});
				if(vRes && vRes.length>=2){

					var sDirToImport=''+vRes[0], iSel=parseInt(vRes[1]);

					localStorage.setItem(sCfgKey1, sDirToImport);
					localStorage.setItem(sCfgKey2, iSel);

					plugin.initProgressRange(plugin.getScriptTitle());

					include('comutils');

					var nFolders=0, nFiles=0;
					var sCurItem=plugin.getCurInfoItem(-1)||plugin.getDefRootContainer();

					var _get_unique_child_id=function(sSsgPath){
						return xNyf.getChildEntry(sSsgPath, 0);
					};

//					var _get_unique_file_name=function(sSsgPath, sSsgName0){
//						var xFn=new CLocalFile(sSsgName0), n=1, sRes='', sMagic='';
//						var sTitle=xFn.getTitle(), sExt=xFn.getExtension(false); //false: without dot;
//						do{
//							var sName=sTitle||'untitled'; if(sMagic) sName=sName+'_'+sMagic; if(sExt) sName+=('.'+sExt);
//							var f=new CLocalFile(sSsgPath); f.append(sName);
//							if(!xNyf.entryExists(f.toStr())){
//								sRes=sName;
//								break;
//							}
//							sMagic=''+n; n++;
//						}while(n<=0xffff);
//						return sRes;
//					};

					var vFails=[], bContinue=true;
					var vExtsHtml='html;htm'.split(';');

					var _defnote_ifany=function(v){
						var sFnDefNote='', sFnHtmlFirst='';
						for(var i in v){

							var sName=v[i]||'';
							var xFn=new CLocalFile(sName);

							var sExt=xFn.getExtension(false).toLowerCase();
							if(!sFnHtmlFirst && vExtsHtml.indexOf(sExt)>=0){
								//2016.4.12 keep the HTML document as it is without renaming to default item content;
								//sFnHtmlFirst=sName;
							}

							//if(sName.match(/^[_]*(defcontent|defnote|itemcontent|index|default|def|home)\.htm[l]?$/i)){
							if(sName.search(/^[_]*(defcontent|defnote|itemcontent|index|default|def|home)\.(html|htm|qrich|qrich\.html|txt|md|rtf)$/i)===0){
								sFnDefNote=sName;
								break;
							}
						}
						return sFnDefNote||sFnHtmlFirst;
					};

					var vDirsToSkip=[]; //2016.4.13 ignore those directories containg accompanying images, e.g. ./xxx_files for xxx.htm derived from MSIE;
					var _skip_dir=function(sDir){
						if(sDir && vDirsToSkip.indexOf(sDir)<0){
							vDirsToSkip.push(sDir);
						}
					};

					var _import_files_as_attachments=function(xSsgPath, xDskPath){
						var v=xDskPath.listFiles('');
						var sFnDefNote=_defnote_ifany(v)||''; //2011.9.13 detect if any file can be imported as the item's default content;
						for(var i in v){
							var sName=v[i]||'', bDefNoteFn=(sName===sFnDefNote);
							var xDskFn=new CLocalFile(xDskPath.toStr(), sName);
							var tMod=xDskFn.getModifyTime();

							var sSsgName=sName.replace(/\.qrich\.html$/i, '.qrich'); //rename .qrich.html to .qrich;

							if(bDefNoteFn){
								var sExt=new CLocalFile(sSsgName).getCompleteSuffix(false);
								sSsgName=plugin.getDefNoteFn(sExt);
							}

							var xSsgFn=new CLocalFile(xSsgPath.toStr(), sSsgName);

							bContinue=plugin.ctrlProgressBar(sName, 1, true);
							if(!bContinue) return false;

							var sExt=xDskFn.getExtension(false).toLowerCase();
							var bHtml=(vExtsHtml.indexOf(sExt)>=0);
							if(bHtml){

								//2016.4.13 tries to import accompanying images for HTML documents;
								var sHtml=xDskFn.loadText('html');

								var sNew=importAccompanyingObjsWithinHtml(xNyf, xSsgPath.toStr(), sHtml, xDskPath, null, function(sObj, sAttr, sUriRes, nBytes){
									var u=sObj||'';
									if(u.search(/^javascript:/i)<0 && u.search(/^mailto:/i)<0 && u.search(/^\w+?:\/\//i)<0 && u.search(/[\?\*\#]/)<0){

										var f=new CLocalFile(percentDecode(sObj)), sSubDir=f.getDirectory(false);

										//2016.4.12 For attachments, simply skip accompanying 'xxxx_files' sub-dirs of HTML docs;
										if(sSubDir.indexOf(xDskFn.getTitle())===0 && sSubDir.search(/[_.]files$/)>0){
											var xSub=new CLocalDir(xDskPath.toStr(), sSubDir);
											_skip_dir(xSub.toStr());
										}else{
											//2016.4.20 consider skipping all accompanying sub folders; e.g.  ./images/logo.png
											var xSub=new CLocalDir(xDskPath.toStr(), sSubDir.replace(/^\.\//, ''));
											_skip_dir(xSub.toStr());
										}
									}
									return sUriRes;
								});

								if(sHtml!==sNew){
									sHtml=changeHtmlCharset(sNew, 'UTF-8');
									var xTmpFn=new CLocalFile(platform.getTempFile('', '', '.tmp')); plugin.deferDeleteFile(xTmpFn.toStr());
									if(xTmpFn.saveUtf8(sHtml)>0){
										xDskFn=xTmpFn;
									}
								}

							}

							var nBytes=xNyf.createFile(xSsgFn.toStr(), xDskFn.toStr());
							if(nBytes>=0){
								xNyf.setModifyTime(xSsgFn.toStr(), tMod);
								nFiles++;
							}else{
								vFails[vFails.length]=sName;
							}
						}
						return true;
					};

					var _import_files_as_hyperlinks=function(xSsgPath, xDskPath){
						var v=xDskPath.listFiles('');
						if(v.length>0){

							var sHtml='';
							for(var i in v){

								var sName=v[i]||'';
								var xDskFn=new CLocalFile(xDskPath.toStr()); xDskFn.append(sName);

								bContinue=plugin.ctrlProgressBar(xDskFn.toStr(), 1, true);
								if(!bContinue) return false;

								//2016.4.12 For hyperlinks, simply skip accompanying 'xxxx_files' sub-dirs of HTML docs;
								var sExt=xDskFn.getExtension(false).toLowerCase(), sTitle=xDskFn.getTitle();
								var bHtml=(vExtsHtml.indexOf(sExt)>=0);
								if(bHtml){
									var vTags=['_files', '.files', '-files'];
									for(var j in vTags){
										var xSubDir=new CLocalDir(xDskPath.toStr(), sTitle+vTags[j]);
										if(xSubDir.exists()){
											_skip_dir(xSubDir.toStr());
										}
									}
								}

								var sUri=xNyf.makeFileLinkWithRelativePath(xDskFn.toStr());
								var tMod=xDskFn.getModifyTime();
								sHtml+='\n<tr><td align=left><a href="%URI%">%NAME%</a></td><td align=right>%SIZE%</td><td align=center>%DATE%</td></tr>'
									.replace('%DATE%', platform.formatDateTime(tMod, 'DefaultLocaleShortDate'))
									.replace('%SIZE%', xDskFn.getFileSize())
									.replace('%NAME%', platform.htmlEncode(sName))
									.replace('%URI%', sUri)
								;
							}

							var sDirLink=xNyf.makeFileLinkWithRelativePath(xDskPath.toStr());
							var sDirLabel=xNyf.applyRelativePath(xDskPath.toStr());

							sHtml='<html>'
								+ '<head>'
								+ '<style>'
								+ 'body, table{font-family: Tahoma, Verdana, Arial; font-size: 10pt;}'
								+ '</style>'
								+ '</head>'
								+ '<body>'
								+ '<div><b>Directory</b>: <a href="%LINK%">%DIR%</a></div>'.replace('%LINK%', sDirLink).replace('%DIR%', platform.htmlEncode(sDirLabel))
								+ '<hr noshade size=1 />'
								+ '<table>'
								+ '<thead><tr>'
								+ '<th align="left" width="180">File Name</th>'
								+ '<th align="right" width="80">Size</th>'
								+ '<th align="center" width="180">Last Modified</th>'
								+ '</tr></thead>'
								+ '<tbody>'
								+ sHtml
								+ '</tbody>'
								+ '</table>'
								;

							//2016.4.20 save the file list as index.html for view only, instead of the default content file which is by default editable;
							var xSsgFn=new CLocalFile(xSsgPath.toStr(), 'index.html');
							var nBytes=xNyf.createTextFile(xSsgFn.toStr(), sHtml);
							if(nBytes>=0){
								//
							}
						}

						return true;
					};

					var _import_folder=function(sSsgPath, sDskPath, xActOnFile){

						bContinue=plugin.ctrlProgressBar(sDskPath, 1, true);
						if(!bContinue) return false;

						if(vDirsToSkip.indexOf(sDskPath)<0){ //ignore sub-dirs where HTML doc's accompanying images reside;

							var xDskPath=new CLocalDir(sDskPath);
							var xSubItem=new CLocalFile(sSsgPath); xSubItem.append(_get_unique_child_id(sSsgPath));

							if(xNyf.createFolder(xSubItem.toStr())){

								xNyf.setFolderHint(xSubItem.toStr(), xDskPath.getLeafName());

								bContinue=xActOnFile(xSubItem, xDskPath);
								if(!bContinue) return false;

								var v=xDskPath.listFolders('*');
								for(var i in v){
									var sName=v[i]||'';
									if( sName==='.' || sName==='..' ) continue;
									var xSubDir=new CLocalFile(xDskPath.toStr(), sName);
									if(!_import_folder(xSubItem.toStr(), xSubDir.toStr(), xActOnFile)){
										return false;
									}
								}
								nFolders++;
							}
						}
						return true;
					};

					var xAct=(iSel===0) ? _import_files_as_attachments : _import_files_as_hyperlinks;
					_import_folder(sCurItem, sDirToImport, xAct);

					if(nFolders>0){
						plugin.refreshOutline(-1, sCurItem);
					}

					plugin.destroyProgressBar();
					if(vFails.length>0){
						alert(_lc2('Failure', 'Failed to import the following files.')+'\n\n'+vFails.join('\n'));
					}else{
						alert(_lc2('Done', 'Successfully imported the directory tree.')+'\n\n'+sDirToImport);
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

//}catch(e){
//	alert(e);
//}
