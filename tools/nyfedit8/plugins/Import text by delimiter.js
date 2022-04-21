
//sValidation=nyfjs
//sCaption=Import text by delimiter ...
//sHint=Split text by a delimiter and import as child items
//sCategory=MainMenu.Capture
//sCondition=CURDB; DBRW; OUTLINE; CURINFOITEM
//sID=p.ImportTextByDelimiter
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

//var _html_encode=function(s)
//{
//	//http://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references
//	s=s.replace(/&/g,	'&amp;');
//	s=s.replace(/</g,	'&lt;');
//	s=s.replace(/>/g,	'&gt;');
//	s=s.replace(/\"/g,	'&quot;');
//	s=s.replace(/\'/g,	'&apos;');
//	s=s.replace(/\xA0/g,	'&nbsp;'); //http://www.fileformat.info/info/unicode/char/a0/index.htm
//	s=s.replace(/  /g,	'&nbsp; ');
//	s=s.replace(/\t/g,	'&nbsp; &nbsp; &nbsp; &nbsp; '); //&emsp;
//	//and more ...
//	return s;
//};

//try{
	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			var sCfgKey1='ImportTextByDelimiter.sDir', sCfgKey2='ImportTextByDelimiter.sDelimiter';
			var vFields = [
				{sField: "file", sLabel: _lc2('SrcFn', 'Text file to import'), sTitle: plugin.getScriptTitle(), sFilter: 'Text files (*.txt);;All files (*.*)', sInit: localStorage.getItem(sCfgKey1)||''}
				, {sField: "lineedit", sLabel: _lc2('Delimiter', 'Delimiter to divide text content'), sInit: localStorage.getItem(sCfgKey2)||'----------'}
			];

			var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 500, vMargins: [2, 0, 50, 0], bVert: true});
			if(vRes && vRes.length>=2){

				var sSrcFn=vRes[0], sDelimiter=vRes[1];
				if(sSrcFn && sDelimiter){

					localStorage.setItem(sCfgKey1, sSrcFn);
					localStorage.setItem(sCfgKey2, sDelimiter);

					plugin.initProgressRange(plugin.getScriptTitle());

					var sCurItem=plugin.getCurInfoItem(-1), nDone=0;

					if(!sCurItem) sCurItem=plugin.getDefRootContainer();

					var _find_unique_id=function(sSsgPath){
						return xNyf.getChildEntry(sSsgPath, 0);
					};

					var sCSS=''; //'body, table{font-family: Verdana, Tahoma, Arial; font-size: 10pt;}';

//					var _save_item=function(sTitle, sHtml){

//						plugin.ctrlProgressBar(sTitle);

//						var xSubItem=new CLocalFile(sCurItem); xSubItem.append(_find_unique_id(sCurItem));

//						xNyf.createFolder(xSubItem.toStr());
//						xNyf.setFolderHint(xSubItem.toStr(), sTitle);

//						var xSsgFn=new CLocalFile(xSubItem.toStr()); xSsgFn.append(plugin.getDefNoteFn());

//						var nBytes=xNyf.createTextFile(xSsgFn.toStr(), '<html><head>\n<style>'+sCSS+'</style>\n</head>\n<body>\n'+sHtml+'</body></html>');

//						if(nBytes>=0) nDone++;

//						return nBytes;
//					};

					var _save_item=function(sTitle, sTxt){

						plugin.ctrlProgressBar(sTitle);

						var xSubItem=new CLocalFile(sCurItem); xSubItem.append(_find_unique_id(sCurItem));

						xNyf.createFolder(xSubItem.toStr());
						xNyf.setFolderHint(xSubItem.toStr(), sTitle);

						var xSsgFn=new CLocalFile(xSubItem.toStr()); xSsgFn.append(plugin.getDefNoteFn('txt'));

						var nBytes=xNyf.createTextFile(xSsgFn.toStr(), sTxt);

						if(nBytes>=0) nDone++;

						return nBytes;
					};

					var bCRLF=(sDelimiter==='\\r' || sDelimiter==='\\n' || sDelimiter==='\\r\\n');

					var xSrcFn=new CLocalFile(sSrcFn), sTxt=xSrcFn.loadText('auto');
					var v=sTxt.split('\n'), vRes=[], sHtml='', sTitle='', nMax=260;
					for(var i in v){
						var sLine=v[i];
						if(bCRLF){
							sLine=_trim(sLine);
							if(sLine){
								sTitle=sLine; if(sTitle.length>nMax) sTitle.length=nMax;
								_save_item(sTitle, sLine);
							}
						}else{
							if(sLine.indexOf(sDelimiter)===0){
								if(vRes.length>0) _save_item(sTitle, vRes.join('\n'));
								vRes=[]; sTitle='';
							}else{
								if(!sTitle) sTitle=_trim(sLine);
								if(sTitle.length>nMax) sTitle.length=nMax;
								vRes.push(sLine);
							}
						}
					}

					if(vRes.length>0) _save_item(sTitle, vRes.join('\n'));

					if(nDone>0){
						plugin.refreshOutline(-1, sCurItem);
					}
				}else{
					alert('Bad input of direcotry path or delimiter.');
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
