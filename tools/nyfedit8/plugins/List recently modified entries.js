
//sValidation=nyfjs
//sCaption=List recently modified entries ...
//sHint=Scan database for entries recently modified in a specified date period
//sCategory=MainMenu.Search
//sCondition=CURDB
//sID=p.ListRecent
//sAppVerMin=8.0
//sShortcutKey=
//sAuthor=wjjsoft

/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2022 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////


let _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
let _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

let _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
let _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

//try{
	let xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		{
			let t0=new Date();

			let vItems=[];
			{
				vItems=[{id: 'Today', cap: 'Today', start: t0, end: t0}];
			}

			{
				let t1=new Date();
				t1.setTime(t0.getTime()-1000*3600*24);
				vItems[vItems.length]={id: 'Yesterday', cap: 'Yesterday', start: t1, end: t1};
			}

			{
				let t1=new Date();
				t1.setTime(t0.getTime()-1000*3600*24*t0.getDay());
				vItems[vItems.length]={id: 'ThisWeek', cap: 'This week', start: t1, end: t0};
			}

			{
				let t1=new Date(), t2=new Date();
				t2.setTime(t0.getTime()-1000*3600*24*(t0.getDay()+1));
				t1.setTime(t2.getTime()-1000*3600*24*7);
				vItems[vItems.length]={id: 'LastWeek', cap: 'Last week', start: t1, end: t2};
			}

			{
				let t1=new Date();
				t1.setDate(1);
				vItems[vItems.length]={id: 'ThisMonth', cap: 'This month', start: t1, end: t0};
			}

			{
				let t1=new Date(), t2=new Date();
				t2.setDate(1);
				t2.setTime(t2.getTime()-1000*3600*24*1);
				t1.setTime(t2.getTime());
				t1.setDate(1);
				vItems[vItems.length]={id: 'LastMonth', cap: 'Last month', start: t1, end: t2};
			}

			{
				let t1=new Date();
				t1.setMonth(0);
				t1.setDate(1);
				vItems[vItems.length]={id: 'ThisYear', cap: 'This year', start: t1, end: t0};
			}

			{
				let t1=new Date(), t2=new Date();
				t1.setFullYear(t1.getFullYear()-1);
				t1.setMonth(0);
				t1.setDate(1);
				t2.setMonth(0);
				t2.setDate(1);
				t2.setTime(t2.getTime()-1000*3600*24*1);
				vItems[vItems.length]={id: 'LastYear', cap: 'Last year', start: t1, end: t2};
			}

			{
				let t1=new Date();
				t1.setTime(t0.getTime()-1000*3600*24*7);
				vItems[vItems.length]={id: 'Recent7d', cap: 'Recent 7 days', start: t1, end: t0};
			}

			{
				let t1=new Date();
				t1.setTime(t0.getTime()-1000*3600*24*14);
				vItems[vItems.length]={id: 'Recent14d', cap: 'Recent 14 days', start: t1, end: t0};
			}

			{
				let t1=new Date();
				t1.setTime(t0.getTime()-1000*3600*24*21);
				vItems[vItems.length]={id: 'Recent21d', cap: 'Recent 21 days', start: t1, end: t0};
			}

			{
				let t1=new Date();
				t1.setTime(t0.getTime()-1000*3600*24*30);
				vItems[vItems.length]={id: 'Recent30d', cap: 'Recent 30 days', start: t1, end: t0};
			}

			{
				let t1=new Date();
				t1.setTime(t0.getTime()-1000*3600*24*60);
				vItems[vItems.length]={id: 'Recent60d', cap: 'Recent 60 days', start: t1, end: t0};
			}

			{
				let t1=new Date();
				t1.setTime(t0.getTime()-1000*3600*24*90);
				vItems[vItems.length]={id: 'Recent90d', cap: 'Recent 90 days', start: t1, end: t0};
			}

			{
				let t1=new Date();
				t1.setTime(t0.getTime()-1000*3600*24*100);
				vItems[vItems.length]={id: 'Recent100d', cap: 'Recent 100 days', start: t1, end: t0};
			}

			{
				let t1=new Date();
				t1.setTime(t0.getTime()-1000*3600*24*120);
				vItems[vItems.length]={id: 'Recent120d', cap: 'Recent 120 days', start: t1, end: t0};
			}

			{
				let t1=new Date();
				t1.setTime(t0.getTime()-1000*3600*24*150);
				vItems[vItems.length]={id: 'Recent150d', cap: 'Recent 150 days', start: t1, end: t0};
			}

			{
				let t1=new Date();
				t1.setTime(t0.getTime()-1000*3600*24*180);
				vItems[vItems.length]={id: 'Recent180d', cap: 'Recent 180 days', start: t1, end: t0};
			}

			{
				let t1=new Date();
				t1.setTime(t0.getTime()-1000*3600*24*200);
				vItems[vItems.length]={id: 'Recent200d', cap: 'Recent 200 days', start: t1, end: t0};
			}

			{
				let t1=new Date();
				t1.setTime(t0.getTime()-1000*3600*24*250);
				vItems[vItems.length]={id: 'Recent250d', cap: 'Recent 250 days', start: t1, end: t0};
			}

			{
				let t1=new Date();
				t1.setTime(t0.getTime()-1000*3600*24*300);
				vItems[vItems.length]={id: 'Recent300d', cap: 'Recent 300 days', start: t1, end: t0};
			}

			{
				let t1=new Date();
				t1.setTime(t0.getTime()-1000*3600*24*365);
				vItems[vItems.length]={id: 'Recent365d', cap: 'Recent 365 days', start: t1, end: t0};
			}

			let vDisp=[], n=1;
			for(let i in vItems){
				let t=vItems[i];
				vDisp[vDisp.length]=_lc('Info.SearchForm.Period.'+t.id, t.cap); //''+n+'. '+t.cap
				n++;
			}

			let sCfgKey1='ListRecent.iDateRange';
			let vFields = [
				{sField: 'combolist', sLabel: _lc2('LastModified', 'Last modified in the date period:'), vItems: vDisp, sInit: localStorage.getItem(sCfgKey1)||''}
				, {sField: 'label', sText: _lc2('MoreOpts', 'For more specific time periods, use the Advanced Search Form.'), bWordWrap:  true}
			];

			let vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 400, vMargins: [8, 0, 30, 0], bVert: true});
			if(vRes && vRes.length>0){

				let iSel=vRes[0];

				let t=vItems[iSel]; logd('Query for entries modified in: ' + t.cap + '; startDate=' + t.start.toDateString() + ', endDate=' + t.end.toDateString());

				localStorage.setItem(sCfgKey1, iSel);

				//plugin.initProgressRange(plugin.getScriptTitle(), 0);

				//let _srcfn_of_shortcut=function(xDb, sSsgFn){
				//	let sSrcFn='';
				//	let xTmpFn=new CLocalFile(platform.getTempFile()); plugin.deferDeleteFile(xTmpFn.toStr());
				//	if(xDb.exportFile(sSsgFn, xTmpFn.toStr())>0){
				//		let vLines=(xTmpFn.toStr().loadText()||'').split('\n');
				//		for(let i in vLines){
				//			let sLine=_trim(vLines[i]), sKey='url=file://';
				//			if(sLine.toLowerCase().indexOf(sKey)==0){
				//				let sSrc=sLine.substr(sKey.length);
				//				if(sSrc){
				//					sSrcFn=sSrc;
				//					break;
				//				}
				//			}
				//		}
				//	}
				//	xTmpFn.remove();
				//	return sSrcFn;
				//};

				let _compare=function(t1, t2){
					let y1=t1.getFullYear(), m1=t1.getMonth(), d1=t1.getDate();
					let y2=t2.getFullYear(), m2=t2.getMonth(), d2=t2.getDate();
					if(y1 === y2){
						if(m1 === m2){
							if(d1 === d2){
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

				let _match=function(tMod){
					let t=vItems[iSel];
					if(_compare(tMod, t.start)>=0 && _compare(tMod, t.end)<=0){
						return true;
					}else{
						return false;
					}
				};

				plugin.showResultsPane(true, true); //make sure the Query-results window is open and cleared;
				plugin.beginUpdateResultsList(plugin.getScriptTitle()+'  '+vDisp[iSel], true);

				let sCurItem=plugin.getCurInfoItem();
				let sPathRoot=plugin.getDefRootContainer();
				let sPathToScan=sPathRoot;

				let nFolders=0;

				//To estimate the progress range;
				xNyf.traverseOutline(sPathToScan, false, function(){
					nFolders++;
				});

				plugin.initProgressRange(plugin.getScriptTitle(), nFolders);

				let nFound=0;
				let _act_on_treeitem=function(sSsgPath, iLevel){

					if(xNyf.folderExists(sSsgPath)){

						let sTitle=xNyf.getFolderHint(sSsgPath); if(!sTitle) sTitle='== Untitled ==';
						let bContinue=plugin.ctrlProgressBar(sTitle, 1, true);
						if(!bContinue) return true;

						let tMod=xNyf.getModifyTime(sSsgPath);
						if(_match(tMod)){
								//let sLine=xNyf.getDbFile()+'\t'+sSsgPath+'\t';
								plugin.appendToResults(xNyf.getDbFile(), sSsgPath, '', '');
						}

						let vFiles=xNyf.listFiles(sSsgPath);
						for(let i in vFiles){
							let sName=vFiles[i];
							let xSsgFn=new CLocalFile(sSsgPath, sName);

							tMod=xNyf.getModifyTime(xSsgFn.toStr());
							if(xNyf.isShortcut(xSsgFn.toStr())){
								let sSrcFn=xNyf.getShortcutFile(xSsgFn.toStr(), true);
								let xSrcFn=new CLocalFile(sSrcFn);
								if(xSrcFn.exists()){
									tMod=xSrcFn.getModifyTime();
								}
							}

							if(_match(tMod)){
									//let sLine=xNyf.getDbFile()+'\t'+sSsgPath+'\t'+sName;
									plugin.appendToResults(xNyf.getDbFile(), sSsgPath, sName, '');
									nFound++;
							}
						}
					}
				};

				xNyf.traverseOutline(sPathToScan, false, _act_on_treeitem);

				plugin.endUpdateResultsList('', true);

			}
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	alert(e);
//}
