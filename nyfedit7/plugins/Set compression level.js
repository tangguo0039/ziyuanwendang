
//sValidation=nyfjs
//sCaption=Set compression level ...
//sHint=Set compression level for the current database
//sCategory=MainMenu.Maintain
//sID=p.SetPackLevel
//sAppVerMin=7.0
//sShortcutKey=
//sAuthor=wjjsoft

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

try{
	var xNyf=new CNyfDb(-1);

	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			var vLevels=[
				  '0: '+_lc2('NoPack', 'No compression')
				, '1: '+_lc2('SpeedPrior', 'Speed priority')
				, '2'
				, '3'
				, '4'
				, '5'
				, '6'
				, '7: '+_lc2('Default', 'Default')
				, '8'
				, '9: '+_lc2('SizePrior', 'Size priority')
			];
			var sMsg=_lc2('SelLevel', 'Choose a compression level from within the drop-down list.');
			var iLevelOld=xNyf.getCompressLevel ? xNyf.getCompressLevel() : 9;
			var iLevel=dropdown(sMsg, vLevels, iLevelOld);
			if(iLevel>=0){
				if(xNyf.setCompressLevel(iLevel)){
					plugin.refreshOverview(-1);
					var sMsg=_lc2('Done', 'Successfully set the compression level to');
					alert(sMsg+' '+iLevel+'.');
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
