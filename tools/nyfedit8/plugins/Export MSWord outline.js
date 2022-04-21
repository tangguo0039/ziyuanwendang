
//sValidation=nyfjs
//sCaption=Export MS-Word outline ...
//sHint=Export contents to Microsoft Word outline view via OLE-Automation
//sCategory=MainMenu.Share
//sCondition=CURDB; CURINFOITEM; OUTLINE;
//sPlatform=Windows
//sID=p.ExportMSWordOutline
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

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};

var _validate_filename=function(s){
	s=s||'';
	s=s.replace(/[\*\?\.\(\)\[\]\{\}\<\>\\\/\!\$\^\&\+\|,;:\"\'`~@]/g, ' ');
	s=s.replace(/\s{2,}/g, ' ');
	s=_trim(s);
	if(s.length>64) s=s.substr(0, 64);
	s=_trim(s);
	s=s.replace(/\s/g, '_');
	return s;
};

try{

	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		let vRange=[
			  _lc('p.Common.CurBranch', 'Current branch')
			, _lc('p.Common.CurDB', 'Current database')
			];

		let sCfgKey1='ExportMSWordOutline.iRange', sCfgKey2='ExportMSWordOutline.sDstFn', sCfgKey3='ExportMSWordOutline.bInclText';

		let xInitFn=new CLocalFile(localStorage.getItem(sCfgKey2)||platform.getHomePath()||'', _validate_filename(xNyf.getFolderHint(plugin.getCurInfoItem(-1)))||'untitled');

		let vFields = [
			{sField: "savefile", sLabel: _lc2('DstFn', 'Save as MS-Word document'), sTitle: plugin.getScriptTitle(), sFilter: 'MS-Word documents (*.doc);;All files (*.*)', sInit: xInitFn.toStr()}
			, {sField: "combolist", sLabel: _lc('p.Common.Range', 'Range'), vItems: vRange, sInit: localStorage.getItem(sCfgKey1)||''}
			, {sField: "checkbox", sLabel: '', vItems: [(localStorage.getItem(sCfgKey3)||'')+'|'+_lc2('TxtContent', 'Including text contents')]}
		];

		let vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 500, vMargins: [2, 0, 30, 0], bVert: true});
		if(vRes && vRes.length===3){

			let sDstFn=vRes[0], iRange=vRes[1], vOpts=vRes[2];
			if(iRange>=0 && sDstFn && vOpts && vOpts.length>0){

				let bCurBranch=(iRange===0);
				let bInclContents=vOpts[0];

				localStorage.setItem(sCfgKey1, iRange);
				localStorage.setItem(sCfgKey2, new CLocalFile(sDstFn).getDirectory());
				localStorage.setItem(sCfgKey3, bInclContents);

				var xMsw=new CAppWord(); //xMsg may be accessed at end on exceptions;
				if(xMsw && xMsw.init()){

					//2011.8.7 Set it visible, in case users press ESC and select No to continue without losing connection with MSWord;
					xMsw.setVisible(true);

					let xDstFn=new CLocalFile(sDstFn);
					let xDocs=xMsw.getDocuments(), bAbort=false;
					let xDoc; if(xDocs) xDoc=xDocs.add('');
					if(xDoc){

						let sCurItem=plugin.getCurInfoItem(-1);

						if(!sCurItem || !bCurBranch){
							sCurItem=plugin.getDefRootContainer();
							bCurBranch=false;
						}

						let nFolders=0, iLastLvl=0, xRng=xDoc.getRange(0, 0);

						xNyf.traverseOutline(sCurItem, true, function(){
							nFolders++;
						});

						plugin.initProgressRange(plugin.getScriptTitle(), nFolders);

						//let vImgFileTypes='bmp|jpg|jpeg|png|gif|tif'.split('|');

						var _act_on_item=function(sSsgPath, iLevel){
							let iBakLvl=iLevel;
							if(xNyf.folderExists(sSsgPath)){

								let sTitle=xNyf.getFolderHint(sSsgPath); if(!sTitle) sTitle='Untitled';

								let bContinue=plugin.ctrlProgressBar(sTitle, 1, true);
								if(!bContinue) return (bAbort=true);

								//xRng.setStart(xRng.getStoryLength());

								//xRng.setStart(xRng.getEnd());
								//xRng.setText('\n');

								xRng.setStart(xRng.getEnd());
								xRng.setText(sTitle+'\n');

								let xPars=xRng.getParagraphs();
								if(xPars){
									if(iLevel === iLastLvl){
										xPars.outlinePromote();
									}else if(iLevel < iLastLvl){
										while(iLevel++ <= iLastLvl) xPars.outlinePromote();
									}else if(iLevel > iLastLvl){
										xPars.outlineDemote();
									}
								}

								if(xPars) xPars.release();

								xRng.setStart(xRng.getEnd());
								if(bInclContents){
									let sPreferred=xNyf.detectPreferredFile(sSsgPath, "html;htm;qrich;txt;md;rtf>ini;log");
									if(sPreferred){
										let xSsgFn=new CLocalFile(sSsgPath, sPreferred);
										let sExt=xSsgFn.getSuffix(false), sExt2=sExt; if(sExt2.search(/^(md|qrich)$/i)===0) sExt2+='.html';
										let xTmpFn=new CLocalFile(platform.getTempFile('', '', sExt2)); plugin.deferDeleteFile(xTmpFn.toStr());
										if(xNyf.exportFile(xSsgFn.toStr(), xTmpFn.toStr())>0){
											let vFilesToDel=[];
											if(sExt==='md'){

												let s0=xTmpFn.loadText('auto'), s=s0;
												s=platform.convertMarkdownToHtml(s);

												let v=s.split('\n');
												for(let i=0; i<v.length; ++i){
													let sLine=v[i];

													//2018.1.12 MS-Word outline recognize <h[1-9] ...> in HTML as outline titles;
													sLine=sLine.replace(/<h[1-9]\s+[^>]*>/i, "<p style='font-size: medium; font-weight: bold;'>");
													sLine=sLine.replace(/<\/h[1-9]>/i, '</p>');

													v[i]=sLine;
												}
												s=v.join('\n');

												if(s!==s0) xTmpFn.saveUtf8(s);

											}else if(sExt==='qrich'){

												//2018.1.12 the rich-text contains spaces/tabs that are not recognized by msword;
												//<p style="margin:0px;"><span style="font-family:'Courier'; font-size:13pt;">    abc	def    xyz</span></p>
												let s0=xTmpFn.loadText('auto'), s=s0;

												let v=s.split('\n');
												for(let i=0; i<v.length; ++i){
													let sLine=v[i];
													sLine=sLine.replace(/(<span\s+[^>]*>)(.*)(<\/span>)/ig, function(m0, m1, m2, m3){
														m2=m2.replace(/  /g, '&nbsp; ');
														m2=m2.replace(/\t/g, '&nbsp; &nbsp; &nbsp; &nbsp; ');
														return m1+m2+m3;
													});

													if(sLine==='p, li { white-space: pre-wrap; }') sLine='';
													v[i]=sLine;
												}
												s=v.join('\n');

												if(s!==s0) xTmpFn.saveUtf8(s);

											}else if(sExt==='html' || sExt==='htm'){

												let sHtml=xTmpFn.loadText('auto');
												if(sHtml){

//													let vFiles=xNyf.listFiles(sSsgPath);
//													for(let i in vFiles){
//														let xImgFn=new CLocalFile(sSsgPath); xImgFn.append(vFiles[i]);
//														let sExt=xImgFn.getExtension(false).toLowerCase();
//														if(vImgFileTypes.indexOf(sExt)>=0){
//															if(sHtml.indexOf(vFiles[i])>0){
//																let xTmpFn2=new CLocalFile(platform.getTempFolder()); xTmpFn2.append(vFiles[i]);
//																if(xNyf.exportFile(xImgFn, xTmpFn2)>0){
//																	vFilesToDel.push(xTmpFn2);
//																}
//															}
//														}
//													}

													//2015.5.11 msword 'insertFile' doesn't recognize this tag (geneated by msword itself);
													let sTmp=sHtml.replace(/<\!\[if\s\!supportEmptyParas\]>&nbsp;<\!\[endif\]><o\:p><\/o\:p>/g, '&nbsp;');
													if(sTmp!==sHtml){
														if(sTmp.indexOf('<meta http-equiv=Content-Type content="text/html; charset=UTF-8">')>0){
															xTmpFn.saveUtf8(sTmp);
														}else{
															xTmpFn.saveAnsi(sTmp);
														}
													}
												}
											}

											//msword dones't insert image data, but only with links preserved;
											xRng.insertFile(xTmpFn.toStr());

//											for(let i in vFilesToDel){
//												vFilesToDel[i].remove();
//											}
										}
										xTmpFn.remove();
									}
								}

								xRng.setStart(xRng.getStoryLength());
								xRng.setText('\n');

								iLastLvl=iBakLvl;
							}
						};

						xNyf.traverseOutline(sCurItem, bCurBranch, _act_on_item);

						if(!bAbort){
							let win=xDoc.getActiveWindow();
							if(!win){
								sMsg=_lc2('NoActiveWindow', 'Failure using active window from MS-Word; Please make sure there are no modal dialogs with in MS-Word. Re-try and proceed?');
								if(confirm(sMsg)){
									win=xDoc.getActiveWindow();
								}
							}
							if(win){
								win.getActivePane().getView().setType(2); //wdOutlineView = 2;
							}

							let iFmt=0; //wdFormatDocument = 0
							{
								//2020.5.29 as tested it always fail to save as .docx ?????
								let sExt=xDstFn.getExtension(false).toLowerCase();
								if(sExt==='doc') iFmt=0; //wdFormatDocument = 0
								else if(sExt==='docx') iFmt=11; //wdFormatXML = 11
								else if(sExt==='html' || sExt==='htm') iFmt=8; //wdFormatHTML = 8
								else if(sExt==='rtf') iFmt=6; //wdFormatRTF = 6
								else if(sExt==='txt') iFmt=2; //wdFormatText = 2
								else if(sExt==='mht' || sExt==='mhtml') iFmt=9; //wdFormatWebArchive = 9
							}

							let bSucc=xDoc.saveAs(sDstFn, iFmt);
							if(!bSucc){
								bAbort=true;
								sMsg=_lc2('Fail.SaveAs', 'Failed to save the file.' + '\n\n' + sDstFn);
								alert(sMsg);
							}
						}

						if(xDocs) xDocs.release();
						if(xRng) xRng.release();
					}

					if(xMsw) xMsw.quit(); xMsw=undefined;

					if(!bAbort){
						sMsg=_lc2('Done', 'Successfully generated the outline within MS-Word. View it now?');
						if(confirm(sMsg+'\n\n'+sDstFn)){
							xDstFn.exec();
						}
					}
				}else{
					alert(_lc('p.Common.Fail.LoadMSWord', 'Failed to invoke Microsoft Word.'));
				}
			}else{
				alert('Bad input of destination file path.');
			}
		}
	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

}catch(e){
	alert(e);
	if(xMsw) xMsw.quit(); xMsw=undefined;
}
