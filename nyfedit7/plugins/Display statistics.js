
//sValidation=nyfjs
//sCaption=Display statistics ...
//sHint=Display statistics for current branch of outline
//sCategory=MainMenu.Tools
//sID=p.BranchStats
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

		if(plugin.getCurNavigationTab()=='Outline'){

			var sCurItem=plugin.getCurInfoItem();
			if(sCurItem){

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

				var nFolders=0;

				plugin.initProgressRange('Retrieving');

				//To estimate the progress range;
				xNyf.traverseOutline(sCurItem, true, function(sSsgPath, iLevel){
					plugin.ctrlProgressBar(sSsgPath, 1, true);
					nFolders++;
				});

				plugin.initProgressRange(plugin.getScriptTitle(), nFolders);

				var xBytes=undefined, xCount=undefined;
				var nBytes=0, nFiles=0, nSymlinks=0, nShortcuts=0, nSizeOfShortcuts=0;

				var _act_on_treeitem=function(sSsgPath, iLevel){

					if(xNyf.folderExists(sSsgPath, false)){

						var sTitle=xNyf.getFolderHint(sSsgPath); if(!sTitle) sTitle='== Untitled ==';

						plugin.ctrlProgressBar(sTitle, 1, true);

						//var bContinue=plugin.ctrlProgressBar(sTitle, 1, true);
						//if(!bContinue) return true;

						var sSymDst=xNyf.getSymlinkDestination(sSsgPath); //plugin.getSymlinkDestination(-1, sSsgPath, false);
						if(sSymDst && sSymDst!=sSsgPath) nSymlinks++;

						var vFiles=xNyf.listFiles(sSsgPath);
						for(var i in vFiles){
							var sName=vFiles[i];
							var xSsgFn=new CLocalFile(sSsgPath); xSsgFn.append(sName);
							if(xNyf.isShortcut(xSsgFn)){
								nShortcuts++;
								var sSrcFn=_srcfn_of_shortcut(xNyf, xSsgFn);
								var xSrcFn=new CLocalFile(sSrcFn);
								nSizeOfShortcuts+=xSrcFn.getFileSize();
							}else{
								var sExt=(xSsgFn.getExtension()||'.').toLowerCase();
								var nSize=xNyf.getFileSize(xSsgFn, false);
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

				try{
					xNyf.traverseOutline(sCurItem, true, _act_on_treeitem);
				}catch(e){
					//user aborted;
				}

				var s='';
				
				s+=_lc2('InfoItems', 'Info items') + ': ' + nFolders;
				s+='\n' + _lc2('SymLinks', 'Symbolic links') + ': ' + nSymlinks;

				s+='\n';
				s+='\n' + _lc2('Attachments', 'Attachments') + ': ' + nFiles + ', ' + _lc2('Bytes', 'Bytes') + ': ' + nBytes;

				if(nShortcuts>0){
					s+='\n' + _lc2('Shortcuts', 'Shortcuts') + ': ' + nShortcuts + ', ' + _lc2('Bytes', 'Bytes') + ': ' + nSizeOfShortcuts;
				}

				if(xBytes && xCount){
					s+='\n\n' + _lc2('Type', 'Type') + ' \t' + _lc2('Files', 'Files') + ' \t' + _lc2('Bytes', 'Bytes');
					for(var sExt in xBytes){
						var nCount=xCount[sExt], nBytes=xBytes[sExt];
						s+='\n' + sExt + '\t' + nCount + ' \t' + nBytes + '';
					}
				}

				plugin.destroyProgressBar();
				//alert(s);
				textbox(
					{
						sTitle: plugin.getScriptTitle()
						, sDescr: _lc2('Descr', 'Statistics on entries in the current branch;')
						, sDefTxt: s
						, bReadonly: true
						, bWordwrap: false
						, nWidth: 30
						, nHeight: 60
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
	alert(e);
}
