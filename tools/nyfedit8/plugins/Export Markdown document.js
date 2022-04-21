
//sValidation=nyfjs
//sCaption=Export Markdown document ...
//sHint=Export text contents as a single .md document
//sCategory=MainMenu.Share
//sCondition=CURDB; CURINFOITEM; OUTLINE;
//sID=p.ExportMdDoc
//sAppVerMin=8.0
//sAuthor=wjjsoft

/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2022 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////


let _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
let _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

let _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
let _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

let _validate_filename=function(s){
	s=s||'';
	s=s.replace(/[\*\?\.\(\)\[\]\{\}\<\>\\\/\!\$\^\&\+\|,;:\"\'`~@]/g, ' ');
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

		if(plugin.isContentEditable()) plugin.commitCurrentChanges();

		let sCfgKeyRange='ExportMdDoc.iRange', sCfgKeyDstFn='ExportMdDoc.sDstFn', sCfgKeyDialect='ExportMdDoc.iDialect', sCfgKeyImgStg='ExportMdDoc.iImgStg';

		let bCurDoc=(parseInt(localStorage.getItem(sCfgKeyRange)||'0')===0);
		let bCurBranch=(parseInt(localStorage.getItem(sCfgKeyRange)||'0')===1);
		let sCurItem=(bCurDoc || bCurBranch) ? ui.getCurInfoItem(-1) : plugin.getDefRootContainer();
		let sTitle=(bCurDoc || bCurBranch) ? xNyf.getFolderHint(sCurItem) : xNyf.getDbTitle();
		let sCRLF=(/^win/i).test(platform.getOsType()) ? '\r\n' : '\n';

		let xInitFn=new CLocalFile(localStorage.getItem(sCfgKeyDstFn)||platform.getHomePath()||'', _validate_filename(sTitle||'untitled')); xInitFn.changeExtension('.md');

		let vRange=[_lc('p.Common.CurDoc', 'Current document')
			    , _lc('p.Common.CurBranch', 'Current branch')
			    , _lc('p.Common.CurDB', 'Current database')
		    ];

		let vDialectOpts=[_lc2('GithubDialect', 'Github dialect')
				  , _lc2('CommonMarkdown', 'Common Markdown')
		    ];

		let vImgStg=[_lc2('Base64', 'Embeded as base64 dataURL')
			     , _lc2('NoImgData', 'Do not export any image data')
		    ];

		let vFields = [
			    {sField: "savefile", sLabel: _lc2('DstFn', 'Save as .md file'), sTitle: plugin.getScriptTitle(), sFilter: 'Markdown documents (*.md);;All files (*.*)', sInit: xInitFn.toStr(), bReq: true}
			    , {sField: "combolist", sLabel: _lc('p.Common.Range', 'Range'), vItems: vRange, sInit: localStorage.getItem(sCfgKeyRange)||'0'}
			    , {sField: "combolist", sLabel: _lc2('Dialect', 'Markdown dialect'), vItems: vDialectOpts, sInit: localStorage.getItem(sCfgKeyDialect)||'0', bReq: true}
			    , {sField: "combolist", sLabel: _lc2('ImgDat', 'Image data'), vItems: vImgStg, sInit: localStorage.getItem(sCfgKeyImgStg)||'0', bReq: true}
		    ];

		let vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 500, vMargins: [2, 0, 50, 0], bVert: true});
		if(vRes && vRes.length>=4){

			let j=0, sDstFn=vRes[j++], iRange=vRes[j++], iDialect=parseInt(vRes[j++]), iImgStg=parseInt(vRes[j++]);
			if(sDstFn){

				localStorage.setItem(sCfgKeyDstFn, new CLocalFile(sDstFn).getDirectory());
				localStorage.setItem(sCfgKeyRange, iRange);
				localStorage.setItem(sCfgKeyDialect, iDialect);
				localStorage.setItem(sCfgKeyImgStg, iImgStg);

				bCurDoc=(iRange===0)
				bCurBranch=(iRange===1);
				sCurItem=(bCurDoc || bCurBranch) ? ui.getCurInfoItem(-1) : plugin.getDefRootContainer();
				sTitle=(bCurDoc || bCurBranch) ? xNyf.getFolderHint(sCurItem) : xNyf.getDbTitle();

				ui.initProgressRange(plugin.getScriptTitle());

				include('comutils');

				let sMarkOpt=(iDialect===0) ? 'github' : 'common';
				let bForceBase64=(iImgStg===0), bNoImgData=(iImgStg===1);

				let _txt2html=(s)=>{
					let vLines=(s||'').replace(/\r\n/g, '\n').replace(/\r/g, '\n').split(/\n/), vHtml=[];
					for(let s of vLines){
						s=_trim(s);
						if(s) s=platform.htmlEncode(s);
						vHtml.push('<p>'+s+'</p>');
					}
					return vHtml.join(sCRLF);
				};

				let _isImgBase64=(u)=>{return (/^data:image\/(.+?);base64,/i.test(u||''));};

				let _subst_images=(sObj, sTagName, sSsgPath)=>{
					var u=sObj||'';
					if(u.search(/\.(jpe?g|gif|png|bmp|svg|webp)$/i)>0){

						if(!bNoImgData || bForceBase64){

							u=u.replace(/^\.\/([^/\\]+)$/i, '$1'); //"./123.png"  --> "123.png"
							u=u.replace(/^nyf:\/\/localhost\//i, 'file:///'); //make nyf:// to file:// for consistency with nyf7;
							u=u.replace(/^\/(.+)$/i, 'file:///$1'); //"/${HOME}/tmp/123.jpg" --> ""file:///${HOME}/tmp/123.jpg""

							var ba, sExt;
							if(u.search(/[:\?\*\|\/\\<>]/)<0){ //for linked objs, possibly saved in the attachments section;
								var xSsgFn=new CLocalFile(sSsgPath, percentDecode(u));
								ba=xNyf.loadBytes(xSsgFn.toStr());
								sExt=xSsgFn.getSuffix(false).toLowerCase()||'jpg';
							}else if(u.search(/^file:\/\//i)===0){ //for href objects, possibly linked to local files;
								var sFn=localFileFromUrl(u, true);
								if(sFn){
									sFn=xNyf.evalRelativePath(sFn);
									var xFn=new CLocalFile(sFn);
									if(xFn.exists()){
										ba=xFn.loadBytes();
										sExt=xFn.getSuffix(false).toLowerCase()||'jpg';
									}
								}
							}
							if(ba && ba.size()>0){
								if(/^(svg)$/.test(sExt)) sExt='svg+xml';
								u='data:image/'+sExt+';base64,'+ba.toStr('base64');
								//logd(ellipsis(u, 256));
							}

						}

					}else if(_isImgBase64(u)){
						if(bNoImgData){
							u='Image.Base64.Stripped';
						}
					}

					return u;
				};

				let _embed_images=(sMd, sSsgPath)=>{
					//![alt-text](src-url "img-title")
					//![alt-text](src-url)
					//![](src-url)
					//let re=/!\[[^\]]*\]\(([^\)\s]+)(\s+(['"])([^'"]*)\\3)?\s*\)/gim, m;
					let re=/!\[([^\]]*)\]\(([^\)\s]+)/gm;
					return sMd.replace(re, (m0, m1, m2)=>{
							    //logd('>>>> '+m0 + '  ALT=' + m1 + '  URL=' + m2);
							    if(bNoImgData && _isImgBase64(m2)){
								    u='Image.Base64.Stripped';
							    }
							    return '![' + m1 + '](' + _subst_images(m2, '', sSsgPath);
						    });
				};

				let vRes=[], nDone=0;
				if(bCurDoc){

					let s='';

					//let sSsgFn=ui.getCurDocUri(-1)||''; //---> file://7ff5912c09c0.dbptr/Organizer/data/0/c4j/jze/_~_~_notes.md
					let sSsgFn=ui.getCurDocFile(-1); //---> /Organizer/data/0/c4j/jze/_~_~_notes.md

					if((/\.md$/i).test(sSsgFn)){

						s=xNyf.loadText(sSsgFn, 'auto'); //ui.getTextContent(-1, false);

					}else{

						let sEditor=ui.getCurEditorType().toLowerCase();
						if(sEditor==='htmledit' || sEditor==='richedit'){
							s=ui.getTextContent(-1, true);
							s=_remove_toc(s);
						}else if(sEditor==='plainedit'){
							s=ui.getTextContent(-1, false);
							s=_txt2html(s);
						}

						//s=substituteUrisWithinHtml(s, 'img', sCurItem, _subst_images);
						s=platform.convertHtmlToMarkdown(s, sMarkOpt);

					}

					s=_embed_images(s, sCurItem);

					vRes.push('');
					vRes.push('# '+(sTitle||'untitled'));
					vRes.push('');
					vRes.push(s);
					vRes.push('');

				}else{

					let _act_on_treeitem=function(sSsgPath, iLevel){

						let sItemTitle=xNyf.getFolderHint(sSsgPath); if(!sItemTitle) sItemTitle='Untitled';

						let bContinue=ui.ctrlProgressBar(sItemTitle, 1, true);
						if(!bContinue) throw 'User abort by ESC.'; //return true;

						let sPreferred=xNyf.detectPreferredFile(sSsgPath, "html;qrich;txt;md;rtf;htm");
						if(sPreferred){

							let xSsgFn=new CLocalFile(sSsgPath, sPreferred);
							if(!xNyf.isShortcut(xSsgFn.toStr())){ //ignore shortcuts;

								let s=xNyf.loadText(xSsgFn.toStr(), 'auto');

								let bHtml=sPreferred.search(/\.(html|htm)$/i)>0;
								let bRich=sPreferred.search(/\.(qrich)$/i)>0;
								let bTxt=sPreferred.search(/\.(txt)$/i)>0;
								let bMd=sPreferred.search(/\.md$/i)>0;
								let bRtf=sPreferred.search(/\.rtf$/i)>0;

								if(bRtf){
									s = platform.convertRtfToHtml(s, {}); bHtml=true;
								}else if(bTxt){
									s=_txt2html(s); bHtml=true;
								}

								if(bHtml || bRich){
									s=substituteUrisWithinHtml(s, 'img', sSsgPath, _subst_images);
									s=platform.convertHtmlToMarkdown(s, sMarkOpt);
								}else if(bMd){
									s=_embed_images(s, sSsgPath);
								}else{
									s='';
								}

								if(s){
									if(vRes.length>0) vRes.push(function(n){let s=''; while( n-- > 0) s+='-'; return s;}(40));
									vRes.push('');
									vRes.push('# '+sItemTitle);
									vRes.push('');
									vRes.push(s);
									vRes.push('');
									vRes.push('');
									nDone++;
								}
							}
						}
					};

					xNyf.traverseOutline(sCurItem, bCurBranch, _act_on_treeitem);
				}

				let nBytes=-1, xDstFn=new CLocalFile(sDstFn);
				if(vRes.length>0){

					var c_sInfoFooter=plugin.isAppLicensed() ? '' : 'Generated with [' + plugin.getAppTitle() + ' ' + plugin.getAppVerStr() + '](http://www.wjjsoft.com/mybase.html?ref=markdown_export)';

					vRes.push(function(n){let s=''; while( n-- > 0) s+='-'; return s;}(60));
					vRes.push(c_sInfoFooter);
					vRes.push('');

					nBytes=xDstFn.saveUtf8(vRes.join(sCRLF));
					if(nBytes<=0){
						alert('Failed to export contents as the Markdown document.'+'\n\n'+sDstFn);
					}else{
						let sMsg=_lc2('Done', 'Total %nDone% info items successfully exported to the .md file. View it now?').replace('%nDone%', nDone)+'\n\n'+sDstFn;
						if(confirm(sMsg)){
							//xDstFn.exec();
							textbox({
									sTitle: plugin.getScriptTitle()
									, sDescr: _lc2('Descr', 'Markdown text exported') + ': '  +sDstFn
									, sDefTxt: xDstFn.loadText('auto')
									, bReadonly: true
									, bWordwrap: true
									, nWidth: 80
									, nHeight: 80
									, sSyntax: 'md'
								});
						}
					}
				}else{
					alert('No text contents available to export as Markdown.');
				}

				ui.destroyProgressBar();
			}
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	ui.destroyProgressBar();
//	alert(e);
//}
