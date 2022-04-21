//sValidation=nyfjs
//sCaption=Export HTML document ...
//sHint=Export text contents as a single .html document
//sCategory=MainMenu.Share;
//sCondition=CURDB; OUTLINE; CURINFOITEM;
//sID=p.ExportHtmlDoc
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

	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		if(plugin.isContentEditable()) plugin.commitCurrentChanges();

		let sCfgKeyRange='ExportHtmlDoc.iRange', sCfgKeyDstFn='ExportHtmlDoc.sDstFn', sCfgKeyImgStg='ExportHtmlDoc.iImgStg';

		let bCurDoc=(parseInt(localStorage.getItem(sCfgKeyRange)||'0')===0);
		let bCurBranch=(parseInt(localStorage.getItem(sCfgKeyRange)||'0')===1);
		let sCurItem=(bCurDoc || bCurBranch) ? ui.getCurInfoItem(-1) : plugin.getDefRootContainer();
		let sTitle=(bCurDoc || bCurBranch) ? xNyf.getFolderHint(sCurItem) : xNyf.getDbTitle();
		let sCRLF=(/^win/i).test(platform.getOsType()) ? '\r\n' : '\n';

		let xInitFn=new CLocalFile(localStorage.getItem(sCfgKeyDstFn)||platform.getHomePath()||'', _validate_filename(sTitle||'untitled')); xInitFn.changeExtension('.html');

		let vRange=[_lc('p.Common.CurDoc', 'Current document')
			    , _lc('p.Common.CurBranch', 'Current branch')
			    , _lc('p.Common.CurDB', 'Current database')
		    ];

		let vImgStg=[_lc2('Base64', 'Embeded as base64 dataURL')
			     , _lc2('NoImgData', 'Do not export any image data')
		    ];

		let vFields = [
			    {sField: "savefile", sLabel: _lc2('DstFn', 'Save as .html file'), sTitle: plugin.getScriptTitle(), sFilter: 'HTML documents (*.html *.htm);;All files (*.*)', sInit: xInitFn.toStr(), bReq: true}
			    , {sField: "combolist", sLabel: _lc('p.Common.Range', 'Range'), vItems: vRange, sInit: localStorage.getItem(sCfgKeyRange)||'0'}
			    , {sField: "combolist", sLabel: _lc2('ImgDat', 'Image data'), vItems: vImgStg, sInit: localStorage.getItem(sCfgKeyImgStg)||'0', bReq: true}
		    ];

		let vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 500, vMargins: [2, 0, 50, 0], bVert: true});
		if(vRes && vRes.length>=3){

			let j=0, sDstFn=vRes[j++], iRange=vRes[j++], iImgStg=parseInt(vRes[j++]);
			if(sDstFn){

				let xDstFn=new CLocalFile(sDstFn), sDstDir=xDstFn.getDirectory();

				localStorage.setItem(sCfgKeyDstFn, sDstDir);
				localStorage.setItem(sCfgKeyRange, iRange);
				localStorage.setItem(sCfgKeyImgStg, iImgStg);

				bCurDoc=(iRange===0);
				bCurBranch=(iRange===1);
				sCurItem=(bCurDoc || bCurBranch) ? ui.getCurInfoItem(-1) : plugin.getDefRootContainer();
				sTitle=(bCurDoc || bCurBranch) ? xNyf.getFolderHint(sCurItem) : xNyf.getDbTitle();

				ui.initProgressRange(plugin.getScriptTitle());

				include('comutils');

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

				let _remove_toc=function(sHtml){
					//2020.1.22 hard-coded 'id' to identify the pane so it can be removed when exporting contents;
					return sHtml.replace(/<div (id="ID_NYF_TOC_PANE") style="(.+)">/gi, '<div $1 style="display: none; $2">');
				};

				let _body=(sHtml)=>{
					sHtml=(sHtml||'').replace(/^([\s\S]*?)(<body[^>]*?>)([\s\S]*)(<\/body>)([\s\S]*)$/i, '$3');
					return sHtml;
				};

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

				let s='', nMarkdownDocs=0;
				if(bCurDoc){

					let sEditor=ui.getCurEditorType().toLowerCase();
					if(sEditor==='htmledit' || sEditor==='richedit'){
						s=_remove_toc(ui.getTextContent(-1, true));
						let u=ui.getCurDocUri(-1)||'';
						if((/\.md$/i).test(u)){
							nMarkdownDocs++;
						}
					}else if(sEditor==='plainedit'){
						s=_txt2html(ui.getTextContent(-1, false));
					}
					s=_body(s);
					s=substituteUrisWithinHtml(s, 'img', sCurItem, _subst_images);

				}else{

					let vRes=[], nDone=0;
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
									s=platform.convertRtfToHtml(s
										, {bInner: true
										//, bPicture: true
										//, sImgDir: sDstDir
										//, sTitle: sTitle
										//, sFooter: (plugin.isAppLicensed() ? '' : 'Generated with Mybase/HtmlTree Maker by Wjj Software')
										//, sFooter: (plugin.isAppLicensed() ? '' : '%MYBASE-HTMLTREE-MAKER%')
										//, sStyle: sCss0
										//, sJsFiles: 'jquery.js;itemlink.js'
										}
									);
									s=_body(s);
								}else if(bTxt){
									s=_txt2html(s);
								}else if(bMd){
									s=platform.convertMarkdownToHtml(s);
									s=_body(s);
									nMarkdownDocs++;
								}else{
									//html or qrich
									s=_body(s);
								}

								s=substituteUrisWithinHtml(s, 'img', sSsgPath, _subst_images);

								if(s){
									if(vRes.length>0) vRes.push('<hr noshade size=1>');
									vRes.push('');
									vRes.push('<h1>'+sItemTitle+'</h1>');
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

					s=vRes.join(sCRLF);
				}

				s=_trim(s);
				if(s){
					//2022.2.18 if any .md contents exported, export css files for markdown, otherwise export css for default html notes
					var sCss=_trim((xNyf.cssTextForDoc(plugin.getDefNoteFn(nMarkdownDocs>0 ? 'md' : 'html'))));

					if(sCss){
						sCss+=['', ''
						       , '/********** fixes/tweaks 2022.1.19 **********/'
						       , ''
						       , 'a{margin-left: 4px; margin-right: 4px;}'
						       , 'a:hover{text-decoration: underline;}'
						       , 'hr{border: 0px; height: 2px; background: gray;}'
								].join(sCRLF);
					}

					var c_sInfoFooter='Generated with <a href="http://www.wjjsoft.com/mybase.html?ref=html_export" target=_blank>' + plugin.getAppTitle() + ' ' + plugin.getAppVerStr() + '</a>';
					var c_sCssFooter='font-size: small; font-style: italic; text-align: right; margin-top: 4em; padding-top: 4px; border-top: 2px solid gray;';

					let sHtml=['<!DOCTYPE html>' // PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"
						   , '<html>' // xmlns="http://www.w3.org/1999/xhtml"
						   , '<head><style>'
						   , sCss
						   , ''
						   , '</style></head>'
						   , '<body>'
						   , s
						   , '<footer style="' + c_sCssFooter + '">'
						   ,
						   c_sInfoFooter
						   , '</footer>'
						   , '</body></html>'
					    ].join(sCRLF);

					if(xDstFn.saveUtf8(sHtml)>0){
						var sMsg=_lc2('Done', 'Successfully exported text contents and saved as the .html document. View it now?')+'\n\n'+xDstFn.toStr();
						if(confirm(sMsg)){
							xDstFn.launch('');
						}
					}
				}else{
					alert(_lc2('NoTextAvail', 'No text contents available to export.'));
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
