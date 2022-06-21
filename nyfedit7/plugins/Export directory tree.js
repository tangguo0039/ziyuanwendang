
//sValidation=nyfjs
//sCaption=Export directory tree ...
//sHint=Export the current branch as directory tree
//sCategory=MainMenu.Tools
//sID=p.ExportDirTree
//sAppVerMin=7.0
//sShortcutKey=
//sAuthor=wjjsoft

//4:43 PM 12/21/2010 this utility exports the current branch as a directory tree on disk.
//	Notes:
//	0. Each info item creates a sub directory, in which the attachments are exported and saved.
//	1. Default RTF text of each info items are saved in the specific file named with 'defnote.rtf';
//	2. Shortcuts are ignored while exporting attachments.


//10:41 AM 12/23/2010 defines a filename to save default text notes of each info items. (*customizable*)
var sRenameDefNote='defnote.html';

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

try{

	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		var sCfgKey='ExportDirTree.sDestDir';
		var sDstDir=platform.browseForFolder(_lc2('SelDest', 'Select the destination directory'), localStorage.getItem(sCfgKey));

		if(sDstDir){

			localStorage.setItem(sCfgKey, sDstDir);

			var vSelItems=plugin.getSelectedInfoItems(-1);

			plugin.initProgressRange(plugin.getScriptTitle(), 0);

			var _validate_dir=function(s){
				s=s||'';
				s=s.replace(/[\*\?\.\(\)\[\]\{\}\<\>\\\/\!\$\^\&\+\|,;:\"\'`~@]/g, ' ');
				s=s.replace(/\s{2,}/g, ' ');
				s=_trim(s);
				if(s.length>64) s=s.substr(0, 64);
				s=_trim(s);
				s=s.replace(/\s/g, '_');
				return s;
			};

			var _unique_name=function(sDir, sName){
				var sRes=sName, xFn=new CLocalFile(sDir); xFn.append(sRes);
				while(xFn.exists()){
					sRes=sName+'-'+Math.round(Math.random()*1000);
					xFn=new CLocalFile(sDir); xFn.append(sRes);
				}
				return sRes;
			};

			var vCurDir=[sDstDir], vFails=[], sDefNoteFn=plugin.getDefNoteFn(), nFolders=0, nFiles=0;
			var _act_on_treeitem=function(sSsgPath, iLevel){
				var sDir=(iLevel>=0 && iLevel<vCurDir.length) ? vCurDir[iLevel] : '';
				if(xNyf.entryExists(sSsgPath, false)){

					var sTitle=xNyf.getFolderHint(sSsgPath); if(!sTitle) sTitle='Untitled';

					//2014.5.7 consider the calendar date while exporting dir tree;
					var sCal=plugin.getCalendarAttr(-1, sSsgPath)||'';
					if(sCal){
						//2013.11.27 the calendar info is structured in the form:
						//ID-of-SsgPath \t StartDate \t EndDate \t iRepeat \t iReminder \t LastRemindDate
						//0	2013-11-27	2013-11-30	1	0	0-0-0
						var v=sCal.split('\t');
						if(v && v.length>1){
							sCal=v[1];
						}
						if(sCal){
							//sTitle += ' _' + sCal;
							sTitle = sCal + ' _' + sTitle; //put the date in front of item title;
						}
					}

					var bContinue=plugin.ctrlProgressBar(sTitle, 1, true);
					if(!bContinue) return true;

					var sSub=_validate_dir(sTitle);
					sSub=_unique_name(sDir, sSub);

					var xDir=new CLocalDir(sDir);
					if(xDir.exists() && xDir.createDirectory(sSub)){
						xDir.append(sSub);
						nFolders++;
						vCurDir[iLevel+1]=xDir.toString();
						var vFiles=xNyf.listFiles(sSsgPath);
						for(var i in vFiles){
							var sFn=vFiles[i];
							var xSrc=new CLocalFile(sSsgPath); xSrc.append(sFn);
							if(!xNyf.isShortcut(xSrc)){
								var sFn2=(sFn==sDefNoteFn) ? sRenameDefNote : sFn;
								sFn2=_unique_name(xDir, sFn2);
								var xDst=new CLocalFile(xDir); xDst.append(sFn2);
								if(xNyf.exportFile(xSrc, xDst)<0){
									vFails[vFails.length]=sFn;
								}else{
									nFiles++;
								}
							}
						}
					}
				}
			};

			var vSucc=[];
			for(var i in vSelItems){
				var sSsgPath=vSelItems[i];
				if(sSsgPath){
					var sTitle=xNyf.getFolderHint(sSsgPath); if(!sTitle) sTitle='......';
					vCurDir=[sDstDir];
					xNyf.traverseOutline(sSsgPath, true, _act_on_treeitem);
					vSucc.push(sTitle);
				}
			}

			plugin.destroyProgressBar();
			if(vFails.length>0){
				alert(_lc2('Failure', 'Failed to export the following files.')+'\n\n'+vFails);
			}else{
				var sMsg=_lc2('Done', 'Successfully exported the currently selected branch(es) as directories.');
				sMsg+='\n\n[ '+sDstDir+' ]\n';
				for(var i in vSucc){
					sMsg+='\n' + vSucc[i];
				}
				alert(sMsg);
			}
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

}catch(e){
	alert(e);
}
