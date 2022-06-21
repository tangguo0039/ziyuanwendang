//sValidation=nyfjs
//sCaption=Items for next week
//sHint=List out info items for next week by calendar
//sCategory=MainMenu.Search
//sID=p.ItemsForNextWeek
//sAppVerMin=7.0
//sShortcutKey=
//sAuthor=wjjsoft

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

try{
	if(plugin.getCurDbIndex()>=0){

		var t0=new Date(), t1=new Date(), t2=new Date();

		t1.setTime(t0.getTime()+1000*3600*24*(7-t0.getDay()));
		t2.setTime(t1.getTime()+1000*3600*24*7);

		plugin.runQuery({
			  iDbPos: -1
			, tCalendarStart: t1
			, tCalendarEnd: t2
			, bListOut: true
		});

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}
}catch(e){
	alert(e);
}

