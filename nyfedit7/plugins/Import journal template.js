
//sValidation=nyfjs
//sCaption=Import journal template ...
//sHint=Insert journal info items by templates
//sCategory=MainMenu.Tools
//sID=p.ImportJournal
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

			var sCurItem=plugin.getCurInfoItem(-1)||plugin.getDefRootContainer();
			var sItemTitle=xNyf.getFolderHint(sCurItem)||'untitled';

			var _find_unique_id=function(sSsgPath){
				return xNyf.getChildEntry(sSsgPath, 0);
			};

			var _isLeapYear=function(y){return (y%400 == 0 || (y%4 == 0 && y%100 != 0));};

			var _insertItem=function(sSsgPath, sTitle){
				var sNewItem;
				var xChild=new CLocalFile(sSsgPath); xChild.append(_find_unique_id(sSsgPath));
				if(xNyf.createFolder(xChild)){
					if(sTitle) xNyf.setFolderHint(xChild, sTitle);
					sNewItem=xChild.toString();
				}
				return sNewItem;
			};

			var sCfgKey='ImportJournal.YearNum';
			var sMsg=_lc2('YearNum', 'Enter a year number to make journal info items');
			var sYear=prompt(sMsg, localStorage.getItem(sCfgKey)||''); sYear=_trim(sYear);
			if(sYear){
				var nYear=parseInt(sYear);
				if(nYear>1900 && nYear<2050){

					localStorage.setItem(sCfgKey, nYear);

					var bLeap=_isLeapYear(nYear);
					var sPathYear=_insertItem(sCurItem, _lc2('Journal', 'Journal')+' - '+nYear);

					plugin.initProgressRange(plugin.getScriptTitle(), 12);

					var _insertMonths=function(){
						//var vMon='January,February,March,April,May,June,July,August,September,October,November,December'.split(',');
						var vMon=_lc2('MonthNames', 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec').split(',');
						for(var j=0; j<12; ++j){
							var sMon=''+(j+1); if(vMon.length>j) sMon=vMon[j];
							var sPathMon=_insertItem(sPathYear, sMon+' - '+nYear);
							var nDays=30, m=j+1;
							if(m==2){
								nDays=28;
								if(bLeap) nDays++;
							}else if(m==1 || m==3 || m==5 || m==7 || m==8 || m==10 || m==12){
								nDays=31;
							}

							var bContinue=plugin.ctrlProgressBar(sMon+'. '+nYear, 1, true);
							if(!bContinue) break;

							for(var i=0; i<nDays; ++i){
								var sPathDay=_insertItem(sPathMon, '');
								if(sPathDay){

									var t=new Date();
									t.setFullYear(nYear);

									//2013.3.30 this code may fail if today is March/30 and Month is set to Feb;
									//t.setMonth(j);
									//t.setDate(i+1);
									t.setMonth(j, i+1);

									if(xNyf.linkCalendar(sPathDay, t, t, 0, 0)){
										var sTxt='\n'+t.toDateString()+'\n====================\n\n';
										var xFn=new CLocalFile(sPathDay); xFn.append(plugin.getDefNoteFn());
										xNyf.createTextFile(xFn, sTxt);
									}
								}
							}
						}
					};

					_insertMonths();

					plugin.refreshOutline(-1, sCurItem);
					plugin.refreshCalendar(-1);
					plugin.refreshOverview(-1);
				}else{
					alert('Bad input of the year number.');
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
