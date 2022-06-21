
//sValidation=nyfjs
//sCaption=Search local file system ....
//sHint=Search the local file system for words or with regular expression
//sCategory=MainMenu.Search
//sID=p.SearchLFS
//sAppVerMin=7.0
//sShortcutKey=Ctrl+Shift+F3
//sAuthor=wjjsoft

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

//to ignore files of types defined below;
var vExtsIgnore='nyf;exe;dll;com;lrc;nls;cpl;ocx;drv;so;obj;dat;bmp;jpg;jpeg;png;gif;tiff;zip;rar;7z;cab;tar;gz;avi;rm;rvmb;mov;qt;flv;mpeg;swf;mp4;mp3;ogg;wav;aac;pcm;wma'.split(';');

//to be considered as text file of types defined below;
var vExtsText='txt;ini;log;cpp;hpp;cc;c;h;pas;mak;idl;def;cs;css;php;asp;jsp;rb;js;java;lua;py;pl;bas;asm;as;bat;diz'.split(';');

var nMaxFileSize=1024*1024*50;		//to ignore files of size>50MB;
var bCacheFileContent=true;		//whether to cache file content in a specific .nyf database;
var bCacheViewable=false;		//whether to have content viewable within myBase;

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

try{

	var sCfgKey='SearchLFS.Phrase';
	var sMsg=_lc2('Phrase', 'Enter a text string or a Regular Expression (eg. /pattern/i ) to search for:');
	var sFor=prompt(sMsg, localStorage.getItem(sCfgKey)||''); sFor=_trim(sFor);
	if(sFor){

		localStorage.setItem(sCfgKey, sFor);

		sCfgKey='SearchLFS.Folder';
		sMsg=_lc2('Folder', 'Select a folder to search.');
		var sDir=platform.browseForFolder(sMsg, localStorage.getItem(sCfgKey)||'');
		if(sDir){

			localStorage.setItem(sCfgKey, sDir);

			var vActs=[
				  _lc2('Names',		'1. Search file names only')
				, _lc2('Content',	'2. Search file content only')
				, _lc2('Both',		'3. Search both file names & content')
				];

			sCfgKey='SearchLFS.iAction';
			sMsg=_lc('p.Common.SelAction', 'Please select an action from within the dropdown list');
			var iSel=dropdown(sMsg, vActs, localStorage.getItem(sCfgKey));
			if(iSel>=0){

				localStorage.setItem(sCfgKey, iSel);

				var bSearchNames=false, bSearchContent=false;
				switch(iSel){
					case 0:
						bSearchNames=true;
						bSearchContent=false;
						break;
					case 1:
						bSearchNames=false;
						bSearchContent=true;
						break;
					case 2:
						bSearchNames=true;
						bSearchContent=true;
						break;
				}

				plugin.initProgressRange(plugin.getScriptTitle(), 0);

				var xRE;
				{
					//construct the xRE;
					var v=sFor.match(/^\/(.*)\/([igm]*)$/);
					if(v && v.length>1){
						var sRE=v[1], sOpt=v[2];
						if(sRE){
							xRE=new RegExp(sRE, sOpt.replace(/g/gi, '')); //remove the redundant 'g'.
						}
					}
				}

				var _match_boolean=function(s){
					var bOK=false;
					//To-do ... ??????????
					return bOK;
				};

				var _match=function(s){
					var bOK=false, s=s.replace(/[\r\n]/g, ' ');
					if(xRE){
						bOK=s.match(xRE);
					}
					if(!bOK){
						bOK=_match_boolean(s);
					}
					if(!bOK){
						bOK=s.toLowerCase().indexOf(sFor.toLowerCase())>=0;
					}
					return bOK;
				};

				var bCancel=false;
				var _traverse_branch=function(sPath, sLeaf, xAct){
					if(xAct) xAct(sPath, sLeaf);
					if(!bCancel) _traverse_children(sPath, sLeaf, xAct);
				};

				var _traverse_children=function(sPath, sLeaf, xAct){
					var xPath=new CLocalDir(sPath); if(sLeaf) xPath.append(sLeaf);
					var vSub=xPath.listFolders();
					for(var i in vSub){
						var sSub=vSub[i];
						if(sSub=='.' || sSub=='..') continue;
						_traverse_branch(xPath.toString(), sSub, xAct);
						if(bCancel) break;
					}
				};

				var xNyfCache=new CNyfDb();
				if(bSearchContent && bCacheFileContent && xNyfCache){
					//var xFnCache=new CLocalFile(plugin.getScriptFile()); xFnCache.changeExtension('.nyf');
					{
						var sScriptName=new CLocalFile(plugin.getScriptFile()).getLeafName();
						var xFnCache=new CLocalFile(platform.getHomePath()); xFnCache.append(sScriptName);
						xFnCache.changeExtension('.nyf');
					}
					if(!xFnCache.exists()){
						xFnCache.createFile();
					}
					if(xFnCache.exists()){

						plugin.showProgressMsg('Content cache loading');

						if(xNyfCache.open(xFnCache, false)){
							xNyfCache.setCompressLevel(9);
							xNyfCache.save();
						}
					}
				}

				var vRes=[];
				var _push=function(sPath, sLeaf, sHint){
					var xPath=new CLocalFile(sPath); if(sLeaf) xPath.append(sLeaf);
					var sItem=xPath.toString(); if(sHint) sItem+=' --> '+sHint;
					if(vRes.indexOf(sItem)<0){
						vRes.push(sItem);
					}
				};

				var _make_ssgpath=function(sFn){
					return (sFn||'').replace(/:/, '');
				};

				if(bCacheViewable){
					_make_ssgpath=function(sFn){
						return plugin.getDefRootContainer()+'\\'+(sFn||'').replace(/:/, '');
					};
				}

				//2012.9.3 utilize 'map' for fast find;
				var xExtsIgnore={}, xExtsText={};
				for(var i in vExtsIgnore){xExtsIgnore[vExtsIgnore[i]]=1;}
				for(var i in vExtsText){xExtsText[vExtsText[i]]=1;}
				var _test_filetype=function(xExts, sExt){return xExts[sExt.toLowerCase().replace(/\./g, '')];};
				var _to_ignore=function(sExt){return _test_filetype(xExtsIgnore, sExt);};
				var _is_text_file=function(sExt){return _test_filetype(xExtsText, sExt);};

				var _get_file_content=function(sPath, sName, sStatus){

					var xFn=new CLocalFile(sPath); xFn.append(sName);
					var sSsgFn=_make_ssgpath(xFn.toString());
					var xDate=xFn.getModifyTime(), sExt=xFn.getExtension(true);

					var sContent, bToCache=false;
					if(_is_text_file(sExt)){

						var bContinue=plugin.showProgressMsg(sStatus+' [text loading...]', true);
						if(!bContinue)return '';

						//2012.9.2 for text content files, simply load as text, without having to parse them;
						sContent=xFn.loadText('auto');

					}else{

						if(xNyfCache.isOpen() && xNyfCache.fileExists(sSsgFn) && xDate.toString()==xNyfCache.getModifyTime(sSsgFn)){

							var bContinue=plugin.showProgressMsg(sStatus+' [cache loading...]', true);
							if(!bContinue)return '';

							sContent=xNyfCache.loadText(sSsgFn, 'UTF-8');

						}else{

							var bContinue=plugin.showProgressMsg(sStatus+' [parsing...]', true);
							if(!bContinue)return '';

							sContent=platform.parseFile(xFn.toString());
							bToCache=true;
						}
					}

					if(sContent){
						sContent=sContent.replace(/[\r\n]/g, ' ');
						sContent=sContent.replace(/\s{2,}/g, ' ');
					}

					if(sContent!='' && bToCache && xNyfCache.isOpen()){

						var bContinue=plugin.showProgressMsg(sStatus+' [caching...]', true);
						if(!bContinue) return '';

						xNyfCache.createTextFile(sSsgFn, sContent);
						xNyfCache.setModifyTime(sSsgFn, xDate);
					}

					return sContent;
				};

				var _search_file_content=function(sPath, sName, sStatus){
					var xFn=new CLocalFile(sPath); xFn.append(sName);
					var sExt=xFn.getExtension(true), nLen=xFn.getFileSize();

					var xFnDst;
					if(nLen>0 && nLen<=nMaxFileSize && !_to_ignore(sExt)){
						if(sExt.toLowerCase()=='.lnk'){
							//for shortcuts to retrieve the target file;
							var sFnDst; //=xFn.getShortcutTarget();
							if(sFnDst){
								xFnDst=new CLocalFile(sFnDst);
								sExt=xFnDst.getExtension(true);
								nLen=xFnDst.getFileSize();
							}
						}else{
							xFnDst=xFn;
						}
					}

					if(xFnDst){
						if(nLen>0 && nLen<=nMaxFileSize && !_to_ignore(sExt)){
							var sTxt=_get_file_content(sPath, sName, sStatus);
							if(sTxt && _match(sTxt)){
								_push(sPath, sName, sFnDst);
							}
						}
					}
				};

				var _xAct=function(sPath, sLeaf){

					if(sLeaf && _match(sLeaf)){
						_push(sPath, sLeaf+'\\');
					}

					var xPath=new CLocalDir(sPath); if(sLeaf) xPath.append(sLeaf);

					var bContinue=plugin.showProgressMsg('('+vRes.length+') '+xPath.toString(), true);
					if(!bContinue){bCancel=true; return;}

					var vNames=xPath.listFiles();
					for(var i in vNames){
						var sName=vNames[i];
						var xFn=new CLocalFile(xPath.toString()); xFn.append(sName);
						var nLen=xFn.getFileSize();

						var sLen=_scale_file_size(nLen);

						var sStatus='['+vRes.length+'] '+sName+' ['+sLen+']';

						var bContinue=plugin.showProgressMsg(sStatus, true);
						if(!bContinue){bCancel=true; return;}

						if(bSearchNames && sName && _match(sName)){
							_push(xPath.toString(), sName);
						}

						if(bSearchContent && nLen>0 && nLen<=nMaxFileSize){
							_search_file_content(xPath.toString(), sName, sStatus);
						}
					}

					_gc();
				};

				_traverse_branch(sDir, '', _xAct);

				if(xNyfCache.isOpen() && xNyfCache.isModified()){
					plugin.showProgressMsg('Flushing content cache', false);
					//xNyfCache.purge();
					//xNyfCache.optimizeForSize();
					xNyfCache.save();
				}

				var nFound=vRes.length;
				var sMsg=_lc2('None', 'No entries matched "%sPattern%".').replace(/%sPattern%/g, sFor);
				if(nFound>0){
					sMsg=_lc2('Done', 'Total (%nFound%) entries matched the pattern: %sPattern%').replace(/%nFound%/g, nFound).replace(/%sPattern%/g, sFor);
				}

				plugin.showProgressMsg(sMsg, false);

				var s='';
				if(nFound>0){
					for(var i in vRes){
						if(s) s+='\r\n';
						s+=vRes[i];
					}
				}

				plugin.destroyProgressBar();
				if(s){
					textbox({
						sTitle: _lc2('Results', 'Search results')
						, sDescr: sMsg
						, sDefTxt: s
						, bReadonly: true
						, bWordwrap: false
						, nWidth: 40
						, nHeight: 70
					});
				}else{
					alert(sMsg);
				}
			}
		}
	}

}catch(e){
	alert(e);
}
