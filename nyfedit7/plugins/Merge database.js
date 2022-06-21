
//sValidation=nyfjs
//sCaption=Merge database ...
//sHint=Merge a database into the currently working one
//sCategory=MainMenu.File.Maintenance
//sID=p.MergeDatabase
//sAppVerMin=7.0
//sShortcutKey=Ctrl+Alt+M
//sAuthor=wjjsoft

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

try{
	var xDbDst=new CNyfDb(-1);

	if(xDbDst.isOpen()){

		if(!xDbDst.isReadonly()){

			var sCfgKey='MergeDatabase.FilePath';
			var sDbSrc=platform.getOpenFileName(
				{ sTitle: plugin.getScriptTitle()
				, sFilter: 'myBase databases (*.nyf)|*.nyf|All files (*.*)|*.*'
				, bMultiSelect: false
				, bHideReadonly: true
				, sInitDir: localStorage.getItem(sCfgKey)||''
				});

			if(sDbSrc){

				localStorage.setItem(sCfgKey, new CLocalFile(sDbSrc).getDirectory()||'');

				var bOK=true;

				if(bOK){
					var xDbSrc=new CNyfDb(sDbSrc, true, 0);
					if(xDbSrc.isOpen()){

						var _qualifyPath=function(s){
							var r='';
							var v=s.replace(/\\/g, '/').split('/');
							for(var i in v){
								if(v[i]){
									if(r) r+='/';
									r+=v[i];
								}
							}
							return r;
						};

						var _getItemLocation=function(xDb, sSsgPath){
							var sLoc='';
							var sRoot=_qualifyPath(plugin.getDefRootContainer());
							while(sSsgPath && xDb.entryExists(sSsgPath)){
								if(sSsgPath==sRoot) break;
								var sHint=xDb.getFolderHint(sSsgPath)||'...';
								if(!sLoc) sLoc=sHint; else sLoc=sHint+' / '+sLoc;
								sSsgPath=new CLocalFile(sSsgPath).getParent().toString();
								sSsgPath=_qualifyPath(sSsgPath);
							}
							return sLoc;
						};

						var _traverseBranch=function(xDb, sSsgPath, iLevel, xActPre, xActPost){
							if(xDb.folderExists(sSsgPath)){
								var bBranchExit=false;
								if(xActPre) bBranchExit=xActPre(sSsgPath, iLevel);
								if(!bBranchExit){
									_traverseChildren(xDb, sSsgPath, iLevel+1, xActPre, xActPost);
									if(xActPost) xActPost(sSsgPath, iLevel);
								}
							}
						};

						var _traverseChildren=function(xDb, sSsgPath, iLevel, xActPre, xActPost){
							var v=xDb.listFolders(sSsgPath);
							for(var i in v){
								var sName=v[i];
								if(sName){
									var xSub=new CLocalFile(sSsgPath); xSub.append(sName);
									_traverseBranch(xDb, xSub.toString(), iLevel, xActPre, xActPost);
								}
							}
						};

						var _copyEntryAttr=function(xDst, sPathDst, xSrc, sPathSrc, bFolder){
							if(bFolder){
								xDst.setFolderHint(sPathDst, xSrc.getFolderHint(sPathSrc));
							}else{
								xDst.setFileHint(sPathDst, xSrc.getFileHint(sPathSrc));
							}
							xDst.setEntryAttr(sPathDst, xSrc.getEntryAttr(sPathSrc));
							xDst.setEntryAppAttr(sPathDst, xSrc.getEntryAppAttr(sPathSrc));

							var n=xSrc.getEntryAppDataCount(sPathSrc);
							for(var i=0; i<n; ++i){
								var x=xSrc.getAppDataOfEntryByPos(sPathSrc, i);
								xDst.setAppDataOfEntry(sPathDst, i, x);
							}

							xDst.setCreateTime(sPathDst, xSrc.getCreateTime(sPathSrc));
							xDst.setModifyTime(sPathDst, xSrc.getModifyTime(sPathSrc));
						};

						var _copySsgFile=function(xDst, sFnDst, xSrc, sFnSrc){

							var bSucc=false;
							var sTmpFn=platform.getTempFile(); platform.deferDeleteFile(sTmpFn);
							if(xSrc.exportFile(sFnSrc, sTmpFn)>=0){
								if(xDst.createFile(sFnDst, sTmpFn)>=0){
									bSucc=true;
								}
							}

							var xTmpFn=new CLocalFile(sTmpFn);
							xTmpFn.remove();

							if(bSucc) _copyEntryAttr(xDst, sFnDst, xSrc, sFnSrc, false);

							return bSucc;
						};

						var nSubFilesDone=0;
						var _copyBranch=function(xDst, sPathDst, xSrc, sPathSrc){

							var bContinue=plugin.ctrlProgressBar(xSrc.getFolderHint(sPathSrc)||'....', 0, true);
							if(!bContinue) throw 'User aborted.';

							if(xDst.createFolder(sPathDst)){
								_copyEntryAttr(xDst, sPathDst, xSrc, sPathSrc, true);
								var v=xSrc.listFiles(sPathSrc);
								for(var i in v){
									var sName=v[i];
									var xFnSrc=new CLocalFile(sPathSrc); xFnSrc.append(sName);
									var xFnDst=new CLocalFile(sPathDst); xFnDst.append(sName);
									if(_copySsgFile(xDst, xFnDst.toString(), xSrc, xFnSrc.toString())){
										nSubFilesDone++;
									}
								}
								_copyChildren(xDst, sPathDst, xSrc, sPathSrc);
							}
						};

						var nSubBranchesDone=0;
						var _copyChildren=function(xDst, sPathDst, xSrc, sPathSrc){
							var v=xSrc.listFolders(sPathSrc);
							for(var i in v){
								var sName=v[i];
								if(sName){
									var xSubSrc=new CLocalFile(sPathSrc); xSubSrc.append(sName);
									var xSubDst=new CLocalFile(sPathDst); xSubDst.append(sName);
									_copyBranch(xDst, xSubDst.toString(), xSrc, xSubSrc.toString());
									nSubBranchesDone++;
								}
							}
						};

						var nBranchesDone=0, nFilesDone=0;
						var sBranchesDone='', sFilesDone='', sCRLF='\r\n';
						var _merge=function(xDst, xSrc){

							var sDefNoteFn=plugin.getDefNoteFn();

							var _dispNameOf=function(sName){return (sName==sDefNoteFn) ? 'defnote.rtf' : sName;};

							var _entryExists=function(sSsgPath){
								return xDst.entryExists(sSsgPath);
							};

							var _titleChanged=function(sSsgPath){
								return xSrc.getFolderHint(sSsgPath)!=xDst.getFolderHint(sSsgPath);
							};

							var _fileModified=function(sSsgFn){
								return xSrc.getFileSize(sSsgFn, false)!=xDst.getFileSize(sSsgFn, false)
									|| xSrc.getFileSize(sSsgFn, true)!=xDst.getFileSize(sSsgFn, true) //packed file size
									|| xSrc.getCreateTime(sSsgFn).toString()!=xDst.getCreateTime(sSsgFn).toString()
									|| xSrc.getModifyTime(sSsgFn).toString()!=xDst.getModifyTime(sSsgFn).toString()
									;
							};

							var vBranchesToCopy=[], vFilesToCopy=[];
							var xActPre=function(sSsgPath, iLevel){

								var bContinue=plugin.ctrlProgressBar(xSrc.getFolderHint(sSsgPath)||'....', 1, true);
								if(!bContinue) throw 'User aborted.';

								var bDone=false;
								if(!_entryExists(sSsgPath) || _titleChanged(sSsgPath)){
									vBranchesToCopy.push(sSsgPath);
									bDone=true; //done in the branch, no seek into child items;
								}else{
									var v=xSrc.listFiles(sSsgPath);
									if(v && v.length>0){
										for(var i in v){
											var sName=v[i];

											var bContinue=plugin.ctrlProgressBar(_dispNameOf(sName), 1, true);
											if(!bContinue) throw 'User aborted.';

											var xSsgFn=new CLocalFile(sSsgPath); xSsgFn.append(sName);
											if(!_entryExists(xSsgFn.toString()) || _fileModified(xSsgFn.toString())){
												vFilesToCopy.push(xSsgFn.toString());
											}
										}
									}
								}
								return bDone;
							};

							plugin.initProgressRange('Comparing');

							_traverseChildren(xSrc, plugin.getDefRootContainer(), 0, xActPre, null);

							plugin.initProgressRange('Merging branches');

							for(var i in vBranchesToCopy){
								var sPathSrc=vBranchesToCopy[i];

								var bContinue=plugin.ctrlProgressBar(''+i+'. '+xSrc.getFolderHint(sPathSrc)||'....', 1, true);
								if(!bContinue) break;

								var sPathDst=sPathSrc;
								if(xDst.entryExists(sPathDst)){
									var sParent=new CLocalFile(sPathDst).getParent().toString();
									if(sParent){
										var sNewName=xDst.getChildEntry(sParent, 0);
										if(sNewName){
											var xTmp=new CLocalFile(sParent); xTmp.append(sNewName);
											sPathDst=xTmp.toString();
										}
									}
								}

								{
								//log the branch info before copying the branch;
								var sBranch=_getItemLocation(xSrc, sPathSrc.toString());
								if(sBranchesDone) sBranchesDone+=sCRLF;
								sBranchesDone+=sBranch;
								nBranchesDone++;
								}

								_copyBranch(xDst, sPathDst, xSrc, sPathSrc);
							}

							plugin.initProgressRange('Merging attachments', vFilesToCopy.length);

							for(var i in vFilesToCopy){
								var sSsgFn=vFilesToCopy[i];
								var sName=new CLocalFile(sSsgFn).getLeafName();

								var bContinue=plugin.ctrlProgressBar(''+i+'. '+_dispNameOf(sName), 1, true);
								if(!bContinue){
									sFilesDone+=sCRLF+sCRLF+'<User Abort>';
									break;
								}

								if(_copySsgFile(xDst, sSsgFn, xSrc, sSsgFn)){
									var xFn=new CLocalFile(sSsgFn);
									var sName=xFn.getLeafName();
									var sPathSrc=xFn.getParent().toString();
									if(sFilesDone) sFilesDone+=sCRLF;
									sFilesDone+=(_dispNameOf(sName)+'  ( '+_getItemLocation(xSrc, sPathSrc)+' )');
									nFilesDone++;
								}
							}

						};

						var bAbort=false;
						try{
							_merge(xDbDst, xDbSrc);
						}catch(e){
							bAbort=true;
							//alert(e);
						}

						xDbSrc.close(); //2014.10.15 make sure to close the db;

						plugin.showProgressMsg('Done!');
						plugin.destroyProgressBar();

						if(nBranchesDone>0 || nFilesDone>0){

							plugin.refreshOutline(-1, plugin.getDefRootContainer());

							var sDescr='Total ' + nBranchesDone + ' branch(es) and ' + nFilesDone + ' attachment(s) merged into the database.';

							var sMsg=sCRLF+'Source database: '+sDbSrc
								+ sCRLF+'Destination database: '+xDbDst.getDbFile();
							;

							if(sBranchesDone){
								sMsg+=sCRLF+sCRLF+nBranchesDone+' '+'Branch(es) (including '+nSubBranchesDone+' sub branches and '+nSubFilesDone+' files) merged:';
								sMsg+=sCRLF+sBranchesDone;
							}

							if(sFilesDone){
								sMsg+=sCRLF+sCRLF+nFilesDone+' Attachment(s) merged:';
								sMsg+=sCRLF+sFilesDone;
							}

							if(bAbort){
								sMsg += (sCRLF+sCRLF+'[User Abort]');
							}

							var bWriteLog=true;
							if(bWriteLog){
								var xFn=new CLocalFile(xDbDst.getDbFile());
								var sDir=xFn.getDirectory(), sTitle=xFn.getTitle();
								var xLog=new CLocalFile(sDir); xLog.append(sTitle+'_MERGE.log');
								xLog.saveUtf8(plugin.getScriptTitle()+sCRLF+sCRLF+sDescr+sCRLF+sCRLF+sMsg);
								xLog.launch();
							}else{
								textbox({
									sTitle: 'Merging Results'
									, sDescr: sDescr
									, sDefTxt: sMsg
									, bReadonly: true
									, bWordwrap: false
								});
							}

						}else{
							var sMsg='No entries merged into the currently working database.';
							alert(sMsg+'\n\n'+xDbDst.getDbFile());
						}
					}else{
						alert('Failed to open the source database.'+'\n\n'+sDbSrc);
					}
				}
			}

		}else{
			alert(_lc('Prompt.Warn.ReadonlyDb', 'Cannot modify the database opened as Readonly.'));
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

}catch(e){
	alert(e);
}
