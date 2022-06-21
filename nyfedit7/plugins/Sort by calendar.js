
//sValidation=nyfjs
//sCaption=Sort child items by calendar ...
//sHint=Sort child info items by calendar
//sCategory=MainMenu.Organize; Context.Outline
//sID=p.SortByCalendar
//sAppVerMin=7.0
//sShortcutKey=
//sAuthor=wjjsoft

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

try{
	var xNyf=new CNyfDb(-1);

	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			var sCurItem=plugin.getCurInfoItem(-1)||plugin.getDefRootContainer();
			var sItemTitle=xNyf.getFolderHint(sCurItem)||'untitled';

			var vActs=[
				  '0: '+_lc2('Ascending', 'Sort child items by calendar in Ascending order')
				, '1: '+_lc2('Descending', 'Sort child items by calendar in Descending order')
			];

			var sCfgKey='SortByCalendar.iAction';
			var sMsg=_lc('p.Common.SelAction', 'Please select an action from within the dropdown list');
			var iOrder=dropdown(sMsg, vActs, localStorage.getItem(sCfgKey));
			if(iOrder>=0){

				localStorage.setItem(sCfgKey, iOrder);

				var bAsc=(iOrder==0);

				var vItems=[];
				var vSub=xNyf.listFolders(sCurItem);
				for(var i in vSub){
					var xSub=new CLocalFile(sCurItem); xSub.append(vSub[i]);
					var sCal=plugin.getCalendarAttr(-1, xSub.toString());
					if(sCal){
						var vFields=sCal.split('\t');
						if(vFields.length>1){
							var vStart=(vFields[1]||'').split('-');
							if(vStart.length==3){
								var xStartDate=new Date();
								xStartDate.setFullYear(parseInt(vStart[0]), parseInt(vStart[1])-1, parseInt(vStart[2]));
								xStartDate.setHours(0, 0, 0, 0);
								if(xStartDate){
									vItems.push({sSsgPath: xSub.toString(), xDate: xStartDate});
								}
							}
						}
					}else{
						/*
						var xStartDate=new Date();
						xStartDate.setFullYear((bAsc ? 1900 : 2999), 0, 1);
						xStartDate.setHours(0, 0, 0, 0);
						vItems.push({sSsgPath: xSub.toString(), xDate: xStartDate});
						*/
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
}catch(e){
	alert(e);
}
