
//sValidation=nyfjs
//sCaption=Import OPML items ...
//sHint=Import items from within OPML document
//sCategory=MainMenu.Tools
//sID=p.ImportOpml
//sAppVerMin=7.0
//sShortcutKey=
//sAuthor=wjjsoft

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

String.prototype._html_encode=function()
{
	//http://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references
	var s=this;
	s=s.replace(/&/g,	'&amp;');
	s=s.replace(/</g,	'&lt;');
	s=s.replace(/>/g,	'&gt;');
	s=s.replace(/\"/g,	'&quot;');
	s=s.replace(/\'/g,	'&apos;');
	s=s.replace(/  /g,	' &nbsp;'); //&nbsp; = non-breaking space;
	//more ...
	return s;
};

String.prototype._html_decode=function()
{
	var s=this;
	s=s.replace(/&lt;/g,		'<');
	s=s.replace(/&gt;/g,		'>');
	s=s.replace(/&quot;/g,		'"');
	s=s.replace(/&apos;/g,		'\'');
	s=s.replace(/&nbsp;/g,		' ');
	s=s.replace(/&circ;/g,		'^');
	s=s.replace(/&tilde;/g,		'~');
	//more ...
	s=s.replace(/&amp;/g,		'&');
	return s;
};

try{
	var xNyf=new CNyfDb(-1);

	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			var sCfgKey='ImportOpml.Dir';
			var sSrcFn=platform.getOpenFileName(
				{ sTitle: plugin.getScriptTitle()
				, sInitDir: localStorage.getItem(sCfgKey)||''
				, sFilter: 'OPML Documents (*.opml;*.xml)|*.opml;*.xml|All files (*.*)|*.*'
				, bMultiSelect: false
				, bHideReadonly: true
				});

			if(sSrcFn){

				var sDir=new CLocalFile(sSrcFn).getDirectory();
				localStorage.setItem(sCfgKey, sDir);

				plugin.initProgressRange(plugin.getScriptTitle());

				var sCurItem=plugin.getCurInfoItem(-1), nDone=0;

				if(!sCurItem) sCurItem=plugin.getDefRootContainer();

				var sCSS='p{font-family: Verdana, Tahoma, Arial; font-size: 10pt; line-height: 100%;}';

				var _find_unique_id=function(sSsgPath){
					return xNyf.getChildEntry(sSsgPath, 0);
				};

				var _import_branch=function(sSsgPath, xElm){

					var sHtml='', sTitle='';
					var c=xElm.getAttrCount();
					for(var i=0; i<c; ++i){
						var sName=xElm.getAttrName(i);
						var sVal=xElm.getAttrValue(sName);
						if(sName && sVal){

							if(sName=='title' || sName=='text'){
								if(!sTitle) sTitle=sVal;
							}else{
								sHtml+='<p>';
								sHtml+=(sName._html_encode() + ' = ' + sVal._html_encode());
								sHtml+='</p>\n';
							}
						}
					}

					plugin.ctrlProgressBar(sTitle);

					var xPathSub=new CLocalFile(sSsgPath); xPathSub.append(_find_unique_id(sSsgPath));

					if(xNyf.createFolder(xPathSub)){

						if(sTitle) xNyf.setFolderHint(xPathSub, sTitle);

						var xSsgFn=new CLocalFile(xPathSub); xSsgFn.append(plugin.getDefNoteFn());
						var nBytes=xNyf.createTextFile(xSsgFn, '<html><head>\n<style>'+sCSS+'</style>\n</head>\n<body>\n'+sHtml+'</body></html>');

						_import_subitems(xPathSub, xElm);
					}
				};

				var _import_subitems=function(sSsgPath, xElm){
					var nChild=xElm.getElementCount();
					for(var i=0; i<nChild; ++i){
						var xSub=xElm.getElementByIndex(i);
						if(xSub.getTagName()=='outline'){
							_import_branch(sSsgPath, xSub);
						}
					}
				};

				//var nDone=0;
				var sXml=new CLocalFile(sSrcFn).loadText();
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
}catch(e){
	alert(e);
}
