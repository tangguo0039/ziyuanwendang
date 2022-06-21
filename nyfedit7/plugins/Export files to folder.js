
//sValidation=nyfjs
//sCaption=Export files to folder ...
//sHint=Export all text notes and attachments under current branch into a directory
//sCategory=MainMenu.Tools
//sID=p.ExportFilesToDir
//sAppVerMin=7.0
//sShortcutKey=
//sAuthor=wjjsoft

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

//4:43 PM 7/5/2010 this utility traverses the current branch
//and exports all attached files to a specified disk folder.

try{

	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		var sCfgKey='ExportFilesToDir.sPathDst';
		var sDstDir=platform.browseForFolder(_lc2('SelDest', 'Select a destination folder to store the files'), localStorage.getItem(sCfgKey));

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

			var vFails=[], sDefFn=plugin.getDefNoteFn();

			var _validate_filename=function(sFn){
				sFn=sFn.replace(/[\*\?\.\(\)\[\]\{\}\<\>\\\/\!\$\^\&\+\|,;:\"\'`~@]/g, ' ');
				sFn=sFn.replace(/\s{2,}/g, ' ');
				sFn=sFn.replace(/\s/g, '_');
				if(sFn.length>128) sFn=sFn.substr(0, 128);
				sFn=_trim(sFn);
				return sFn;
			};

			var _act_on_treeitem=function(sSsgPath, iLevel){

				if(xNyf.folderExists(sSsgPath, false)){

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
						var xSrc=new CLocalFile(sSsgPath); xSrc.append(sFn);
						var xDst=new CLocalFile(sDstDir);
						if(sFn==sDefFn){
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
								}
							}
							if(sFn) sFn+='.html';
						}
						if(sFn){
							xDst.append(sFn);
							var bOW=true;
							if(xDst.exists()){
								bOW=confirm(_lc2('Overwrite', 'The file already exists. Overwrite it?')+'\n\n'+xDst);
							}
							if(bOW){
								if(xNyf.exportFile(xSrc, xDst)<0){
									vFails[vFails.length]=sFn;
								}
							}
						}
					}
				}
			};

			xNyf.traverseOutline(sCurItem, true, _act_on_treeitem);

			if(vFails.length>0){
				alert(_lc2('Failure', 'Failed to export the following files;')+'\n\n'+vFails);
			}
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

}catch(e){
	alert(e);
}
