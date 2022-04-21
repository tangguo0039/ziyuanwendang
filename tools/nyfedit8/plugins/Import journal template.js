
//sValidation=nyfjs
//sCaption=Import journal template ...
//sHint=Insert journal info items by templates
//sCategory=MainMenu.Capture
//sCondition=CURDB; DBRW; OUTLINE; CURINFOITEM
//sID=p.ImportJournal
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

			var sCurItem=plugin.getCurInfoItem(-1)||plugin.getDefRootContainer();
			var sItemTitle=xNyf.getFolderHint(sCurItem)||'untitled';

			var _find_unique_id=function(sSsgPath){
				return xNyf.getChildEntry(sSsgPath, 0);
			};

			var _isLeapYear=function(y){return (y%400 == 0 || (y%4 == 0 && y%100 != 0));};

			var _insertItem=function(sSsgPath, sTitle){
				var sNewItem;
				var xChild=new CLocalFile(sSsgPath); xChild.append(_find_unique_id(sSsgPath));
				if(xNyf.createFolder(xChild.toStr())){
					if(sTitle) xNyf.setFolderHint(xChild.toStr(), sTitle);
					sNewItem=xChild.toStr();
				}
				return sNewItem;
			};

			var sCfgKey='ImportJournal.YearNum';
			var vItems=[], yCur=new Date().getFullYear(), nItems=20;
			for(var i=0; i<=nItems; ++i){
				vItems.push(''+(yCur-nItems/2+i));
			}
			var vFields = [{sField: 'comboedit', sLabel: _lc2('YearNum', 'Select or enter a year (4 digits)'), vItems: vItems, sInit: localStorage.getItem(sCfgKey)||yCur}];
			var vRes=input(plugin.getScriptTitle(), vFields, {nMinSize: 400, vMargins: [6, 0, 30, 0], bVert: true});
			if(vRes && vRes.length>0){

				var nYear=parseInt(vRes[0]);

				if(nYear>1900 && nYear<2099){

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
							if(m===2){
								nDays=28;
								if(bLeap) nDays++;
							}else if(m===1 || m===3 || m===5 || m===7 || m===8 || m===10 || m===12){
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
										//var sHtml='\n'+t.toDateString()+'\n====================\n\n';
										var sHtml='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
											+ '<html xmlns="http://www.w3.org/1999/xhtml">'
											+ '<head>'
											//+ '<style>\n'
											//+ 'body, table{font-family: Tahoma, Verdana}\n'
											//+ 'div{line-height: 1.5em;}\n' //2015.6.23 this may cause confusion to HTML editings;
											//+ '</style>'
											+ '</head>'
											+ '</body>'
											//+ '<div style="line-height: 1.5em;">'+t.toDateString()+'</div>'
											//+ '<div style="line-height: 1.5em;">====================</div>'
											//+ '<div style="line-height: 1.5em;"><br /></div>'
											//+ '<div style="line-height: 1.5em;"><br /></div>'
											+ '<div>'+t.toDateString()+'</div>'
											+ '<div>====================</div>'
											+ '<div><br /></div>'
											+ '<div><br /></div>'
											+ '</body></html>'
											;
										var xFn=new CLocalFile(sPathDay, plugin.getDefNoteFn('html'));
										xNyf.createTextFile(xFn.toStr(), sHtml);
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

//}catch(e){
//	alert(e);
//}
