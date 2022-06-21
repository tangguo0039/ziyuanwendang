
//sValidation=nyfjs
//sCaption=Search by custom icons ...
//sHint=Search for info items having a specified custom icon
//sCategory=MainMenu.Search
//sID=p.SearchIcons
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

		var vIcons=[], vLabels=[];
		{
			var sRoot=plugin.getDefRootContainer();
			var vFiles=xNyf.listFiles(sRoot), nMaxID=0;
			for(var j in vFiles){
				var xSsgFn=new CLocalFile(sRoot); xSsgFn.append(vFiles[j]);
				if(xSsgFn.getExtension()=='.bmp'){
					var nIconID=parseInt(xSsgFn.getTitle()||'', 16);
					if(nIconID>=0){
						//var sHint=xNyf.getFileHint(xSsgFn)||('Untitled-'+nIconID);
						var sHint=xNyf.getFileHint(xSsgFn)||_lc2('Untitled', 'Untitled');
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

			for(var j in vIcons){
				var d=vIcons[j];
				var sID=''+d.nIconID; if(d.nIconID<0) sID='0';
				var nPadding=nDigits-sID.length;
				while(nPadding-->0) sID='0'+sID;
				vLabels[vLabels.length]='#'+sID+': '+d.sHint;
			}
		}

		if(vLabels.length>0){

			var _pos_of=function(nID){
				var iPos=-1;
				for(var j in vIcons){
					if(vIcons[j].nIconID==nID){
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

			var sCfgKey='SearchIcons.iIcon';
			var sMsg=_lc2('SelIcon', 'Select a custom icon by its label text from within the dropdown list');
			var iIconSel=dropdown(sMsg, vLabels, 0);
			if(iIconSel>=0){

				localStorage.setItem(sCfgKey, _id_of(iIconSel));

				var iIcon2Find=_id_of(iIconSel);

				var vActs=[
					  _lc2('InBranch', '1. Search the current branch')
					, _lc2('InDatabase', '2. Search the whole database')
					];

				sCfgKey='SearchIcons.iScope';
				sMsg=_lc('p.Common.SelAction', 'Please select an action from within the dropdown list');
				var iSel=dropdown(sMsg, vActs, localStorage.getItem(sCfgKey));
				if(iSel>=0){

					localStorage.setItem(sCfgKey, iSel);

					plugin.initProgressRange(plugin.getScriptTitle(), 0);

					var mToScan={};
					var sDefNoteFn=plugin.getDefNoteFn();

					var _push=function(i, p, n){
						var v=mToScan[i];
						if(!v) v=mToScan[i]=[];
						v[v.length]={sSsgPath: p, sSsgName: n};
					};

					switch(iSel){
						case 0:
						case 1:
						{
							var bBranch=(iSel==0), sCurItem=bBranch ? plugin.getCurInfoItem() : plugin.getDefRootContainer();
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

							break;
						}
					}

					plugin.showResultsPane(true, true);
					plugin.setResultsPaneTitle(plugin.getScriptTitle()+'  ['+vLabels[iIconSel]+']');

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

								var iIcon=xNyf.getAppDataOfEntryByPos(sSsgPath, 0, -1);

								//if(iIcon>=0 && iIcon==iIcon2Find){
								if(iIcon==iIcon2Find){ //2014.12.9 defaults: -1;
									plugin.appendToResults(xDb.getDbFile(), sSsgPath, sSsgName, '');
									nFound++;
								}
							}
						}
					}

					plugin.setResultsPaneTitle(plugin.getScriptTitle()+'  ['+vLabels[iIconSel]+'] '+_lc('p.Common.Found', 'Found: (%nFound%)').replace(/%nFound%/g, ''+nFound));
				}
			}
		}else{
			alert(_lc2('NoIcons', 'No custom icons available to search.'));
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

}catch(e){
	alert(e);
}
