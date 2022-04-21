
//sValidation=nyfjs
//sCaption=Find duplicate files ...
//sHint=Find duplicate files in specified disk folders
//sCategory=MainMenu.Tools
//sID=p.FindDupFiles
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

var vFilesToIgnore=['.DS_Store'];
var vDirsToIgnore=[];

try{
	var sCfgKey1='FindDupFiles.sDir1', sCfgKey2='FindDupFiles.sDir2';
	var vFields = [
				{sField: "folder", sLabel: _lc2('Dir1', 'Find duplicate files in the folder'), sInit: localStorage.getItem(sCfgKey1)||''}
				, {sField: "textarea", sLabel: _lc2('Dir2', 'Search additional folders (optional)'), sInit: localStorage.getItem(sCfgKey2)||'', bReq: false, bWordwrap: false}
			];

	var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 600, bVert: true});
	if(vRes && vRes.length >0){

		var sDir1=_trim(vRes[0]), sDir2=_trim(vRes[1]);

		localStorage.setItem(sCfgKey1, sDir1);
		localStorage.setItem(sCfgKey2, sDir2);

		var vDirs=[], vExtra=sDir2.replace(/\r\n/g, ';').replace(/\n/g, ';').split(';');
		if(sDir1) vDirs.push(sDir1);
		for(var j in vExtra){
			var bFound=false;
			for(var i in vDirs){
				if(vExtra[j]===vDirs[i]){
					bFound=true;
					break;
				}
			}
			if(!bFound){
				vDirs.push(_trim(vExtra[j]));
			}
		}

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

		var nFiles=0, nDirs=0, tStart=new Date();
		var _retrieve_fileinfo=function(sDir, xSizes){
			var xDir=new CLocalDir(sDir);
			var v=xDir.listFiles('*', 'NoDot | NoDotDot | Readable | Hidden');
			for(var i in v){
				var sName=v[i];
				if(sName==='.' || sName==='..') continue;
				if(!_file_ignoring(sName)){
					//var sHint='[Files: ' + nFiles + ', Dirs: ' + nDirs + ' Elapsed: ' + Math.floor((new Date() - tStart)/1000) + ']';
					var sHint='Listing [Files: ' + nFiles + ', Dirs: ' + nDirs + ']';
					var xFn=new CLocalFile(sDir, sName);
					if(!plugin.showProgressMsg(sHint + ': ' + xFn.toStr(), true)) throw 'User abort by Esc.';
					var nSize=xFn.getFileSize(), sSize=nSize.toString(16);
					var tMod=xFn.getModifyTime();
					if(xSizes[sSize]){
						xSizes[sSize].push(xFn.toStr());
					}else{
						xSizes[sSize]=[xFn.toStr()];
					}
					nFiles++;
				}
			}
			nDirs++;
		};

		var _retrieve_fileinfo_recursively=function(sDir, xSizes){

			_retrieve_fileinfo(sDir, xSizes);

			var xDir=new CLocalDir(sDir);
			var v=xDir.listFolders('*', 'NoDot | NoDotDot | Readable | Hidden');
			for(var i in v){
				var sName=v[i];
				if(!sName || sName==='.' || sName==='..') continue;
				if(!_dir_ignoring(sName)){
					var xSubDir=new CLocalDir(sDir, sName);
					_retrieve_fileinfo_recursively(xSubDir.toStr(), xSizes);
				}
			}
		};

		var _find_duplicates=function(vDirs){

			plugin.initProgressRange(plugin.getScriptTitle(), 0);

			var xSizes={};
			for(var j in vDirs){
				var sDir=vDirs[j];
				if(sDir){
					_retrieve_fileinfo_recursively(sDir, xSizes);
				}
			}

			var xHash={};
			for(var j in xSizes){
				var vFn=xSizes[j];
				if(typeof(vFn)==='object' && vFn.length>1){
					for(var i in vFn){
						var sFn=vFn[i];
						if(sFn){
							var xFn=new CLocalFile(sFn);
							var nSize=xFn.getFileSize();
							if(nSize.toString(16)===j){
								//var sHint=' SHA1 [Elapsed: ' + Math.floor((new Date() - tStart)/1000) + ']';
								var sHint='SHA1';
								if(!plugin.showProgressMsg(sHint + ': ' + sFn, true)) throw 'User abort by Esc.';
								var h=xFn.digest('sha1');
								if(h){
									if(xHash[h]){
										xHash[h].push(sFn);
									}else{
										xHash[h]=[sFn];
									}
								}
							}
						}
					}
				}
			}

			var _format_date=function(t){
				var s='';
				s+=t.getFullYear()+'-'+(t.getMonth()+1)+'-'+t.getDate();
				s+=' ';
				s+=t.getHours()+':'+t.getMinutes()+':'+t.getSeconds();
				return s;
			};

			var _thousand_separators=function(n){return (n||'').toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,");};

			plugin.showProgressMsg('Creating reports ...', true);

			var _num_padding=function(i, nMax, sPad){
				var w=nMax.toString().length, r=i.toString();
				while(r.length<w){
					r=(sPad||' ').toString()+r;
				}
				return r;
			};

			var vLog=[], nHash=0;
			for(var j in xHash){
				var vFn=xHash[j];
				if(typeof(vFn)=='object' && vFn.length>1){
					if(vLog.length>0) vLog.push('');
					vLog.push('SHA1: ' + j.replace(/_/g, '0') + ' (' + vFn.length + ')');
					for(var i in vFn){
						var sFn=vFn[i];
						var xFn=new CLocalFile(sFn);
						var nSize=xFn.getFileSize();
						var tMod=xFn.getModifyTime(), tCre=xFn.getCreateTime();
						var sInfo=_lc('p.Common.DateModified', 'Date modified') + ': ' + _format_date(tMod)
							+ '  '
							+ _lc('p.Common.DateCreated', 'Date created') + ': ' + _format_date(tMod)
							+ '  '
							+ _lc('p.Common.FileSize', 'Size') + ': ' + _thousand_separators(nSize)
							;
						vLog.push('    ' + _num_padding(parseInt(''+i)+1, vFn.length, ' ') + '. ' + sFn);
						vLog.push('\t(' + sInfo + ')');
					}
					nHash++;
				}
			}

			plugin.destroyProgressBar();

			if(vLog.length>0){
				textbox(
					{
						sTitle: plugin.getScriptTitle()
						, sDescr: _lc2('Result', 'List of duplicate files found in the given folders by SHA1 values') + ' ('+nHash + ')'
						, sDefTxt: vLog.join('\n')
						, bReadonly: true
						, bWordwrap: false
						, nWidth: 80
						, nHeight: 80
					}
				);
			}else{
				alert(_lc2('NoDupFiles', 'No duplicate files found in the specified folders.'));
			}

		};

		_find_duplicates(vDirs);

	}

}catch(e){
	plugin.destroyProgressBar();
	alert(e);
}
