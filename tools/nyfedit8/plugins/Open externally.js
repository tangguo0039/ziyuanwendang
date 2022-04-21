
//sValidation=nyfjs
//sCaption=Open externally ...
//sHint=Open the selected attachment or current text contents within the associated application
//sCategory=MainMenu.Attachments; Context.HtmlEdit; Context.HtmlView; Context.RichEdit; Context.RichView; Context.PlainEdit; Context.PlainView; Context.Relation.Attachment;
//sCondition=CURDB; OUTLINE; CURINFOITEM; CURDOC;
//sID=p.OpenExternally
//sAppVerMin=8.0
//sAuthor=wjjsoft

/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2021 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

var _validate_filename=function(s){
	s=s||'';
	s=s.replace(/[\*\?\.\(\)\[\]\{\}\<\>\\\/\!\$\^\&\+\|,;:\"\'`~@]+/g, ' ');
	s=s.replace(/\s{2,}/g, ' ');
	s=_trim(s);
	if(s.length>64) s=s.substr(0, 64);
	s=_trim(s);
	s=s.replace(/\s/g, '_');
	return s;
};

//try{
	let xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		let xArg=plugin.argument();
		let sCurDocFn=xArg['sSsgFn'];

		if(sCurDocFn) logd('Open externally: '+ sCurDocFn + ' [Specific]');

		if(!sCurDocFn){

			//pick a document from visual components by input focus;
			let sFocus=ui.getFocusPane().toLowerCase();

			if(sFocus==='relation'){

				let bFullPath=true, v=ui.getSelectedAttachments(-1, bFullPath);
				if(v && v.length>0){
					//let vExts='html;htm;txt;ini;log;csv;css;js;xml;pl;php;asp;c;h;cpp;hpp;cxx;hxx;pas;cs;java;py;rb;go;erl;asm;sql;bat;sh;bas;m;mm;swift;md'.split(';');
					for(let i in v){
						let xFn=new CLocalFile(v[i]), sExt=xFn.getExtension(false).toLowerCase();
						//if(vExts.indexOf(sExt)>=0){
						if(sExt){
							sCurDocFn=xFn.toStr();
							break;
						}
					}

					if(!sCurDocFn){
						sCurDocFn=v[0]; //select the first one if no matches;
					}
				}

				if(!sCurDocFn){
					//if no attachments selected, choose the currently opened document;
					sCurDocFn=ui.getCurDocFile();
				}

			}else if(sFocus==='htmlview'){

				let sSsgFn=ui.getCurDocFile(); //2016.6.1 consider of image-gallery;
				if(xNyf.fileExists(sSsgFn)){
					sCurDocFn=sSsgFn;
				}

			}else{

				sCurDocFn=ui.getCurDocFile();

			}
		}

		if(sCurDocFn){

			if(sCurDocFn===ui.getCurDocFile()){
				//firstly commit changes if it's currently opened inplace for editing;
				if(ui.isContentEditable()) ui.commitCurrentChanges();
			}

			let bShortcut=xNyf.isShortcut(sCurDocFn), xPeer;
			if(bShortcut){

				let sPeer=xNyf.getShortcutFile(sCurDocFn, true);
				if(sPeer){
					xPeer=new CLocalFile(sPeer);
				}

			}else{

				let sPeer=xNyf.getPeerFile(sCurDocFn), sCurDocPath=new CLocalFile(sCurDocFn).getParent();

				if(!sPeer){
					let sName;
					if(1){
						sName=new CLocalFile(sCurDocFn).getLeafName();
						if(plugin.isReservedNoteFn(sName)){
							let sItemTitle=xNyf.getFolderHint(sCurDocPath);
							let sExt=new CLocalFile(sName).getExtension(true);
							if(sExt===".qrich") sExt='.html';
							sName=(_validate_filename(sItemTitle)||'untitled') + sExt;
						}
					}

					if(sName){
						let sTmpDir=platform.getTempFolder(), sMagic='__nyf8_external_opens', xTmpSubDir=new CLocalDir(sTmpDir, sMagic);
						if(!xTmpSubDir.exists()){
							new CLocalDir(sTmpDir).createDirectory(sMagic);
							logd('Create temp folder: ' + sTmpDir + '/' + sMagic);
						}

						if(xTmpSubDir.exists()){
							sTmpDir=xTmpSubDir.toStr();
						}

						if(sTmpDir){
							let xTmpFn=new CLocalFile(sTmpDir, sName), sTitle=xTmpFn.getCompleteBaseName(), sExt=xTmpFn.getSuffix(true), i=1;
							while(xTmpFn.exists()){
								sName=sTitle+'_'+i+sExt;
								xTmpFn=new CLocalFile(sTmpDir, sName);
								i++;
							}
							sPeer=xTmpFn.toStr(); platform.deferDeleteFile(sPeer);
						}
					}
				}

				if(sPeer){

					xPeer=new CLocalFile(sPeer); let sExt=xPeer.getSuffix(false).toLowerCase();

					if(xNyf.fileExists(sCurDocFn)){

						let tSsg=xNyf.getModifyTime(sCurDocFn), tPeer=0;
						if(xPeer.exists()) tPeer=xPeer.getModifyTime();
						if(tSsg>tPeer){

							let nBytes=xNyf.exportFile(sCurDocFn, xPeer.toStr());
							if(nBytes>0 && (sExt==='html' || sExt==='htm')){

								logd('Create temp file: ' + xPeer.toStr());

								include('comutils');

								let sHtml=xPeer.loadText('html');
								let sNew=substituteUrisWithinHtml(sHtml, 'img,link', function(sObj, sTagName){

									let u=sObj.toString();

									//2021.6.23 custom css should not be included when opening externally, especially for editing externally;
									//u=u.replace(/^nyf:\/\/localhost\//i, 'file:///');

									//2020.1.22 for markdown documents, it may contain several local file links and a relative file path to attached css;
									//("nyf://localhost/${scripts}/hljs/styles/${SyntaxHighlightStyleName}.css")
									//("nyf://localhost/${scripts}/marked/marked.css")
									//("./markdown.css")
									u=u.replace(/^\.\/([^\/\\]+)$/i, '$1');
									u=u.replace(/^nyf:\/\/localhost\//i, 'file:///'); //make nyf:// to file:// for consistency with nyf8;

									if(u.search(/(\.jpg|\.jpeg|\.gif|\.png|\.bmp|\.svg)$/i)>0){
										let ba, sExt;
										if(u.search(/[:\?\*\|\/\\<>]/)<0){ //for linked objs, possibly saved in the attachments section;
											let xSsgFn=new CLocalFile(sCurDocPath, percentDecode(u));
											ba=xNyf.loadBytes(xSsgFn.toStr());
											sExt=xSsgFn.getSuffix(false).toLowerCase()||'jpg';
										}else if(u.search(/^file:\/\//i)===0){ //for href objects, possibly linked to local files;
											let sFn=localFileFromUrl(u, true);
											if(sFn){
												sFn=xNyf.evalRelativePath(sFn);
												let xFn=new CLocalFile(sFn);
												if(xFn.exists()){
													ba=xFn.loadBytes();
													sExt=xFn.getSuffix(false).toLowerCase()||'jpg';
												}
											}
										}
										if(ba && ba.size()>0){
											logd('Dump image: ' + u);
											u='data:image/'+sExt+';base64,'+ba.toStr('base64');
										}
									}else if(u.search(/(\.css)$/i)>0){
										if(u.search(/[:\?\*\|\/\\<>]/)<0){ //for linked objs, possibly saved in the attachments section;
											let sCssName=percentDecode(u);
											let xSsgFn=new CLocalFile(sCurDocPath, sCssName);
											let xCssFn=new CLocalFile(xPeer.getParent(), sCssName);
											if(!xCssFn.exists()){
												let nBytes=xNyf.exportFile(xSsgFn.toStr(), xCssFn.toStr());
												if(nBytes>0){
													platform.deferDeleteFile(xCssFn.toStr());
													logd('Dump css: ' + u);
													u=percentEncode(sCssName);
												}
											}
										}else if(u.search(/^file:\/\//i)===0){ //for href objects, possibly linked to local files;
											let sFn=localFileFromUrl(u, true);
											if(sFn){
												sFn=xNyf.evalRelativePath(sFn);
												let xFn=new CLocalFile(sFn);
												if(xFn.exists()){
													let sCssName=xFn.getLeafName();
													let xCssFn=new CLocalFile(xPeer.getParent(), sCssName);
													if(!xCssFn.exists() && xCssFn.toStr()!==xFn.toStr()){
														let bSucc=xFn.copyTo(xPeer.getParent(), sCssName);
														if(bSucc){
															platform.deferDeleteFile(xCssFn.toStr());
															logd('Dump css: ' + u);
															u=percentEncode(sCssName);
														}
													}

												}
											}
										}
									}
									return u;
								});

								if(sNew!==sHtml){
									if(xPeer.saveUtf8(sNew)>0){
										xPeer.setModifyTime(tSsg);
									}
								}
							}
						}

					}else{
						//consider of new info items with no HTML contents saved;
						if(sExt==='html' || sExt==='htm'){
							let sHtml=ui.getTextContent(-1, true)||'<html><body><div>No contents available<br /></div></body></html>';
							if(xPeer.saveUtf8(sHtml)>0){
								//xPeer.setModifyTime(new Date());
							}
						}
					}

				}
			}

			if(xPeer){
				if(xPeer.exists()){
					logd('Open externally: '+ xPeer.toStr());
					if(xPeer.launch()){
						if(!xNyf.isReadonly() && !bShortcut){
							plugin.watchPeerFile(-1, sCurDocFn, xPeer.toStr(), true);
						}
					}
				}else{
					alert('File not found' + '\n\n' + xPeer.toStr());
				}
			}else{
				alert('Failed to retrieve the attachment file.');
			}

		}else{
			alert('No documents available to open externally.');
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	alert(e);
//}
