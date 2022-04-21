
//sValidation=nyfjs
//sCaption=Backup local folder ...
//sHint=Make incremental backup of a disk folder
//sCategory=MainMenu.Tools
//sID=p.BackupFolder
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

var vFilesToIgnore=[];
var vDirsToIgnore=[];

try{
	var sCfgKey1='BackupFolder.sDir1', sCfgKey2='BackupFolder.sDir2', sCfgKey3='BackupFolder.bSub', sCfgKey4='BackupFolder.bHiddenFolders', sCfgKey5='BackupFolder.bHiddenFiles';
	var vChks=[(localStorage.getItem(sCfgKey3)||'true')+'|'+_lc2('SubDirs', 'Include sub folders')
		   , (localStorage.getItem(sCfgKey4)||'false')+'|'+_lc2('HiddenFolders', 'Hidden folders')
		   , (localStorage.getItem(sCfgKey5)||'false')+'|'+_lc2('HiddenFiles', 'Hidden files')
			];
	var vFields = [
		{sField: "folder", sLabel: _lc2('Dir1', 'Select a source folder to backup'), sInit: localStorage.getItem(sCfgKey1)||''}
		, {sField: "folder", sLabel: _lc2('Dir2', 'Select the destination folder'), sInit: localStorage.getItem(sCfgKey2)||''}
		, {sField: 'check', sLabel: '', vItems: vChks}
	];

	var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 500, bVert: true});
	if(vRes && vRes.length === 3){

		var sDirSrc=vRes[0], sDirDst=vRes[1], vChk=vRes[2];
		var bSubFolders=vChk[0], bHiddenFolders=vChk[1], bHiddenFiles=vChk[2];

		localStorage.setItem(sCfgKey1, sDirSrc);
		localStorage.setItem(sCfgKey2, sDirDst);
		localStorage.setItem(sCfgKey3, bSubFolders);
		localStorage.setItem(sCfgKey4, bHiddenFolders);
		localStorage.setItem(sCfgKey5, bHiddenFiles);

		plugin.initProgressRange(plugin.getScriptTitle(), 0);

		var _format_date=function(t){
			var s='';
			s+=t.getFullYear()+'-'+(t.getMonth()+1)+'-'+t.getDate();
			s+=' ';
			s+=t.getHours()+':'+t.getMinutes()+':'+t.getSeconds();
			return s;
		};

		var _thousand_separators=function(n){return (n||'').toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,");};

		var _file_ignoring=function(sName){
			for(var i in vFilesToIgnore){
				var sPat=vFilesToIgnore[i].replace(/([.+$!(){}\'\"])/g, '\\$1').replace(/[?]/g, '(.)').replace(/[*]/g, '(.*?)');
				if(sName.search(new RegExp('^' + sPat + '$', 'g'))===0){
					return true;
				}
			}
			return false;
		};

		var _dir_ignoring=function(sName){
			for(var i in vDirsToIgnore){
				var sPat=vDirsToIgnore[i].replace(/([.+$!(){}\'\"])/g, '\\$1').replace(/[?]/g, '\\.+').replace(/[*]/g, '\\.*');
				if(sName.search(new RegExp('^' + sPat + '$', 'g'))===0){
					return true;
				}
			}
			return false;
		};

		var bWin=platform.getOsType().search(/win/i)>=0; //for win32
		var sAttrFilters='NoDot | NoDotDot | NoSymLinks | Readable';

		var _do_backup=function(sDirSrc0, sDirDst0){

			var nFiles=0, nDirs=0, tStart=new Date();

			var _retrieve_subdirs=function(sRoot, sDir, bRecursively, vSubdirs){
				var xDir=new CLocalDir(sRoot, sDir);
				var v=xDir.listFolders('*', (sAttrFilters + (bHiddenFolders?'+ Hidden':'')));
				for(var i in v){
					var sName=v[i]; if(sName==='.' || sName==='..') continue;
					if(!_dir_ignoring(sName)){
						var sHint='[Dirs: ' + (nDirs++) + ' Elapsed: ' + Math.floor((new Date() - tStart)/1000) + ']';
						var xSub=new CLocalFile(xDir.toStr(), sName);
						if(!plugin.showProgressMsg(sHint + ': ' + xSub.toStr(), true)) throw 'User abort by Esc.';
						var sChild=new CLocalFile(sDir, sName).toStr();
						vSubdirs.push(sChild);
						nDirs++;
						if(bRecursively){
							_retrieve_subdirs(sRoot, sChild, bRecursively, vSubdirs);
						}
					}
				}
			};

			var _retrieve_fileinfo=function(sRoot, sDir, vFiles){
				var xDir=new CLocalDir(sRoot, sDir);
				var v=xDir.listFiles('*', (sAttrFilters + (bHiddenFiles?'+ Hidden':'')));
				for(var i in v){
					var sName=v[i]; if(sName==='.' || sName==='..') continue;
					if(!_file_ignoring(sName)){
						var xFn=new CLocalFile(xDir.toStr(), sName);
						var sHint='[Files: ' + (++nFiles) + ' Elapsed: ' + Math.floor((new Date() - tStart)/1000) + ']';
						if(!plugin.showProgressMsg(sHint + ': ' + xFn.toStr(), true)) throw 'User abort by Esc.';
						var xRel=new CLocalFile(sDir, sName);
						vFiles.push(xRel.toStr());
					}
				}
			};

			var _retrieve_files=function(sRoot, vDirs, vFiles){
				for(var i in vDirs){
					var sDir=vDirs[i];
					_retrieve_fileinfo(sRoot, sDir, vFiles);
				}
			};

			var _compare_folders=function(sSrc, sDst, bRecursively){

				var vSubdirs=['./']; _retrieve_subdirs(sSrc, "./", bRecursively, vSubdirs);

				//detect new folders;
				var vNewDirs=[], vSubdirs2=[];

				var _skip_subnew=function(sSub){
					for(var i in vNewDirs){
						var sDir=vNewDirs[i];
						if(sSub.indexOf(sDir+'/')==0){
							return true;
						}
					}
					return false;
				};

				for(var i in vSubdirs){
					var sSub=vSubdirs[i];
					if(sSub){
						if(!_skip_subnew(sSub)){
							var xDir=new CLocalDir(sDst, sSub);
							if(xDir.exists()){
								vSubdirs2.push(sSub);
							}else{
								vNewDirs.push(sSub);
							}
						}
					}
				}

				//detect new files, or updated files, and/or outdated files;
				var vNewFiles=[], vUpdatedFiles=[], vConflicts=[], vFiles=[]; _retrieve_files(sSrc, vSubdirs2, vFiles);
				for(var i in vFiles){
					var sFn=vFiles[i];
					var xFnSrc=new CLocalFile(sSrc, sFn);
					var xFnDst=new CLocalFile(sDst, sFn);
					if(xFnSrc.exists() && xFnDst.exists()){
						var s0=xFnSrc.getFileSize(), t0=xFnSrc.getModifyTime();
						var s1=xFnDst.getFileSize(), t1=xFnDst.getModifyTime();
						var tDiff=Math.abs(t1-t0);
						//consider of timestamp limitations, for the same file in exFAT/FAT32 file system, the diff can be up to 2 Secs;
						if(s0!=s1 || tDiff>2000){
							if(t0>t1){
								vUpdatedFiles.push(sFn);
							}else{
								vConflicts.push(sFn);
							}
						}
					}else{
						vNewFiles.push(sFn);
					}
				}

				return {vNewDirs: vNewDirs, vNewFiles: vNewFiles, vUpdatedFiles: vUpdatedFiles, vConflicts: vConflicts};
			};

			var d=_compare_folders(sDirSrc0, sDirDst0, bSubFolders);

			if(d.vNewDirs.length>0 || d.vNewFiles.length>0 || d.vUpdatedFiles.length>0 || d.vConflicts.length>0){

				var sHint=_lc2('Direction', 'Backup folder') + ': ' + sDirSrc0 + ' -> ' + sDirDst0;
				var sCaution=_lc2('Caution', 'The above listed files will be copied from the source to the destination folder. Please double check and make sure first to remove unwanted lines from the above lists before proceeding. This operation cannot be undone.');
				var vFields = [
							{sField: 'label', sText: sHint, bWordwrap: false}
							, {sField: 'textarea', sLabel: _lc2('CopyNewFolders', 'Append: copy the newly added folders'), sInit: d.vNewDirs.join('\n'), bWordwrap: false, bReadonly: false, bReq: false}
							, {sField: 'textarea', sLabel: _lc2('CopyNewFiles', 'Append: copy the newly added files'), sInit: d.vNewFiles.join('\n'), bWordwrap: false, bReadonly: false, bReq: false}
							, {sField: 'textarea', sLabel: _lc2('UpdateFiles', 'Update: copy the recently modified files'), sInit: d.vUpdatedFiles.join('\n'), bWordwrap: false, bReadonly: false, bReq: false}
							, {sField: 'textarea', sLabel: _lc2('RevertFiles', 'Revert: overwrite the files with older versions'), sInit: d.vConflicts.join('\n'), bWordwrap: false, bReadonly: false, bReq: false}
							, {sField: 'label', sText: sCaution, bWordwrap: false}
						];

				var vRes=input(plugin.getScriptTitle(), vFields, {nMinSize: [800, 500], nMaxSize: 700, nSpacing: 10, vMargins: [0, 0, 0, 0], bVert: true});
				if(vRes && vRes.length >= 4){

					var vNewDirs=vRes[0].split('\n'), vNewFiles=vRes[1].split('\n'), vUpdatedFiles=vRes[2].split('\n'), vConflicts=vRes[3].split('\n');

					var vLog=[], nFails=0, nFilesCopied=0, nDirsAdded=0;
					var _copy_files=function(vNames, sSrc0, sDst0, sRel0){
						for(var i=0; i<vNames.length; ++i){
							//2018.11.29 note that the 'sName' could contain a relative path;
							var sName=_trim(vNames[i]); if(sName==='.' || sName==='..' || !sName) continue;
							//if(!_file_ignoring(sName))
							{
								var xRel=sRel0 ? new CLocalFile(sRel0, sName) : new CLocalFile(sName);
								var sRel=xRel.toStr().replace(/^\.[\/\\]/, '').replace(/[\/\\]\.[\/\\]/, '/');
								var xFnSrc=new CLocalFile(sSrc0, sRel);
								var xFnDst=new CLocalFile(sDst0, sRel);

								if(xFnSrc.exists()){

									if(xFnDst.exists()){
										xFnDst.remove();
									}

									var sHint='Copy file [#' + (++nFilesCopied) + ', ' + Math.floor((new Date() - tStart)/1000) + 'Sec]';
									if(!plugin.showProgressMsg(sHint + ': ' + xRel.toStr(), true)) throw 'User abort by Esc.';

									var tMod=xFnSrc.getModifyTime(), bHidden=xFnSrc.isHidden();
									if(xFnSrc.copyTo(xFnDst.getDirectory(), "")){
										xFnDst.setModifyTime(tMod);
										if(bWin && bHidden) xFnDst.setHidden(true);
										vLog.push('File copied: ' + xFnSrc.toStr() + ' -> ' + xFnDst.toStr());
									}else{
										nFails++;
										//vFail.push(xRel.toStr());
										vLog.push('*** Failure copying file: ' + xFnSrc.toStr() + ' -> ' + xFnDst.toStr());
									}
								}else{
									nFails++;
									vLog.push('*** File missing: ' + xFnSrc.toStr());
									//vFail.push(xRel.toStr());
								}
							}
						}
					};

					var _copy_folders=function(vDirs, sSrc0, sDst0){

						var _copy_folder=function(sSrc0, sDst0, sRel){
							var xSrc=new CLocalDir(sSrc0, sRel), xDst=new CLocalDir(sDst0, sRel);
							if(xSrc.exists()){
								if(xDst.create()){
									vLog.push('');
									vLog.push('Folder created: ' + xDst.toStr());
									nDirsAdded++;
									var vNames=xSrc.listFiles('*', (sAttrFilters + (bHiddenFiles?'+ Hidden':'')));
									_copy_files(vNames, sSrc0, sDst0, sRel);
									var vSub=xSrc.listFolders('*', (sAttrFilters + (bHiddenFolders?'+ Hidden':'')));
									for(var i=0; i<vSub.length; ++i){
										var sName=_trim(vSub[i]); if(sName==='.' || sName==='..' || !sName) continue;
										var xSub=new CLocalDir(sRel, sName);
										_copy_folder(sSrc0, sDst0, xSub.toStr());
									}
								}else{
									nFails++;
									vLog.push('*** Failure creating folder: ' + xDst.toStr());
									//vFail.push(sRel);
								}
							}else{
								nFails++;
								vLog.push('*** Folder missing: ' + xSrc.toStr());
								//vFail.push(sRel);
							}
						};

						for(var i=0; i<vDirs.length; ++i){
							var sRel=_trim(vDirs[i]).replace(/^\.[\/\\]/, '').replace(/[\/\\]\.[\/\\]/, '/');
							if(sRel==='.' || sRel==='..' || !sRel) continue;
							_copy_folder(sSrc0, sDst0, sRel);
						}
					};

					_copy_folders(vNewDirs, sDirSrc0, sDirDst0);

					_copy_files(vNewFiles, sDirSrc0, sDirDst0, "");
					_copy_files(vUpdatedFiles, sDirSrc0, sDirDst0, "");
					_copy_files(vConflicts, sDirSrc0, sDirDst0, "");

					plugin.destroyProgressBar();

					var sInfo = _lc2('Done', 'Done with [%nDirs%] subfolders created, [%nFiles%] files copied, and [%nFails%] error(s) encountered.')
					.replace(/%nDirs%/i, nDirsAdded)
					.replace(/%nFiles%/i, nFilesCopied)
					.replace(/%nFails%/i, nFails)
					 + '\n'  + sDirSrc0 + ' --> ' + sDirDst0
					 + '\n\n' + vLog.join('\n')
					;

					textbox(
								{
									sTitle: plugin.getScriptTitle()
									, sDescr: _lc2('Result', 'Logs on running the folder backup;')
									, sDefTxt: sInfo
									, bReadonly: true
									, bWordwrap: false
									, nWidth: 80
									, nHeight: 80
								}
								);

				}
			}else{
				plugin.destroyProgressBar();
				alert(_lc2('Unchanged', 'No changes detected in the source folder by checking file names, sizes and timestamps.') + '\n\n' + sDirSrc0 + '\n--> ' + sDirDst0);
			}
		};

		_do_backup(sDirSrc, sDirDst);

		if(confirm(_lc2('ReverseDir', 'Do you wish to run incremental backup in the reverse direction?') + '\n\n'  + sDirDst + '\n--> ' + sDirSrc)){
			_do_backup(sDirDst, sDirSrc);
		}

	}

}catch(e){
	plugin.destroyProgressBar();
	alert(e);
}
