
//sValidation=nyfjs
//sCaption=Set compression level ...
//sHint=Set compression level for the current database
//sCategory=MainMenu.Maintain; Context.Overview
//sCondition=CURDB; DBRW
//sID=p.SetPackLevel
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

//try{
	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			var vVals=[
				  '0: '+_lc2('NoPack', 'None')
				, '1: '+_lc2('SpeedPrior', 'Speed priority')
				, '2'
				, '3'
				, '4'
				, '5'
				, '6'
				, '7' //'7: '+_lc2('Default', 'Default')
				, '8'
				, '9: '+_lc2('SizePrior', 'Size priority')
			];

			var iLevelOld=xNyf.getCompressLevel ? xNyf.getCompressLevel() : 9;

			var vFields = [
				{sField: "combolist", sLabel: _lc2('Level', 'Compression level'), vItems: vVals, sInit: iLevelOld}
			];

			var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 400, vMargins: [5, 0, 30, 0], bVert: true});
			if(vRes && vRes.length>0){

				var iLevel=vRes[0];

				if(xNyf.setCompressLevel(iLevel)){
					plugin.refreshOverview(-1);
					var sMsg=_lc2('Done', 'Successfully set the compression level to');
					alert(sMsg+' '+iLevel+'.');
				}else{
					alert('Failed to set the compression level.');
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
