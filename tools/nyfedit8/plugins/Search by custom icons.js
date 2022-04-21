
//sValidation=nyfjs
//sCaption=Search by custom icons ...
//sHint=Search for info items having a specified custom icon
//sCategory=MainMenu.Search
//sCondition=CURDB
//sID=p.SearchIcons
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

		var vIcons=[], vLabels=[];
		{
			var sRoot=plugin.getDefRootContainer();
			var vFiles=xNyf.listFiles(sRoot), nMaxID=0;
			for(var j in vFiles){
				var xSsgFn=new CLocalFile(sRoot); xSsgFn.append(vFiles[j]);
				//if(xSsgFn.getExtension(false)==='bmp'){
				if(xSsgFn.getExtension(false).search(/^(bmp|jpg|jpeg|png|gif|tif|svg)$/i)>=0){
					var nIconID=parseInt(xSsgFn.getTitle()||'', 16);
					if(nIconID>=0){
						//var sHint=xNyf.getFileHint(xSsgFn)||('Untitled-'+nIconID);
						var sHint=xNyf.getFileHint(xSsgFn.toStr())||_lc2('Untitled', 'Untitled');
						vIcons[vIcons.length]={nIconID: nIconID, sHint: sHint};
						if(nMaxID<nIconID) nMaxID=nIconID;
					}
				}
			}

			vIcons.sort(function(x, y){
				return x.sHint>y.sHint ? 1 : -1;
			});

			var nDigits=0;
			do{
				nMaxID=Math.floor(nMaxID/10);
				nDigits++;
			}while(nMaxID>=1);

			vIcons.splice(0, 0, {nIconID: -1, sHint: _lc2('Default', 'Default Icon')});

			//for(var j in vIcons){
			//	var d=vIcons[j];
			//	var sID=''+d.nIconID; if(d.nIconID<0) sID='0';
			//	var nPadding=nDigits-sID.length;
			//	while(nPadding-->0) sID='0'+sID;
			//	vLabels[vLabels.length]='#'+sID+': '+d.sHint;
			//}

			for(var j in vIcons){
				var d=vIcons[j];
				vLabels[vLabels.length]=d.sHint;
			}
		}

		if(vLabels.length>0){

			var _pos_of=function(nID){
				var iPos=-1;
				for(var j in vIcons){
					if(vIcons[j].nIconID===nID){
						iPos=j;
					}
					iPos=-1;
				}
				return iPos;
			};

			var _id_of=function(iPos){
				var nID=-1;
				if(iPos>=0 && iPos<vIcons.length){
					nID=vIcons[iPos].nIconID;
				}
				return nID;
			};

			var vRange=[
				  _lc('p.Common.CurBranch', 'Current branch')
				, _lc('p.Common.CurDB', 'Current database')
				];

			var sCfgKey1='SearchIcons.iIcon', sCfgKey2='SearchIcons.iRange';
			var vFields = [
				{sField: "combolist", sLabel: _lc2('Icon', 'Icon'), vItems: vLabels, sInit: localStorage.getItem(sCfgKey1)||''}
				, {sField: "combolist", sLabel: _lc('p.Common.Range', 'Range'), vItems: vRange, sInit: localStorage.getItem(sCfgKey2)||''}
			];

			var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 400, vMargins: [8, 0, 30, 0]});
			if(vRes && vRes.length>=2){

				var iIcon=vRes[0], iRange=vRes[1];

				localStorage.setItem(sCfgKey1, iIcon);
				localStorage.setItem(sCfgKey2, iRange);

				var nIconID2Find=_id_of(iIcon);


				plugin.initProgressRange(plugin.getScriptTitle(), 0);

				var mToScan={};

				var _push=function(i, p, n){
					var v=mToScan[i];
					if(!v) v=mToScan[i]=[];
					v[v.length]={sSsgPath: p, sSsgName: n};
				};

				var bBranch=(iRange===0);
				var sCurItem=bBranch ? plugin.getCurInfoItem() : plugin.getDefRootContainer();
				if(!sCurItem){
					sCurItem=plugin.getDefRootContainer();
					bBranch=false;
				}

				var iDbPos=plugin.getCurDbIndex();
				xNyf.traverseOutline(sCurItem, bBranch, function(sSsgPath, iLevel){

					var sTitle=xNyf.getFolderHint(sSsgPath); if(!sTitle) sTitle='Untitled';

					var bContinue=plugin.ctrlProgressBar(sTitle, 1, true);
					if(!bContinue) return true;

					_push(iDbPos, sSsgPath, '');
				});

				plugin.showResultsPane(true, true);
				plugin.beginUpdateResultsList(plugin.getScriptTitle()+'  ['+vLabels[iIcon]+']', true);

				var nFound=0;
				for(var iDbPos in mToScan){
					var vII=mToScan[iDbPos];
					if(vII.length>0){
						var xDb=new CNyfDb(parseInt(iDbPos)), sDbid=xDb.getDbFile();
						for(var i in vII){
							var xII=vII[i];
							var sSsgPath=xII.sSsgPath, sSsgName=xII.sSsgName, sTitle=xDb.getFolderHint(sSsgPath)||'';

							var bContinue=plugin.ctrlProgressBar(sTitle||'Untitled', 1, true);
							if(!bContinue) break;

							var nIconID=xNyf.getAppDataOfEntryByPos(sSsgPath, 0, -1);

							//if(nIconID>=0 && nIconID==nIconID2Find){
							if(nIconID===nIconID2Find){ //2014.12.9 defaults: -1;
								plugin.appendToResults(xDb.getDbFile(), sSsgPath, sSsgName, '');
								nFound++;
							}
						}
					}
				}

				plugin.endUpdateResultsList('', true);

			}
		}else{
			alert(_lc2('NoIcons', 'No custom icons available to search.'));
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	alert(e);
//}
