
//sValidation=nyfjs
//sCaption=List attachments/shortcuts ...
//sHint=List all attachments/shortcuts stored in database
//sCategory=MainMenu.Search
//sID=p.ListAttachments
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

		var sCurItem=plugin.getCurInfoItem();
		var sPathRoot=plugin.getDefRootContainer();
		var sDefNoteFn=plugin.getDefNoteFn();

		var vActs=[
			  _lc2('BranchAttach', 'List attachments only, within current branch')
			, _lc2('BranchShortcut', 'List shortcuts only, within current branch')
			, _lc2('BranchAll', 'List attachments and shortcuts, within current branch')
			, _lc2('DbAttach', 'List attachments only, within current database')
			, _lc2('DbShortcut', 'List shortcuts only, within current database')
			, _lc2('DbAll', 'List attachments and shortcuts, within current database')
			];

		var sCfgKey='ListAttachments.iAction';
		var sMsg=_lc('p.Common.SelAction', 'Please select an action from within the dropdown list');
		var iSel=dropdown(sMsg, vActs, localStorage.getItem(sCfgKey));
		if(iSel>=0){

			localStorage.setItem(sCfgKey, iSel);

			var bInclAttach=(iSel==0 || iSel==2 || iSel==3 || iSel==5);
			var bInclShortcut=(iSel==1 || iSel==2 || iSel==4 || iSel==5);
			var bCurBranch=(iSel==0|| iSel==1 || iSel==2);
			var bCurDb=(iSel==3|| iSel==4 || iSel==5);

			var sPathToScan=sCurItem, bStartFromItem=true;
			if(bCurDb){
				sPathToScan=sPathRoot;
				bStartFromItem=false;
			}

			var nFolders=0;

			//To estimate the progress range;
			xNyf.traverseOutline(sPathToScan, true, function(){
				nFolders++;
			});

			plugin.initProgressRange(plugin.getScriptTitle(), nFolders);

			plugin.showResultsPane(true, true);
			plugin.setResultsPaneTitle(vActs[iSel]);

			var nFound=0;
			var _act_on_treeitem=function(sSsgPath, iLevel){

				if(xNyf.folderExists(sSsgPath, false)){

					var sTitle=xNyf.getFolderHint(sSsgPath); if(!sTitle) sTitle='Untitled';
					var bContinue=plugin.ctrlProgressBar(sTitle, 1, true);
					if(!bContinue) return true;

					var vFiles=xNyf.listFiles(sSsgPath);
					for(var i in vFiles){
						var sName=vFiles[i];
						if(sName!=sDefNoteFn){
							var xSsgFn=new CLocalFile(sSsgPath); xSsgFn.append(sName);
							var sLine=xNyf.getDbFile()+'\t'+sSsgPath+'\t'+sName;
							if(xNyf.isShortcut(xSsgFn)){
								if(bInclShortcut){
									plugin.appendToResults(xNyf.getDbFile(), sSsgPath, sName, '');
									nFound++;
								}
							}else{
								if(bInclAttach){
									plugin.appendToResults(xNyf.getDbFile(), sSsgPath, sName, '');
									nFound++;
								}
							}
						}
					}
				}
			};

			xNyf.traverseOutline(sPathToScan, bStartFromItem, _act_on_treeitem);

			plugin.setResultsPaneTitle(vActs[iSel] + ';  ' + _lc('p.Common.Found', 'Found: (%nFound%)').replace(/%nFound%/g, ''+nFound));

		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

}catch(e){
	alert(e);
}
