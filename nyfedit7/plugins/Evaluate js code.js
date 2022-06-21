
//sValidation=nyfjs
//sCaption=Evaluate expression or js code ...
//sHint=Evaluate the selected/supplied math expression or javascript code
//sCategory=MainMenu.Tools;
//sID=p.EvalExpr
//sAppVerMin=7.0
//sShortcutKey=Ctrl+Shift+F9
//sAuthor=wjjsoft

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

try{

	var sExp=plugin.getSelectedText(false);
	if(sExp){

		var sRes=eval(sExp);
		if(sRes){
			var sNew=sExp+' = '+sRes;
			var xNyf=new CNyfDb(-1);
			if(xNyf.isOpen() && !xNyf.isReadonly() && !plugin.getDbLock(-1)){
				plugin.replaceSelectedText(-1, sNew, false);
			}else{
				alert(sRes);
			}
		}
	}else{
		var bLineEdit=false, sDescr=_lc2('Descr', 'No text currently selected; Please enter a math expression or js code to evaluate (Javascript Syntax):');
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
			});
		}
		if(sExp){
			var sRes=eval(sExp);
			if(sRes) alert(sRes);
		}
	}
}catch(e){
	alert(e);
}
