
//sValidation=nyfjs
//sCaption=Import .zip archives ...
//sHint=Import files & folders from specified .zip archives
//sCategory=MainMenu.Capture
//sCondition=CURDB; DBRW; OUTLINE; CURINFOITEM
//sID=p.ImportZip
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

try{
	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			var sCfgKey='ImportZip.Dir';

			var vFiles=platform.getOpenFileNames({
				sTitle: plugin.getScriptTitle()
				, sInitDir: localStorage.getItem(sCfgKey)||''
				, sFilter: 'Zip archives (*.zip);;All files (*)' //2020.7.21 (*.*) doesn't match those files having no suffix;
			});

			if(vFiles && vFiles.length>0){

				localStorage.setItem(sCfgKey, new CLocalFile(vFiles[0]).getDirectory(false));

				plugin.initProgressRange(plugin.getScriptTitle(), 0);

				var xCacheDir={};
				var _add_folder=function(sZipDir, sSsgPath){
					var sRes=xCacheDir[sZipDir];
					if(!sRes){
						var sNewItem=sSsgPath, sSubPath='', v=sZipDir.split('/'), bSucc=true;
						for(var i=0; i<v.length; ++i){
							var sSub=v[i];
							if(sSub){
								sSubPath+=(sSub+'/');
								sRes=xCacheDir[sSubPath];
								if(sRes){
									sNewItem=sRes;
								}else{
									var sNew=xNyf.getChildEntry(sNewItem);
									sNewItem+='/'+sNew;
									if(xNyf.createFolder(sNewItem)){
										xNyf.setFolderHint(sNewItem, sSub);
										xCacheDir[sSubPath]=sNewItem;
										//logd('Folder added: ' + sSub+'/' + ' <---> ' + sNewItem);
									}else{
										bSucc=false;
										break;
									}
								}
							}
						}
						if(bSucc){
							sRes=sNewItem;
						}
					}
					return sRes;
				};

				var vFail=[];
				var _import_entries=function(sZipFn, sSsgPath){
					var z=new CZip();
					if(z && z.open(sZipFn, true)){
						var v=z.listEntries(), sTmpFn=platform.getTempFile();
						for(var i=0; i<v.length; ++i){
							var sZipEntry=v[i]||'';
							//logd('Zip entry: ' + sZipEntry);

							//skip folders ending with a slash, as CLocalFile() only accepts file paths containing leaf names;
							if(sZipEntry.search(/[/\\]$/)>=0) continue;

							if(!plugin.showProgressMsg(sZipFn + ': ' + sZipEntry, true)) throw 'User abort by Esc.';

							var xFn=new CLocalFile(sZipEntry), sZipDir=xFn.getDirectory(true), sLeaf=xFn.getLeafName(), sTitle=xFn.getTitle(), sExt=xFn.getSuffix();
							var sSub=_add_folder(sZipDir, sSsgPath);
							if(sLeaf){
								var nBytes=z.extractEntry(sZipEntry, sTmpFn);
								if(nBytes>=0){
									var xRE=/^__defnote$/i;
									var xSsgFn=new CLocalFile(sSub, (sTitle.search(xRE)===0) ? plugin.getDefNoteFn(sExt) : sLeaf);
									nBytes=xNyf.createFile(xSsgFn.toStr(), sTmpFn);
									if(nBytes>=0){
										var d=z.getEntryInfo(sZipEntry);
										if(d){
											xNyf.setModifyTime(xSsgFn.toStr(), d.tLastModified);
										}
										//logd('File imported: ' + sZipEntry);
									}else{
										vFail.push(sZipEntry);
										loge('Failed to import zip entry' + ': ' + sZipEntry);
									}
								}else{
									vFail.push(sZipEntry);
									loge('Failed to extract zip entry' + ': ' + sZipEntry);
								}
							}
						}
						new CLocalFile(sTmpFn).remove();
						z.close();
					}
				};

				var sCurItem=plugin.getCurInfoItem(-1), sItemToSel;

				var _import=function(sZipFn){
					var sNew=xNyf.getChildEntry(sCurItem);
					var sSsgPath=new CLocalFile(sCurItem , sNew).toStr();
					if(xNyf.createFolder(sSsgPath)){
						xNyf.setFolderHint(sSsgPath, new CLocalFile(sZipFn).getLeafName());
						_import_entries(sZipFn, sSsgPath);
						if(!sItemToSel) sItemToSel=sSsgPath;
					}
				};

				for(var j in vFiles){
					var sZipFn=vFiles[j];
					_import(sZipFn);
				}

				plugin.destroyProgressBar();
				plugin.refreshOutline(-1);
				plugin.selectInfoItem(-1, sItemToSel);

				if(vFail.length>0){
					textbox({
							sTitle: plugin.getScriptTitle()
							, sDescr: _lc2('BadEntries', 'Failed to import the following zip entries:')
							, sDefTxt: vFail.join('\n')
							, bReadonly: true
							, bWordwrap: false
							, bFixedPitch: true
							, nWidth: 60
							, nHeight: 90
						});
				}
			}
		}else{
			alert(_lc('Prompt.Warn.ReadonlyDb', 'Cannot modify the database opened as Readonly.'));
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

}catch(e){
	plugin.destroyProgressBar();
	plugin.refreshOutline(-1);
	alert(e);
}
