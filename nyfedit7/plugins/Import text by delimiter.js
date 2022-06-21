
//sValidation=nyfjs
//sCaption=Import text by delimiter ...
//sHint=Import text by a delimiter and save as child items
//sCategory=MainMenu.Tools
//sID=p.ImportTextByDelimiter
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
	s=s.replace(/\t/g,	' &nbsp; &nbsp; &nbsp; &nbsp;');
	s=s.replace(/  /g,	' &nbsp;'); //&nbsp; = non-breaking space;
	//more ...
	return s;
};

try{
	var xNyf=new CNyfDb(-1);

	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			var sCfgKey='ImportTextByDelimiter.Dir';
			var sSrcFn=platform.getOpenFileName(
				{ sTitle: plugin.getScriptTitle()
				, sInitDir: localStorage.getItem(sCfgKey)||''
				, sFilter: 'Text files (*.txt)|*.txt|All files (*.*)|*.*'
				, bMultiSelect: false
				, bHideReadonly: true
				});

			if(sSrcFn){

				var sDir=new CLocalFile(sSrcFn).getDirectory();
				localStorage.setItem(sCfgKey, sDir);

				plugin.initProgressRange(plugin.getScriptTitle());

				var sCurItem=plugin.getCurInfoItem(-1), nDone=0;

				if(!sCurItem) sCurItem=plugin.getDefRootContainer();

				var _find_unique_id=function(sSsgPath){
					return xNyf.getChildEntry(sSsgPath, 0);
				};

				var sCSS='p{font-family: Verdana, Tahoma, Arial; font-size: 10pt; line-height: 100%;}';

				var _save_item=function(sTitle, sHtml){

					plugin.ctrlProgressBar(sTitle);

					var xSubItem=new CLocalFile(sCurItem); xSubItem.append(_find_unique_id(sCurItem));

					xNyf.createFolder(xSubItem);
					xNyf.setFolderHint(xSubItem, sTitle);

					var xSsgFn=new CLocalFile(xSubItem); xSsgFn.append(plugin.getDefNoteFn());

					var nBytes=xNyf.createTextFile(xSsgFn, '<html><head>\n<style>'+sCSS+'</style>\n</head>\n<body>\n'+sHtml+'</body></html>');

					if(nBytes>=0) nDone++;

					return nBytes;
				};

				var sCfgKey='ImportTextByDelimiter.sDelimiter';
				var sMsg=_lc2('Delimiter', 'Enter a delimiter to split the text notes');
				var sDelimiter=prompt(sMsg, localStorage.getItem(sCfgKey)||'----------');

				if(sDelimiter){

					localStorage.setItem(sCfgKey, sDelimiter);

					var bCRLF=(sDelimiter=='\\r' || sDelimiter=='\\n' || sDelimiter=='\\r\\n');

					var xSrcFn=new CLocalFile(sSrcFn), sTxt=xSrcFn.loadText();
					var v=sTxt.split('\n'), sHtml='', sTitle='', nMax=260;
					for(var i in v){
						var sLine=v[i];
						if(bCRLF){
							sLine=_trim(sLine);
							if(sLine){
								sTitle=sLine; if(sTitle.length>nMax) sTitle.length=nMax;
								_save_item(sTitle, '<p>'+sLine._html_encode() + '</p>');
							}
						}else{
							if(sLine.indexOf(sDelimiter)==0){
								if(sHtml) _save_item(sTitle, sHtml);
								sHtml=''; sTitle='';
							}else{
								if(!sTitle) sTitle=_trim(sLine);
								if(sTitle.length>nMax) sTitle.length=nMax;

								if(sHtml) sHtml+='\n';
								sHtml+=('<p>'+sLine._html_encode() + '</p>');
							}
						}
					}

					if(sHtml) _save_item(sTitle, sHtml);

					if(nDone>0){
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
