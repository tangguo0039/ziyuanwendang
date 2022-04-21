
//sValidation=nyfjs
//sCaption=Export files to folder ...
//sHint=Export all text contents and attachments under current branch to a specified folder
//sCategory=MainMenu.Share
//sCondition=CURDB; OUTLINE; CURINFOITEM
//sID=p.ExportFilesToDir
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

//4:43 PM 7/5/2010 this utility traverses the current branch
//and exports all attached files to a specified disk folder.

//try{

	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		if(plugin.isContentEditable()) plugin.commitCurrentChanges();

		var sCfgKey='ExportFilesToDir.sPathDst';
		var sDstDir=platform.browseForFolder(_lc2('DstPath', 'Select a destination folder'), localStorage.getItem(sCfgKey));

		if(sDstDir){

			localStorage.setItem(sCfgKey, sDstDir);

			var sCurItem=plugin.getCurInfoItem(-1);

			var sItemTitle=xNyf.getFolderHint(sCurItem); if(!sItemTitle) sItemTitle='== Untitled ==';

			var nFolders=0;

			//To estimate the progress range;
			//xNyf.traverseOutline(sCurItem, true, function(){
			//	nFolders++;
			//});

			plugin.initProgressRange(plugin.getScriptTitle(), nFolders);

			var vFails=[];

			var _validate_filename=function(sFn){
				sFn=sFn.replace(/[\*\?\.\(\)\[\]\{\}\<\>\\\/\!\$\^\&\+\|,;:\"\'`~@]/g, ' ');
				sFn=sFn.replace(/\s{2,}/g, ' ');
				sFn=sFn.replace(/\s/g, '_');
				if(sFn.length>128) sFn=sFn.substr(0, 128);
				sFn=_trim(sFn);
				return sFn;
			};

			var vDiskFiles=[];
			var _act_on_treeitem=function(sSsgPath, iLevel){

				if(xNyf.folderExists(sSsgPath)){

					var sTitle=xNyf.getFolderHint(sSsgPath); //if(!sTitle) sTitle='Untitled';

					var bContinue=plugin.ctrlProgressBar(sTitle||'Untitled', 1, true);
					if(!bContinue) return true;

					var sBaseName=_validate_filename(sTitle);
					var sCal=plugin.getCalendarAttr(-1, sSsgPath)||'';
					if(sCal){
						//2013.11.27 the calendar info is structured in the form:
						//ID-of-SsgPath \t StartDate \t EndDate \t iRepeat \t iReminder \t LastRemindDate
						//0	2013-11-27	2013-11-30	1	0	0-0-0
						var v=sCal.split('\t');
						if(v && v.length>1){
							sCal=v[1];
						}
					}

					var vFiles=xNyf.listFiles(sSsgPath), nUntitled=0;
					for(var i in vFiles){
						var sFn=vFiles[i];
						var xSrc=new CLocalFile(sSsgPath, sFn);
						if(xNyf.isShortcut(xSrc.toStr())){
							var sDskFn=xNyf.getShortcutFile(xSrc.toStr(), true);
							if(sDskFn && vDiskFiles.indexOf(sDskFn)<0){
								vDiskFiles.push(sDskFn);
							}
						}else{
							var sExt=xSrc.getSuffix(true);
							if(plugin.isReservedNoteFn(sFn)){
								if(sCal){
									//2013.11.27 consider adding calendar info into file names;
									sCal=sCal.replace(/[\/\:\!\?\*\\]/g, '-');
									sFn=sCal;
									if(sBaseName){
										sFn+='_';
										sFn+=sBaseName;
									}
								}else{
									if(sBaseName){
										sFn=sBaseName;
									}else{
										sFn='untitled_'+nUntitled;
										nUntitled++;
									}
								}
								if(sFn){
									if(sExt==='.qrich') sExt+='.html';
									sFn+=sExt;
								}
							}
							if(sFn){
								var xDst=new CLocalFile(sDstDir, sFn);
								var bOverwrite=true;
								if(xDst.exists()){
									bOverwrite=confirm(_lc2('Overwrite', 'The file already exists. Overwrite it?')+'\n\n'+xDst.toStr());
								}
								if(bOverwrite){
									if(xNyf.exportFile(xSrc.toStr(), xDst.toStr())<0){
										vFails[vFails.length]=sFn;
									}
								}
							}
						}
					}
				}
			};

			xNyf.traverseOutline(sCurItem, true, _act_on_treeitem);

			if(vDiskFiles.length>0){
				var bCopyLinkedFiles=confirm(_lc2('CopyLinkedFiles', 'Also exporting files linked by shortcuts; Proceed?')+'\n\n'+vDiskFiles.join('\n'));
				if(bCopyLinkedFiles){
					for(var i=0; i<vDiskFiles.length; ++i){

						var xSrc=new CLocalFile(vDiskFiles[i]), sName=xSrc.getLeafName();
						var xDst=new CLocalFile(sDstDir, sName);

						var bOverwrite=true;
						if(xDst.exists()){
							bOverwrite=confirm(_lc2('Overwrite', 'The file already exists. Overwrite it?')+'\n\n'+xDst.toStr());
						}

						if(bOverwrite){
							//If a file with the file already exists, copy() returns false (i.e., copyTo() will not overwrite files).
							xDst.remove('rightNow');
							var bSucc=xSrc.copyTo(sDstDir, sName);
							if(!bSucc) vFails.push(xSrc.toStr());
						}
					}
				}
			}

			if(vFails.length>0){
				alert(_lc2('Failure', 'Failed to export the following files;')+'\n\n'+vFails.join('\n'));
			}else{
				alert(_lc2('Done', 'Successfully exported files to the folder.') + '\n\n' + sDstDir);
			}
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	alert(e);
//}
