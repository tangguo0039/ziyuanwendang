
//sValidation=nyfjs
//sCaption=Backup with Sqlite database ...
//sHint=Backup current branch or whole database with Sqlite
//sCategory=MainMenu.Maintain; Context.Overview
//sCondition=CURDB
//sID=p.BackupWithSqlite
//sAppVerMin=8.0
//sShortcutKey=
//sAuthor=wjjsoft

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

var _validate_filename=function(s){
	s=s||'';
	s=s.replace(/[\*\?\.\(\)\[\]\{\}\<\>\\\/\!\$\^\&\+\|,;:\"\'`~@]/g, ' ');
	s=s.replace(/\s{2,}/g, ' ');
	s=_trim(s);
	if(s.length>64) s=s.substr(0, 64);
	s=_trim(s);
	s=s.replace(/\s/g, '_');
	return s;
};

let db; //global;

try{
	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		if(plugin.isContentEditable()) plugin.commitCurrentChanges();

		var sCurItem=plugin.getCurInfoItem(-1);
		var sItemTitle=xNyf.getFolderHint(sCurItem)||'untitled';

		var sCfgKey_Driver='BackupWithSqlite.Driver', sCfgKey_DbName='BackupWithSqlite.DbName', sCfgKey_Range='BackupWithSqlite.Range', sCfgKey_StgFmt='BackupWithSqlite.StgFmt';

		var sInitFn = (new CLocalFile(localStorage.getItem(sCfgKey_DbName)).getDirectory(false)||platform.getHomePath()||'') + '/' + _validate_filename(sItemTitle) + '.db';

		let vRange=[
			    _lc('p.Common.CurBranch', 'Current branch')
			    , _lc('p.Common.CurDB', 'Current database')
		    ];

		let vFmts=[
			    _lc2('Zlib', 'Blob: zlib/9')
			    , _lc2('Base64', 'Text: base64')
			    , _lc2('ZlibBase64', 'Text: zlib/9 + base64')
			    , _lc2('Raw', 'Blob: raw bytes array')
			    , _lc2('None', 'None: no contents/attachments; only outline tree structure backed up')
		    ];

		var vFields=[
					{sField: 'savefile', sLabel: _lc2('DstFn', 'File path to Sqlite database'), sFilter: 'Sqlite database files (*.db);;All files (*.*)', sTitle: plugin.getScriptTitle(), sInit: sInitFn, bReq: true}
					, {sField: 'combolist', sLabel: _lc('p.Common.Range', 'Range'), vItems: vRange, sInit: localStorage.getItem(sCfgKey_Range)||'0', bReq: true}
					, {sField: 'combolist', sLabel: _lc2('StgFmt', 'Storage format for text contents and attachments'), vItems: vFmts, sInit: localStorage.getItem(sCfgKey_StgFmt)||'0', bReq: true}
				];

		var vRes=input(plugin.getScriptTitle(), vFields, {nMinSize: 560, vMargins: [6, 0, 30, 0], bVert: true});
		if(vRes && vRes.length>=3){

			let sDstFn=vRes[0], iRange=vRes[1], iFmt=vRes[2];
			if(sDstFn && iRange>=0 && iFmt>=0){

				let xDstFn=new CLocalFile(sDstFn), sExt=xDstFn.getExtension(false);
				if(!sExt){
					//2021.9.30 on linux, the File-dialog may not supply the default extension name;
					sExt='db';
					xDstFn.changeExtension(sExt);
				}

				localStorage.setItem(sCfgKey_DbName, xDstFn.toStr());
				localStorage.setItem(sCfgKey_Range, iRange);
				localStorage.setItem(sCfgKey_StgFmt, iFmt);

				let bCurBranch=(iRange===0);

				let bZlib=false, bBase64=false, bRaw=false, bSkipBlob=false, sFmt='';

				if(iFmt===0){
					bZlib=true; sFmt='zlib';
				}else if(iFmt===1){
					bBase64=true; sFmt='base64';
				}else if(iFmt===2){
					bZlib=true; bBase64=true; sFmt='zlib+base64';
				}else if(iFmt===3){
					bRaw=true; sFmt='raw';
				}else if(iFmt===4){
					bSkipBlob=true; sFmt='none';
				}

				ui.initProgressRange(plugin.getScriptTitle());

				logd('Sql drivers installed: ' + CSqlDatabase.drivers().join(', '));
				logd('Defaut Sql connection: ' + CSqlDatabase.getDefaultConnectionName());

				logd('Backup range: ' + vRange[iRange]);
				logd('Storage format: ' + vFmts[iFmt]);

				let _throw=(e, sDef)=>{
					if(e && e.sText){
						throw e.sText;
					}else{
						throw sDef || 'Unknown error.';
					}
				};

				db=CSqlDatabase.addDatabase('QSQLITE', 'sqlite');
				if(db && db.isValid()){

					if(xDstFn.exists()) xDstFn.remove(); //overwrite;

					db.setHostName('');
					db.setPort(0);
					db.setUserName('');
					db.setPassword('');
					db.setDatabaseName(xDstFn.toStr());

					if(db.open()){

						logd('sConn=' + db.connectionName());
						let drv=db.driver(); if(drv && drv.hasFeature('blob')) logd('BLOB supported.');

						let _export_parameters=(m)=>{
							let tbl='parameters', fields=['key TEXT', 'val TEXT'];
							let sql='CREATE TABLE ' + tbl + ' (' + fields.join(', ') + ')';
							if(db.exec(sql)){
								for(let k in m){
									let q=db.prepare('INSERT INTO ' + tbl +' VALUES(:key, :val)');
									q.bindValue(':key', k);
									q.bindValue(':val', m[k]);
									if(q.exec()){
										logd('sql/insert: ' + k + '=' + m[k]);
									}else{
										throw q.lastError().sText;
									}
								}
							}else{
								_throw(db.lastError(), 'Failed to create table: ' + tbl);
							}
						};

						let sSsgPathStartPoint=bCurBranch ? ui.getCurInfoItem(-1) : plugin.getDefRootContainer();

						_export_parameters({'startpoint' : sSsgPathStartPoint
									   , 'stgfmt': sFmt
									   , 'range': (bCurBranch ? 'branch' : 'wholedb')
									   , 'date': new Date().getTime()
									   , 'version': '1.0'
								   });

						let _export_ssgentries=(sSsgPathStart)=>{

							let tbl='ssgentries';

							let fields=['no INTEGER'
								    , 'ssgpath TEXT'
								    , 'ssgname TEXT' //empty for ssgfolders;
								    , 'title TEXT'
								    , 'tcreate INTEGER DEFAULT 0'
								    , 'tmodify INTEGER DEFAULT 0'
								    , 'icon INTEGER DEFAULT -1'
								    , 'fsize INTEGER DEFAULT -1' //file size;
								    , 'psize INTEGER DEFAULT -1' //file size packed/compressed;
								    , 'fbody BLOB'
							    ];

							let sql='CREATE TABLE ' + tbl + ' (' + fields.join(', ') + ')';
							if(db.exec(sql)){

								let n=0; //, q=new CSqlQuery();

								let _push=(ssgpath, ssgname)=>{

									if(ssgname){
										logd('#' + n + ' --> ' + 'ssgfile='+ (ssgpath+ssgname));
									}else{
										logd('#' + n + ' --> ' + 'ssgfolder=' + ssgpath);
									}

									let sTitle=(ssgname && !plugin.isReservedNoteFn(ssgname)) ? ssgname : xNyf.getFolderHint(ssgpath);
									let bContinue=ui.ctrlProgressBar(sTitle||'Untitled', 1, true);
									if(!bContinue) throw 'User abort by Esc.';

									let ssgfn=new CLocalFile(ssgpath , ssgname).toStr();
									let title=xNyf.getEntryHint(ssgfn);
									let tcreate=xNyf.getCreateTime(ssgfn);
									let tmodify=xNyf.getModifyTime(ssgfn);
									let icon=xNyf.getInfoItemIcon(ssgfn);
									let fsize=(ssgname ? xNyf.getFileSize(ssgfn, 0) : -1);
									let psize=(ssgname ? xNyf.getFileSize(ssgfn, 1) : -1);

									let fbody;
									if(!bSkipBlob && ssgname && fsize>0){

										fbody=xNyf.loadBytes(ssgfn);
										fsize=fbody.size();

										if(fbody && fbody.size()>0){
											if(bZlib){
												let o=fbody.size();
												fbody=fbody.compress('zlib', 9);
												psize=fbody.size();
												logd('File compressed (zlib/9): ' + o + ' --> ' + psize);
											}
											if(bBase64){
												let o=fbody.size();
												fbody=fbody.base64(); //It's now turned into a string of base64;
												psize=fbody.length;
												logd('File encoded (base64): ' + o + ' --> ' + psize);
											}
										}
									}

									let q=db.prepare('INSERT INTO ' + tbl +' VALUES(:no, :ssgpath, :ssgname, :title, :tcreate, :tmodify, :icon, :fsize, :psize, :fbody)');
									{
										q.bindValue(':no', n++);
										q.bindValue(':ssgpath', ssgpath);
										q.bindValue(':ssgname', ssgname);
										q.bindValue(':title', title);
										q.bindValue(':tcreate', tcreate);
										q.bindValue(':tmodify', tmodify);
										q.bindValue(':icon', icon);
										q.bindValue(':fsize', fsize);
										q.bindValue(':psize', psize);
										q.bindValue(':fbody', fbody);
									}

									if(q.exec()){
										logd('sql/insert: ssgpath=' + ssgfn + ' title=<' + title + '> fsize=' + fsize + ' psize=' + psize + ' icon=' + icon + ' tmodify=<' + tmodify + '>');
									}else{
										_throw(q.lastError(), 'Failed to insert records to table: ' + tbl);
									}

									q.finish(); q.clear();
								};

								let _act_on_item=(sSsgPath, iLevel)=>{
									_push(sSsgPath, '');
									let vFiles=xNyf.listFiles(sSsgPath);
									for(let sSsgName of vFiles){
										if(sSsgName){
											_push(sSsgPath, sSsgName);
										}
									}
								};

								xNyf.traverseOutline(sSsgPathStartPoint, true, _act_on_item);

								ui.destroyProgressBar();

								let sMsg;
								if(n>0){
									sMsg=_lc2('Done', 'Total %nDone% records successfully inserted into the Sqlite database.').replace(/%nDone%/gi, n);
								}else{
									sMsg=_lc2('Failed', 'No records inserted to the Sqlite database.', 'error');
								}
								alert(sMsg + '\n\n' + db.databaseName());

							}else{
								_throw(db.lastError(), 'Failed to create table: ' + tbl);
							}
						};

						_export_ssgentries(bCurBranch ? ui.getCurInfoItem(-1) : plugin.getDefRootContainer());

						if(db.isOpen()) db.close();

					}else{
						_throw(db.lastError(), 'Failed to open the Sqlite database.');
					}

					ui.destroyProgressBar();
				}
			}
		}
	}

}catch(e){
	if(db && db.isOpen()) db.close();
	alert(e);
	ui.destroyProgressBar();
}
