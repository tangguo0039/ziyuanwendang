
//sValidation=nyfjs
//sCaption=Detect text encoding ...
//sHint=Detect character encoding of a given text file
//sCategory=MainMenu.Tools
//sID=p.CodecDetection
//sAppVerMin=8.0
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

//try{

	var sCfgKey1='CodecDetection.sFn';

	var sFn=platform.getOpenFileName({
					sTitle: plugin.getScriptTitle()
					, sInitDir: localStorage.getItem(sCfgKey1)||''
					, sFilter: 'All files (*);;Text files(*.txt *.html *.htm *.ini *.log *.csv)'
				});
	if(sFn){

		var xFn=new CLocalFile(sFn);
		localStorage.setItem(sCfgKey1, xFn.getDirectory()||'');

		alert(xFn.toStr() + "\n\n" + xFn.codecName());
	}

//}catch(e){
//	alert(e);
//}
