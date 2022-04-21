
//sValidation=nyfjs
//sCaption=Import OPML items ...
//sHint=Import items from in a specified OPML document
//sCategory=MainMenu.Capture
//sCondition=CURDB; DBRW; OUTLINE; CURINFOITEM
//sID=p.ImportOpml
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
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

//String.prototype._html_encode=function()
//{
//	//http://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references
//	var s=this;
//	s=s.replace(/&/g,	'&amp;');
//	s=s.replace(/</g,	'&lt;');
//	s=s.replace(/>/g,	'&gt;');
//	s=s.replace(/\"/g,	'&quot;');
//	s=s.replace(/\'/g,	'&apos;');
//	s=s.replace(/\xA0/g,	'&nbsp;'); //http://www.fileformat.info/info/unicode/char/a0/index.htm
//	s=s.replace(/  /g,	'&nbsp; ');
//	s=s.replace(/\t/g,	'&nbsp; &nbsp; &nbsp; &nbsp; '); //&emsp;
//	//more ...
//	return s;
//};

//String.prototype._html_decode=function()
//{
//	var s=this;
//	s=s.replace(/&lt;/g,		'<');
//	s=s.replace(/&gt;/g,		'>');
//	s=s.replace(/&quot;/g,		'"');
//	s=s.replace(/&apos;/g,		'\'');
//	s=s.replace(/&nbsp;/g,		' ');
//	s=s.replace(/&circ;/g,		'^');
//	s=s.replace(/&tilde;/g,		'~');
//	//more ...
//	s=s.replace(/&amp;/g,		'&');
//	return s;
//};

//try{
	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			var sCfgKey='ImportOpml.Dir';
			var sSrcFn=platform.getOpenFileName(
				{ sTitle: plugin.getScriptTitle()
				, sInitDir: localStorage.getItem(sCfgKey)||''
				, sFilter: 'OPML documents (*.opml *.xml);;All files (*.*)'
				, bMultiSelect: false
				, bHideReadonly: true
				});

			if(sSrcFn){

				localStorage.setItem(sCfgKey, new CLocalFile(sSrcFn).getDirectory(false));

				plugin.initProgressRange(plugin.getScriptTitle());

				var sCurItem=plugin.getCurInfoItem(-1), nDone=0;

				if(!sCurItem) sCurItem=plugin.getDefRootContainer();

				var sCSS='p{font-family: Verdana, Tahoma, Arial; font-size: 10pt; line-height: 100%;}';

				var _find_unique_id=function(sSsgPath){
					return xNyf.getChildEntry(sSsgPath, 0);
				};

				var _import_branch_as_html=function(sSsgPath, xElm){

					var sHtml='', sTitle='';
					var c=xElm.getAttrCount();
					for(var i=0; i<c; ++i){
						var sName=xElm.getAttrName(i);
						var sVal=xElm.getAttrValue(sName);
						if(sName && sVal){

							if(sName==='title' || sName==='text'){
								if(!sTitle) sTitle=sVal;
							}else{
								sHtml+='<p>';
								sHtml+=(platform.htmlEncode(sName) + ' = ' + platform.htmlEncode(sVal));
								sHtml+='</p>\n';
							}
						}
					}

					plugin.ctrlProgressBar(sTitle);

					var xPathSub=new CLocalFile(sSsgPath); xPathSub.append(_find_unique_id(sSsgPath));

					if(xNyf.createFolder(xPathSub.toStr())){

						if(sTitle) xNyf.setFolderHint(xPathSub.toStr(), sTitle);

						var xSsgFn=new CLocalFile(xPathSub.toStr()); xSsgFn.append(plugin.getDefNoteFn('html'));
						var nBytes=xNyf.createTextFile(xSsgFn, '<html><head>\n<style>'+sCSS+'</style>\n</head>\n<body>\n'+sHtml+'</body></html>');

						_import_subitems(xPathSub.toStr(), xElm);
					}
				};

				var _import_branch=function(sSsgPath, xElm){

					var sTxt='', sTitle='';
					var c=xElm.getAttrCount();
					for(var i=0; i<c; ++i){
						var sName=xElm.getAttrName(i);
						var sVal=xElm.getAttrValue(sName);
						if(sName && sVal){

							if(sName==='title' || sName==='text'){
								if(!sTitle) sTitle=sVal;
							}else{
								if(sTxt) sTxt+='\n';
								sTxt+=(sName + ' = ' + sVal);
							}
						}
					}

					plugin.ctrlProgressBar(sTitle);

					var xPathSub=new CLocalFile(sSsgPath); xPathSub.append(_find_unique_id(sSsgPath));

					if(xNyf.createFolder(xPathSub.toStr())){

						if(sTitle) xNyf.setFolderHint(xPathSub.toStr(), sTitle);

						var xSsgFn=new CLocalFile(xPathSub.toStr()); xSsgFn.append(plugin.getDefNoteFn('txt'));
						var nBytes=xNyf.createTextFile(xSsgFn.toStr(), sTxt);

						_import_subitems(xPathSub.toStr(), xElm);
					}
				};

				var _import_subitems=function(sSsgPath, xElm){
					var nChild=xElm.getElementCount();
					for(var i=0; i<nChild; ++i){
						var xSub=xElm.getElementByIndex(i);
						if(xSub.getTagName()==='outline'){
							_import_branch(sSsgPath, xSub);
						}
					}
				};

				//var nDone=0;
				var sXml=new CLocalFile(sSrcFn).loadText('auto');
				if(sXml){
						var xml=new CXmlDocument();
						xml.initWith(sXml);

						var xHd=xml.getElement('opml/head');
						var xBd=xml.getElement('opml/body');

						//_import_head(sCurItem, xHd);

						_import_subitems(sCurItem, xBd);

						//if(nDone>0)
						{
							plugin.refreshOutline(-1, sCurItem);
						}
				}

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
