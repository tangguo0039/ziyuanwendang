
//sValidation=nyfjs
//sCaption=Import MS-Word documents ...
//sHint=Import Microsoft Word documents via OLE-Automation
//sCategory=MainMenu.Capture
//sCondition=CURDB; DBRW; OUTLINE; CURINFOITEM
//sPlatform=Windows
//sID=p.ImportMSWordDocs
//sPlatform=Windows
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

try{
	var xNyf=new CNyfDb(-1);

	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			var sCfgKey='ImportMSWordDocs.sDir';
			var vFiles=platform.getOpenFileNames(
						{ sTitle: plugin.getScriptTitle()
							, sInitDir: localStorage.getItem(sCfgKey)||''
							, sFilter: 'MS-Word documents (*.doc *.docx);;All files (*.*)'
						});

			var vFail=[];
			if(vFiles && vFiles.length>0){

				{
					//2016.4.14 invoke the common functions predefined for plugins;
					var xFn=new CLocalFile(new CLocalFile(plugin.getScriptFile()).getDirectory(false), 'comutils.js');
					if(!xFn.exists()){
						var sTmp=xFn.toStr().replace(/([\/\\]plugins)(_win32)([\/\\].+$)/i, function(s0, s1, s2, s3){return s1+s3;});
						xFn=new CLocalFile(sTmp);
					}
					include(xFn.toStr());
				}

				var xMsw=new CAppWord();
				if(xMsw && xMsw.init()){

					xMsw.setVisible(true);

					localStorage.setItem(sCfgKey, new CLocalFile(vFiles[0]).getDirectory(false));

					var sCurItem=plugin.getCurInfoItem(-1), nDone=0;
					if(!sCurItem) sCurItem=plugin.getDefRootContainer();

					plugin.initProgressRange(plugin.getScriptTitle());

					var _find_unique_id=function(sSsgPath){
						return xNyf.getChildEntry(sSsgPath, 0);
					};

					var xDocs=xMsw.getDocuments();

					var _import_docs=function(){

						var xTmpFn=new CLocalFile(platform.getTempFolder(), '__nyf7_import_msword_docs.html');

						var _clean_up=function(){

							if(xTmpFn.exists()) xTmpFn.remove();

							var xAccDir=new CLocalDir(xTmpFn.getDirectory(false), xTmpFn.getTitle()+'.files');
							if(!xAccDir.exists()){
								xAccDir=new CLocalDir(xTmpFn.getDirectory(false), xTmpFn.getTitle()+'_files');
							}
							if(xAccDir.exists()){
								var vAccFiles=xAccDir.listFiles();
								for(var i in vAccFiles){
									var xAccFn=new CLocalFile(xAccDir.toStr(), vAccFiles[i]);
									xAccFn.remove();
								}
								xAccDir.remove();
							}
						}

						for(var i=0; i<vFiles.length; ++i){
							var xDocFn=new CLocalFile(vFiles[i]);
							var tMod=xDocFn.getModifyTime();

							var bContinue=plugin.ctrlProgressBar(xDocFn.getLeafName(), 1, true);
							if(!bContinue) break;

							_clean_up();

							var xDoc=xDocs.open(xDocFn.toStr(), true);

							var bSucc=false;
							if(xDoc){
								bSucc=xDoc.saveAs(xTmpFn.toStr(), 8); //wdFormatHTML: 8;
								xDoc.close();
								xDoc.release();
							}

							if(bSucc){
								var xChild=new CLocalFile(sCurItem); xChild.append(_find_unique_id(sCurItem));
								if(xNyf.createFolder(xChild.toStr())){
									xNyf.setFolderHint(xChild.toStr(), xDocFn.getCompleteBaseName());
									var sHtml=xTmpFn.loadText('html');
									if(sHtml){

										sHtml=importAccompanyingObjsWithinHtml(xNyf, xChild.toStr(), sHtml, xTmpFn.getDirectory(false), null, function(sObj, sTagName, sUriRes, nBytes){
											if(nBytes<0){
												var u=sObj;
												//<link rel="File-List" href="./__nyf7_import_msword_doc.files/filelist.xml" />
												//<link rel="Edit-Time-Data" href="./__nyf7_import_msword_doc.files/editdata.mso" />
												if(u.search(/(\.xml|\.mso)$/i)>0){
													sUriRes=new CLocalFile(u).getLeafName();
												}
											}
											return sUriRes;
										});

										if(sHtml){
											var xSsgFn=new CLocalFile(xChild.toStr()); xSsgFn.append(plugin.getDefNoteFn('html'));
											var nBytes=xNyf.createTextFile(xSsgFn.toStr(), sHtml, true);

											if(nBytes>=0){
												xNyf.setModifyTime(xSsgFn.toStr(), tMod);
												nDone++;
											}else{
												var sMsg=_lc2('GoAnyway', 'Failed to import the document. Continue anyway?');
												//if(i<vFiles.length-1 && !confirm(sMsg+'\n\n'+xDocFn)){
												if(!confirm(sMsg+'\n\n'+xDocFn.toStr())){
													break;
												}
											}
										}
									}
								}
							}else{
								vFail.push(xDocFn.toStr());
							}

							_clean_up(); //clean up the temp file/directory and accompanying image files;

						}
					};

					if(xDocs) _import_docs();

					if(nDone>0){
						plugin.refreshOutline(-1, sCurItem);
					}
				}else{
					alert(_lc('p.Common.Fail.LoadMSWord', 'Failed to invoke Microsoft Word.'));
				}

				if(xMsw) xMsw.quit(); xMsw=undefined;

				if(vFail.length>0){
					alert(_lc2('Fail.HtmlFormatting', 'Failed to convert the following document(s) into HTML format.')+'\n\n'+vFail.join('\n'));
				}
			}

		}else{
			alert(_lc('Prompt.Warn.ReadonlyDb', 'Cannot modify the database opened as Readonly.'));
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

}catch(e){
	alert(e);
	if(xMsw) xMsw.quit(); xMsw=undefined;
}
