
//sValidation=nyfjs
//sCaption=Sort child items by calendar ...
//sHint=Sort child info items by calendar
//sCategory=MainMenu.Organize; Context.Outline
//sCondition=CURDB; DBRW; OUTLINE; CURINFOITEM
//sID=p.SortByCalendar
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
	var xNyf=new CNyfDb(-1);

	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			var sCurItem=plugin.getCurInfoItem(-1)||plugin.getDefRootContainer();
			var sItemTitle=xNyf.getFolderHint(sCurItem)||'untitled';

			var vVals=[
				_lc2('Asc', 'Ascending')
				, _lc2('Desc', 'Descending')
			];

			var sCfgKey1='SortByCalendar.iOption';
			var vFields = [
				{sField: "combolist", sLabel: _lc2('Option', 'Option'), vItems: vVals, sInit: localStorage.getItem(sCfgKey1)||''}
			];

			var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 400, vMargins: [8, 0, 30, 0]});
			if(vRes && vRes.length>0){

				var iOrder=vRes[0];

				localStorage.setItem(sCfgKey1, iOrder);

				var bAsc=(iOrder===0);

				var vItems=[];
				var vSub=xNyf.listFolders(sCurItem);
				for(var i in vSub){
					var xSub=new CLocalFile(sCurItem, vSub[i]);
					var sCal=plugin.getCalendarAttr(-1, xSub.toStr());
					if(sCal){
						var vFields=sCal.split('\t');
						if(vFields.length>1){
							var vStart=(vFields[1]||'').split('-');
							if(vStart.length>=3){
								var xStartDate=new Date();
								xStartDate.setFullYear(parseInt(vStart[0]), parseInt(vStart[1])-1, parseInt(vStart[2]));
								xStartDate.setHours(0, 0, 0, 0);
								if(xStartDate){
									vItems.push({sSsgPath: xSub.toStr(), xDate: xStartDate});
								}
							}
						}
					}else{
						//var xStartDate=new Date();
						//xStartDate.setFullYear((bAsc ? 1900 : 2999), 0, 1);
						//xStartDate.setHours(0, 0, 0, 0);
						//vItems.push({sSsgPath: xSub.toStr(), xDate: xStartDate});
					}
				}

				var _compare_asc=function(x, y){
					if(x.xDate > y.xDate) return 1;
					else if(x.xDate < y.xDate) return -1;
					else return 0;
				};

				var _compare_desc=function(x, y){
					if(x.xDate < y.xDate) return 1;
					else if(x.xDate > y.xDate) return -1;
					else return 0;
				};

				vItems.sort(bAsc ? _compare_asc : _compare_desc);

				for(var i=vItems.length-1; i>=0; --i){
					var sSsgPath=vItems[i].sSsgPath;
					xNyf.setEntryPos(sSsgPath, 0);
				}

				plugin.refreshOutline(-1, sCurItem, false);

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
