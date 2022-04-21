
//sValidation=nyfjs
//sCaption=List attachments/shortcuts ...
//sHint=List all attachments/shortcuts stored in database
//sCategory=MainMenu.Search
//sCondition=CURDB; CURINFOITEM; OUTLINE
//sID=p.ListAttachments
//sAppVerMin=8.0
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

		var sCurItem=plugin.getCurInfoItem();
		var sPathRoot=plugin.getDefRootContainer();

		var vTarget=[
			  _lc2('Attachments', 'Attachments')
			  , _lc2('Shortcuts', 'Shortcuts')
			  , _lc2('AllFiles', 'Both attachments and shortcuts')
			];

		var vRange=[
			  _lc('p.Common.CurBranch', 'Current branch')
			, _lc('p.Common.CurDB', 'Current database')
			];

		var sCfgKey1='ListAttachments.iTarget', sCfgKey2='ListAttachments.iRange';
		var vFields = [
			{sField: "combolist", sLabel: _lc2('Target', 'Target'), vItems: vTarget, sInit: localStorage.getItem(sCfgKey1)||''}
			, {sField: "combolist", sLabel: _lc('p.Common.Range', 'Range'), vItems: vRange, sInit: localStorage.getItem(sCfgKey2)||''}
		];

		var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 400, vMargins: [2, 0, 30, 0]});
		if(vRes && vRes.length>=2){

			var iTarget=vRes[0], iRange=vRes[1];

			localStorage.setItem(sCfgKey1, iTarget);
			localStorage.setItem(sCfgKey2, iRange);

			var bInclAttach=(iTarget===0 || iTarget===2);
			var bInclShortcut=(iTarget===1 || iTarget===2);
			var bCurBranch=(iRange===0);
			var bCurDb=(iRange===1);

			var sHint='Listing'+' '+vTarget[iTarget]+' '+'in'+' '+vRange[iRange];

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
			plugin.beginUpdateResultsList(sHint, true);

			var nFound=0;
			var _act_on_treeitem=function(sSsgPath, iLevel){

				if(xNyf.folderExists(sSsgPath)){

					var sTitle=xNyf.getFolderHint(sSsgPath); if(!sTitle) sTitle='Untitled';
					var bContinue=plugin.ctrlProgressBar(sTitle, 1, true);
					if(!bContinue) return true;

					var vFiles=xNyf.listFiles(sSsgPath);
					for(var i in vFiles){
						var sName=vFiles[i];
						if(!plugin.isReservedNoteFn(sName)){
							var xSsgFn=new CLocalFile(sSsgPath, sName);
							var sLine=xNyf.getDbFile()+'\t'+sSsgPath+'\t'+sName;
							if(xNyf.isShortcut(xSsgFn.toStr())){
								if(bInclShortcut){
									plugin.appendToResults(xNyf.getDbFile(), sSsgPath, sName);
									nFound++;
								}
							}else{
								if(bInclAttach){
									plugin.appendToResults(xNyf.getDbFile(), sSsgPath, sName);
									nFound++;
								}
							}
						}
					}
				}
			};

			xNyf.traverseOutline(sPathToScan, bStartFromItem, _act_on_treeitem);

			plugin.endUpdateResultsList('', true);

		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	alert(e);
//}
