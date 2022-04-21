
//sValidation=nyfjs
//sCaption=Compare local folders ...
//sHint=Compare two local folders and report differences
//sCategory=MainMenu.Tools
//sID=p.CompareFolders
//sAppVerMin=8.0
//sShortcutKey=
//sAuthor=wjjsoft

/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2021 Wjj Software. All rights Reserved.
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

//try{
	var sCfgKey1='CompareFolders.sDir1', sCfgKey2='CompareFolders.sDir2', sCfgKey3='CompareFolders.bSub', sCfgKey4='CompareFolders.bHiddenFolders', sCfgKey5='CompareFolders.bHiddenFiles';

	var vChks=[(localStorage.getItem(sCfgKey3)||'true')+'|'+_lc2('SubDirs', 'Include sub folders')
		   , (localStorage.getItem(sCfgKey4)||'false')+'|'+_lc2('HiddenFolders', 'Hidden folders')
		   , (localStorage.getItem(sCfgKey5)||'false')+'|'+_lc2('HiddenFiles', 'Hidden files')
			];

	var vFields=[{sField: "folder", sLabel: _lc2('Dir1', 'Select a folder path to compare'), sInit: localStorage.getItem(sCfgKey1)||''}
		     , {sField: "folder", sLabel: _lc2('Dir2', 'Select another one to compare with'), sInit: localStorage.getItem(sCfgKey2)||''}
		     , {sField: 'check', sLabel: '', vItems: vChks}
			];

	var vRes=input(plugin.getScriptTitle(), vFields, {nMinSize: 500, bVert: true});
	if(vRes && vRes.length >= 2){

		var sDir1=vRes[0], sDir2=vRes[1], vChk=vRes[2], bSubFolders=vChk[0], bHiddenFolders=vChk[1], bHiddenFiles=vChk[2];

		localStorage.setItem(sCfgKey1, sDir1);
		localStorage.setItem(sCfgKey2, sDir2);
		localStorage.setItem(sCfgKey3, bSubFolders);
		localStorage.setItem(sCfgKey4, bHiddenFolders);
		localStorage.setItem(sCfgKey5, bHiddenFiles);

		var _file_ignoring=function(sName){
			for(var i in vFilesToIgnore){
				var sPat=vFilesToIgnore[i].replace(/([.+$!(){}'"])/g, '\\$1').replace(/[?]/g, '(.)').replace(/[*]/g, '(.*?)');
				if(sName.search(new RegExp('^' + sPat + '$', 'g'))===0){
					return true;
				}
			}
			return false;
		};

		var _dir_ignoring=function(sName){
			for(var i in vDirsToIgnore){
				var sPat=vDirsToIgnore[i].replace(/([.+$!(){}'"])/g, '\\$1').replace(/[?]/g, '\\.+').replace(/[*]/g, '\\.*');
				if(sName.search(new RegExp('^' + sPat + '$', 'g'))===0){
					return true;
				}
			}
			return false;
		};

		var nFiles=0, nDirs=0, tStart=new Date();
		var sAttrFilters='NoDot | NoDotDot | NoSymLinks | Readable';

		var _retrieve_fileinfo=function(sRoot, sDir, xFiles){
			var xDir=new CLocalDir(sRoot, sDir);
			var v=xDir.listFiles('*', (sAttrFilters + (bHiddenFiles?'+ Hidden':'')));
			for(var i in v){
				var sName=v[i];
				if(sName==='.' || sName==='..') continue;
				if(!_file_ignoring(sName)){
					//var sHint='[Files: ' + nFiles + ', Dirs: ' + nDirs + ' Elapsed: ' + Math.floor((new Date() - tStart)/1000) + ']';
					var sHint='Listing [Files: ' + nFiles + ', Dirs: ' + nDirs + ']';
					var xFn=new CLocalFile(xDir.toStr(), sName);
					if(!ui.showProgressMsg(sHint + ': ' + xFn.toStr(), true)) throw 'User abort by Esc.';
					var nSize=xFn.getFileSize(); //, sSize=nSize.toString(16);
					var tMod=xFn.getModifyTime();
					var xRel=new CLocalFile(sDir, sName);
					xFiles[xRel.toStr()]={sFn: xFn.toStr(), tMod: tMod, nSize: nSize};
					nFiles++;
				}
			}
			nDirs++;
		};

		var _retrieve_fileinfo_recursively=function(sRoot, sDir, xFiles){

			_retrieve_fileinfo(sRoot, sDir, xFiles);

			if(bSubFolders){
				var xDir=new CLocalDir(sRoot, sDir);
				var v=xDir.listFolders('*', (sAttrFilters + (bHiddenFolders?'+ Hidden':'')));
				for(var i in v){
					var sName=v[i];
					if(!sName || sName==='.' || sName==='..') continue;
					if(!_dir_ignoring(sName)){
						var xSubDir=new CLocalDir(sDir, sName);
						_retrieve_fileinfo_recursively(sRoot, xSubDir.toStr(), xFiles);
					}
				}
			}
		};

		var _format_date=function(t){
			var s='';
			s+=t.getFullYear()+'-'+(t.getMonth()+1)+'-'+t.getDate();
			s+=' ';
			s+=t.getHours()+':'+t.getMinutes()+':'+t.getSeconds();
			return s;
		};

		var _thousand_separators=function(n){return (n||'').toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,");};

		var iMissing=0, iDiffSize=1, iDiffDate=2;

		var _compare_existence=function(v1, v2){
			var vDiff=[];
			for(var j in v1){
				if(!ui.showProgressMsg('Test existence: ' + j, true)) throw 'User abort by Esc.';
				if(!v2[j]){
					vDiff[vDiff.length]={sTag: j, iType: iMissing};
				}
			}
			return vDiff;
		};

		var _compare_filesize=function(v1, v2){
			var vDiff=[];
			for(var j in v1){
				if(!ui.showProgressMsg('Test filesize: ' + j, true)) throw 'User abort by Esc.';
				if(v2[j]){
					var r1=v1[j], r2=v2[j];
					if(r1.nSize !== r2.nSize){
						vDiff[vDiff.length]={sTag: j, iType: iDiffSize, nSize1: r1.nSize, nSize2: r2.nSize};
					}//else log(r1.nSize+', '+r2.nSize);
				}
			}
			return vDiff;
		};

		var _compare_datemodified=function(v1, v2){
			var vDiff=[];
			for(var j in v1){
				if(!ui.showProgressMsg('Test tiemstamp: ' + j, true)) throw 'User abort by Esc.';
				if(v2[j]){
					var r1=v1[j], r2=v2[j];
					var t1=r1.tMod, t2=r2.tMod, nDiff=Math.floor(Math.abs(t1-t2)/1000);
					if(nDiff!==0){
						//2017.9.8 consider of exFAT file system, timestamp of files may be slightly truncated when writting into exFAT;
						var bDiff=true;
						if(nDiff>0 && nDiff<=2 && r1.nSize===r2.nSize){
							//var xFn1=new CLocalFile(r1.sFn);
							//var xFn2=new CLocalFile(r2.sFn);
							//if(xFn1.hash('sha1')==xFn2.hash('sha1')){
							//	bDiff=false;
							//}
							bDiff=false;
						}
						if(bDiff) vDiff[vDiff.length]={sTag: j, iType: iDiffDate, tMod1: t1, tMod2: t2};
					}
				}
			}
			return vDiff;
		};

		var _format_msg=function(vDiff){
			var s='', c=0;
			for(var i in vDiff){
				var d=vDiff[i];
				s+='\n'; c++;
				switch(d.iType){
					case iMissing:
						s+='    '; //'\t';
						s+=d.sTag;
						break;
					case iDiffSize:
						s+='    '; //'\t';
						s+=d.sTag;
						s+='    '; //'\t';
						s+=_thousand_separators(d.nSize1)+' <--> '+_thousand_separators(d.nSize2);
						break;
					case iDiffDate:
						s+='    '; //'\t';
						s+=d.sTag;
						s+='    '; //'\t';
						s+=_format_date(d.tMod1) + ' <--> ' + _format_date(d.tMod2);
						break;
				}
			}
			return s;
		};

		var _compare_folder=function(v1, v2, bLookAtAttr){

			var s='', vDiff;

			vDiff=_compare_existence(v1, v2);
			if(vDiff.length>0){
				s+='\n\n' + _lc2('FilesMissing', 'File(s) missing in the latter (%nFiles%)').replace(/%nFiles%/g, vDiff.length.toString());
				s+=_format_msg(vDiff);
			}else{
				//s+='\n\t';
				//s+='** All looks fine **';
			}

			if(bLookAtAttr){
				vDiff=_compare_filesize(v1, v2);
				if(vDiff.length>0){
					s+='\n\n' + _lc2('DiffFileSize', 'File(s) with size changed (%nFiles%)').replace(/%nFiles%/g, vDiff.length.toString());
					s+=_format_msg(vDiff);
				}else{
					//s+='\n\t';
					//s+='** All looks fine **';
				}

				vDiff=_compare_datemodified(v1, v2);
				if(vDiff.length>0){
					s+='\n\n' + _lc2('DiffDateMod', 'File(s) with timestamp changed (%nFiles%)').replace(/%nFiles%/g, vDiff.length.toString());
					s+=_format_msg(vDiff);
				}else{
					//s+='\n\t';
					//s+='** All looks fine **';
				}
			}

			return s;
		};

		var _do_compare=function(d1, d2){
			logd('Compare disk folders: ' + d1 + ' <==> ' + d2);

			var v1={}, v2={}, misc1={}, misc2={};

			_retrieve_fileinfo_recursively(d1, './', v1);
			_retrieve_fileinfo_recursively(d2, './', v2);

			var s='', sTitle=_lc2('CompareWith', 'Comparing <%Dir1%> with <%Dir2%>');

			s+=sTitle.replace('%Dir1%', d1).replace('%Dir2%', d2);
			s+=_compare_folder(v1, v2, true);

			s+='\n\n';
			s+=sTitle.replace('%Dir1%', d2).replace('%Dir2%', d1);
			s+=_compare_folder(v2, v1, false);

			return s;
		};

		ui.initProgressRange(plugin.getScriptTitle(), 0);

		var sInfo=_do_compare(sDir1, sDir2); //try{}catch(e){}

		ui.destroyProgressBar();

		if(sInfo){
			textbox({
					sTitle: plugin.getScriptTitle()
					, sDescr: _lc2('Result', 'Differences detected between the two folders;')
					, sDefTxt: sInfo
					, bReadonly: true
					, bWordwrap: false
					, nWidth: 80
					, nHeight: 80
				});
		}

	}

//}catch(e){
//	ui.destroyProgressBar();
//	alert(e);
//}
