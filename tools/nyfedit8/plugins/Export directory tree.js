
//sValidation=nyfjs
//sCaption=Export directory tree ...
//sHint=Export the current branch as directory tree
//sCategory=MainMenu.Share
//sCondition=CURDB; DBRW; OUTLINE; CURINFOITEM
//sID=p.ExportDirTree
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

//10:41 AM 12/23/2010 defines a base filename to save default text notes of each info items. (*customizable*)
var sRenameDefNote='defnote';

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

//try{
	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		if(plugin.isContentEditable()) plugin.commitCurrentChanges();

		var sCfgKey='ExportDirTree.sDestDir';
		var sDstDir=platform.browseForFolder(_lc2('SelDest', 'Select the destination directory'), localStorage.getItem(sCfgKey));

		if(sDstDir){

			localStorage.setItem(sCfgKey, sDstDir);

			var vSelItems=plugin.getSelectedInfoItems(-1);

			plugin.initProgressRange(plugin.getScriptTitle(), 0);

			include('comutils');

			var _validate_dirname=function(s){
				s=s||'';
				s=s.replace(/[\*\?\.\(\)\[\]\{\}\<\>\\\/\!\$\^\&\+\|,;:\"\'`~@]/g, ' ');
				s=s.replace(/\s{2,}/g, ' ');
				s=_trim(s);
				if(s.length>64) s=s.substr(0, 64);
				s=_trim(s);
				s=s.replace(/\s/g, '_');
				return s;
			};

			var _unique_dirname=function(sDir, sName){
				var sRes=sName||'sub';
				var xFn=new CLocalDir(sDir, sRes), i=0;
				while(xFn.exists()){
					//sRes=sName+'-'+Math.round(Math.random()*1000);
					sRes=sName+'_'+i;
					xFn=new CLocalDir(sDir, sRes);
					i++;
				}
				return sRes;
			};

			var _unique_filename=function(sDir, sName0){
				var xFn=new CLocalFile(sName0), n=1, sRes='', sMagic='';
				var sTitle=xFn.getTitle(), sExt=xFn.getCompleteSuffix(false); //false: without dot;
				do{
					var sName=sTitle||'untitled'; if(sMagic) sName=sName+'_'+sMagic; if(sExt) sName+=('.'+sExt);
					var f=new CLocalFile(sDir); f.append(sName);
					if(!f.exists()){
						sRes=sName;
						break;
					}
					sMagic=''+n; n++;
				}while(n<=0xffff);
				return sRes;
			};

			var _renameDefNoteFn=function(sName){
				var f=new CLocalFile(sName);
				var sExt=f.getSuffix(false); if(sExt.toLowerCase()==='qrich') sExt+='.html';
				return sRenameDefNote + '.' + sExt;
			};

			var _renameRichTextFn=function(sName){
				var f=new CLocalFile(sName);
				var sBase=f.getCompleteBaseName(); //2019.2.26 consider of abc.d.e.f.txt
				var sExt=f.getSuffix(false); if(sExt.toLowerCase()==='qrich') sExt+='.html';
				return sBase + '.' + sExt;
			};

			var vDirTrack=[], vFails=[], nFolders=0, nFiles=0;
			var _act_on_treeitem=function(sSsgPath, iLevel){
				var sDir=(iLevel>=0 && iLevel<vDirTrack.length) ? vDirTrack[iLevel] : '';
				if(xNyf.entryExists(sSsgPath, false)){

					var sTitle=xNyf.getFolderHint(sSsgPath)||'Untitled';

					var bContinue=plugin.ctrlProgressBar(sTitle, 1, true);
					if(!bContinue) return true;

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

					var sSub=_unique_dirname(sDir, _validate_dirname(sTitle));

					var xDir=new CLocalDir(sDir);
					if(xDir.exists() && xDir.createDirectory(sSub)){
						xDir.append(sSub);
						nFolders++;
						vDirTrack[iLevel+1]=xDir.toStr();
						var vFiles=xNyf.listFiles(sSsgPath);
						for(var i in vFiles){
							var sFn=vFiles[i];
							var xSsgFnSrc=new CLocalFile(sSsgPath, sFn);
							var sFn2=plugin.isReservedNoteFn(sFn) ? _renameDefNoteFn(sFn) : _renameRichTextFn(sFn); sFn2=_unique_filename(xDir.toStr(), sFn2);
							var xDst=new CLocalFile(xDir.toStr(), sFn2);
							if(xNyf.isShortcut(xSsgFnSrc.toStr())){
								var bResolve=true, sDskFn=xNyf.getShortcutFile(xSsgFnSrc.toStr(), bResolve);
								var xDskFn=new CLocalFile(sDskFn);
								if(xDskFn.exists() && xDskFn.copyTo(xDir.toStr(), sFn2)){
									nFiles++;
								}else{
									vFails[vFails.length]=sFn;
								}
							}else{
								var sExt=xSsgFnSrc.getExtension(false).toLowerCase();
								if(sExt==='html' || sExt==='htm'){
									var sHtml=xNyf.loadText(xSsgFnSrc.toStr(), 'html');
									var sNew=substituteUrisWithinHtml(sHtml, 'img,link', function(sObj, sTagName){
										var u=sObj||'';
										if(u.search(/^file:\/\//i)===0){
											var sFn=localFileFromUrl(u, true);
											if(sFn){
												sFn=xNyf.evalRelativePath(sFn);
												u=urlFromLocalFile(sFn, true);
											}
										}
										return u;
									});
									if(sHtml!==sNew){
										xDst.saveUtf8(sNew);
										continue; //go on with next one;
									}
								}

								if(xNyf.exportFile(xSsgFnSrc.toStr(), xDst.toStr())<0){
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
					var sTitle=xNyf.getFolderHint(sSsgPath)||'....';
					vDirTrack=[sDstDir];
					xNyf.traverseOutline(sSsgPath, true, _act_on_treeitem);
					vSucc.push(sTitle);
				}
			}

			plugin.destroyProgressBar();
			if(vFails.length>0){
				alert(_lc2('Failure', 'Failed to export the following files.')+'\n\n'+vFails.join('\n'));
			}else{
				var sMsg=_lc2('Done', 'Successfully exported the currently selected branch(es).');
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

//}catch(e){
//	alert(e);
//}
