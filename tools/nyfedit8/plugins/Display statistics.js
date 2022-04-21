
//sValidation=nyfjs
//sCaption=Display statistics ...
//sHint=Display statistics for current branch of outline
//sCategory=MainMenu.Organize
//sCondition=CURDB; CURINFOITEM; OUTLINE
//sID=p.BranchStats
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

var _fixBigNum=function(n){return n.toString().replace(/^0+/, '')||'0';}

try{
	var xNyf=new CNyfDb(-1);

	if(xNyf.isOpen()){

		if(plugin.getCurNavigationTab()==='Outline'){

			var sCurItem=plugin.getCurInfoItem();
			if(sCurItem){

				var nFolders=0;

				plugin.initProgressRange('List info items');

				//To estimate the progress range;
				xNyf.traverseOutline(sCurItem, true, function(sSsgPath, iLevel){
					plugin.ctrlProgressBar(sSsgPath, 1, true);
					nFolders++;
				});

				plugin.initProgressRange(plugin.getScriptTitle(), nFolders);

				var xBytes=undefined, xCount=undefined;
				var nBytes=0, nFiles=0, nSymlinks=0, nShortcuts=0, nSizeOfShortcuts=0;

				var _act_on_treeitem=function(sSsgPath, iLevel){

					if(xNyf.folderExists(sSsgPath)){

						var sTitle=xNyf.getFolderHint(sSsgPath); if(!sTitle) sTitle='== Untitled ==';

						plugin.ctrlProgressBar(sTitle, 1, true);

						//var bContinue=plugin.ctrlProgressBar(sTitle, 1, true);
						//if(!bContinue) return true;

						var sSymDst=xNyf.getSymLinkDestination(sSsgPath); //plugin.getSymLinkDestination(-1, sSsgPath, false);
						if(sSymDst && sSymDst!==sSsgPath) nSymlinks++;

						var vFiles=xNyf.listFiles(sSsgPath);
						for(var i in vFiles){
							var sName=vFiles[i];
							var xSsgFn=new CLocalFile(sSsgPath, sName);
							if(xNyf.isShortcut(xSsgFn.toStr())){
								nShortcuts++;
								var bResolve=true, sSrcFn=xNyf.getShortcutFile(xSsgFn.toStr(), bResolve);
								if(sSrcFn){
									var xSrcFn=new CLocalFile(sSrcFn);
									nSizeOfShortcuts+=xSrcFn.getFileSize();
								}
							}else{
								var sExt=(xSsgFn.getExtension(false)||'.').toLowerCase();
								var nSize=xNyf.getFileSize(xSsgFn.toStr());
								if(!xBytes) xBytes={};
								if(!xCount) xCount={};
								if(!xBytes[sExt]) xBytes[sExt]=0;
								if(!xCount[sExt]) xCount[sExt]=0;
								xBytes[sExt]+=nSize; nBytes+=nSize;
								xCount[sExt]++; nFiles++;
							}
						}
					}
				};

				//try{
					xNyf.traverseOutline(sCurItem, true, _act_on_treeitem);
				//}catch(e){
					//user aborted;
				//}

				var s='';

				s+=_lc2('Location', 'Location') + ': '  + xNyf.getLocationText(sCurItem);
				s+='\n' + _lc2('SsgPath', 'SsgPath') + ': '  + sCurItem;
				
				s+='\n'
				s+='\n'+_lc2('InfoItems', 'Info items') + ': ' + nFolders;
				s+='\n' + _lc2('SymLinks', 'Symbolic links') + ': ' + nSymlinks;

				s+='\n';
				s+='\n' + _lc2('Attachments', 'Attachments') + ': ' + nFiles + ', ' + _lc2('Bytes', 'Bytes') + ': ' + _fixBigNum(nBytes);

				if(nShortcuts>0){
					s+='\n' + _lc2('Shortcuts', 'Shortcuts') + ': ' + nShortcuts + ', ' + _lc2('Bytes', 'Bytes') + ': ' + nSizeOfShortcuts;
				}

				if(xBytes && xCount){
					s+='\n\n' + _lc2('Type', 'Type') + ' \t' + _lc2('Files', 'Files') + ' \t' + _lc2('Bytes', 'Bytes');
					for(var sExt in xBytes){
						var nCount=xCount[sExt], nBytes=xBytes[sExt];
						s+='\n' + sExt + '\t' + nCount + ' \t' + _fixBigNum(nBytes) + '';
					}
				}

				plugin.destroyProgressBar();

				textbox(
					{
						sTitle: plugin.getScriptTitle()
						, sDescr: _lc2('Descr', 'Statistics on entries in the current branch;')
						, sDefTxt: s
						, bReadonly: true
						, bWordwrap: false
						, nWidth: 50
						, nHeight: 80
						, bFind: false
					}
				);

			}else{
				alert(_lc('Prompt.Warn.NoInfoItemSelected', 'No info item is currently selected.'));
			}

		}else{
			alert(_lc('Prompt.Warn.OutlineNotSelected', 'The outline tree view is currently not selected.'));
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

}catch(e){
	plugin.destroyProgressBar();
	alert(e);
}
