
//sValidation=nyfjs
//sCaption=Export ePub digital book ...
//sHint=Export contents in current branch as .ePub digital book
//sCategory=MainMenu.Share
//sCondition=CURDB; CURINFOITEM; OUTLINE
//sID=p.ExportEpub
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

//iPolicy_RenderEmptyItem: policy on rendering info items that don't have any web content;
//0 = Leave as it is, 1 = 'No content available', 2 = Listing child items
var iPolicy_RenderEmptyItem=2;

//iPolicy_xHtml11Conversion: policy on validating random HTML documents saved in .nyf databases;
//0 = Leave as it is with no conversion, 1 = Discard images/formatting, 2 = Try to convert to xHtml 1.1;
var iPolicy_xHtml11Conversion=2;

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_l=function(s){return (s||'').replace(/^\s+/g, '');};
var _trim_r=function(s){return (s||'').replace(/\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

//var _html_encode=function(s)
//{
//	//http://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references
//	s=s.replace(/&/g,	'&amp;');
//	s=s.replace(/</g,	'&lt;');
//	s=s.replace(/>/g,	'&gt;');
//	s=s.replace(/\"/g,	'&quot;');
//	s=s.replace(/\'/g,	'&apos;');
//	s=s.replace(/  /g,	' &nbsp;'); //&nbsp; = non-breaking space;
//	//and more ...
//	return s;
//};

//var _html_decode=function(s)
//{
//	s=s.replace(/&lt;/g,		'<');
//	s=s.replace(/&gt;/g,		'>');
//	s=s.replace(/&quot;/g,		'"');
//	s=s.replace(/&apos;/g,		'\'');
//	s=s.replace(/&nbsp;/g,		' ');
//	s=s.replace(/&circ;/g,		'^');
//	s=s.replace(/&tilde;/g,		'~');
//	//and more ...
//	s=s.replace(/&amp;/g,		'&');
//	return s;
//};

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

//try{
	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		if(plugin.isContentEditable()) plugin.commitCurrentChanges();

		var bCurBranch=true;
		var sRootItem=plugin.getDefRootContainer();
		var sCurItem=bCurBranch ? plugin.getCurInfoItem(-1) : plugin.getDefRootContainer();
		var sItemTitle=bCurBranch ? xNyf.getFolderHint(sCurItem) : xNyf.getDbTitle();

		var sCfgKey1='ExportEpub.sDstFn';
		var sCfgKey2='ExportEpub.iLang';
		var sCfgKey3='ExportEpub.sAuthor';

		var xInitFn=new CLocalFile(localStorage.getItem(sCfgKey1)||platform.getHomePath()||'', _validate_filename(sItemTitle)||'untitled');

		//2013.11.18 select a language appropriate for content in ePub;
		//http://msdn.microsoft.com/en-us/library/ms533052(vs.85).aspx
		var vLangs=[
			  "af :  Afrikaans"
			, "ar-AE :  Arabic (U.A.E.)"
			, "ar-BH :  Arabic (Bahrain)"
			, "ar-DZ :  Arabic (Algeria)"
			, "ar-EG :  Arabic (Egypt)"
			, "ar-IQ :  Arabic (Iraq)"
			, "ar-JO :  Arabic (Jordan)"
			, "ar-KW :  Arabic (Kuwait)"
			, "ar-LB :  Arabic (Lebanon)"
			, "ar-LY :  Arabic (Libya)"
			, "ar-MA :  Arabic (Morocco)"
			, "ar-OM :  Arabic (Oman)"
			, "ar-QA :  Arabic (Qatar)"
			, "ar-SA :  Arabic (Saudi Arabia)"
			, "ar-SY :  Arabic (Syria)"
			, "ar-TN :  Arabic (Tunisia)"
			, "ar-YE :  Arabic (Yemen)"
			, "be :  Belarusian"
			, "bg :  Bulgarian"
			, "ca :  Catalan"
			, "cs :  Czech"
			, "da :  Danish"
			, "de :  German (Standard)"
			, "de-AT :  German (Austria)"
			, "de-CH :  German (Switzerland)"
			, "de-LI :  German (Liechtenstein)"
			, "de-LU :  German (Luxembourg)"
			, "el :  Greek"
			, "en :  English"
			, "en :  English (Caribbean)"
			, "en-AU :  English (Australia)"
			, "en-BZ :  English (Belize)"
			, "en-CA :  English (Canada)"
			, "en-GB :  English (United Kingdom)"
			, "en-IE :  English (Ireland)"
			, "en-JM :  English (Jamaica)"
			, "en-NZ :  English (New Zealand)"
			, "en-TT :  English (Trinidad)"
			, "en-US :  English (United States)"
			, "en-ZA :  English (South Africa)"
			, "es :  Spanish (Spain)"
			, "es-AR :  Spanish (Argentina)"
			, "es-BO :  Spanish (Bolivia)"
			, "es-CL :  Spanish (Chile)"
			, "es-CO :  Spanish (Colombia)"
			, "es-CR :  Spanish (Costa Rica)"
			, "es-DO :  Spanish (Dominican Republic)"
			, "es-EC :  Spanish (Ecuador)"
			, "es-GT :  Spanish (Guatemala)"
			, "es-HN :  Spanish (Honduras)"
			, "es-MX :  Spanish (Mexico)"
			, "es-NI :  Spanish (Nicaragua)"
			, "es-PA :  Spanish (Panama)"
			, "es-PE :  Spanish (Peru)"
			, "es-PR :  Spanish (Puerto Rico)"
			, "es-PY :  Spanish (Paraguay)"
			, "es-SV :  Spanish (El Salvador)"
			, "es-UY :  Spanish (Uruguay)"
			, "es-VE :  Spanish (Venezuela)"
			, "et :  Estonian"
			, "eu :  Basque (Basque)"
			, "fa :  Farsi"
			, "fi :  Finnish"
			, "fo :  Faeroese"
			, "fr :  French (Standard)"
			, "fr-BE :  French (Belgium)"
			, "fr-CA :  French (Canada)"
			, "fr-CH :  French (Switzerland)"
			, "fr-LU :  French (Luxembourg)"
			, "ga :  Irish"
			, "gd :  Gaelic (Scotland)"
			, "he :  Hebrew"
			, "hi :  Hindi"
			, "hr :  Croatian"
			, "hu :  Hungarian"
			, "id :  Indonesian"
			, "is :  Icelandic"
			, "it :  Italian (Standard)"
			, "it-CH :  Italian (Switzerland)"
			, "ja :  Japanese"
			, "ji :  Yiddish"
			, "ko :  Korean"
			, "ko :  Korean (Johab)"
			, "lt :  Lithuanian"
			, "lv :  Latvian"
			, "mk :  Macedonian (FYROM)"
			, "ms :  Malaysian"
			, "mt :  Maltese"
			, "nl :  Dutch (Standard)"
			, "nl-BE :  Dutch (Belgium)"
			, "no :  Norwegian (Bokmal)"
			, "no :  Norwegian (Nynorsk)"
			, "pl :  Polish"
			, "pt :  Portuguese (Portugal)"
			, "pt-BR :  Portuguese (Brazil)"
			, "rm :  Rhaeto-Romanic"
			, "ro :  Romanian"
			, "ro-MO :  Romanian (Republic of Moldova)"
			, "ru :  Russian"
			, "ru-MO :  Russian (Republic of Moldova)"
			, "sb :  Sorbian"
			, "sk :  Slovak"
			, "sl :  Slovenian"
			, "sq :  Albanian"
			, "sr :  Serbian (Cyrillic)"
			, "sr :  Serbian (Latin)"
			, "sv :  Swedish"
			, "sv-FI :  Swedish (Finland)"
			, "sx :  Sutu"
			, "sz :  Sami (Lappish)"
			, "th :  Thai"
			, "tn :  Tswana"
			, "tr :  Turkish"
			, "ts :  Tsonga"
			, "uk :  Ukrainian"
			, "ur :  Urdu"
			, "ve :  Venda"
			, "vi :  Vietnamese"
			, "xh :  Xhosa"
			, "zh-CN :  Chinese (PRC)"
			, "zh-HK :  Chinese (Hong Kong SAR)"
			, "zh-SG :  Chinese (Singapore)"
			, "zh-TW :  Chinese (Taiwan)"
			, "zu :  Zulu"
		];

		var vFields = [
			{sField: 'savefile', sLabel: _lc2('DstFn', 'Save as ePub file'), sFilter: 'ePub documents (*.epub);;All files (*.*)', sTitle: plugin.getScriptTitle(), sInit: xInitFn.toStr(), bReq: true}
			, {sField: 'combolist', sLabel: _lc2('SelLang', 'Language for the text content'), vItems: vLangs, sInit: localStorage.getItem(sCfgKey2)||'', bReq: true}
			, {sField: 'lineedit', sLabel: _lc2('Author', 'Author name of the ePub digital book'), sInit: localStorage.getItem(sCfgKey3)||'', bReq: true}
		];

		var vRes=input(plugin.getScriptTitle(), vFields, {nMinSize: 560, vMargins: [6, 0, 30, 0], bVert: true});
		if(vRes && vRes.length>=3){

			var sDstFn = vRes[0], iLang=vRes[1], sAuthor = vRes[2];

			var sLang=undefined;
			if(iLang>=0){
				sLang=vLangs[iLang];
				var p=sLang.indexOf(':');
				if(p>=0){
					sLang=sLang.substr(0, p);
					sLang=_trim(sLang);
				}
			}

			if(sDstFn && sLang && sAuthor){

				let xDstFn=new CLocalFile(sDstFn), sExt=xDstFn.getExtension(false);
				if(!sExt){
					//2021.9.30 on linux, the File-dialog may not supply the default extension name;
					sExt='epub';
					xDstFn.changeExtension(sExt);
				}

				localStorage.setItem(sCfgKey1, xDstFn.getParent());
				localStorage.setItem(sCfgKey2, iLang);
				localStorage.setItem(sCfgKey3, sAuthor);

				include('comutils');

				var nCountOfInfoItems=0, nCountOfInfoItemDone=0;

				//To estimate the progress range;
				xNyf.traverseOutline(sCurItem, true, function(){
					nCountOfInfoItems++;
				});

				plugin.initProgressRange(plugin.getScriptTitle(), nCountOfInfoItems);

				var sTmpDir='';
				{
					var xTmpDir=new CLocalDir(platform.getTempFolder(), 'nyf2epub');
					if(xTmpDir.exists()){
						sTmpDir=xTmpDir.toStr();
					}else{
						if((new CLocalDir()).createDirectory(xTmpDir.toStr())){
							sTmpDir=xTmpDir.toStr();
						}
					}
				}

				if(sTmpDir){
					var z=new CZip();
					if(z && z.create(xDstFn.toStr())){

						//http://www.w3.org/TR/xhtml-media-types/
						//http://www.ibm.com/developerworks/xml/tutorials/x-epubtut/section3.html
						//See: Listing 5. Extract of OPF manifest
						//Note that all items have an appropriate media-type value and that the media type
						//for the XHTML content is application/xhtml+xml. This exact value is required
						//and cannot be text/html or some other type.
						var c_xMimeTypes={
							  "xhtml": "application/xhtml+xml"
							, "html": "application/xhtml+xml" //"text/html"
							, "htm": "application/xhtml+xml" //"text/html"
							, "xml": "text/xml"
							, "css": "text/css"
							, "js": "text/plain"
							, "txt": "text/plain"
							, "ini": "text/plain"
							, "gif": "image/gif"
							, "jpeg": "image/jpeg"
							, "jpg": "image/jpeg"
							, "png": "image/png"
							, "bmp": "image/bmp"
							, "ico": "image/x-icon"
						};

						var c_sInfoFooter=plugin.isAppLicensed() ? '' : 'Generated with <a href="http://www.wjjsoft.com/mybase.html?ref=epub_export">' + plugin.getAppTitle() + ' ' + plugin.getAppVerStr() + '</a>';
						var c_sCssFooter='font-size: small; font-style: italic; text-align: right; margin-top: 4em; padding-top: 4px; border-top: 2px solid gray;';

						/*var c_sCssGlobal='\r\ntable{border: 1px solid gray;}'
							+ '\r\ntd{border: 1px dotted gray;}'
							+ '\r\np{margin: 3px 0 3px 0; padding: 0;}'
							+ '\r\n#ID_Footer{'+c_sCssFooter+'}'
							+ '\r\n'
							;*/

						//2015.9.3 for CSS formatted tables;
						var c_sCssGlobal=''
							+ '\r\ntable{border-collapse: collapse; border: solid gray; border-width: 2px 0 2px 0;}'
							+ '\r\nth{border: 1px solid gray; padding: 4px; background-color: #DDD;}'
							+ '\r\ntd{border: 1px solid gray; padding: 4px;}'
							+ '\r\ntr:nth-child(2n){background-color: #f8f8f8;}'
							+ '\r\n#ID_Footer{'+c_sCssFooter+'}'
							;

						//2013.6.2 ePub 2.0 requires xHtml 1.1 Specs;
						var c_sXhtmlDtdVal='html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"';
						var c_sXhtmlDtdElm='<!DOCTYPE '+c_sXhtmlDtdVal+'>';
						var c_sXhtmlRootProp='xmlns="http://www.w3.org/1999/xhtml" xml:lang="'+(sLang||'en')+'"';
						var c_sXhtmlRootElm='<html '+c_sXhtmlRootProp+'>';

						var sLineDelimiter='\r\n', bSelfClosing=true;

						var _qualify_xHtml_doctype=function(sHtml, sTitle, sFooter){
							//ePub requires the !DOCTYPE in xHTML document;
							//2013.11.15 insert UTF-8 charset;
							return c_sXhtmlDtdElm+'\r\n'+c_sXhtmlRootElm
								+ '\r\n<head>'
								+ '\r\n<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'
								+ '\r\n<meta name="generator" content="Wjjsoft Mybase ePub Maker" />'
								+ '\r\n<meta name="author" content="'+((plugin.isAppLicensed() ? sAuthor : 'Wjjsoft Mybase')||'Wjjsoft Mybase')+'" />'
								+ '\r\n<style>\r\n/*<![CDATA[*/' + c_sCssGlobal + '/*]]>*/\r\n</style>'
								+ '\r\n<title>' + platform.htmlEncode(sTitle) + '</title>'
								+ '\r\n</head>'
								+ '\r\n<body>'
								+ '\r\n'
								+ (sHtml||'')
								+ '\r\n'
								+ ( sFooter ? ('<p id="ID_Footer">' + sFooter + '</p>') : "" )
								+ '\r\n</body></html>'
								;
						};
						var _text_to_xhtml11=function(sTxt, sCss, sFooter, sTitle){
							var sHtml='';
							if(0){
								var v=(sTxt||'').split('\n');
								for(var i in v){
									var sLine=_trim_r(v[i]);
									if(sHtml) sHtml+='\r\n';
									sHtml+='<p>'+platform.htmlEncode(sLine)+'</p>';
								}
							}else{
								//The native c++ RTF2HTML converter does the same thing well;
								sHtml=platform.convertRtfToHtml(sTxt
									, {bInner: true
										, bPicture: true
										, sImgDir: sTmpDir
										, sCharset: 'UTF-8'
										, sTitle: sTitle
										, sFooter: '' //c_sInfoFooter
										, sStyle: sCss
										, sJsFiles: ''
									}
								);
							}
							return _qualify_xHtml_doctype(sHtml, sTitle, sFooter);
						};

						//2013.6.2 Qualify legacy Html documents for xHtml 1.1, by eliminating ineligible HTML tags;

						//constants for HTML nodeType;
						//For nodeType values see: http://www.w3schools.com/dom/dom_nodetype.asp
						var ELEMENT_NODE=1;
						var ATTRIBUTE_NODE=2;
						var TEXT_NODE=3;
						var CDATA_SECTION_NODE=4;
						var ENTITY_REFERENCE_NODE=5;
						var ENTITY_NODE=6;
						var PROCESSING_INSTRUCTION_NODE=7;
						var COMMENT_NODE=8;
						var DOCUMENT_NODE=9;
						var DOCUMENT_TYPE_NODE=10;
						var DOCUMENT_FRAGMENT_NODE=11;
						var NOTATION_NODE=12;

						var _nodetype=function(sTag){
							var t=-1;
							if(sTag==='!DOCTYPE'){
								t=DOCUMENT_TYPE_NODE;
							}else if(sTag==='![CDATA['){
								t=CDATA_SECTION_NODE;
							}else if(sTag==='!--'){
								t=COMMENT_NODE;
							}else if(sTag==='#document'){
								t=DOCUMENT_NODE;
							}else{
								t=ELEMENT_NODE;
							}
							return t;
						};

						var _substr_bytag=function(s, iFrom, sEndTag, xAct){
							var p=(s||'').toLowerCase().indexOf(sEndTag.toLowerCase(), iFrom), sSub;
							if(p>=iFrom){
								sSub=s.substring(iFrom, p);
								p=p+sEndTag.length;
							}else{
								sSub=s.substring(iFrom);
								p=s.length;
							}
							if(xAct) xAct(p, sSub);
							return sSub;
						};

						var _next_htmltag=function(sHtml, iPos, xElm, xOwner){
							var pBak=iPos, sTag='', sProps='', bClosed=false, bCloseTag=false;
							while(iPos<sHtml.length){

								var ch=sHtml.charAt(iPos);

								//there may be no blank-separator in these elements though;
								if(sTag==='!--' || sTag==='![CDATA['){
									ch=' ';
								}else{
									iPos++;
								}

								if(ch<=' '){
									//A blank space character terminates the HTML Tag;
									if(sTag){
										var xAct=function(p, sSub){iPos=p; sProps=sSub;};
										if(sTag.toUpperCase()==='![CDATA['){
											_substr_bytag(sHtml, iPos, ']]>', xAct);
											bClosed=true;
										}else if(sTag==='!--'){
											_substr_bytag(sHtml, iPos, '-->', xAct);
											bClosed=true;
										}else{
											_substr_bytag(sHtml, iPos, '>', xAct);
										}
										break;
									}
								}else if(ch==='>'){
									//A '>' character definitely separates the HTML Tag;
									break;
								}else{
									sTag+=ch;
								}
							}

							if(sTag){
								//test if the tag has been closed by itself;
								var sTmp='!doctype,![cdata[,!--,area,base,basefont,br,col,command,embed,frame,hr,img,input,keygen,link,meta,param,source,track,wbr';
								if(sTmp.split(',').indexOf(sTag.toLowerCase())>=0){
									//These void elements can never have child elements
									//http://dev.w3.org/html5/markup/syntax.html#syntax-elements
									bClosed=true;
								}else if(sTag[0]==='/'){
									//test if it is matched with its start-tag;
									if(sTag.toLowerCase().indexOf(xOwner.nodeName.toLowerCase(), 1)===1){
										bClosed=true;
										bCloseTag=true;
									}else{
										bClosed=false;
										bCloseTag=false;
										sTag=''; //Discard the unmatched end-tag;
									}
								}

								//consider to deal with some malformed HTML formatting;
								//e.g. <a href=http://www.xxx.com/xxx/ApacheManual/>Apache</a>
								if(sProps && sProps.length>1 && sProps[sProps.length-2]===' ' && sProps[sProps.length-1]==='/'){
									sProps=sProps.substr(0, sProps.length-2);
									bClosed=true;
								}
							}

							if(sTag){
								//For xHtml1.1, make all regular tags lowercase, except the two;
								if(sTag.toUpperCase()==='!DOCTYPE'){
									//simply ignore the <!DOCTYPE> element;
									//It'll be added forcedly in a later time;
									sTag='';
								}else if(sTag.toUpperCase()==='![CDATA['){
									sTag=sTag.toUpperCase();
								}else{
									sTag=sTag.toLowerCase();
								}
								xElm.nodeType=_nodetype(sTag);
								xElm.nodeName=sTag;
								xElm.sProps=sProps;
								xElm.bClosed=bClosed;
								xElm.bCloseTag=bCloseTag;
							}
							return iPos;
						};


//var s_sDbgInfo='', s_xDbgFn=new CLocalFile(platform.getTempFolder()); s_xDbgFn.append('_epub_debug.log');

						var s_vCallStack=['#DOCUMENT'];
						var _rfind_tag_in_callstack=function(sTag){
							var i=s_vCallStack.length;
							while(i>=0){
								if(s_vCallStack[i]===sTag)
									return i;
								i--;
							}
						};

						var _build_domtree_branch=function(sHtml, iPos, xOwner, iLevel){
							var p=sHtml.indexOf('<', iPos), xTxt={}, sVal='';
							if(p>=iPos){

								//look and see if any text existing before the next HTML tag;
								if(p>iPos){
									sVal=sHtml.substring(iPos, p);
									if(sVal){

//if(s_sDbgInfo) s_sDbgInfo+='\r\n';
//s_sDbgInfo+='@'+iPos+' ['+xOwner.vItems.length+'] ['+(sVal||'').substr(0, 80).replace(/[\r\n\t]/g, '^')+']\t';
//s_sDbgInfo+=s_vCallStack.toString();
//s_xDbgFn.saveUtf8(s_sDbgInfo);

										//2013.6.6 we may trust all that special characters have already been encoded in HTML;
										//We'd still try to encode text from within <body> section, excluding <head> section, but <title>;
										if(_rfind_tag_in_callstack('body')>=0 || _rfind_tag_in_callstack('title')>=0){
											if(0){
												sVal=platform.htmlDecode(sVal);
												sVal=platform.htmlEncode(sVal);
											}else if(0){
												//2021.9.11 within myf7/8, the leading '\t' are used to sanitize html source code, can't be encoded into &nbsp;
												sVal=sVal.replace(/^([\t\r\n]*)([^\t\r\n].*)$/gi, function(m0, m1, m2){
													m2=platform.htmlDecode(m2);
													m2=platform.htmlEncode(m2);
													return m1 + m2;
												});
											}else{
												//ignored ...
											}
//logd('sVal: ['+sVal+']');
										}

										xTxt={nodeName: '#text', nodeType: TEXT_NODE, nodeValue: sVal};

										//2013.6.6 weird things, Array.push() somehow may fail!!!
										//as tested with a >500KB random .html document, it constantly failed at this line of script code,
										//with no any exceptions thrown, it just terminated the script code and returns to C++ native code;
										//Fortunately, the C++ code grabs the excution and go on after the traversing tree terminated;
										//This way, we got a change to restore from crashes with the error message prompted to end users;
										//if anyone knows why or any clue, please be so kind as to contact us at info@wjjsoft.com Thanks.

										xOwner.vItems.push(xTxt);

										//_gc();
									}
								}

								var xElm={nodeName: '', nodeType: -1, sProps: '', xProps: {}, bClosed: false, bCloseTag: false, vItems: []};
								iPos=_next_htmltag(sHtml, p+1, xElm, xOwner);

								var sTag=xElm.nodeName.toLowerCase();
								if(sTag){

									//Do not insert the close tag into DOM;
									if(!xElm.bCloseTag){

										xOwner.vItems.push(xElm);

										//if(sTag=='style' || sTag=='script'){
										if(sTag==='script'){
											var sEndTag='</'+sTag+'>';
											_substr_bytag(sHtml, iPos, sEndTag, function(p, sSub){
												//2013.6.4 simply discard style/script content;
												//xTxt={nodeName: '#text', nodeType: TEXT_NODE, nodeValue: c_sCssGlobal};
												//xElm.vItems.push(xTxt);
												iPos=p;
											});
											xElm.bClosed=true;
										}

									}else{
										//for owner to break the while-loop;
										xOwner.bClosed=true;
									}

//if(s_sDbgInfo) s_sDbgInfo+='\r\n';
//s_sDbgInfo+='@'+iPos+' ['+(sVal||'').substr(0, 30).replace(/[\r\n\t]/g, '^')+']\t';
//s_sDbgInfo+=s_vCallStack.toString();
//s_xDbgFn.saveUtf8(s_sDbgInfo);

									if(!xElm.bClosed && !xElm.bCloseTag){
										s_vCallStack.push(xElm.nodeName);
										//The 'xElm.bClosed' value may be modified, while traversing sub elements;
										iPos=_build_domtree_children(sHtml, iPos, xElm, iLevel+1);
										s_vCallStack.pop();
									}
								}

							}else{
								//2013.6.5 ignore any text (e.g. &nbsp;) in the specific elements;
								//Well, as tested, it doesn't matter, even if you put some &nbsp; in the <head> section;
								//The real problem is that a dummy <style /> may cause the whole webpage not to display;
								//if('head,html'.split(',').indexOf(xOwner.nodeName)<0)
								{
									sVal=sHtml.substring(iPos);
									xTxt={nodeName: '#text', nodeType: TEXT_NODE, nodeValue: sVal};
									xOwner.vItems.push(xTxt);
								}
								iPos=sHtml.length;
							}
							return iPos;
						};

						var _build_domtree_children=function(sHtml, iPos, xOwner, iLevel){
							var nLen=sHtml.length;
							while(iPos<nLen && !xOwner.bClosed){
								//The xOwner tag may be closed by its end-tag;
								iPos=_build_domtree_branch(sHtml, iPos, xOwner, iLevel);
							}
							return iPos;
						};

						//var _get_elements_bytag=function(xOwner, sTag){
						//	var vElms=[];
						//	for(var i in xOwner.vItems){
						//		var xElm=xOwner.vItems[i];
						//		if(xElm && xElm.sTag===sTag){
						//			vElms.push(xElm);
						//		}
						//	}
						//	return vElms;
						//};

						var _parse_props=function(xElm){

							var s=xElm.sProps||''; var iPos=0, nLen=s.length;

							var _skip_blanks=function(){while(iPos<nLen && s[iPos]<=' ') iPos++;};

							var _next_attrname=function(){

								_skip_blanks(); //skip spaces;

								var sToken='';
								while(iPos<nLen){
									var ch=s[iPos];
									if( (ch>='a' && ch<='z') || (ch>='A' && ch<='Z') || (ch>='0' && ch<='9') || ch==='_' || ch==='-' || ch===':' || ch==='.' ){
										//http://www.w3.org/TR/2000/REC-xml-20001006#NT-Name
										//http://www.w3.org/TR/REC-xml/#NT-NameChar
										//e.g. <html ... xml:lang="en">, <meta http-equiv=...>
										if(sToken){
											sToken+=ch;
										}else{
											//test the first letter;
											if( (ch>='0' && ch<='9') || ch===':' || ch==='.' || ch==='-' ){
												break;
											}else{
												sToken+=ch;
											}
										}
									}else{
										break;
									}
									iPos++;
								}
								return sToken;
							};

							var _next_attrvalue=function(){

								_skip_blanks(); //skip spaces;

								//first look and see if any quotation-mark starting at the values;
								//if no quotation-mark is present, a blank space terminates the values;
								var sEndTag=undefined;
								if(iPos<nLen){
									var ch=s[iPos];
									if(ch==='\'' || ch==='\"'){
										sEndTag=ch;
										iPos++;
									}
								}

								var sVal='';
								while(iPos<nLen){
									var ch=s[iPos];
									if(ch==='\\'){
										//first, handle escape sequence;
										if(iPos<nLen-1){
											iPos++;
											sVal+=s[iPos];
										}
									}else if(ch===sEndTag){
										//ends with quotation marks;
										iPos++;
										break;
									}else if(ch<=' '){
										//ends with blank spaces;
										//e.g.  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
										if(sEndTag){
											sVal+=ch;
										}else{
											iPos++;
											break;
										}
									}else{
										sVal+=ch;
									}
									iPos++;
								}
								return sVal;
							};

							while(iPos<nLen){
								var sName=_next_attrname()
								if(sName){
									//force all attribute names in lower case;
									sName=sName.toLowerCase();
									if(s[iPos]==='='){
										iPos++;
										var sVal=_next_attrvalue()||'';
										//http://www.hyperwrite.com/articles/showarticle.aspx?id=39
										sVal=platform.htmlDecode(sVal); //consider it's already xHtml 1.1;
										sVal=platform.htmlEncode(sVal); //forcedly conforms to xHtml 1.1;
										xElm.xProps[sName]=sVal;
									}else{
										//deal with 'selected, checked, disabled, readonly, etc.'
										xElm.xProps[sName]=sName;
									}
								}else{
									break;
								}
							}
						};

						var bDocTypePresent=false, bCssInjected=false;
						var _conform_to_xhtml11=function(xElm){
							//2013.6.4 http://www.w3school.com.cn/tags/html_ref_dtd.asp

							//these will be substituted with <span>
							var vSubstitute='applet,area,basefont,font'.split(',');

							//dismiss these elements no longer supported in XHTML1.1;
							//consider to dismiss all style/script/meta/!-- elements as well;
							//var vDismiss='!--,basefont,bdo,col,colgroup,del,frame,frameset,iframe,isindex,map,meta,noframes,script,style'.split(',');
							var vDismiss='!--,basefont,bdo,col,colgroup,del,frame,frameset,iframe,isindex,map,meta,noframes,script'.split(',');

							//clean up the properties of these elements;
							//2013.11.25 don't clear properties from these elements;
							var vClean=[]; //'p,div,body,span,ul,ol,li'.split(',');

							var sTag=xElm.nodeName.toLowerCase();

							if(sTag==='center'){
								xElm.nodeName='div';
								xElm.xProps['style']='text-align: center;';
							}else if(sTag==='dir'){
								xElm.nodeName='ol';
							}else if(sTag==='ins'){
								xElm.nodeName='b';
							}else if(sTag==='menu'){
								xElm.nodeName='ul';
							}else if(sTag==='s' || sTag==='strike'){
								xElm.nodeName='span';
								xElm.xProps['style']='text-decoration: line-through;';
							}else if(sTag==='u'){
								xElm.nodeName='span';
								xElm.xProps['style']='text-decoration: underline;';
							}else if(sTag==='tbody' || sTag==='tfoot' || sTag==='thead'){
								xElm.nodeName='';
							}else if(vSubstitute.indexOf(sTag)>=0){
								xElm.nodeName='span';
								xElm.sProps='';
								xElm.xProps={};
							}else if(vClean.indexOf(sTag)>=0){
								xElm.sProps='';
								xElm.xProps={};
							}else if(vDismiss.indexOf(sTag)>=0){
								xElm.nodeName='';
								xElm.sProps='';
								xElm.xProps={};
								xElm.vItems=[];
							}

							if('head,title'.split(',').indexOf(sTag)>=0){
								//2013.6.5 dummy <title /> seemed not to work in Chrome;
								if(xElm.vItems.length===0){
									xElm.nodeName='';
									xElm.sProps='';
									xElm.xProps={};
									xElm.vItems=[];
								}
							}

							//try to parse & fix ineligible attr/values for the particular elements;
							var vParseProps='a,img,link,input,form'.split(',');
							//if(vParseProps.indexOf(sTag)>=0)
							{
								_parse_props(xElm);
							}

							//Set CSS for our footer;
							/*if(sTag=='style'){
								//2013.6.5 in the case that more than one <style> elements exist,
								//the second dummy <style /> may cause the webpage not to display correctly;
								//Now we attempts to inject CSS into each existing <style>;
								//if(!bCssInjected)
								{
									//var xTxt={nodeName: '#text', nodeType: TEXT_NODE, nodeValue: c_sCssGlobal};
									//xElm.vItems.push(xTxt);
									//bCssInjected=true;
								}
							}*/

							//clear the property string, except for the <!DOCTYPE>;
							/*if(sTag.toUpperCase()=='!DOCTYPE'){
								bDocTypePresent=true;
							}else{
								xElm.sProps='';
							}*/

							//finally clear the property string for all the regular elements;
							xElm.sProps='';

							return true;
						};

						var _remove_fontfamily=function(sCss){
							//2013.11.25 Users reported that Sony reader isn't able to show text in Chinese fonts;
							//this function tries to strip the 'font-family: xxx; font-size: yyy' away from inline CSS,
							//but with the 'color: xxxx' and other styles preserved;
							return sCss
								.replace(/font-family:(.*?;|.*)/i, '')
								.replace(/font-size:(.*?;|.*)/i, '')
								;
						};

						var _serialize_domtree_children=function(xElm){
							var s='';
							for(var i=0; i<xElm.vItems.length; ++i){
								s+=_serialize_domtree_branch(xElm.vItems[i]);
							}
							return s;
						};

						var _serialize_domtree_branch=function(xElm){
							var s='';
							if(xElm && _conform_to_xhtml11(xElm)){
								var sTag=xElm.nodeName, iType=xElm.nodeType, sProps=xElm.sProps, xProps=xElm.xProps, vItems=xElm.vItems, bClosed=xElm.bClosed;
								if(sTag || vItems.length>0){
									if(iType===TEXT_NODE){
										s+=xElm.nodeValue;
									}else{
										if(sTag){
											s+='<'+sTag;
											if(sTag==='!DOCTYPE'){
												s+=' '+c_sXhtmlDtdVal;
											}else if(sTag==='html'){
												s+=' '+c_sXhtmlRootProp;
											}else{
												for(var k in xProps){
													var sVal=xProps[k]||'';
													if(k==='style'){
														sVal=_remove_fontfamily(sVal);
														sVal=_trim(sVal);
													}
													s+=' '+k+'='+'"'+sVal+'"';
												}
											}
										}
										if(vItems.length===0){
											s+=' />';
										}else{
											if(sTag) s+='>';
											s+=_serialize_domtree_children(xElm);

											if(sTag==='body' && c_sInfoFooter){
												s+='<footer'
													+' id="ID_Footer"'
													+' style="'+c_sCssFooter+'"'
													+'>'
													+c_sInfoFooter
													+'</footer>'
													;
											}

											if(sTag) s+='</'+sTag+'>';
										}
									}
								}
							}
							return s;
						};

						var _html_to_xhtml11=function(sHtml, sTitle, iPolicy){
							var s=sHtml;
							switch(iPolicy){
								case 0:
									//leave as it is;
									break;
								case 1:
									//2013.6.1 random HTML documents may not work in ePub;
									//Workaround/Dirty way: Make HTML into TEXT and then to XHTML1.1 back again;
									//This way, no images/formatting will be converted into ePub;
									s=platform.extractTextFromHtml(s) || 'No text content available';
									s=_text_to_xhtml11(s, c_sCssGlobal, c_sInfoFooter, sTitle);
									break;
								case 2:
									try{
										s_vCallStack=['#document'];
										var xDom={nodeName: '#document', nodeType: DOCUMENT_NODE, nodeValue: '', bClosed: false, vItems: []};
										_build_domtree_children(s, 0, xDom, 0);
										s=_serialize_domtree_children(xDom);
										if(!bDocTypePresent){
											s=c_sXhtmlDtdElm+'\r\n'+s;
										}
									}catch(e){
										var sMsg=e.toString() + '\n\n' + 'Info Item: ' + sTitle;
										if(e.toString().indexOf('too much recursion')>=0){
											sMsg += ('\n\n'+'CallStack ('+s_vCallStack.length+' Recursion): '+s_vCallStack);
											sMsg += ('\n\n'+_lc2('TooMuchRecursion.Notes', 'Notes: You may want to revise the HTML document and have these HTML tags properly closed. ePub requires contents to conform to XHTML 1.1 Specs.'));
										}
										sMsg += ('\n\n'+_lc2('TooMuchRecursion.Options', 'Options: Press [Yes] button to simply ignore all the HTML formatting, or [No] to bear with the incompatibility.'));
										if(confirm(sMsg)){
											s=platform.extractTextFromHtml(s) || _lc2('NoContentAvail', 'No content available in this info item.');
											s=_text_to_xhtml11(s, c_sCssGlobal, c_sInfoFooter, sTitle);
										}
									}
									break;
							}
							return s;
						};

						let _embed_images=function(sHtml, sSsgPath){
							sHtml=substituteUrisWithinHtml(sHtml, 'img', function(sObj, sTagName){
								var u=sObj||'';
								if(u.search(/(\.jpg|\.jpeg|\.gif|\.png|\.bmp|\.svg)$/i)>0){
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
										u='data:image/'+sExt+';base64,'+ba.toStr('base64');
									}
								}
								return u;
							});
							return sHtml;
						};

						//var _default_name=function(vFiles, bWebOnly){
						//	var sDef='';
						//	{
						//		var vDefNames=['index.html', 'index.htm', 'home.html', 'home.htm', 'default.html', 'default.htm'];
						//		for(var i in vDefNames){
						//			if(i==0 && bWebOnly) continue;
						//			var sName=vDefNames[i];
						//			if((vFiles||[]).indexOf(sName)>=0){
						//				sDef=sName;
						//				break;
						//			}
						//		}
						//	}

						//	if(!sDef){
						//		var vBands='html;htm;qrich;md;rtf>txt>gif;png;jpg;jpeg;bmp'.split('>');
						//		for(var j in vBands){
						//			var vExts=vBands[j].split(';');
						//			for(var i in vFiles){
						//				var sName=vFiles[i];
						//				var sExt=new CLocalFile(sName).getExtension(false).toLowerCase();
						//				if(vExts.indexOf(sExt)>=0){
						//					sDef=sName;
						//					break;
						//				}
						//			}
						//			if(sDef) break;
						//		}
						//	}
						//	return sDef;
						//};

						var xTmpFn=new CLocalFile(platform.getTempFile()); plugin.deferDeleteFile(xTmpFn.toStr());

						var nDone=0, vInfoItems=[], sInfoItemProcessing='';
						var _act_on_treeitem=function(sSsgPath, iLevel){

							var xLI={}, sTitle=xNyf.getFolderHint(sSsgPath)||'Untitled';

							//2013.6.6 workaround of the spidermonkey 1.7 bugs, somehow Array.push() may fail,
							//we save the item title in the variable, and clear it when done;
							//In case of the runtime error, xNyf.traverseOutline() may catch the exception and go on,
							//so an error message will be prompted after the conversion;
							sInfoItemProcessing=sTitle;

							var bContinue=plugin.ctrlProgressBar(sTitle, 1, true);
							if(!bContinue) return true;

							xLI['sSsgPath']=sSsgPath;
							xLI['sTitle']=sTitle;
							xLI['iLevel']=iLevel;
							xLI['sHref']='';
							xLI['vFiles']=[];
							xLI['nSub']=xNyf.getFolderCount(sSsgPath);
							//xLI['nID']=plugin.getItemIDByPath(-1, sSsgPath);
							xLI['nID']=xNyf.getItemIDByPath(sSsgPath);

							var xPath=new CLocalFile(sSsgPath); xPath.append('/');

							var _make_oebps_path=function(sEntry){
								var xPath=new CLocalFile(sSsgPath);
								var xRoot=new CLocalFile(sCurItem); xRoot.append('\\');
								var sTmp=xPath.toStr().replace(xRoot.toStr(), 'OEBPS\\');
								var xTmp=new CLocalFile(sTmp, sEntry);
								return xTmp.toStr().replace(/\\/g, '/');
							};

							//consider exporting content from within the symbolic links;
							//var sSsgPathReal=plugin.getSymLinkDestination(-1, sSsgPath, true);
							var sSsgPathReal=xNyf.getSymLinkDestination(sSsgPath);

							//var vFiles=xNyf.listFiles(sSsgPathReal), sDef=_default_name(vFiles), sHref='', bAccompanyingImages=false;
							var vFiles=xNyf.listFiles(sSsgPathReal), sHref='', bAccompanyingImages=false;
							var sDef=xNyf.detectPreferredFile(sSsgPathReal, 'html;htm;qrich>rtf>txt;ini;log;>jpg;png;gif;bmp');

							//first handle and export default content for the info item;
							if(sDef){
								var xSrc=new CLocalFile(sSsgPathReal, sDef);
								if(!xNyf.isShortcut(xSrc.toStr())){
									var sExt=new CLocalFile(sDef).getExtension(false).toLowerCase();
									if(plugin.isReservedNoteFn(sDef)){
										bAccompanyingImages=false;
										sHref=_make_oebps_path('__itemcontent.' + sExt + '.html');
										if(sHref){
											var s=xNyf.loadText(xSrc.toStr(), 'auto');
											if(sExt==='rtf'){
												s=platform.convertRtfToHtml(s
															    , {bInner: false
																    , bPicture: false
																    , sImgDir: '' //sTmpDir
																    , sCharset: 'UTF-8'
																    , sTitle: sTitle
																    //, sFooter: (plugin.isAppLicensed() ? '' : 'Generated with Mybase/HtmlTree Converter by Wjj Software')
																    //, sFooter: (plugin.isAppLicensed() ? '' : '%MYBASE-EPUB-MAKER%')
																    , sStyle: sCss
																    , sJsFiles: ''
															    }
															    );
												//s=s.replace('%MYBASE-EPUB-MAKER%', 'Generated with <a href="http://www.wjjsoft.com/mybase#epub_export" target="_blank">Mybase/HtmlTree Maker</a>');
											}else if(sExt==='md'){
												s=platform.convertMarkdownToHtml(s);
												s=_html_to_xhtml11(s, sTitle, iPolicy_xHtml11Conversion);
											}else if(sExt==='txt'){
												s=_text_to_xhtml11(s, c_sCssGlobal, c_sInfoFooter, sTitle);
											}else{
												sHref=_make_oebps_path('__itemcontent.html');
												//s=_qualify_xHtml_doctype(s, sTitle, c_sInfoFooter);
												s=_html_to_xhtml11(s, sTitle, iPolicy_xHtml11Conversion);
											}

											s=_embed_images(s, sSsgPathReal);

											if(xTmpFn.saveUtf8(s)>0){
												bAccompanyingImages=true;
											}
											if(sHref){
												z.addEntry(xTmpFn.toStr(), sHref);
											}


										}
										//xLI['sHref']=sHref;
									}else{
										//2013.6.1 validating file filename, in case the original filename contains invalid characters;
										if(xNyf.exportFile(xSrc.toStr(), xTmpFn.toStr())>0){
											if(sExt==='html' || sExt==='htm'){
												var s=xTmpFn.loadText('html');
												s=_html_to_xhtml11(s, sTitle, iPolicy_xHtml11Conversion);
												s=_embed_images(s, sSsgPathReal);
												if(xTmpFn.saveUtf8(s)>0){
													sHref=_make_oebps_path('__webcontent.html');
													bAccompanyingImages=true;
												}
											}else if(sExt==='txt'){
												var s=xTmpFn.loadText('auto');
												s=_text_to_xhtml11(s, c_sCssGlobal, c_sInfoFooter, sTitle);
												s=_embed_images(s, sSsgPathReal);
												if(xTmpFn.saveUtf8(s)>0){
													sHref=_make_oebps_path('__txtcontent.html');
												}
											}else{
												//for jpg/gif/png/bmp images to show in ePub;
												var s='<html><body><h1>'+platform.htmlEncode(sTitle)+'</h1>';
												for(var i=0; i<vFiles.length; ++i){
													var sName=vFiles[i];
													s+='<div><img src="'+platform.htmlEncode(sName)+'" /></div>';
												}
												s+='</body></html>';
												s=_html_to_xhtml11(s, sTitle, iPolicy_xHtml11Conversion);
												s=_embed_images(s, sSsgPathReal);
												if(xTmpFn.saveUtf8(s)>0){
													sHref=_make_oebps_path('__imgcontent.html');
													bAccompanyingImages=true;
													//clear it for the first image to be then transferred to ePub/zip;
													sDef='';
												}
											}
											if(sHref){
												z.addEntry(xTmpFn.toStr(), sHref);
											}
										}
										//xLI['sHref']=sHref;
									}
								}else{
									//ignore shortcuts;
								}
							}

							//2013.6.4 Now we made the feature: attempting to qualify random HTML text with XHTML1.1;
							//2013.6.2 As the HTML documents have been made into plain text for viewing in ePub;
							//so there's no need to import all the accompanying elements stored in the info item;

							//then export image or CSS files linked with webpages;
							if(0 && bAccompanyingImages){
								for(var i=0; i<vFiles.length; ++i){
									var sName=vFiles[i];
									if(sName!==sDef){
										var xSrc=new CLocalFile(sSsgPathReal, sName);
										logd('Accompanying file: '+xSrc.toStr());
										if(!xNyf.isShortcut(xSrc.toStr())){
											var sTypes='gif;jpg;jpeg;png;bmp'; //2013.6.1 images only, excluding '.js;.css';
											if(sTypes.split(';').indexOf(xSrc.getExtension(false).toLowerCase())>=0){
												var sEntry=_make_oebps_path(sName);
												if(sEntry){
													if(xNyf.exportFile(xSrc.toStr(), xTmpFn.toStr())>0){
														z.addEntry(xTmpFn.toStr(), sEntry);
													}else{
														sEntry='';
													}
												}
												if(sEntry){
													var v=xLI['vFiles']; v[v.length]=sEntry;
													logd('Accompanying file retrieved: ' + ' --> ' + sEntry);
												}
											}
										}
									}
								}
							}

							//2013.6.1 make a placeholder for empty info item;
							if(!sHref){

								var s='';
								switch(iPolicy_RenderEmptyItem){
									case 0:
										s='';
										break;
									case 1:
										s='\r\n'+sTitle+'\r\n\r\n'+_lc2('NoContentAvail', 'No content available in this info item.')+'\r\n';
										break;
									case 2:
										var vSub=xNyf.listFolders(sSsgPath);
										s+='\r\n';
										s+=sTitle;
										s+='\r\n\r\n';
										s+='Table of Contents'+'\r\n';
										for(var i=0; i<vSub.length; ++i){
											var xSub=new CLocalFile(sSsgPath); xSub.append(vSub[i]);
											if(s) s+='\r\n';
											s+='\t';
											s+=(parseInt(i)+1)+'. ';
											s+=(xNyf.getFolderHint(xSub.toStr())||'Untitled');
										}
										break;
								}

								s=_text_to_xhtml11(s, c_sCssGlobal, c_sInfoFooter, sTitle);
								xTmpFn.saveUtf8(s);

								sHref=_make_oebps_path('__placeholder.html');
								z.addEntry(xTmpFn.toStr(), sHref);

								//xLI['sHref']=sHref;
							}

							if(sHref) xLI['sHref']=sHref;

							vInfoItems.push(xLI);

							//2013.6.6 workaround for bugs in the spidermonkey 1.7, Array.push() somehow may fail,
							sInfoItemProcessing=''; //done;
							nCountOfInfoItemDone++;
						};

						xNyf.traverseOutline(sCurItem, bCurBranch, _act_on_treeitem, false);

						var _traverseBranch=function(sSsgPath, iLevel, _actPre, _actPost){
							if(xNyf.folderExists(sSsgPath)){
								if(_actPre) _actPre(sSsgPath, iLevel);
								_traverseChildren(sSsgPath, iLevel+1, _actPre, _actPost);
								if(_actPost) _actPost(sSsgPath, iLevel);
							}
						};

						var _traverseChildren=function(sSsgPath, iLevel, _actPre, _actPost){
							var v=xNyf.listFolders(sSsgPath);
							for(var i in v){
								var sName=v[i];
								if(sName){
									var xSub=new CLocalFile(sSsgPath, sName); xSub.append('/');
									_traverseBranch(xSub.toStr(), iLevel, _actPre, _actPost);
								}
							}
						};

						//_traverseBranch(sCurItem, 0, _act_on_treeitem);

						//The mimetype file must be saved in ANSI, As tested with iOS, it doesn't accept UTF-8;
						//http://www.ibm.com/developerworks/xml/tutorials/x-epubtut/section3.html
						//http://blog.sina.com.cn/s/blog_5c0175790100bdfi.html

						xTmpFn.saveAnsi('application/epub+zip');
						z.addEntry(xTmpFn.toStr(), 'mimetype');

						//make the entry: META-INF/container.xml
						{
							var xml=new CXmlDocument(); xml.initWith('');
							var xCon=xml.getElement('container', true);
							if(xCon){
								xCon.addAttribute('xmlns', 'urn:oasis:names:tc:opendocument:xmlns:container');
								xCon.addAttribute('version', '1.0');

								var xRFiles=xCon.createElement('rootfiles');
								if(xRFiles){
									var xRFile=xRFiles.createElement('rootfile');
									xRFile.addAttribute('full-path', 'OEBPS/content.opf');
									xRFile.addAttribute('media-type', 'application/oebps-package+xml');

									var sDocType='';
									//var sXml=xml.serialize(bHtml, sDocType, sLineDelimiter);
									var sXml=xml.serialize(sDocType, sLineDelimiter, bSelfClosing);
									xTmpFn.saveUtf8(sXml);
									z.addEntry(xTmpFn.toStr(), 'META-INF/container.xml');
								}
							}
						}

						//make the entry: OEBPS/content.opf
						//http://blog.sina.com.cn/s/blog_5c0175790100bdfv.html
						{
							var xml=new CXmlDocument(); xml.initWith('');
							var xPkg=xml.getElement('package', true);
							if(xPkg){
								xPkg.addAttribute('unique-identifier', 'bookid');
								xPkg.addAttribute('xmlns:opf', 'http://www.idpf.org/2007/opf');
								xPkg.addAttribute('xmlns', 'http://www.idpf.org/2007/opf');
								xPkg.addAttribute('version', '2.0');

								var xMD=xPkg.createElement('metadata');
								if(xMD){
									var xDcm=xMD.createElement('dc-metadata');
									if(xDcm){
										xDcm.addAttribute('xmlns:dc', 'http://purl.org/dc/elements/1.1/');
										xDcm.addAttribute('xmlns:dcterms', 'http://purl.org/dc/terms/');
										xDcm.addAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');

										//DCMI Metadata Terms
										//http://dublincore.org/documents/dcmi-terms/

										xDcm.createElement('dc:title', sItemTitle);
										xDcm.createElement('dc:subject', sItemTitle);
										xDcm.createElement('dc:description', sItemTitle);
										xDcm.createElement('dc:date', new Date().toDateString());
										xDcm.createElement('dc:format', 'Text/html');
										xDcm.createElement('dc:contributor', '');
										xDcm.createElement('dc:type', '');
										xDcm.createElement('dc:language', '');
										xDcm.createElement('dc:rights', '');
										xDcm.createElement('dc:coverage', '');

										var sAppName='Wjjsoft'+' '+'Mybase';
										var sAppVer='';//plugin.getAppVerStr();
										var sPromTag=sAppName+(plugin.isAppLicensed() ? '' : ' (Evaluation)');

										xDcm.createElement('dc:publisher', sPromTag);
										xDcm.createElement('dc:creator', (plugin.isAppLicensed() ? sAuthor : sAppName)||sAppName); //epub author
										xDcm.createElement('dc:relation', 'http://www.wjjsoft.com');
										xDcm.createElement('dc:source', sAppName+' '+sAppVer);

										//http://mademers.com/globalindieauthor/2012/01/how-to-redistribute-your-epub-with-a-different-aggregator/
										var sBkID=Math.round(Math.random()*0xffffFFFF).toString(16)
											+ '-'
											+ Math.round(Math.random()*0xffffFFFF).toString(16)
											+ '-'
											+ Math.round(Math.random()*0xffffFFFF).toString(16)
											;
										var xDcID=xDcm.createElement('dc:identifier', sBkID);
										xDcID.addAttribute('id', 'bookid');

										//....
									}

									var xMeta=xMD.createElement('meta', '');
									if(xMeta){
										xMeta.addAttribute('name', 'cover');
										xMeta.addAttribute('content', 'cover-image');
									}

								}

								var _remove_oebps=function(s)
								{
									return (s||'').replace('OEBPS/', '');
								};

								var xMani=xPkg.createElement('manifest');
								if(xMani){
									var xItem=xMani.createElement('item');
									if(xItem){
										xItem.addAttribute('id', 'ncx');
										xItem.addAttribute('href', 'toc.ncx');
										xItem.addAttribute('media-type', 'application/x-dtbncx+xml');
									}
									for(var i in vInfoItems){
										var xII=vInfoItems[i];
										var xItem=xMani.createElement('item');
										if(xItem){
											xItem.addAttribute('id', i);
											//var sHref=(xII.sHref||'').replace('OEBPS/', '');
											let sHref=_remove_oebps(xII.sHref);
											let sExt=new CLocalFile(sHref).getExtension(false).toLowerCase();
											xItem.addAttribute('media-type', c_xMimeTypes[sExt] || ''); //'application/xhtml+xml'
											xItem.addAttribute('href', sHref||'');
										}
									}
								}

								var xSpine=xPkg.createElement('spine');
								if(xSpine){
									for(var i in vInfoItems){
										var xItem=xSpine.createElement('itemref');
										if(xItem){
											xItem.addAttribute('idref', i);
											xItem.addAttribute('linear', 'yes');
										}
									}
								}

								//http://epubsecrets.com/where-do-you-start-an-epub-and-what-is-the-guide-section-of-the-opf-file.php
								var xGuide=xPkg.createElement('guide');
								if(xGuide){
									for(var i in vInfoItems){
										var xII=vInfoItems[i];
										var xRef=xGuide.createElement('reference');
										if(xRef){
											//var sHref=(xII.sHref||'').replace('OEBPS/', '');
											var sHref=_remove_oebps(xII.sHref);
											var sTitle=(xII.sTitle||'');
											xRef.addAttribute('type', 'text');
											xRef.addAttribute('title', sTitle||'');
											xRef.addAttribute('href', sHref||'');
										}
									}
								}

								//xml.setDocType('package PUBLIC "+//ISBN 978-7-308-05831-5//DTD OEB 1.2 Package//EN" "http://openebook.org/dtds/oeb-1.2/oebpkg12.dtd"');
								var sDocType='package PUBLIC "+//ISBN 978-7-308-05831-5//DTD OEB 1.2 Package//EN" "http://openebook.org/dtds/oeb-1.2/oebpkg12.dtd"';
								//var sXml=xml.serialize(bHtml, sDocType, sLineDelimiter);
								var sXml=xml.serialize(sDocType, sLineDelimiter, bSelfClosing);
								xTmpFn.saveUtf8(sXml);
								z.addEntry(xTmpFn.toStr(), 'OEBPS/content.opf');
							}
						}

						//make the entry: OEBPS/toc.ncx
						//http://blog.sina.com.cn/s/blog_5c0175790100bdg5.html
						{
							var xml=new CXmlDocument(); xml.initWith('');
							var xNcx=xml.getElement('ncx', true);
							if(xNcx){
								xNcx.addAttribute('version', '2005-1');
								xNcx.addAttribute('xmlns', 'http://www.daisy.org/z3986/2005/ncx/');

								var xHead=xNcx.createElement('head');
								if(xHead){
									var xMeta=xHead.createElement('meta');
									xMeta.addAttribute('name', 'dtb:uid');
									xMeta.addAttribute('content', '');

									xMeta=xHead.createElement('meta');
									xMeta.addAttribute('name', 'dtb:depth');
									xMeta.addAttribute('content', '-1');

									xMeta=xHead.createElement('meta');
									xMeta.addAttribute('name', 'dtb:totalPageCount');
									xMeta.addAttribute('content', '0');

									xMeta=xHead.createElement('meta');
									xMeta.addAttribute('name', 'dtb:maxPageNumber');
									xMeta.addAttribute('content', '0');
								}

								var xTitle=xNcx.createElement('docTitle');
								if(xTitle){
									xTitle.createElement('text', sItemTitle);
								}

								var xAuthor=xNcx.createElement('docAuthor');
								if(xAuthor){
									xAuthor.createElement('text', (plugin.isAppLicensed() ? sAuthor : 'Wjjsoft Mybase')||'Wjjsoft Mybase');
								}

								var xNMap=xNcx.createElement('navMap');
								if(xNMap){

									/*
									//Disregard the outline tree structure;
									for(var i in vInfoItems){
										var xNpt=xNMap.createElement('navPoint');
										if(xNpt){
											xNpt.addAttribute('id', i);
											xNpt.addAttribute('playOrder', i);

											var sHref=(vInfoItems[i].sHref||'').replace('OEBPS/', '');
											var sTitle=(vInfoItems[i].sTitle||'');

											var xCon=xNpt.createElement('content');
											xCon.addAttribute('src', sHref);

											xNpt.createElement('navLabel').createElement('text', sTitle);
										}
									}
									*/

									//2013.5.31 Adds the tree-structured navigation;
									var i=0;
									var _make_navpoints=function(vIIs, iLevel, xOwner){
										var xNpt=xOwner;
										while(i<vInfoItems.length){
											var xII=vInfoItems[i];
											if(xII.iLevel>iLevel){
												_make_navpoints(vIIs, xII.iLevel, xNpt)
											}else if(xII.iLevel<iLevel){
												break;
											}else{
												xNpt=xOwner.createElement('navPoint');
												if(xNpt){
													xNpt.addAttribute('id', i);
													xNpt.addAttribute('playOrder', i);

													//var sHref=(xII.sHref||'').replace('OEBPS/', '');
													var sHref=_remove_oebps(xII.sHref);
													var sTitle=(xII.sTitle||'');

													var xCon=xNpt.createElement('content');
													xCon.addAttribute('src', sHref||'');

													xNpt.createElement('navLabel').createElement('text', sTitle||'');
												}
												i++;
											}
										}
									};

									_make_navpoints(vInfoItems, 0, xNMap);

									//xml.setDocType('ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd"');
									var sDocType='ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd"';
									//var sXml=xml.serialize(bHtml, sDocType, sLineDelimiter);
									var sXml=xml.serialize(sDocType, sLineDelimiter, bSelfClosing);
									xTmpFn.saveUtf8(sXml);
									z.addEntry(xTmpFn.toStr(), 'OEBPS/toc.ncx');
								}
							}
						}

						z.close();

						var bSucc=false;

						//Finally we need to remove the temporary folder precedingly created;
						if(sTmpDir){
							var xTmpDir=new CLocalDir(sTmpDir);
							if(xTmpDir.exists()){
								//if(!xTmpDir.delete()){
								if(!xTmpDir.remove()){
									alert('Failed to remove the Temporary folder. You may need to manually clear it.'+'\n\n'+xTmpDir.toStr());
								}else{
									bSucc=true;
								}
							}
						}

						if(bSucc){
							if(nCountOfInfoItemDone>=nCountOfInfoItems && !sInfoItemProcessing){
								var sMsg=_lc2('Done', 'Successfully generated the ePub digital book, that can be transferred onto your mobile/xPad devices for viewing.');
								alert(sMsg+'\n\n'+xDstFn.toStr());
							}else{
								var sErr=_lc2('Incomplete'
									, 'The ePub digital book was generated, but might be incomplete, '
									+ 'since an XHTML/1.1 conversion problem occurred at the following info item. '
									+ 'Please try first to validate web contents with the W3C validator.'
									+ '\n\n'
									+ '%sItemTitle%'
									+ '\n\n'
									+ 'Count of info items done: '+'%nDoneInfoItems%'+'/'+'%nTotalInfoItems%'
									)
									.replace(/%sItemTitle%/g, sInfoItemProcessing)
									.replace(/%nDoneInfoItems%/g, nCountOfInfoItemDone)
									.replace(/%nTotalInfoItems%/g, nCountOfInfoItems)
									;
								alert(sErr);
							}
						}

					}else{
						alert(_lc2('Fail.CreateEpubFile', 'Failed to create the ePub file.')+'\n\n'+xDstFn.toStr());
					}
				}else{
					alert(_lc2('Fail.CreateTmpDir', 'Failed to create the Temporary folder.')+'\n\n'+sTmpDir);
				}
			}else{
				alert(_lc2('Fail.BadInput', "Invalid parameters input."));
			}
		}
	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	alert(e);
//}
