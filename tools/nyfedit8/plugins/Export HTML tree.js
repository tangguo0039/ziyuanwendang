
//sValidation=nyfjs
//sCaption=Export HTML tree ...
//sHint=Export content as webpages with an HTML tree navigation
//sCategory=MainMenu.Share
//sCondition=CURDB; CURINFOITEM; OUTLINE
//sID=p.ExportHtmlTree
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

var _pack_array=function(v, xPred){
	let vTmp=[];
	for(let i=0; i < v.length; ++i){
		let bDel=false, val=v[i];
		if(typeof(xPred)==='function'){
			bDel=xPred(i, val);
		}else{
			bDel=xPred ? (val===xPred) : (!val);
		}
		if(!bDel){
			vTmp[vTmp.length]=val;
		}
	}
	return vTmp;
};

var _compare_array=function(v1, v2)
{
	let iRes=0;
	if(v1.length>v2.length){
		iRes=1;
	}else if(v1.length<v2.length){
		iRes=-1;
	}else{
		for(let i=0; i < v1.length; ++i){
			if(v1[i]>v2[i]){
				iRes=1;
				break;
			}else if(v1[i]<v2[i]){
				iRes=-1;
				break;
			}else{
			}
		}
	}
	return iRes;
};

//try{

	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		if(plugin.isContentEditable()) plugin.commitCurrentChanges();

		let vRange=[
			  _lc('p.Common.CurBranch', 'Current branch')
			, _lc('p.Common.CurDB', 'Current database')
		];

		let sCfgKey1='ExportHtmlTree.sDir', sCfgKey2='ExportHtmlTree.iRange';
		let vFields = [
			{sField: "folder", sLabel: _lc2('DstPath', 'Destination folder'), sTitle: plugin.getScriptTitle(), sInit: localStorage.getItem(sCfgKey1)||''}
			, {sField: "combolist", sLabel: _lc('p.Common.Range', 'Range'), vItems: vRange, sInit: localStorage.getItem(sCfgKey2)||'0'}
		];

		let vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 500, vMargins: [2, 0, 50, 0], bVert: true});
		if(vRes && vRes.length===2){

			let sDstDir=vRes[0], iRange=vRes[1], bOverwriteAlways=false;
			if(sDstDir && iRange>=0){

				localStorage.setItem(sCfgKey1, sDstDir);
				localStorage.setItem(sCfgKey2, iRange);

				ui.initProgressRange(plugin.getScriptTitle());

				let bCurBranch=(iRange===0);
				let sCurItem=bCurBranch ? ui.getCurInfoItem(-1) : plugin.getDefRootContainer();
				let sTitle=bCurBranch ? xNyf.getFolderHint(sCurItem) : xNyf.getDbTitle();
				let sEol=(/^win/i).test(platform.getOsType()) ? '\r\n' : '\n';

				include('comutils');

				if(1){
					//copy static files to the destination folder;
					let xNames={
						'jquery.js': 'jquery-1.5.min.js'
						, 'index.html': '_htmltree_index.html'
						, 'nav.html': '_htmltree_navpane.html'
						, 'itemlink.js': '_htmltree_itemlink.js' //2013.3.27 to enable item-links nyf://entry?...
						, 'icon_plus.gif': 'icon_plus.gif'
						, 'icon_minus.gif': 'icon_minus.gif'
						, 'icon_itemlink.gif': 'icon_itemlink.gif'
						//, 'icon_attachment.gif': 'icon_attachment.gif'
						, 'icon_attachment.svg': 'icon_attachment.svg'
						, 'icon_newwin.gif': 'icon_newwin.gif'
						, 'icon_jump.gif': 'icon_jump.gif'
						, 'icon_email.gif': 'icon_email.gif'
					};
					let sPathSrc=new CLocalFile(plugin.getScriptFile()).getDirectory(), vMissing=[];
					for(let sFn in xNames){
						let sNameDst=xNames[sFn];
						let xSrc=new CLocalFile(sPathSrc, sNameDst);
						if(xSrc.exists()){
							let sExt=xSrc.getExtension(false);
							let xDst=new CLocalFile(sDstDir, sFn);
							if((/^(svg|gif|jpg|png|bmp)$/i).test(sExt)){
								if((/^(svg)$/i).test(sExt)){
									let svg=xSrc.loadText();
									if(ui.isDarkMode()) svg=svg.replace(/currentColor/i, '#e9e9e9');
									xDst.saveUtf8(svg);
								}else{
									xSrc.copyTo(sDstDir, sFn);
								}
							}else if((/^(html|js|css)$/i).test(sExt)){
								let s=xSrc.loadText('auto');
								if(sExt.toLowerCase()==='html'){
									s=s.replace(/%DbTitle%/g, sTitle);
								}
								xDst.saveUtf8(trim(s).replace(/[\r\n]+/g, sEol));
							}else{
								alert('Configure errors!');
							}
						}else{
							vMissing.push(xSrc.toStr());
						}
					}
					if(vMissing.length>0){
						alert('The following files are missing. You may need to re-install the software.'+'\n\n'+vMissing.join('\n'), 'error');
					}
				}

				var _validate_filename=function(s){
					//test RE: alert(_validate_filename("ABC\t\r\n   /[*?.()\[\]{}<>/\\!$^&+|,;:\"'`~@#]/gim"));
					s=s||'';
					s=s.replace(/[*?.()\[\]{}<>/\\!$^&+|,;:"'`~@#\s\t\r\n]+/g, ' ');
					s=trim(s);
					if(s.length>64) s=s.substr(0, 64);
					s=trim(s);
					s=s.replace(/\s/g, '_');
					return s;
				};

				let _xNameCache={}, _xHashUsed={};
				let _hash_name=function(s1, s2, sExt, sTag){
					let sName='', k=s1+'/'+s2;
					sName=_xNameCache[k];
					if(!sName){
						let i=0;
						do{
							//2011.2.8 make signed integers into unsigned by using the operator 'n>>>0';
							sName=(adler32(s1)>>>0).toString(16).toLowerCase();
							if(s2) sName+='_'+(adler32(s2)>>>0).toString(16).toLowerCase();
							sName+=('_'+i);
							sName+=('.'+sExt.replace(/^[.]+/, ''));
							i++;
						}while(_xHashUsed[sName]);
						//2013.11.2 push the name into cache in case of hash conflicts;
						_xHashUsed[sName]=1;
						_xNameCache[k]=sName;
					}
					return sName;
				};

				let _isModified=function(sSsgFn, sWinFn){
					if(bOverwriteAlways) return true;
					let xWinFn=new CLocalFile(sWinFn), t1=xNyf.getModifyTime(sSsgFn), bUpd=true;
					if(xWinFn.exists()){
						let t2=xWinFn.getModifyTime();
						bUpd=t1>t2;
					}
					return bUpd;
				}

				//2013.3.27 enable item links to work;
				//let xID$Path={}, xPath$ID={};
				//if(1){
				//	let vLines=xNyf.listItemIDs().split(/[\r\n]+/);
				//	for(let i in vLines){
				//		let v=vLines[i].split('\t');
				//		if(v.length===2){
				//			let sID=v[0], sPath=v[1];
				//			if(sID && sPath){
				//				xID$Path[sID]=sPath;
				//				xPath$ID[sPath]=sID;
				//			}
				//		}
				//	}
				//}

				//2013.3.29 enable bookmarks to work;
				let xBkmk$Info={};
				if(1){
					let vLines=xNyf.listBookmarks().split(/[\r\n]+/);
					for(let i in vLines){
						let v=vLines[i].split('\t');
						if(v.length>=2){
							let sBkmkID=v[0], sItemID=v[1], sSsgName=v[2], sAnchor=v[3]; //2017.10.21 new data format;
							if(sBkmkID && sItemID){
								xBkmk$Info[sBkmkID]=[sItemID , sSsgName, sAnchor].join('\t');
							}
						}
					}
				}

				let _remove_scripts=function(sHtml){
					sHtml=sHtml.replace(/<script\b.*?>[\s\S]*?<\/script>/ig, '');
					return sHtml;
				};

				let _install_script=function(sHtml, vJsFn){
					let sRes=sHtml;
					let p=sHtml.indexOf('</body>'); if(p<0) p=sHtml.indexOf('</head>');
					if(p>=0){
						sRes=sHtml.substr(0, p);
						for(let i in vJsFn){
							sRes+= '\n<script type="text/javascript" language="javascript" src="'+vJsFn[i]+'"></script>';
						}
						sRes+= sHtml.substr(p);
					}
					return sRes;
				};

				let _install_csslink=function(sHtml, sFnCss){
					let sRes=sHtml;
					let p=sHtml.indexOf('</head>'); if(p<0) p=sHtml.indexOf('</body>');
					if(p>=0){
						sRes = sHtml.substr(0, p);
						sRes+= '\n<link rel="stylesheet" type="text/css" href="%sFnCss%">\n'.replace(/%sFnCss%/i, sFnCss);
						sRes+= sHtml.substr(p);
					}
					return sRes;
				};

				let _add_attachment_list=function(sHtml, vAttach){
					let sRes=sHtml;
					if(vAttach.length>0){
						let p=sHtml.indexOf('</body>'); //if(p<0) p=sHtml.indexOf('</head>');
						if(p>=0){
							sRes=sHtml.substr(0, p);
							let sCss='margin: 3em 0;'; //'position:fixed;bottom:0px;width:100%;';
							sCss+=' background-color: ' + (ui.isDarkMode() ? '#424741' : 'rgba(233, 233, 233, 0.8)') + ';';
							let sList='\n<div style="%STYLE%">\n<hr noshade>'.replace(/%STYLE%/gi, sCss);
							for(let i in vAttach){
								let d=vAttach[i];
								sList+='\n<a href="%sDstName%" title="%sDstName%" target=_blank style="padding-left: 1em; background: URL(icon_attachment.svg) no-repeat center left; padding: 0 0 0 24px;">%sSrcName%</a>'
									.replace(/%sDstName%/ig, d.sDstName)
									.replace(/%sSrcName%/ig, platform.htmlEncode(d.sSrcName))
									;
							}
							sList+='\n<hr noshade>\n</div>';
							sRes+=sList;
						}
						sRes+= sHtml.substr(p);
					}
					return sRes;
				};

				let _add_promotional_tag=(sHtml)=>{
					let c_sInfoFooter='Generated with <a href="http://www.wjjsoft.com/mybase.html?ref=htmltree_export" target=_blank>' + plugin.getAppTitle() + ' ' + plugin.getAppVerStr() + '</a>';
					let c_sCssFooter='font-size: small; font-style: italic; text-align: right; margin-top: 16em; padding-top: 4px; border-top: 2px solid gray;';
					let sFooter='<footer style="' + c_sCssFooter + '">' + c_sInfoFooter + '</footer>';
					return sHtml.replace(/<\/body>/i, sFooter + '</body>');
				};

				let _text_to_html=(s, tag)=>{
					let v=(s||'').replace(/\r\n/g, '\n').replace(/\r/g, '\n').split(/\n/), vRes=[];
					let _o='<' + tag + '>';
					let _c='</' + tag + '>';
					for(let s of v){
						if(s) vRes.push(_o + platform.htmlEncode(s) + _c);
						else vRes.push(_o + '<br />' + _c);
					}
					return vRes.join(sEol);
				};

				let _id_of_ssgpath=(sSsgPath)=>{return xNyf.getItemIDByPath(sSsgPath);};

				let _use_cdn_ver_of_Katex=function(u){
					//2020.1.22 use online CDN version of katex & mathjax;
					//<link rel="stylesheet" href="nyf://localhost/${scripts}/katex/katex.min.css" crossorigin="anonymous">
					//<script src="nyf://localhost/${scripts}/katex/katex.min.js" crossorigin="anonymous" defer></script>
					//<script src="nyf://localhost/${scripts}/katex/contrib/auto-render.min.js" crossorigin="anonymous" defer></script>
					//<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.6/MathJax.js?config=%MathJax2Config%"></script>
					//<script type="text/javascript" id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/%MathJax3Config%.js"></script>
					//<script src="nyf://localhost/${scripts}/mermaid/mermaid.min.js"></script>
					//<script src="nyf://localhost/${scripts}/pangu/pangu.min.js"></script>
					//==>log(u):
					//("nyf://localhost/${scripts}/katex/katex.min.css")						-> https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css
					//("nyf://localhost/${scripts}/katex/katex.min.js")						-> https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js
					//("nyf://localhost/${scripts}/katex/contrib/auto-render.min.js")				-> https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/contrib/auto-render.min.js
					//("nyf://localhost/${scripts}/hljs/highlight.pack.js")						-> duplicate
					//("nyf://localhost/${scripts}/mermaid/mermaid.min.js")						-> duplicate
					//("nyf://localhost/${scripts}/pangu/pangu.min.js")						-> duplicate
					//("https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js")				-> AS IS
					//("https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.6/MathJax.js?config=TeX-MML-AM_SVG")	-> AS IS

					u=u.replace(/^nyf:\/\/localhost\/\$\{scripts\}\/katex\/katex\.min\.css$/i, 'https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css');
					u=u.replace(/^nyf:\/\/localhost\/\$\{scripts\}\/katex\/katex\.min\.js$/i, 'https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js');
					u=u.replace(/^nyf:\/\/localhost\/\$\{scripts\}\/katex\/contrib\/auto-render\.min\.js$/i, 'https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/contrib/auto-render.min.js');
					return u;
				};

				let sCss0='table{border: 1px solid gray;} td{border: 1px dotted gray;} '
					+ 'p{margin: 3px 0 3px 0; padding: 0;} '
					+ '#ID_Footer{font-size: small; font-style: italic;} '
					+ 'a{padding-right: 20px; background: URL(./icon_newwin.gif) no-repeat center right;} '
					+ 'a[href ^= "mailto:"]{padding: 0 20px 0 0; background: URL(./icon_email.gif) no-repeat center right;} '
					+ 'a[href ^= "nyf:"]{padding: 0 20px 0 0; background: URL(./icon_jump.gif) no-repeat center right;} '
					;

				let xID$Doc={}, vInfoItems=[], vLocalFiles={};
				let _act_on_treeitem=function(sSsgPath, iLevel){

					let xLI={}, sTitle=xNyf.getFolderHint(sSsgPath), sID=_id_of_ssgpath(sSsgPath);

					let bContinue=ui.ctrlProgressBar(sTitle||'Untitled', 1, true);
					if(!bContinue) throw 'User abort by ESC.'; //return true;

					xLI['sSsgPath']=sSsgPath;
					xLI['sTitle']=sTitle;
					xLI['iLevel']=iLevel;
					xLI['sHref']='';
					xLI['vFiles']=[];
					xLI['nSub']=xNyf.getFolderCount(sSsgPath);
					xLI['nID']=sID; //xNyf.getItemIDByPath(sSsgPath, false);

					if(1){
						let v=xNyf.listRelated(sSsgPath), vIDs=[];
						for(let s in v){
							let nID=xNyf.getItemIDByPath(s, false);
							if(nID>=0){
								vIDs.push(nID);
							}
						}
						xLI['sRelated']=vIDs.join(';');
					}

					let sDefNoteFn=xNyf.detectPreferredFile(sSsgPath, 'html;htm;qrich;md;txt>rtf>jpg;png;gif;bmp;tif;tiff;svg;webp');

					//export attached files;
					let vFiles=xNyf.listFiles(sSsgPath), vAttach=[];
					for(let sName of vFiles){
						if(sName!==sDefNoteFn){
							let xSrc=new CLocalFile(sSsgPath, sName);
							if(!xNyf.isShortcut(xSrc.toStr())){
								let sDstName=_hash_name(sSsgPath, sName, xSrc.getExtension(false), 'Attachment');
								let xDst=new CLocalFile(sDstDir, sDstName);
								if(_isModified(xSrc.toStr(), xDst.toStr())){
									if(xNyf.exportFile(xSrc.toStr(), xDst.toStr())<0){
										sName='';
									}
								}
								if(sName){
									xLI['vFiles'].push(sName);
									vAttach.push({sSsgPath: sSsgPath, sSrcName: sName, sDstName: sDstName, nSize: 0});

									//2021.5.29 for attachments to be accessible from in html tree;
									xID$Doc[xSrc.toStr()]=sDstName; //indexed directly by ssgpath;
									if(sID){
										xID$Doc[sID+'/'+sName]=sDstName; //indexed by ID+Name
									}
								}
							}
						}
					}

					let sHtml0='', sHtml='', xDst;
					if(sDefNoteFn){
						let xSrc=new CLocalFile(sSsgPath, sDefNoteFn);
						if(!xNyf.isShortcut(xSrc.toStr())){
							let sExt=xSrc.getExtension(false).toLowerCase();
							let sName=_hash_name(sSsgPath, sTitle||'Untitled', sExt, 'defnote'); if(sExt.search(/^(rtf|md|qrich|txt)$/i)===0) sName+='.html';
							xDst=new CLocalFile(sDstDir, sName);
							if(_isModified(xSrc.toStr(), xDst.toStr()) && xNyf.exportFile(xSrc.toStr(), xDst.toStr())>=0){
								if(sExt.search(/^(html|htm|qrich|md|txt|rtf)$/i)===0){
									sHtml0=xDst.loadText('auto');
									sHtml=sHtml0;
									if(sExt==='rtf'){
										sHtml=platform.convertRtfToHtml(sHtml
											, {bInner: false
											, bPicture: true
											, sImgDir: sDstDir
											, sTitle: sTitle
											//, sFooter: (plugin.isAppLicensed() ? '' : 'Generated with Mybase/HtmlTree Maker by Wjj Software')
											//, sFooter: (plugin.isAppLicensed() ? '' : '%MYBASE-HTMLTREE-MAKER%')
											, sStyle: sCss0
											, sJsFiles: 'jquery.js;itemlink.js'
											}
										);
										//sHtml=sHtml.replace('%MYBASE-HTMLTREE-MAKER%', 'Generated with <a href="http://www.wjjsoft.com/mybase..html#htmltree_export" target="_blank">Mybase/HtmlTree Maker</a>');
									}else if(sExt==='md'){
										sHtml=platform.convertMarkdownToHtml(sHtml);
									}else if(sExt==='txt'){
										sHtml='<!DOCTYPE html>'
										       + '<html>'
										       + '<head>'
										       + '<style>'
										       //+ 'body,pre,p,div{font-family: "Microsoft Yahei", Helvetica, sans-serif, arial; font-size: 10pt;}'
										       + ' div p{margin: 0.4em 0 0.4em 0;}'
										       //+ (ui.isDarkMode() ? ' body div p{background-color: #282d29;}' : '')
										       //+ (ui.isDarkMode() ? ' body div p{background-color: rgba(40, 45, 41, 0.784314);}' : '')
										       + '</style>'
										       + '</head>'
										       + '<body>'
										       //+ '<article><pre>%TEXT_CONTENT%</pre></article>'.replace(/%TEXT_CONTENT%/g, platform.htmlEncode(sHtml))
										       + '<article>%TEXT_CONTENT%</article>'.replace(/%TEXT_CONTENT%/g, _text_to_html(sHtml, 'div'))
										       + '</body></html>'
										;
									}else{
										sHtml=_remove_scripts(sHtml); //get rid of scripts from random html documents;
									}

									//2020.6.12 from v8.0 on, css are externaly linked, no inline css available;
									let sCss=xNyf.cssTextForDoc(xSrc.toStr());
									if(sCss){
										sCss+='\n\n/*** Fixes 2022.1.19 ***/\n'
												+'a{margin-left: 4px; margin-right: 4px;}'
												+'a:hover{text-decoration: underline;}'
												+'hr{border: 0px; height: 1px; background: darkgray;}'
										;

										let sFnCss=_hash_name(sCss, 'CSS-Export', 'css', 'CSS-Export');
										let xFnCss=new CLocalFile(sDstDir, sFnCss);
										if(!xFnCss.exists()){
											xFnCss.saveUtf8(sCss);
										}
										sHtml=_install_csslink(sHtml, sFnCss);
									}
								}
							}
							xLI['sHref']=sName;
							if(sID) xID$Doc[sID]=sName; else xID$Doc[sSsgPath]=sName; //2021.5.29 back-compatibility with earlier versions using ssgpaths instead of ids;
						}
					}else{
						//2018.4.4 make a default page for listing attachments if any;
						if(xLI['vFiles'].length>0){
							//<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
							//<html xmlns="http://www.w3.org/1999/xhtml">
							sHtml='<!DOCTYPE html>'
									+ '<html>'
									+ '<head>'
									+ '<style>body,pre{font-family:system, -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", "Helvetica", "Arial", "sans-serif";}</style>'
									+ '</head>'
									+ '<body>'
									//+ '<p>No text content but the following attachments available.</p>'
									+ '</body></html>'
							;
							let sName=_hash_name(sSsgPath, sTitle||'Untitled', 'html', 'placeholder');
							xDst=new CLocalFile(sDstDir, sName);
							xLI['sHref']=sName;
							if(sID) xID$Doc[sID]=sName; else xID$Doc[sSsgPath]=sName; //2021.5.29 back-compatibility with earlier versions using ssgpaths instead of ids;
						}
					}

					if(sHtml && xDst){
						sHtml=substituteUrisWithinHtml(sHtml, 'img,link,a,script', function(sObj, sTagName){
							let u=sObj||'';
							u=_use_cdn_ver_of_Katex(u); //2020.1.22 CDN version of ketex would be required, if any Maths with katex enabled;
							if(u.search(/\.(jpg|jpeg|gif|png|bmp|svg|webp|swf|css|js)$/i)>0){

								//2020.1.22 for markdown documents, it may contain several local file links and a relative file path to attached css;
								//("nyf://localhost/${scripts}/hljs/styles/${SyntaxHighlightStyleName}.css")
								//("nyf://localhost/${scripts}/marked/marked.css")
								//("./markdown.css")

								u=u.replace(/^\.\/([^/\\]+)$/i, '$1'); //"./markdown.css"  --> "markdown.css"
								u=u.replace(/^nyf:\/\/localhost\//i, 'file:///'); //make nyf:// to file:// for consistency with nyf7;
								u=u.replace(/^\/(.+)$/i, 'file:///$1'); //"/${HOME}/tmp/123.jpg" --> ""file:///${HOME}/tmp/123.jpg""

								if(u.search(/[:?*|/\\<>]/)<0){ //for linked objs, possibly saved in the attachments section;

									let xObjSrc=new CLocalFile(sSsgPath);
									xObjSrc.append(percentDecode(u)); //2016.5.8 percentDecoding is required;
									if(xNyf.fileExists(xObjSrc.toStr())){ //2018.4.4 prevent from producing zero-sized image files;
										let sExt2=xObjSrc.getExtension(false)||'';
										if(sExt2 && sExt2.length<8){
											let sObjWinName=_hash_name(sSsgPath, u, sExt2, 'linked-img');
											let xObjDst=new CLocalFile(sDstDir, sObjWinName);
											if(_isModified(xObjSrc.toStr(), xObjDst.toStr())){
												if(xNyf.exportFile(xObjSrc.toStr(), xObjDst.toStr())>=0){
													u=sObjWinName;
												}
											}else{
												u=sObjWinName; //already existing with no changes;
											}
										}
									}

								}else if(u.search(/^file:\/\//i)===0){ //for href objects, possibly linked to local files;

									let sFn=localFileFromUrl(u, true);
									if(sFn){
										sFn=xNyf.evalRelativePath(sFn);
										let sDiskFn=vLocalFiles[sFn];
										if(sDiskFn){
											u=sDiskFn; //the file already exported from in previous other items;
										}else{
											let xFn=new CLocalFile(sFn);
											if(xFn.exists()){
												let sExt2=xFn.getExtension(false)||'';
												if(sExt2 && sExt2.length<8){
													let sObjWinName=_hash_name(xFn.getDirectory(false), xFn.getLeafName(), sExt2, 'file-link');
													let xObjDst=new CLocalFile(sDstDir, sObjWinName);
													if(xFn.copyTo(sDstDir, sObjWinName)>=0){
														u=sObjWinName;
														vLocalFiles[sFn]=sObjWinName;
													}
												}
											}
										}
									}

								}

							}else if(u.search(/^file:\/\//i)===0){ //consider evaluation of file links with relative paths; e.g. file:///${xxx}/...

								let sFn=localFileFromUrl(u, true);
								if(sFn){
									sFn=xNyf.evalRelativePath(sFn);
									if(sFn){
										u=urlFromLocalFile(sFn, true);
									}
								}

							}
							if(u===sObj)  logd('ignoreLink: ' + ellipsis(sObj, 128)); else logd('resolveLink: ' + ellipsis(sObj, 128) + ' --> ' + u);
							return u;
						});

						sHtml=_add_attachment_list(sHtml, vAttach);
						sHtml=_install_script(sHtml, 'jquery.js;itemlink.js'.split(';'));
						sHtml=_add_promotional_tag(sHtml);

						if(xDst && sHtml!==sHtml0){
							xDst.saveUtf8(sHtml);
						}
					}

					vInfoItems[vInfoItems.length]=xLI;

				};

				xNyf.traverseOutline(sCurItem, bCurBranch, _act_on_treeitem);

				if(vInfoItems.length>0){
					let vItems=[];
					for(let j in vInfoItems){
						let xLI=vInfoItems[j], sAttach=xLI.vFiles.join(';');
						let sID=xLI.nID>=0 ? xLI.nID : '', sSub=xLI.nSub>0 ? xLI.nSub : '';
						let s='\t<li';
						s+=' level=\"'+xLI.iLevel+'\"';
						if(sSub) s+=' sub=\"'+sSub+'\"';
						if(sID) s+=' id=\"'+sID+'\"';
						if(xLI.sRelated) s+=' related=\"'+(xLI.sRelated||'')+'\"';
						if(xLI.sHref) s+=' href=\"'+(xLI.sHref||'')+'\"';
						if(sAttach) s+=' attach=\"'+sAttach+'\"';
						s+='>';
						s+=platform.htmlEncode(xLI.sTitle);
						s+='</li>';
						vItems.push(s);
					}

					if(vItems.length>0){
						let xFn=new CLocalFile(sDstDir, 'nav.html');
						let sHtml=xFn.loadText('html');
						xFn.saveUtf8(sHtml.replace(/%InfoItems%/, vItems.join('\n')).replace(/[\r\n]+/g, sEol));
					}

					//2013.3.27 export IDs of info items, so the item link can work within web pages.
					if(1){
						let xFn=new CLocalFile(sDstDir, 'itemlink.js');
						let s=xFn.loadText('auto');
						if(s){

							//for item links;
							if(1){
								let sTmp='';
								for(let sID in xID$Doc){
									if(sTmp) sTmp+='\n\t, ';
									sTmp+='"'+sID+'": ';
									sTmp+='"'+xID$Doc[sID]+'"';
								}
								sTmp='{'+sTmp+'\n}';
								s=s.replace(/%xItemIDs%/gi, sTmp);
							}

							//for bookmark links;
							if(1){
								let sTmp='';
								for(let sBkmkID in xBkmk$Info){
									if(sTmp) sTmp+='\n\t, ';
									sTmp+='"'+sBkmkID+'": ';
									sTmp+='"'+xBkmk$Info[sBkmkID]+'"';
								}
								sTmp='{'+sTmp+'\n}';
								s=s.replace(/%xBkmkIDs%/gi, sTmp);
							}

							s=trim(s).replace(/[\r\n]+/g, sEol); //get rid of blank lines;

							xFn.saveUtf8(s);
						}
					}

					if(confirm(_lc2('Done', 'Successfully generated Html contents with tree-structured navigation. View it now?'))){
						let xStartPage=new CLocalFile(sDstDir, 'index.html');
						xStartPage.launch();
					}
				}
			}else{
				alert('Bad input of directory or range');
			}
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	alert(e);
//}
