
//sValidation=nyfjs
//sCaption=List recently modified entries ...
//sHint=Scan database for entries recently modified with a date period
//sCategory=MainMenu.Search
//sID=p.ListRecent
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

		{
			var t0=new Date();

			var vItems=[];
			{
				vItems=[{id: 'Today', cap: 'Today', start: t0, end: t0}];
			}

			{
				var t1=new Date();
				t1.setTime(t0.getTime()-1000*3600*24*t0.getDay());
				vItems[vItems.length]={id: 'ThisWeek', cap: 'This week', start: t1, end: t0};
			}

			{
				var t1=new Date(), t2=new Date();
				t2.setTime(t0.getTime()-1000*3600*24*(t0.getDay()+1));
				t1.setTime(t2.getTime()-1000*3600*24*7);
				vItems[vItems.length]={id: 'LastWeek', cap: 'Last week', start: t1, end: t2};
			}

			{
				var t1=new Date();
				t1.setDate(1);
				vItems[vItems.length]={id: 'ThisMonth', cap: 'This month', start: t1, end: t0};
			}

			{
				var t1=new Date(), t2=new Date();
				t2.setDate(1);
				t2.setTime(t2.getTime()-1000*3600*24*1);
				t1.setTime(t2.getTime());
				t1.setDate(1);
				vItems[vItems.length]={id: 'LastMonth', cap: 'Last month', start: t1, end: t2};
			}

			{
				var t1=new Date();
				t1.setMonth(0);
				t1.setDate(1);
				vItems[vItems.length]={id: 'ThisYear', cap: 'This year', start: t1, end: t0};
			}

			{
				var t1=new Date(), t2=new Date();
				t1.setFullYear(t1.getFullYear()-1);
				t1.setMonth(0);
				t1.setDate(1);
				t2.setMonth(0);
				t2.setDate(1);
				t2.setTime(t2.getTime()-1000*3600*24*1);
				vItems[vItems.length]={id: 'LastYear', cap: 'Last year', start: t1, end: t2};
			}

			{
				var t1=new Date();
				t1.setTime(t0.getTime()-1000*3600*24*30);
				vItems[vItems.length]={id: '30Day', cap: 'Recent 30 days', start: t1, end: t0};
			}

			{
				var t1=new Date();
				t1.setTime(t0.getTime()-1000*3600*24*60);
				vItems[vItems.length]={id: '60Day', cap: 'Recent 60 days', start: t1, end: t0};
			}

			{
				var t1=new Date();
				t1.setTime(t0.getTime()-1000*3600*24*90);
				vItems[vItems.length]={id: '90Day', cap: 'Recent 90 days', start: t1, end: t0};
			}

			var vActs=[], n=1;
			for(var i in vItems){
				var t=vItems[i];
				vActs[vActs.length]=_lc2(t.id, ''+n+'. '+t.cap);
				n++;
			}

			var sCfgKey='ListRecent.iAction';
			var sMsg=_lc2('SelPeriod', 'List entries recently modified within a specified date period.');
			var iSel=dropdown(sMsg, vActs, localStorage.getItem(sCfgKey));
			if(iSel>=0){

				localStorage.setItem(sCfgKey, iSel);

				plugin.initProgressRange(plugin.getScriptTitle(), 0);

				var _srcfn_of_shortcut=function(xDb, sSsgFn){
					var sSrcFn='';
					var xTmpFn=new CLocalFile(platform.getTempFile()); platform.deferDeleteFile(xTmpFn);
					if(xDb.exportFile(sSsgFn, xTmpFn)>0){
						var vLines=(xTmpFn.loadText()||'').split('\n');
						for(var i in vLines){
							var sLine=_trim(vLines[i]), sKey='url=file://';
							if(sLine.toLowerCase().indexOf(sKey)==0){
								var sSrc=sLine.substr(sKey.length);
								if(sSrc){
									sSrcFn=sSrc;
									break;
								}
							}
						}
					}
					xTmpFn.remove();
					return sSrcFn;
				};

				var _compare=function(t1, t2){
					var y1=t1.getFullYear(), m1=t1.getMonth(), d1=t1.getDate();
					var y2=t2.getFullYear(), m2=t2.getMonth(), d2=t2.getDate();
					if(y1 == y2){
						if(m1 == m2){
							if(d1 == d2){
								return 0;
							}else{
								return d1 > d2 ? 1 : -1;
							}
						}else{
							return m1 > m2 ? 1 : -1;
						}
					}else{
						return y1 > y2 ? 1 : -1;
					}
				};

				var _match=function(tMod){
					var t=vItems[iSel];
					if(_compare(tMod, t.start)>=0 && _compare(tMod, t.end)<=0){
						return true;
					}else{
						return false;
					}
				};

				plugin.showResultsPane(true, true); //make sure the Query-results window is open and cleared;
				plugin.setResultsPaneTitle(plugin.getScriptTitle()+'  '+vActs[iSel]);

				var sCurItem=plugin.getCurInfoItem();
				var sPathRoot=plugin.getDefRootContainer();
				var sPathToScan=sPathRoot;

				var nFolders=0;

				//To estimate the progress range;
				xNyf.traverseOutline(sPathToScan, false, function(){
					nFolders++;
				});

				plugin.initProgressRange(plugin.getScriptTitle(), nFolders);

				var nFound=0;
				var _act_on_treeitem=function(sSsgPath, iLevel){

					if(xNyf.folderExists(sSsgPath, false)){

						var sTitle=xNyf.getFolderHint(sSsgPath); if(!sTitle) sTitle='== Untitled ==';
						var bContinue=plugin.ctrlProgressBar(sTitle, 1, true);
						if(!bContinue) return true;

						var tMod=xNyf.getModifyTime(sSsgPath);
						if(_match(tMod)){
								var sLine=xNyf.getDbFile()+'\t'+sSsgPath+'\t';
								plugin.appendToResults(xNyf.getDbFile(), sSsgPath, '', '');
						}

						var vFiles=xNyf.listFiles(sSsgPath);
						for(var i in vFiles){
							var sName=vFiles[i];
							var xSsgFn=new CLocalFile(sSsgPath); xSsgFn.append(sName);

							var tMod=xNyf.getModifyTime(xSsgFn);
							if(xNyf.isShortcut(xSsgFn)){
								var sSrcFn=_srcfn_of_shortcut(xNyf, xSsgFn);
								var xSrcFn=new CLocalFile(sSrcFn);
								if(xSrcFn.exists()){
									tMod=xSrcFn.getModifyTime();
								}
							}

							if(_match(tMod)){
									var sLine=xNyf.getDbFile()+'\t'+sSsgPath+'\t'+sName;
									plugin.appendToResults(xNyf.getDbFile(), sSsgPath, sName, '');
									nFound++;
							}
						}
					}
				};

				xNyf.traverseOutline(sPathToScan, false, _act_on_treeitem);

				plugin.setResultsPaneTitle(plugin.getScriptTitle()+'  ['+vActs[iSel]+'] '+_lc('p.Common.Found', 'Found: (%nFound%)').replace(/%nFound%/g, ''+nFound));

			}
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

}catch(e){
	alert(e);
}
