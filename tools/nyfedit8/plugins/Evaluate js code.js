
//sValidation=nyfjs
//sCaption=Evaluate expression or js code ...
//sHint=Evaluate the selected/supplied math expression or javascript code
//sCategory=MainMenu.Tools; ToolBar.Misc
//sID=p.EvalExpr
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

//try{
	var sExp=plugin.getSelectedText(-1, false);
	if(sExp){
		var sRes=eval(sExp);
		if(sRes || typeof(sRes)==='number'){ //2015.6.1 in case of a Zero;
			var sNew=sExp+' = '+sRes;
			var xNyf=new CNyfDb(-1);
			if(xNyf.isOpen() && !xNyf.isReadonly() && plugin.isContentEditable()){
				plugin.replaceSelectedText(-1, sNew, false);
			}else{
				alert(sRes);
			}
		}
	}else{
		var bLineEdit=false, sDescr=_lc2('Descr', 'No text currently selected; Please type in Math expression or js script to evaluate');
		if(bLineEdit){
			sExp=prompt(sDescr, '');
		}else{
			sExp=textbox({
				sTitle: plugin.getScriptTitle()
				, sDescr: sDescr
				, sDefTxt: ''
				, bReadonly: false
				, bWordwrap: false
				, nWidth: 40
				, nHeight: 20
				, bFind: false
				, bFont: false
			});
		}
		if(sExp){
			var sRes=eval(sExp);
			if(sRes) alert(sRes);
		}
	}

//}catch(e){
//	alert(e);
//}
