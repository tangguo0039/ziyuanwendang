
//sValidation=nyfjs
//sCaption=Import files as attachments ...
//sHint=Import local files as attachments, including accompanying images for HTML
//sCategory=MainMenu.Capture
//sCondition=CURDB; DBRW; OUTLINE; CURINFOITEM
//sID=p.ImportFilesAsAttachments
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

var _scale_file_size=function(n){
	var nKilo=1024;
	var nMega=nKilo*nKilo;
	var nGiga=nKilo*nKilo*nKilo;
	var s='';
	if(n>nGiga){
		s=''+Math.floor(n/nGiga*10)/10+' GiB';
	}else if(n>nMega){
		s=''+Math.floor(n/nMega*10)/10+' MiB';
	}else if(n>nKilo){
		s=''+Math.floor(n/nKilo*10)/10+' KiB';
	}else{
		s=''+n+' B';
	}
	return s;
};

//try{
	var xNyf=new CNyfDb(-1);

	if(xNyf.isOpen()){

		if(!xNyf.isReadonly(-1)){

			var sCfgKey1='ImportFilesAsAttachments.sDir';
			var vFiles=platform.getOpenFileNames({
				     sTitle: plugin.getScriptTitle()
				     , sInitDir: localStorage.getItem(sCfgKey1)||''
				     , sFilter: 'All files (*);;HTML documents (*.htm *.html);;Text files (*.rtf *.txt);;Images (*.png *.jpg *.jpeg *.gif *.bmp *.svg *.webp)'
			     });

			if(vFiles && vFiles.length>0){

				localStorage.setItem(sCfgKey1, new CLocalFile(vFiles[0]).getDirectory(false));

				plugin.initProgressRange(plugin.getScriptTitle(), vFiles.length);

				var nLargeSize=1024*1024*50, vWarn=[]; //warn on adding large files;
				for(var i in vFiles){
					var xFn=new CLocalFile(vFiles[i]);
					var nBytes=xFn.getFileSize();
					if(nBytes>nLargeSize){
						vWarn.push(xFn.getLeafName() + ' (' + _scale_file_size(nBytes) + ")");
					}
				}

				var bProceed=true;
				if(vWarn.length>0){
					var sMsg=_lc2('LargeFiles', 'Adding large files as attachments may significantly bloat the database file size; Proceed anyway?');
					bProceed=confirm(sMsg + '\n\n' + vWarn.join('\n'));
				}

				if(bProceed){
					var sCurItem=plugin.getCurInfoItem(-1);

					if(!sCurItem) sCurItem=plugin.getDefRootContainer();

					include('comutils');

					var _get_unique_child_id=function(sSsgPath){
						return xNyf.getChildEntry(sSsgPath, 0);
					};

					var _is_htm_utf8=function(s){
						return (s||'').search(/content=\"text\/html;\s+charset=utf-8\"/i)>=0;
					};

					var sTmpDir=platform.getTempFolder(), sTmpName='__nyf8_import_files_as_attachments';
					var xTmpFn=new CLocalFile(sTmpDir, sTmpName+'.html'); if(plugin.deferDeleteFile) plugin.deferDeleteFile(xTmpFn.toStr()); else platform.deferDeleteFile(xTmpFn.toStr());

					var vAccFiles=[], vDocFiles=[];
					for(var i in vFiles){
						var xFn=new CLocalFile(vFiles[i]);
						var sExt=xFn.getExtension(false), sFileName=xFn.getLeafName(), sTitle=xFn.getTitle(), sDir=xFn.getDirectory();
						var tMod=xFn.getModifyTime();

						var bContinue=plugin.ctrlProgressBar(sFileName, 1, true);
						if(!bContinue) break;

						if(xTmpFn.exists()) xTmpFn.remove(); //actively clean it up;

						var xChild=new CLocalFile(sCurItem); xChild.append(_get_unique_child_id(sCurItem));
						if(sExt.search(/^(html|htm|qrich)$/i)===0){

							var sHtml=xFn.loadText('auto'); //'html' for detection of charset from within HTML source in case of BOM not present;

							var sNew=importAccompanyingObjsWithinHtml(xNyf, sCurItem, sHtml, sDir, null, function(sObj, sAttr, sUriRes, nBytes){
								if(nBytes>0){
									if(vAccFiles.indexOf(sUriRes)<0){
										vAccFiles.push(sUriRes);
									}
								}
								return sUriRes;
							});

							if(sHtml!==sNew){
								sHtml=changeHtmlCharset(sNew, 'UTF-8');
								xTmpFn.saveUtf8(sHtml);
								xFn=xTmpFn;
							}
						}

						var xSsgFn=new CLocalFile(sCurItem, sFileName);
						var nBytes=xNyf.createFile(xSsgFn.toStr(), xFn.toStr());
						if(nBytes>=0){
							xNyf.setModifyTime(xSsgFn.toStr(), tMod);
							vDocFiles.push(sFileName);
						}else{
							if(!confirm(_lc2('GoOnAnyway', 'Failed to import the file. Continue anyway?')+'\n\n'+sFileName)){
								break;
							}
						}
					}

					if(xTmpFn.exists()) xTmpFn.remove(); //actively clean it up;

					if(vDocFiles.length>0){

						plugin.refreshDocViews(-1);
						plugin.destroyProgressBar();

						var sMsg=_lc2('Done', 'Total %nDocFiles% document(s) and %nAccFiles% accompanying images successfully imported.')
						.replace(/%nDocFiles%/gi, ''+vDocFiles.length)
						.replace(/%nAccFiles%/gi, ''+vAccFiles.length)
						 + (vDocFiles.length > 0 ? ('\n\n' + vDocFiles.join('\n')) : '')
						 + (vAccFiles.length > 0 ? ('\n\n' + vAccFiles.join('\n')) : '')
						;

						alert(sMsg);
					}
				}
			}

		}else{
			alert(_lc('Prompt.Warn.ReadonlyDb', 'Cannot modify the database opened as Readonly.'));
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	alert(e);
//}
