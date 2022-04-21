
//sValidation=nyfjs
//sCaption=Merge database ...
//sHint=Merge entries from within a newer version of the database
//sCategory=MainMenu.File.Maintenance
//sCondition=CURDB; DBRW; OUTLINE;
//sID=p.MergeDatabase
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

var _array_equals = function(v1, v2){
	var bSame = (v1.length === v2.length);
	if(bSame){
		for(var i in v1){
			if(v1[i] !== v2[i]){
				bSame = false;
				break;
			}
		}
	}
	return bSame;
};

var _get_entry_appdata = function(xDb, sSsgPath){
	var vAppData = [];
	var n=xDb.getEntryAppDataCount(sSsgPath);
	for(var i = 0; i < n; ++i){
		var x = xDb.getEntryAppDataAt(sSsgPath, i);
		vAppData.push(x);
	}
	return vAppData;
};

var _get_entry_pos = function(xDb, sSsgPath, bTrash){
	var iPos = -1;
	var sDir = new CLocalFile(sSsgPath).getDirectory(true);
	if(xDb.fileExists(sSsgPath)){
		var vFiles = xDb.listFiles(sDir, bTrash);
		iPos = vFiles.indexOf(new CLocalFile(sSsgPath).getLeafName());
	}else if(xDb.folderExists(sSsgPath)){
		var vFlds = xDb.listFolders(sDir, bTrash);
		iPos = vFlds.indexOf(new CLocalFile(sSsgPath).getLeafName())
	}
	return iPos;
};

//try{
	var xDbDst=new CNyfDb(-1);
	if(xDbDst.isOpen()){

		if(!xDbDst.isReadonly()){

			var sCfgKey='MergeDatabase.FilePath';
			var sDbSrc=platform.getOpenFileName(
				{ sTitle: plugin.getScriptTitle()
				, sFilter: 'Mybase databases (*.nyf);;All files (*.*)'
				, sInitDir: localStorage.getItem(sCfgKey)||''
				}
			);

			if(sDbSrc){

				localStorage.setItem(sCfgKey, new CLocalFile(sDbSrc).getDirectory(false));

				var xDbSrc=new CNyfDb();
				if(xDbSrc.open(sDbSrc, true)){

					plugin.initProgressRange(plugin.getScriptTitle(), 0);

					//first commit changes from within the HTML editor;
					if(plugin.isModified(-1)) plugin.commitChanges();

					var vAbsent = [], vNew = [], vModified = [], vFoldersToReposition = [], bTrash = false, bRecycle = true;
					var tLastMerged = 0, vConflicts = [];

					{
						//var xFnSyncInfo = new CLocalFile(plugin.getDefRootContainer()); xFnSyncInfo.append(_NYF7_SSGFN_SYNCINFO);
						//var sInfo = xDbDst.loadText('' + xFnSyncInfo, 'auto');
						//if(sInfo) tLastMerged = parseInt(sInfo);
					}

					var _is_root_path=function(sSsgPath){return (sSsgPath===plugin.getDefRootContainer());};

					var _push_to_reposition = function(sSsgPath){
						//sSsgPath = new CLocalFile(sSsgPath).getDirectory(true);
						if(sSsgPath && vFoldersToReposition.indexOf(sSsgPath) < 0){
							vFoldersToReposition.push(sSsgPath);
						}
					};

					var _push_to_conflicts = function(sSsgPath){
						if(sSsgPath && vConflicts.indexOf(sSsgPath) < 0 && !_is_root_path(sSsgPath)){
							vConflicts.push(sSsgPath);
						}
					};

					var _push_to_modified = function(sSsgPath){
						if(sSsgPath && vModified.indexOf(sSsgPath) < 0 && !_is_root_path(sSsgPath)){
							vModified.push(sSsgPath);
						}
					};

					var _push_to_new=function(sSsgPath){
						if(sSsgPath && vNew.indexOf(sSsgPath) < 0 && !_is_root_path(sSsgPath)){
							vNew.push(sSsgPath);
							_push_to_reposition(sPath);
						}
					};

					var _push_to_absent = function(sSsgPath){
						if(sSsgPath && vAbsent.indexOf(sSsgPath) < 0 && !_is_root_path(sSsgPath)){
							vAbsent.push(sSsgPath);
							_push_to_conflicts(sSsgPath);
						}
					};

					var _entry_attr_changed = function(sSsgPath){
						var bMod=true;
						var tModSrc = xDbSrc.getModifyTime(sSsgPath), tModDst = xDbDst.getModifyTime(sSsgPath);
						if(tModSrc.getTime()===tModDst.getTime()){
							var tCreatedSrc = xDbSrc.getCreateTime(sSsgPath), tCreatedDst = xDbDst.getCreateTime(sSsgPath);
							if(tCreatedSrc.getTime()===tCreatedDst.getTime()){
								var sHintSrc = xDbSrc.getEntryHint(sSsgPath), sHintDst = xDbDst.getEntryHint(sSsgPath);
								if(sHintSrc===sHintDst){
									if(sHintSrc===sHintDst){
										var nAttrSrc = xDbSrc.getEntryAttr(sSsgPath), nAttrDst= xDbDst.getEntryAttr(sSsgPath);
										if(nAttrSrc===nAttrDst){
											var nAppAttrSrc = xDbSrc.getEntryAppAttr(sSsgPath), nAppAttrDst= xDbDst.getEntryAppAttr(sSsgPath);
											if(nAppAttrSrc===nAppAttrDst){
												var vAppDataSrc = _get_entry_appdata(xDbSrc, sSsgPath)
												var vAppDataDst = _get_entry_appdata(xDbDst, sSsgPath);
												if(_array_equals(vAppDataSrc, vAppDataDst)){
													bMod=false;
												}
											}
										}
									}
								}
							}
						}else{
							//if(tLastMerged > 0 && tModSrc.getTime() > tLastMerged && tModDst.getTime() > tLastMerged){
							if(tModDst.getTime() > tModSrc.getTime()){
								_push_to_conflicts(sSsgPath);
							}
						}
						return bMod;
					};

					var _compare_ssg_file = function(sSsgPath){
						var nSizeSrc = xDbSrc.getFileSize(sSsgPath, 0), nSizeDst = xDbDst.getFileSize(sSsgPath, 0);
						if(_entry_attr_changed(sSsgPath) || nSizeSrc!==nSizeDst){ //attr-comparision first for conflicts detection!
							_push_to_modified(sSsgPath);
						}
					};

					var _compare_ssg_folder = function(sSsgPath){

						if(_entry_attr_changed(sSsgPath)){
							_push_to_modified(sSsgPath);
						}

						var iPosSrc = _get_entry_pos(xDbSrc, sSsgPath, bTrash);
						var iPosDst = _get_entry_pos(xDbDst, sSsgPath, bTrash);
						if(iPosSrc !== iPosDst){
							_push_to_reposition(sSsgPath);
						}

					};

					var _compare_branch = function(sSsgPath){

						plugin.ctrlProgressBar("-> " + sSsgPath, 1, true);

						_compare_ssg_folder(sSsgPath);

						var vFiles=xDbSrc.listFiles(sSsgPath, bTrash);
						for(var i in vFiles){
							var sName = vFiles[i];
							var xFn = new CLocalFile(sSsgPath); xFn.append(sName);
							if(xDbDst.fileExists(xFn.toStr())){
								_compare_ssg_file(xFn.toStr());
							}else{
								_push_to_new(xFn.toStr());
							}
						}

						//2016.1.29 skip entries no longer present in the SRC-DB (being removed)
						if(vAbsent.indexOf(sSsgPath) < 0){
							_compare_children(sSsgPath);
						}
					};

					var _compare_children = function(sSsgPath){

						plugin.ctrlProgressBar("-> " + sSsgPath, 1, true);

						if(xDbSrc.folderExists(sSsgPath) && xDbDst.folderExists(sSsgPath)){
							//first list folders in the source db, and test them in the destination db;
							{
								var vFolders = xDbSrc.listFolders(sSsgPath, bTrash);
								for(var i in vFolders){
									var sName = vFolders[i];
									var xSub = new CLocalFile(sSsgPath); xSub.append(sName);

									//2016.2.8 ignore the file containing timestamp last-merged;
									//if(sSsgPath==plugin.getDefRootContainer() && sName==_NYF7_SSGFN_SYNCINFO){
									//	continue;
									//}

									if(xDbDst.folderExists(xSub.toStr())){
										_compare_branch(xSub.toStr());
									}else{
										_push_to_new(xSub.toStr());
									}
								}
							}

							//the list entries in the destination db, and test them in the source db;
							{
								var vDst = xDbDst.listEntries(sSsgPath, bTrash);
								for(var i in vDst){
									var sName = vDst[i];
									var xSub = new CLocalFile(sSsgPath); xSub.append(sName);

									//2016.2.8 ignore the file which record merge time
									//if(sSsgPath==plugin.getDefRootContainer() && sName==_NYF7_SSGFN_SYNCINFO){
									//	continue;
									//}

									if(!xDbSrc.entryExists(xSub.toStr())){
										_push_to_absent(xSub.toStr());
									}
								}
							}
						}
					};

					_compare_branch(plugin.getDefRootContainer());

					var _format_time=function(t){
						var y=t.getFullYear(), mon=t.getMonth()+1, d=t.getDate();
						var h=t.getHours(), min=t.getMinutes(), s=t.getSeconds();
						return y + '-' + (mon>9?mon:'0'+mon) + '-' + (d>9?d:'0'+d)
							+ ' ' //'T'
							+ (h>9?h:'0'+h) + ':' + (min>9?min:'0'+min) + ':' + (s>9?s:'0'+s)
							;
					};

					var _NYF7_SSGFN_UTF8ENCODING='__encoding.utf8';
					var _NYF7_SSGFN_IDENTIFYING='__identifying.txt';
					var _NYF7_SSGFN_LABELLING='__labelling.txt';
					var _NYF7_SSGFN_SYMLINKING='__symlinking.txt';
					var _NYF7_SSGFN_ITEMLINKING='__itemlinking.txt';
					var _NYF7_SSGFN_BOOKMARKING='__bookmarking.txt';
					var _NYF7_SSGFN_CALENDAR='__calendar.txt';
					var _NYF7_SSGFN_QUERIES='__queries.txt';
					var _NYF7_SSGFN_ITEMTEXTSTYLES='__itemtextstyles.txt';
					var _NYF7_SSGFN_INFOITEMSTYLES='__infoitemstyles.txt';
					var _NYF7_SSGFN_DBIDENTIFYING='__dbrefs.txt';

					var xFileDescr={
						  '__encoding.utf8': _lc2('', 'Tag for UTF-8 encoding')
						, '__identifying.txt': _lc2('', 'IDs of referred info items')
						, '__labelling.txt': _lc2('', 'Custom labels')
						, '__symlinking.txt': _lc2('', 'Symbolic links')
						, '__itemlinking.txt': _lc2('', 'Item links')
						, '__bookmarking.txt': _lc2('', 'Bookmarks')
						, '__calendar.txt': _lc2('', 'Calendar links')
						, '__queries.txt': _lc2('', 'Saved searches')
						, '__itemtextstyles.txt': _lc2('', 'Custom item styles')
						, '__infoitemstyles.txt': _lc2('', 'Custom styles for info items')
						, '__dbrefs.txt': _lc2('', 'Cross-database hyperlinks')
					};

					var _get_display_text = function(xDb, sSsgPath, sNotes){

						var sDisp='', sSsgName, xFn=new CLocalFile(sSsgPath), sType='', sDescr='';
						var bFile=xDb.fileExists(sSsgPath), bFolder=xDb.folderExists(sSsgPath);
						if(bFile){

							sType=_lc2('Attachment', 'Attachment');
							sSsgPath = xFn.getDirectory(true);
							sSsgName = xFn.getLeafName();
							if(plugin.isReservedNoteFn(sSsgName)){
								sType=_lc2('ItemContent', 'Item content');
							}else{
								sDescr=xFileDescr[sSsgName];
								if(sDescr){
									sType=_lc2('LinkData', 'Link data');
								}
							}

						}else if(bFolder){
							sType='Info item';
							if(xDb.hasChild(sSsgPath)){
								sType=_lc2('Folder', 'Folder/Sub branch');
							}
						}else{
							sSsgPath='';
						}

						if(sType && sSsgPath){

							var bRoot=_is_root_path(sSsgPath); //(sSsgPath === plugin.getDefRootContainer());
							if(bRoot){
								if(sSsgName){
									var sExt=new CLocalFile(sSsgName).getExtension(false);
									if('bmp;png;jpg;svg;gif'.split(';').indexOf(sExt.toLowerCase())>=0){
										sType='Custom icon';
									}
								}
							}

							sDisp += sType;
							sDisp += ': ';
							sDisp += xDb.getLocationText(sSsgPath, ' / ');

							if(sSsgName){

								if(sDescr){
									sDisp += sSsgName + ' (' + sDescr + ')';
								}else{
									if(!bRoot) sDisp += ' / ';
									sDisp += sSsgName;
								}

								var xTmp=new CLocalFile(sSsgPath, sSsgName);
								var sHint=xDb.getEntryHint(xTmp.toStr(), '');
								if(sHint) sDisp += ' (' + sHint + ')';
							}

							var tMod=xDb.getModifyTime(xFn.toStr());
							if(bFile){
								var nSize=xDb.getFileSize(xFn.toStr(), 0)
								sDisp+=' [ ' + _format_time(tMod) + ', ' + nSize + ' Bytes ]';
							}else if(bFolder){
								sDisp+=' [ ' + _format_time(tMod) + ' ]';
							}

							//if(sDisp) sDisp+=' ('+sSsgPath+')';
							if(sNotes) sDisp+=' ('+sNotes+')';
						}else{
							sDisp+='** Not present in the source database';
						}

						return sDisp;
					}

					var bContinue = true;
					if(vConflicts.length > 0){

						plugin.ctrlProgressBar("-> Resolve conflicts ", 1, true);

						var sConflicts = '';
						for(var i in vConflicts){
							var sSsgPath = vConflicts[i];
							if(sSsgPath){
								if(sConflicts) sConflicts += '\n\n';
								sConflicts += ('' + _get_display_text(xDbDst, sSsgPath, 'Original') + '\n' + _get_display_text(xDbSrc, sSsgPath));
							}
						}

						var vSolutions=[
							_lc2('KeepOriginal', 'Keep original (Use the newer revisions)')
							, _lc2('Overwrite', 'Overwrite (Use the older revisions)')
						];

						var vFields = [
							{sField: 'textarea', sLabel:_lc2('Conflicts', 'Conflicts detected as newer revisions exist in the current database')+' ('+xDbDst.getDbFile()+')', sInit: sConflicts, bWordwrap: false, bReadonly: true, bRequired:false}
							, {sField: 'combolist', sLabel: _lc2('Resolve', 'How to resolve the confilcts'), vItems: vSolutions, sInit: 0}
						];

						var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: [900, 600], vMargins:[0, 0, 30, 0], nSpacing: 3, bVert: true, bScrollBar: false});
						if(vRes && vRes.length === 2){
							var iSel = vRes[1];
							if(iSel === 0){
								for(var i in vConflicts){
									var sSsgPath=vConflicts[i], iPos;
									iPos=vModified.indexOf(sSsgPath);
									if(iPos>=0){
										vModified.splice(iPos, 1);
									}
									iPos=vAbsent.indexOf(sSsgPath);
									if(iPos>=0){
										vAbsent.splice(iPos, 1);
									}
								}
							}
						}else{
							bContinue = false;
						}
					}

					if(bContinue){

						var sMsg = '';

						var vMsg = [];
						if(vNew.length > 0){
							if(vMsg.length > 0) vMsg.push('');
							vMsg.push(_lc2('Add', 'Items to add:'));
							for(var i in vNew){
								var sPath = vNew[i];
								vMsg.push(_get_display_text(xDbSrc, sPath));
							}
						}

						if(vAbsent.length > 0){
							if(vMsg.length > 0) vMsg.push('');
							vMsg.push(_lc2('Remove', 'Items to remove:'));
							for(var i in vAbsent){
								var sPath = vAbsent[i];
								vMsg.push(_get_display_text(xDbDst, sPath));
							}
						}

						if(vModified.length > 0){
							if(vMsg.length > 0) vMsg.push('');
							vMsg.push(_lc2('Update', 'Items to update:'));
							for(var i in vModified){
								var sPath = vModified[i];
								vMsg.push(_get_display_text(xDbDst, sPath));
							}
						}

						if(vFoldersToReposition.length > 0){
							if(vMsg.length > 0) vMsg.push('');
							vMsg.push(_lc2('Reposition', 'Items to reposition:'));
							for(var i in vFoldersToReposition){
								var sPath = vFoldersToReposition[i];
								vMsg.push(_get_display_text(xDbDst, sPath));
							}
						}

						if(vMsg.length > 0){
							sMsg = vMsg.join('\n');
						}else{
							sMsg = _lc2('Unchanged', 'No entries merged into the currently working database.');
							bContinue = false;
						}

						if(bContinue){

							plugin.destroyProgressBar();

							var vFields = [
								{sField: 'textarea', sLabel:_lc2('ConfirmMerge', 'Merging the following items into the currently working database; Are you sure?'), sInit: sMsg, bWordwrap: false, bReadonly: true, bRequired:false}
							];
							var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: [900, 600], vMargins:[0, 0, 30, 0], nSpacing: 3, bVert: true, bScrollBar: false});
							if(vRes && vRes.length > 0){

								var _copy_entry_attr = function(sSsgPath){

									//plugin.ctrlProgressBar("-> " + sSsgPath, 1, true);

									if((xDbSrc.folderExists(sSsgPath) && xDbDst.folderExists(sSsgPath))
											|| (xDbSrc.fileExists(sSsgPath) && xDbDst.fileExists(sSsgPath))
									){
										var sHintSrc = xDbSrc.getEntryHint(sSsgPath);
										var tModSrc = xDbSrc.getModifyTime(sSsgPath);
										var tCreatedSrc = xDbSrc.getCreateTime(sSsgPath);
										var nAttrSrc = xDbSrc.getEntryAttr(sSsgPath);
										var nAppAttrSrc = xDbSrc.getEntryAppAttr(sSsgPath);

										var vAppDataSrc = _get_entry_appdata(xDbSrc, sSsgPath);
										{
											xDbDst.setEntryHint(sSsgPath, sHintSrc);
											xDbDst.setCreateTime(sSsgPath, tCreatedSrc);
											xDbDst.setEntryAttr(sSsgPath, nAttrSrc);
											xDbDst.setEntryAppAttr(sSsgPath, nAppAttrSrc);

											if(vAppDataSrc.length === 0){
												xDbDst.clearEntryAppData(sSsgPath);
											}else{
												for(var i = 0; i < vAppDataSrc.length; i++){
													xDbDst.setEntryAppDataAt(sSsgPath, i, vAppDataSrc[i]);
												}
											}

											xDbDst.setModifyTime(sSsgPath, tModSrc); //finally copy time last-modified;
										}
									}
								};

								var _copy_ssg_file = function(sSsgFn)
								{
									plugin.ctrlProgressBar("-> " + sSsgFn, 1, true);

									if(xDbSrc.fileExists(sSsgFn)){
										var bSucc = false;
										var sTmpFn = platform.getTempFile(); plugin.deferDeleteFile(sTmpFn);
										if(xDbSrc.exportFile(sSsgFn, sTmpFn)>=0){
											if(xDbDst.createFile(sSsgFn, sTmpFn, bRecycle)>=0){
												bSucc=true;
											}
										}

										new CLocalFile(sTmpFn).remove();

										if(bSucc) _copy_entry_attr(sSsgFn);
									}
								};

								var _copy_ssg_folder = function(sSsgPath)
								{
									plugin.ctrlProgressBar("-> " + sSsgPath, 1, true);

									if(xDbSrc.folderExists(sSsgPath)){
										if(xDbDst.createFolder(sSsgPath)){

											var vFolders = xDbSrc.listFolders(sSsgPath, bTrash);
											for(var i in vFolders){
												var sName = vFolders[i];
												var xSub = new CLocalFile(sSsgPath, sName);
												_copy_ssg_folder(xSub.toStr());
											}

											var vFiles = xDbSrc.listFiles(sSsgPath, bTrash);
											for(var i in vFiles){
												var sName = vFiles[i];
												var xFn = new CLocalFile(sSsgPath, sName);
												_copy_ssg_file(xFn.toStr());
											}

											_copy_entry_attr(sSsgPath);
										}
									}
								};

								var _reposition_sub_entries = function(sSsgPath){

									plugin.ctrlProgressBar("Reposition: " + sSsgPath, 1, true);

									{
										var vSrc = xDbSrc.listEntries(sSsgPath, bTrash);
										for(var i in vSrc){
											var sName = vSrc[i];
											var xFn = new CLocalFile(sSsgPath, sName);
											var sSub = '' + xFn.toStr();
											if(xDbSrc.entryExists(sSub) && xDbDst.entryExists(sSub)){
												var iPos = _get_entry_pos(xDbSrc, sSub, bTrash);
												if(iPos >= 0){
													xDbDst.moveEntry(sSub, sSsgPath, iPos);
												}
											}
										}
									}

									//move absent entries to the end
									{
										var vDst = xDbDst.listEntries(sSsgPath, bTrash);
										for(var i in vDst){
											var sName = vDst[i];
											var xFn = new CLocalFile(sSsgPath, sName);
											var sSub = '' + xFn.toStr();
											if(!xDbSrc.entryExists(sSub)){
												var iPos = xDbDst.fileExists(sSub) ? xDbDst.getFileCount(sSsgPath) : xDbDst.getFolderCount(sSsgPath);
												if(iPos >= 0){
													xDbDst.moveEntry(sSub, sSsgPath, iPos);
												}
											}
										}
									}
								};

								plugin.backupOnDbMaintenance(-1); //create backup if scheduled;

								plugin.initProgressRange(plugin.getScriptTitle(), 0);

								for(var i in vAbsent){
									var sSsgPath = vAbsent[i];
									plugin.ctrlProgressBar("Remove: " + sSsgPath, 1, true);
									xDbDst.trashEntry(sSsgPath, false);
								}

								for(var i in vNew){
									var sSsgPath = vNew[i];
									if(xDbSrc.fileExists(sSsgPath)){
										_copy_ssg_file(sSsgPath);
									}else if(xDbSrc.folderExists(sSsgPath)){
										_copy_ssg_folder(sSsgPath);
									}
								}

								for(var i in vModified){
									var sSsgPath = vModified[i];
									if(xDbSrc.fileExists(sSsgPath)){
										var nSizeSrc = xDbSrc.getFileSize(sSsgPath, 0), nSizeDst = xDbDst.getFileSize(sSsgPath, 0);
										var tModSrc = xDbSrc.getModifyTime(sSsgPath), tModDst = xDbDst.getModifyTime(sSsgPath);
										if(nSizeSrc !== nSizeDst || tModSrc.getTime() !== tModDst.getTime()){
											_copy_ssg_file(sSsgPath);
										}else{
											_copy_entry_attr(sSsgPath);
										}
									}else{
										_copy_entry_attr(sSsgPath);
									}
								}

								{
									var vTmp=[];
									for(var i in vFoldersToReposition){
										var sSsgPath = new CLocalFile(vFoldersToReposition[i]).getDirectory(true);
										if(sSsgPath && vTmp.indexOf(sSsgPath)<0){
											vTmp.push(sSsgPath);
										}
									}
									for(var i in vTmp){
										_reposition_sub_entries(vTmp[i]);
									}
								}

								//2015.2.8 keep the current time for later reference;
								{
									//var tNow = new Date();
									//var xFn = new CLocalFile(plugin.getDefRootContainer(), _NYF7_SSGFN_SYNCINFO);
									//xDbDst.saveUtf8('' + xFn.toStr(), '' + tNow.getTime(), false, true);
								}

								//2020.6.17 try first to refresh the UI;
								plugin.refreshOutline(-1);
								plugin.refreshLabels(-1);
								plugin.refreshCalendar(-1);
								plugin.refreshOverview(-1);
								plugin.refreshRelationPane(-1);
								plugin.refreshDocViews(-1);

								if(confirm(_lc2('ConfirmSave', 'Finally saving the merge results; Are you sure?')+'\n\n'+xDbDst.getDbFile())){
									plugin.ctrlProgressBar("Commit changes", 1, true);
									xDbDst.save();
								}

								plugin.destroyProgressBar(); //destory the progress-bar to release the UI busy state;

								var bForcedly=true;
								plugin.reopenDb(-1, bForcedly);
							}
						}else{
							alert(sMsg);
						}
					}

					xDbSrc.close();

				}else{
					alert('Failed to open the source database.'+'\n\n'+sDbSrc);
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
