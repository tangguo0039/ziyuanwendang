
//sValidation=nyfjs
//sCaption=Export HTML tree ...
//sHint=Export content as webpages with an HTML tree navigation
//sCategory=MainMenu.Tools
//sID=p.ExportHtmlTree
//sAppVerMin=7.0
//sShortcutKey=
//sAuthor=wjjsoft

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_l=function(s){return (s||'').replace(/^\s+/g, '');};
var _trim_r=function(s){return (s||'').replace(/\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

var _html_encode=function(s)
{
	//http://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references
	s=s.replace(/&/g,	'&amp;');
	s=s.replace(/</g,	'&lt;');
	s=s.replace(/>/g,	'&gt;');
	s=s.replace(/\"/g,	'&quot;');
	s=s.replace(/\'/g,	'&apos;');
	s=s.replace(/  /g,	' &nbsp;'); //&nbsp; = non-breaking space;
	//and more ...
	return s;
};

var _html_decode=function(s)
{
	s=s.replace(/&lt;/g,		'<');
	s=s.replace(/&gt;/g,		'>');
	s=s.replace(/&quot;/g,		'"');
	s=s.replace(/&apos;/g,		'\'');
	s=s.replace(/&nbsp;/g,		' ');
	s=s.replace(/&circ;/g,		'^');
	s=s.replace(/&tilde;/g,		'~');
	//and more ...
	s=s.replace(/&amp;/g,		'&');
	return s;
};

var _pack_array=function(v, xPred){
	var vTmp=[];
	for(var i=0; i < v.length; ++i){
		var bDel=false, val=v[i];
		if(typeof(xPred)=='function'){
			bDel=xPred(i, val);
		}else{
			bDel=xPred ? (val==xPred) : (!val);
		}
		if(!bDel){
			vTmp[vTmp.length]=val;
		}
	}
	return vTmp;
};

var _compare_array=function(v1, v2)
{
	var iRes=0;
	if(v1.length>v2.length){
		iRes=1;
	}else if(v1.length<v2.length){
		iRes=-1;
	}else{
		for(var i=0; i < v1.length; ++i){
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

try{

	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		var vActs=[
				  _lc2('CurBranch', '1. Export the current branch as HTML Tree')
				, _lc2('WholeDb', '2. Export the whole database as HTML Tree')
			];

		var sCfgKey='ExportHtmlTree.iAction';
		var sMsg=_lc('p.Common.SelAction', 'Please select an action from within the dropdown list');
		var iSel=dropdown(sMsg, vActs, localStorage.getItem(sCfgKey));
		if(iSel>=0){

			localStorage.setItem(sCfgKey, iSel);

			sCfgKey='ExportHtmlTree.sPathDst';
			var sDstDir=platform.browseForFolder(_lc2('SelDest', 'Select a destination folder to save HTML tree'), localStorage.getItem(sCfgKey));
			if(sDstDir){

				localStorage.setItem(sCfgKey, sDstDir);

				var bCurBranch=(iSel==0);
				var sCurItem=bCurBranch ? plugin.getCurInfoItem(-1) : plugin.getDefRootContainer();
				var sTitle=bCurBranch ? xNyf.getFolderHint(sCurItem) : xNyf.getDbTitle();

				{
					//copy static files to the destination folder;
					var xNames={
						'jquery.js': 'jquery-1.5.min.js'
						, 'index.html': '_htmltree_index.html'
						, 'nav.html': '_htmltree_navpane.html'
						, 'itemlink.js': '_htmltree_itemlink.html' //2013.3.27 to enable item links nyf://entry?...
						, 'icon_plus.gif': 'icon_plus.gif'
						, 'icon_minus.gif': 'icon_minus.gif'
						, 'icon_itemlink.gif': 'icon_itemlink.gif'
						, 'icon_attachment.gif': 'icon_attachment.gif'
						, 'icon_newwin.gif': 'icon_newwin.gif'
						, 'icon_jump.gif': 'icon_jump.gif'
						, 'icon_email.gif': 'icon_email.gif'
					};
					var sPathSrc=new CLocalFile(plugin.getScriptFile()).getDirectory(); var sMissing='';
					for(var sFn in xNames){
						var sNameDst=xNames[sFn];
						var xSrc=new CLocalFile(sPathSrc); xSrc.append(sNameDst);
						if(xSrc.exists()){
							var xDst=new CLocalFile(sDstDir); xDst.append(sFn);
							if('.gif;.jpg;.png'.split(';').indexOf(xSrc.getExtension())>=0){
								xSrc.copyTo(sDstDir, sFn);
							}else{
								var s=xSrc.loadText('').replace(/\n/g, '\r\n');
								if(xSrc.getExtension().toLowerCase()=='.html'){
									s=s.replace(/%DbTitle%/g, sTitle);
								}
								xDst.saveUtf8(s);
							}
						}else{
							if(sMissing) sMissing+='\n'; sMissing+=xSrc;
						}
					}
					if(sMissing){
						alert('The following files are missing. You may need to re-install the software.'+'\n\n'+sMissing);
					}
				}

				var _validate_filename=function(s){
					s=s||'';
					s=s.replace(/[\*\?\.\(\)\[\]\{\}\<\>\\\/\!\$\^\&\+\|,;:\"\'`~@#]/g, ' ');
					s=s.replace(/\s{2,}/g, ' ');
					s=_trim(s);
					if(s.length>64) s=s.substr(0, 64);
					s=_trim(s);
					s=s.replace(/\s/g, '_');
					return s;
				};

				var _unique_filename=function(sDir, sName, sExt){
					var sRes=sName+sExt, xFn=new CLocalFile(sDir); xFn.append(sRes);
					while(xFn.exists()){
						sRes=sName+'-'+Math.round(Math.random()*1000)+sExt;
						xFn=new CLocalFile(sDir); xFn.append(sRes);
					}
					return sRes;
				};

				/*var _hash_name=function(s1, s2, sExt){
					//2011.2.8 make signed into unsigned by using the operator 'n>>>0';
					//http://hi.baidu.com/ebiyuan/blog/item/d0691adb9c78156ed1164e4b.html
					var sName=(adler32(s1)>>>0).toString(16).toLowerCase();
					if(s2) sName+='_'+(adler32(s2)>>>0).toString(16).toLowerCase();
					return sName+sExt;
				};*/

				var _xNamesUsed={};
				var _hash_name=function(s1, s2, sExt){
					var sName='', i=0;
					do{
						//2011.2.8 make signed into unsigned by using the operator 'n>>>0';
						//http://hi.baidu.com/ebiyuan/blog/item/d0691adb9c78156ed1164e4b.html
						sName=(adler32(s1)>>>0).toString(16).toLowerCase();
						if(s2) sName+='_'+(adler32(s2)>>>0).toString(16).toLowerCase();
						sName+=('_'+i);
						sName+=sExt;
						i++;
					}while(_xNamesUsed[sName]);
					//2013.11.2 save the name to avoid file overwriting;
					_xNamesUsed[sName]=1;
					return sName;
				};

				var sDefNoteFn=plugin.getDefNoteFn();

				var _default_name=function(vFiles, bWebOnly){
					var sDef='';
					{
						var vDefNames=[sDefNoteFn, 'index.html', 'index.htm', 'home.html', 'home.htm', 'default.html', 'default.htm'];
						for(var i in vDefNames){
							if(i==0 && bWebOnly) continue;
							var sName=vDefNames[i];
							if((vFiles||[]).indexOf(sName)>=0){
								sDef=sName;
								break;
							}
						}
					}

					if(!sDef){
						var vBands='.html;.htm;.url>.xml;.eml>.gif;.png;.jpg;.jpeg;.bmp'.split('>');
						for(var j in vBands){
							var vExts=vBands[j].split(';');
							for(var i in vFiles){
								var sName=vFiles[i];
								var sExt=new CLocalFile(sName).getExtension().toLowerCase();
								if(vExts.indexOf(sExt)>=0){
									sDef=sName;
									break;
								}
							}
							if(sDef) break;
						}
					}
					return sDef;
				};

				var _updated=function(sSsgFn, sWinFn){
					var xWinFn=new CLocalFile(sWinFn), t1=xNyf.getModifyTime(sSsgFn), bUpd=true;
					if(xWinFn.exists()){
						var t2=xWinFn.getModifyTime();
						bUpd=t1>t2;
					}
					return bUpd;
				}

				plugin.initProgressRange(plugin.getScriptTitle());

				var sCss='table{border: 1px solid gray;} td{border: 1px dotted gray;} '
					+ 'p{margin: 3px 0 3px 0; padding: 0;} '
					+ '#ID_Footer{font-size: small; font-style: italic;} '
					+ 'a{padding-right: 20px; background: URL(./icon_newwin.gif) no-repeat center right;} '
					+ 'a[href ^= "mailto:"]{padding: 0 20px 0 0; background: URL(./icon_email.gif) no-repeat center right;} '
					+ 'a[href ^= "nyf:"]{padding: 0 20px 0 0; background: URL(./icon_jump.gif) no-repeat center right;} '
					;

				//2013.3.27 enable item links to work;
				var xIDofPath={}, xPathOfID={}, xIDofDoc={};
				{
					var vLines=xNyf.listItemIDs().split('\r\n');
					for(var i in vLines){
						var v=vLines[i].split('\t');
						if(v.length==2){
							var sID=v[0], sPath=v[1];
							if(sID && sPath){
								xIDofPath[sID]=sPath;
								xPathOfID[sPath]=sID;
							}
						}
					}
				}

				//2013.3.29 enable bookmarks to work;
				var xIDofBkmk={};
				{
					var vLines=xNyf.listBookmarks().split('\r\n');
					for(var i in vLines){
						var v=vLines[i].split('\t');
						if(v.length>=2){
							var sBkmkID=v[0], sPath=v[1], sItemID=v[2];
							if(sBkmkID && sItemID){
								xIDofBkmk[sBkmkID]=sItemID;
							}
						}
					}
				}

				var _is_local_file=function(s){
					//2011.12.3 test if it's javascript, mailto, http://, or contains any of :?#;
					return s.match(/^javascript:/i)==null 
						&& s.match(/^mailto:/i)==null 
						&& s.match(/:\/\//i)==null 
						&& s.match(/[:\?\#]/i)==null
						//&& s.match(/[^\:\?\*\<\>\|\/\\]/)
						;
				};

				var _detect_linked_objs=function(s, sTag, vObjs){
					if(s && sTag){
						//2011.8.20 '\s' seems not to function within the [...] operator, so replace it with ' \t';

						//2012.7.30 consider all 3 possible formats of the linked objects;
						var vRE=[
							  '=\"(.+?)\"'				//src="abc def.jpg"
							, '=\'(.+?)\''				//src='abc def.jpg'
							//2013.11.2 this may produce some mismatches;
							//, '=(?!\"|\')(.+?)[> \t]'		//src=abc.jpg, spaces not allowed;
						];
						for(var i in vRE){
							var re=new RegExp(sTag+vRE[i], 'ig'), v=[];
							while(v=re.exec(s)){
								if(v && v.length>1){
									//2011.8.21 in case of empty filenames which would cause problems, like this: herf="" or src='';
									var sObj=v[1].replace(/[\'\"]/g, '');
									if(sObj && _is_local_file(sObj)){
										if(vObjs.indexOf(sObj)<0){
											vObjs.push(sObj);
										}
									}
								}
							}
						}
					}
				};

				var _install_script=function(sHtml, vJsFn){
					var sRes=sHtml;
					var p=sHtml.indexOf('</body>'); if(p<0) p=sHtml.indexOf('</head>');
					if(p>=0){
						sRes=sHtml.substr(0, p);
						for(var i in vJsFn){
							sRes+= '<script type="text/javascript" language="javascript" src="'+vJsFn[i]+'"></script>';
						}
						sRes+= sHtml.substr(p);
					}
					return sRes;
				};

				var _idOfSsgPath=function(sSsgPath){
					var sID;
					{
						var v=sSsgPath.toString().replace(/\\/g, '/').split('/'), s='';
						for(var i in v){
							if(v[i]){
								s+='/';
								s+=v[i];
							}
						}
						if(s){
							s+='/';
							sID=xPathOfID[s];
						}
					}
					return sID;
				};

				var nDone=0, vInfoItems=[], vFails=[];
				var _act_on_treeitem=function(sSsgPath, iLevel){

					var xLI={}, sTitle=xNyf.getFolderHint(sSsgPath);

					var bContinue=plugin.ctrlProgressBar(sTitle||'Untitled', 1, true);
					if(!bContinue) return true;

					xLI['sSsgPath']=sSsgPath;
					xLI['sTitle']=sTitle;
					xLI['iLevel']=iLevel;
					xLI['sHref']='';
					xLI['vFiles']=[];
					xLI['nSub']=xNyf.getFolderCount(sSsgPath);
					xLI['nID']=xNyf.getItemIDByPath(sSsgPath, false)

					var xPath=new CLocalFile(sSsgPath); xPath.append('/');
					var sID=_idOfSsgPath(xPath.toString()); //xPathOfID[xPath.toString()];

					var sRel='', vRel=xNyf.listRelated(sSsgPath);
					for(var i in vRel){
						var nID=xNyf.getItemIDByPath(vRel[i], false);
						if(nID>=0){
							if(sRel) sRel+=';';
							sRel+=nID;
						}
					}
					xLI['sRelated']=sRel;

					//var vFiles=xNyf.listFiles(sSsgPath), sDef=_default_name(vFiles);
					var sDef=xNyf.detectPreferredFile(sSsgPath, 'html;htm>rtf>txt;ini;log;>jpg;png;gif;bmp');

					//first handle and export default content for the info item;
					if(sDef){
						var xSrc=new CLocalFile(sSsgPath); xSrc.append(sDef);
						if(!xNyf.isShortcut(xSrc)){
							//if(sDef==sDefNoteFn){
							if(xSrc.getExtension(true).toLowerCase()=='.rtf'){
								var sExt='.html', sName=_hash_name(xSrc, sTitle||'Untitled', sExt);
								var xDst=new CLocalFile(sDstDir); xDst.append(sName);
								if(_updated(xSrc, xDst)){
									var s=xNyf.loadText(xSrc, '');
									s=platform.convertRtfToHtml(s
										, {bInner: false
										, bPicture: true
										, sImgDir: sDstDir
										, sTitle: sTitle
										//, sFooter: (plugin.isAppLicensed() ? '' : 'Generated with myBase/HtmlTree Converter by Wjj Software')
										, sFooter: (plugin.isAppLicensed() ? '' : '%MYBASE-HTMLTREE-MAKER%')
										, sStyle: sCss
										, sJsFiles: 'jquery.js;itemlink.js'
										}
									);
									s=s.replace('%MYBASE-HTMLTREE-MAKER%', 'Generated with <a href="http://www.wjjsoft.com/mybase#htmltree" target="_blank">myBase/HtmlTree Maker</a> by <a href="http://www.wjjsoft.com/#htmltree" target="_blank">Wjj Software</a>');
									s=_install_script(s, 'jquery.js;itemlink.js'.split(';'));
									xDst.saveUtf8(s);
								}
								xLI['sHref']=sName;
								if(sID) xIDofDoc[sID]=sName;
							}else{
								/*var sExt=xSrc.getExtension();
								var sName=_hash_name(xSrc, sTitle||'Untitled', sExt);
								var xDst=new CLocalFile(sDstDir); xDst.append(sName);
								if(_updated(xSrc, xDst)){
									if(xNyf.exportFile(xSrc, xDst)<0){
										sName='';
									}
								}*/
								var sExt=xSrc.getExtension(true);
								var sName=_hash_name(xSrc, sTitle||'Untitled', sExt);
								var xDst=new CLocalFile(sDstDir); xDst.append(sName);
								if(_updated(xSrc, xDst) && xNyf.exportFile(xSrc, xDst)>=0){
									if('.html;.htm'.split(';').indexOf(sExt.toLowerCase())>=0){
										var sHtml=xDst.loadText('').replace(/\n/g, '\r\n');
										if(sHtml){
											var vObjs=[];
											_detect_linked_objs(sHtml, 'src', vObjs); //images
											_detect_linked_objs(sHtml, 'href', vObjs); //css
											if(vObjs.length>0){
												var xRE_Exts=new RegExp('(\.jpg|\.jpeg|\.gif|\.png|\.bmp|\.swf|\.css)', 'i');
												for(var i in vObjs){
													var sObj=vObjs[i]||'';
													if(sObj.match(xRE_Exts) && sObj.match(/[^:\?\*\|\/\\\<\>]/)){
														var xObjSrc=new CLocalFile(sSsgPath);
														try{
															//2013.11.2 For random names, this function may fail if any invalid characters contained;
															xObjSrc.append(sObj);
														}catch(e){
															//alert(e.toString());
															continue;
														}
														var sExt2=xObjSrc.getExtension(true);
														if(sExt2.toLowerCase()!='.js'){
															//2013.11.2 no js put into HTMLTREE;
															var sObjWinName=_hash_name(xSrc, sObj, sExt2);
															var xObjDst=new CLocalFile(sDstDir); xObjDst.append(sObjWinName);
															if(xNyf.exportFile(xObjSrc, xObjDst)>=0){
																var sPat=sObj.replace(/[\.\[\]]/g, function(w){return '\\'+w;});
																sHtml=sHtml.replace(new RegExp(sPat, 'g'), sObjWinName);
															}
														}
													}
												}
											}

											//2014.12.9 get inner item links to work;
											//if(sDef==sDefNoteFn)
											{
												sHtml=_install_script(sHtml, 'jquery.js;itemlink.js'.split(';'));
											}

											/*var sType=xDst.typeOfEncoding();
											if(sType=='ANSI'){
												xDst.saveAnsi(sHtml);
											}else{
												xDst.saveUtf8(sHtml);
											}*/

											xDst.saveUtf8(sHtml);
										}
									}
								}else{
									//sName='';
								}

								xLI['sHref']=sName;
								if(sID) xIDofDoc[sID]=sName;
							}
						}
					}

					//2013.11.2 For now, just export linked images, instead of all existing attachments; See above;
					/*
					//then export image or CSS files linked with webpages;
					for(var i in vFiles){
						var sName=vFiles[i];
						if(sName!=sDef){
							var xSrc=new CLocalFile(sSsgPath); xSrc.append(sName);
							if(!xNyf.isShortcut(xSrc)){
								if('.gif;.jpg;.jpeg;.png;.bmp;.css'.split(';').indexOf(xSrc.getExtension().toLowerCase())>=0){
									var xDst=new CLocalFile(sDstDir); xDst.append(sName);
									if(_updated(xSrc, xDst)){
										if(xNyf.exportFile(xSrc, xDst)<0){
											sName='';
										}
									}
									if(sName){
										var v=xLI['vFiles']; v[v.length]=sName;
									}
								}
							}
						}
					}
					*/

					vInfoItems[vInfoItems.length]=xLI;

				};

				xNyf.traverseOutline(sCurItem, bCurBranch, _act_on_treeitem);

				if(vInfoItems.length>0){
					var sHtm='';
					for(var j in vInfoItems){
						var xLI=vInfoItems[j];

						var sAttach='';
						for(var i in xLI.vFiles){
							if(sAttach) sAttach+=';';
							sAttach+=xLI.vFiles[i];
						}

						if(sHtm) sHtm+='\r\n';

						var sID=xLI.nID>=0 ? xLI.nID : '', sSub=xLI.nSub>0 ? xLI.nSub : '';

						sHtm+='\t<li';
						sHtm+=' level=\"'+xLI.iLevel+'\"';
						if(sSub) sHtm+=' sub=\"'+sSub+'\"';
						if(sID) sHtm+=' id=\"'+sID+'\"';
						if(xLI.sRelated) sHtm+=' related=\"'+(xLI.sRelated||'')+'\"';
						if(xLI.sHref) sHtm+=' href=\"'+(xLI.sHref||'')+'\"';
						if(sAttach) sHtm+=' attach=\"'+sAttach+'\"';
						sHtm+='>';
						sHtm+=_html_encode(xLI.sTitle);
						sHtm+='</li>';
					}

					if(sHtm){
						var xFn=new CLocalFile(sDstDir); xFn.append('nav.html');
						var sHtml=xFn.loadText('').replace(/\n/g, '\r\n');
						xFn.saveUtf8(sHtml.replace(/%InfoItems%/, sHtm));
					}

					//2013.3.27 export IDs of info items, so the item link can work within web pages.
					var xFn=new CLocalFile(sDstDir); xFn.append('itemlink.js');
					var sTxt=xFn.loadText('').replace(/\n/g, '\r\n');
					if(sTxt){
						//for item links;
						{
							var sTmp='';
							for(var sID in xIDofDoc){
								if(sTmp) sTmp+='\r\n\t, ';
								sTmp+='"'+sID+'": ';
								sTmp+='"'+xIDofDoc[sID]+'"';
							}
							sTmp='{'+sTmp+'}';
							sTxt=sTxt.replace(/%xItemIDs%/gi, sTmp);
						}
						//for bookmark links;
						{
							var sTmp='';
							for(var sBkmkID in xIDofBkmk){
								if(sTmp) sTmp+='\r\n\t, ';
								sTmp+='"'+sBkmkID+'": ';
								sTmp+='"'+xIDofBkmk[sBkmkID]+'"';
							}
							sTmp='{'+sTmp+'}';
							sTxt=sTxt.replace(/%xBkmkIDs%/gi, sTmp);
						}
						xFn.saveUtf8(sTxt);
					}

					if(confirm(_lc2('Done', 'The HTML tree successfully generated. View it now?'))){
						var xStartPage=new CLocalFile(sDstDir); xStartPage.append('index.html');
						xStartPage.exec('');
					}
				}
			}
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

}catch(e){
	alert(e);
}
