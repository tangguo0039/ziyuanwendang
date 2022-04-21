
//sValidation=nyfjs
//sCaption=Restore from Sqlite database ...
//sHint=Restore database from a backup Sqlite database
//sCategory=MainMenu.Maintain; Context.Overview
//sCondition=
//sID=p.RestoreFromSqlite
//sAppVerMin=8.0
//sShortcutKey=
//sAuthor=wjjsoft

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

let db; //global;

try{

	var sCfgKey_Src = 'RestoreFromSqlite.sSrcFn', sCfgKey_Dst = 'RestoreFromSqlite.sDstFn';

	var vFields=[
				{sField: 'openfile', sLabel: _lc2('SrcFn', 'File path to source Sqlite database'), sFilter: 'Sqlite database files (*.db);;All files (*.*)', sTitle: plugin.getScriptTitle(), sInit: localStorage.getItem(sCfgKey_Src), bReq: true}
				, {sField: 'savefile', sLabel: _lc2('DstFn', 'File path to destination .nyf database'), sFilter: 'Mybase database files (*.nyf);;All files (*.*)', sTitle: plugin.getScriptTitle(), sInit: localStorage.getItem(sCfgKey_Dst), bReq: true}
			];

	var vRes=input(plugin.getScriptTitle(), vFields, {nMinSize: 560, vMargins: [6, 0, 30, 0], bVert: true});
	if(vRes && vRes.length>=2){

		let sSrcFn=vRes[0], sDstFn=vRes[1];
		if(sSrcFn && sDstFn){

			localStorage.setItem(sCfgKey_Src, sSrcFn); //new CLocalFile(sSrcFn).getDirectory(false)
			localStorage.setItem(sCfgKey_Dst, sDstFn);

			ui.initProgressRange(plugin.getScriptTitle());

			let xDstFn=new CLocalFile(sDstFn);
			if(xDstFn.exists()) xDstFn.remove();

			let xNyf=new CNyfDb();
			if(xNyf.open(sDstFn, false)){

				logd('Sql drivers installed: ' + CSqlDatabase.drivers().join(', '));
				logd('Defaut Sql connection: ' + CSqlDatabase.getDefaultConnectionName());

				let _throw=(e, sDef)=>{
					if(e && e.sText){
						throw e.sText;
					}else{
						throw sDef || 'Unknown error.';
					}
				};

				db=CSqlDatabase.addDatabase('QSQLITE', 'sqlite');
				if(db && db.isValid()){
					db.setHostName('');
					db.setPort(0);
					db.setUserName('');
					db.setPassword('');
					db.setDatabaseName(sSrcFn);
					if(db.open()){

						let sStartPoint='', bZlib=false, bBase64=false, bRaw=false, bSkipBlob=false, bBranchOnly=false;
						{
							let sStgFmt='';
							let tbl='parameters';
							let q=db.prepare('select * from ' + tbl);
							if(q.exec()){
								while(q.next()){
									let k=q.value('key')||'', v=q.value('val')||'';
									logd(k + ': ' + v);
									if((/^(stgfmt)$/i).test(k)) sStgFmt=v.toString();
									if((/^(startpoint)$/i).test(k)) sStartPoint=v.toString();
									if((/^(range)$/i).test(k)) bBranchOnly=(/^(branch)$/i).test(v.toString());
								}
								if(sStgFmt){
									if((/\b(zlib)\b/i).test(sStgFmt)) bZlib=true;
									if((/\b(base64)\b/i).test(sStgFmt)) bBase64=true;
									if((/\b(raw)\b/i).test(sStgFmt)) bRaw=true;
									if((/\b(none)\b/i).test(sStgFmt)) bSkipBlob=true;
								}
								q.finish(); q.clear();
							}else{
								q.finish(); q.clear();
								_throw (q.lastError(), 'Failed to select from table: ' + tbl);
							}
						}

						{
							//let fields=['no INTEGER'
							//	    , 'ssgpath TEXT'
							//	    , 'ssgname TEXT' //empty for ssgfolders;
							//	    , 'title TEXT'
							//	    , 'tcreate INTEGER DEFAULT 0'
							//	    , 'tmodify INTEGER DEFAULT 0'
							//	    , 'icon INTEGER DEFAULT -1'
							//	    , 'fsize INTEGER DEFAULT -1' //file size;
							//	    , 'psize INTEGER DEFAULT -1' //file size packed/compressed;
							//	    , 'fbody BLOB'
							//    ];
							let tbl='ssgentries';
							let q=db.prepare('select * from ' + tbl);
							if(q.exec()){

								let sStartItemName='';
								if(sStartPoint!==plugin.getDefRootContainer()){
									let xDir=new CLocalDir(sStartPoint.replace(/[/\\]+$/g, ''));
									sStartItemName=xDir.getLeafName();
								}

								let nFolders=0, nFiles=0;
								while(q.next()){
									let no=parseInt(q.value('no'));
									let ssgpath=q.value('ssgpath').toString();
									let ssgname=q.value('ssgname').toString();
									let title=q.value('title').toString();
									let tcreate=new Date(q.value('tcreate'));
									let tmodify=new Date(q.value('tmodify'));
									let icon=parseInt(q.value('icon'));
									let fsize=parseInt(q.value('fsize'));
									let psize=parseInt(q.value('psize'));
									let fbody=q.value('fbody');

									logd('#' + no + ' --> ssgpath=' + ssgpath +' ssgname=' + ssgname + ' title=' + title + ' tcreate=' + tcreate + ' tmodify=' + tmodify + ' fisze=' + fsize + ' psize=' + psize);

									let _set_time=(sSsgEntry, tCre, tMod)=>{
										if(!xNyf.setCreateTime(sSsgEntry, tCre)){
											logw('Failed to restore creation timestamp: ' + sSsgEntry);
										}
										if(!xNyf.setModifyTime(sSsgEntry, tMod)){
											logw('Failed to restore modification timestamp: ' + sSsgEntry);
										}
									};

									if(sStartPoint!==plugin.getDefRootContainer()){
										//To promote item level if restoring from a branch;
										let i=ssgpath.indexOf(sStartPoint);
										if(i===0){
											ssgpath=plugin.getDefRootContainer() + sStartItemName + '/' + ssgpath.substr(i+sStartPoint.length);
											logd('changeRoot: ' + ssgpath);
										}else{
											logw('Start point mismatch: <' + sStartPoint + '> <' + ssgpath + '>');
										}
									}

									if(ssgpath){

										let sTitle=(ssgname && !plugin.isReservedNoteFn(ssgname)) ? ssgname : title;
										let bContinue=ui.ctrlProgressBar(sTitle||'Untitled', 1, true);
										if(!bContinue) throw 'User abort by Esc.';

										if(ssgname){
											let xSsgFn=new CLocalFile(ssgpath, ssgname);
											if(bSkipBlob){
												logd('file body not available: ' + xSsgFn.toStr());
											}else{
												let nWritten=-1;
												if(fbody){
													if(bRaw){
														if(typeof(fbody)==='string'){
															nWritten=xNyf.saveUtf8(xSsgFn.toStr(), fbody, false);
															logd('File restored from text/raw: ' + fbody.length);
														}else if(typeof(fbody)==='object'){
															nWritten=xNyf.saveBytes(xSsgFn.toStr(), fbody, false);
															logd('File restored from blob/raw: ' + fbody.size());
														}
													}else{
														if(bBase64){
															if(typeof(fbody)==='string'){
																let o=fbody.length;
																fbody=new CByteArray(fbody, 'base64');
																if(fbody) logd('Base64 decoded: ' + o + ' --> ' + fbody.size());
															}else{
																loge('Blob data type mismatch for base64-decoding: ' + xSsgFn.toStr());
															}
														}

														if(bZlib){
															if(typeof(fbody)==='object'){
																let o=fbody.size();
																fbody=fbody.uncompress();
																if(fbody) logd('Zlib decompressed: ' + o + ' --> ' + fbody.size());
															}else{
																loge('Blob data type mismatch for zlib-decompression: ' + xSsgFn.toStr());
															}
														}

														if(typeof(fbody)==='object'){
															nWritten=xNyf.saveBytes(xSsgFn.toStr(), fbody, false);
															logd('File restored from blob: ' + fbody.size());
														}else{
															loge('Failed to restore file: ' + xSsgFn.toStr());
														}
													}
												}else{
													nWritten=xNyf.saveAnsi(xSsgFn.toStr(), '', false);
													logd('Empty file restored.');
												}

												if(nWritten<0) loge('Failed to restore file: ' + xSsgFn.toStr());

												_set_time(xSsgFn.toStr(), tcreate, tmodify);

												nFiles++;
											}
										}else{
											if(xNyf.createFolder(ssgpath, false)){
												if(title) xNyf.setFolderHint(ssgpath, title);
												if(icon>=0) xNyf.setInfoItemIcon(ssgpath, icon);
												_set_time(ssgpath, tcreate, tmodify);
												nFolders++;
											}
										}
									}
								}

								q.finish(); q.clear();

								if(xNyf.save()){
									alert(_lc2('Done', 'Total %nEntries% entries successfully restored from the Sqlite database').replace(/%nEntries%/g, nFolders+nFiles) + '\n\n' + sSrcFn + '\n==> ' + sDstFn);
								}else{
									alert(_lc2('CommitFailure', 'Failed to commit changes to the database.') + '\n\n' + sDstFn);
								}
							}else{
								q.finish(); q.clear();
								_throw (q.lastError(), 'Failed to select from table: ' + tbl);
							}

						}
						db.close();
					}else{
						alert(_lc2('OpenSqliteFailure', 'Failed to open the Sqlite database.') + '\n\n' + sSrcFn);
					}
				}
			}else{
				alert(_lc2('OpenNyfDbFailure', 'Failed to open the .nyf database.') + '\n\n' + sDstFn);
			}

			ui.destroyProgressBar();
		}
	}

}catch(e){
	if(db && db.isOpen()) db.close();
	alert(e);
	ui.destroyProgressBar();
}
