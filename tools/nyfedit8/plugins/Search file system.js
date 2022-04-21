
//sValidation=nyfjs
//sCaption=Search local file system ...
//sHint=Search the local file system for words or regular expression
//sCategory=MainMenu.Search
//sID=p.SearchLFS
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


var nMaxFileSize=1024*1024*50;		//files of size >50MB are ignred;
var bCacheFileContent=true;		//specify if or not to cache file content in the database: ~/Search file system.nyf;
var bCacheViewable=false;		//specify if or not to make cached contents viewable within Mybase;

//file types to be ignored can be specified here;
var c_sExtsIgnore=('nyf;exe;dll;com;lrc;nls;cpl;ocx;drv;so;obj;dat;bmp;jpg;jpeg;png;gif;tiff;rar'
		   + ';7z;cab;tar;gz;avi;rm;rvmb;mov;qt;flv;mpeg;swf;mp4;mp3;ogg;wav;aac;pcm;wma'
		   ).replace(/[\s\r\n]+/g, '').replace(/([.+-])/g, '\\$1').replace(/;/g, '|');

//file types to be considered as plain text can be specified here;
var c_sExtTxt=('txt;ini;log;csv'
	       + ';ada;apacheconf;arm;osascript;adoc' //ada, apache, armasm, applescript
	       + ';sh;zsh' //bash
	       + ';bf;clean;icl'
	       + ';dcl;clj;cs;csharp;cr;crm;pcmk;cos;cls;coffee;cson;iced;cmake.in;capnp'
	       + ';css'
	       + ';c;cc;cpp;cxx;h;h++;hpp;hxx' //c/c++
	       + ';dst;bat;cmd;docker;bind;zone;jinja' //dos, docker-file, dns-zone-file
	       + ';patch' //diff
	       + ';dpr;dfm;pas;pascal;freepascal;lazarus;lpr;lfm' //delphi
	       + ';erl' //erlang
	       + ';fs;f90;f95' //fortan
	       + ';go;golang' //golang
	       + ';nc;gss;gms'
	       + ';hx;hs;hbs'
	       + ';ini;js;json;java' //ini, js, java
	       + ';jl' //google julia
	       + ';lua;lisp'
	       + ';mips;matlib;m;moo;mma'
	       + ';md;mkdown;mkd;mk;mak' //markdown, makefile
	       + ';nixos;nim;nginxconf'
	       + ';scad;ml;mm;objc;obj-c' //objective-c
	       + ';py;gyp;bp;bpi;pp;ps;php;php3;php4;php5;php6;pl;pm' //python, php, perl
	       + ';qt;qml;k;kdb' //qml
	       + ';r' //R-lang
	       + ';rs;rb;gemspec;podspec;thor;irb' //rust, ruby
	       + ';swift;sql'
	       + ';ts;craftcms;tex;tk' //typescript, tex, tcl
	       + ';v;sv;svh;vbs;vb' //vbscript, vb.net
	       + ';xpath;xq' //xquery
	       + ';html;xhtml;htm;rss;atom;xjb;xsd;xsl;plist;xml' //xml
	       + ';tao' //XL
	       + ';yml;YAML;yaml' //yaml
	       + ';zep' //Zephir
	       + ';url' //shortcuts
	       + ';svg' //svg images
	       ).replace(/[\s\r\n]+/g, '').replace(/([.+-])/g, '\\$1').replace(/;/g, '|');

var c_xReIgnore=new RegExp('^(' + c_sExtsIgnore + ')$', 'i');
var c_xReTxt=new RegExp('^(' + c_sExtTxt + ')$', 'i');

var _to_ignore=function(sExt){return c_xReIgnore.test(sExt);};
var _is_text_file=function(sExt){return c_xReTxt.test(sExt);};

var _scale_file_size=function(n){
	let nKilo=1024;
	let nMega=nKilo*nKilo;
	let nGiga=nKilo*nKilo*nKilo;
	let s='';
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

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

//try{

	var sCfgKey1='SearchLFS.sPhrase', sCfgKey2='SearchLFS.sDir', sCfgKey3='SearchLFS.iOption';

	var vOpts=[_lc2('Names', 'Search file names only')
		   , _lc2('Content', 'Search file content only')
		   , _lc2('Both', 'Search file names & content')
			];

	var vFields=[{sField: "lineedit", sLabel: _lc2('Phrase', 'Enter a text string or RegExp (e.g. /pattern/i ) to search for'), sInit: localStorage.getItem(sCfgKey1)||''}
		     , {sField: "folder", sLabel: _lc2('Folder', 'Select a folder in file system'), sInit: localStorage.getItem(sCfgKey2)||''}
		     , {sField: "combolist", sLabel: _lc2('Options', 'Options'), vItems: vOpts, sInit: localStorage.getItem(sCfgKey3)||''}
			];

	var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 500, vMargins: [2, 0, 30, 0], bVert: true});
	if(vRes && vRes.length>=3){

		let sFor=vRes[0], sDir=vRes[1], iSel=vRes[2];

		if(sFor && sDir && iSel>=0){

			localStorage.setItem(sCfgKey1, sFor);
			localStorage.setItem(sCfgKey2, sDir);
			localStorage.setItem(sCfgKey3, iSel);

			let bSearchNames=false, bSearchContent=false;
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

			ui.initProgressRange(plugin.getScriptTitle(), 0);

			logd('Search files in local directory: ' + sDir + '; For: ' + sFor + '; Look into: ' + vOpts[iSel]);

			let xRE;
			if(1){
				//detect if it's a regexp pattern;
				let v=sFor.match(/^\/(.*)\/([igm]*)$/);
				if(v && v.length>1){
					let sRE=v[1], sOpt=v[2];
					if(sRE){
						xRE=new RegExp(sRE, sOpt.replace(/g/gi, '')); //no use of 'g'.
						logd('RegExp detected: ' + xRE);
					}
				}
			}

			let _match_boolean=function(s){
				let bOK=false;
				//To-do ... ??????????
				return bOK;
			};

			let _match=function(s){
				let bOK=false; //s=s.replace(/[\r\n]/g, ' ');
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

			let _traverse_branch=function(sPath, sLeaf, xAct){
				if(xAct) xAct(sPath, sLeaf);
				_traverse_children(sPath, sLeaf, xAct);
			};

			let _traverse_children=function(sPath, sLeaf, xAct){
				let xPath=new CLocalDir(sPath); if(sLeaf) xPath.append(sLeaf);
				let vSub=xPath.listFolders();
				for(let i in vSub){
					let sSub=vSub[i];
					if(sSub==='.' || sSub==='..') continue;
					_traverse_branch(xPath.toStr(), sSub, xAct);
				}
			};

			var xNyfCache;
			if(bSearchContent && bCacheFileContent){
				let xFnCache; //=new CLocalFile(plugin.getScriptFile()); xFnCache.changeExtension('.nyf');
				if(1){
					let sScriptName=new CLocalFile(plugin.getScriptFile()).getLeafName();
					xFnCache=new CLocalFile(platform.getHomePath(), sScriptName.replace(/[\s]+/g, '_'));
					xFnCache.changeExtension('.nyf');
					logd('cacheFile: ' + xFnCache.toStr());
				}

				//2021.5.10 Do Not create the new file, as CNyfDB.open() will create one (for r/w) if not present;
				//if(!xFnCache.exists()) xFnCache.createFile();

				//if(xFnCache.exists())
				if(1){

					ui.showProgressMsg('Loading cached data');

					xNyfCache=new CNyfDb();
					if(xNyfCache.open(xFnCache.toStr(), false)){
						xNyfCache.setCompressLevel(9);
						xNyfCache.save();
					}
				}
			}

			let vRes=[];
			let _push=function(sPath, sLeaf, sHint){
				let xPath=new CLocalFile(sPath); if(sLeaf) xPath.append(sLeaf);
				let sItem=xPath.toStr(); if(sHint) sItem+=' --> '+sHint;
				if(vRes.indexOf(sItem)<0){
					vRes.push(sItem);
					logd('match[' + vRes.length + ']: ' + sItem);
				}
			};

			let _make_into_ssgpath=function(sFn){
				let p=(sFn||'').replace(/:/, '').replace(/[\\]/g, '/').replace(/^([^/])(.+)$/, '/$1$2').replace(/[/]{2,}/g, '/');
				if(bCacheViewable) p=new CLocalFile(plugin.getDefRootContainer(), p).toStr();
				return p;
			};

			let _get_file_content=function(sPath, sName, sStatus){

				let xFn=new CLocalFile(sPath, sName);
				let sSsgFn=_make_into_ssgpath(xFn.toStr());
				let xDate=xFn.getModifyTime(), sExt=xFn.getExtension(false).toLowerCase();

				let sContent, bToCache=false;
				if(_is_text_file(sExt)){

					let bContinue=ui.showProgressMsg(sStatus+' [text loading...]', true);
					if(!bContinue){throw 'User abort by ESC.';}

					//2012.9.2 for text content files, simply load as text, without having to parse them, neither to be cached;
					sContent=xFn.loadText('auto');
					logd('Plain text: ' + xFn.toStr());

				}else{

					let bEqual=((xDate||'').toString()===(xNyfCache.getModifyTime(sSsgFn)||'').toString());
					if(xNyfCache && xNyfCache.isOpen() && xNyfCache.fileExists(sSsgFn) && bEqual){

						let bContinue=ui.showProgressMsg(sStatus+' [cache loading...]', true);
						if(!bContinue){throw 'User abort by ESC.';}

						sContent=xNyfCache.loadText(sSsgFn, 'auto');
						logd('Use cache: ' + xFn.toStr());

					}else{

						let bContinue=ui.showProgressMsg(sStatus+' [parsing...]', true);
						if(!bContinue){throw 'User abort by ESC.';}

						sContent=platform.parseFile(xFn.toStr());
						bToCache=true;

					}
				}

				if(sContent){
					//sContent=sContent.replace(/[\r\n]+/g, ' ');
					//sContent=sContent.replace(/[\s]{2,}/g, ' ');
				}

				if(sContent!=='' && bToCache && xNyfCache && xNyfCache.isOpen()){

					let bContinue=ui.showProgressMsg(sStatus+' [caching...]', true);
					if(!bContinue){throw 'User abort by ESC.';}

					xNyfCache.createTextFile(sSsgFn, sContent);
					xNyfCache.setModifyTime(sSsgFn, xDate);
				}

				return sContent;
			};

			let _retrieve_shortcut_target=(xFn)=>{
				let sRes;
				if(xFn){
					if(typeof(xFn)==='string') xFn=new CLocalFile(xFn);
					let v=xFn.loadText('auto').split(/[\r\n]+/), bLnk=false;
					for(let s of v){
						s=s.replace(/^[\s\t]+|[\s\t]+$/g, '');
						if( (/^\[InternetShortcut\]$/i).test(s) ){
							bLnk=true;
						}else{
							if(bLnk){
								let m=s.match(/^(URL=)(.+)$/i);
								if(m && m[2]){
									sRes=m[2];
									break;
								}
							}
						}
					}
				}
				return sRes;
			};

			let _search_file_content=function(sPath0, sName0, sStatus){

				let xFn0=new CLocalFile(sPath0, sName0);

				let xFnDst, sFnDst, sPath=sPath0, sName=sName0, sExt=xFn0.getExtension(false), nLen=xFn0.getFileSize();

				if(nLen>0 && nLen<=nMaxFileSize && !_to_ignore(sExt)){
					if(xFn0.isSymLink()){
						sFnDst=xFn0.getSymLinkTarget();
						if(sFnDst){
							logd('symLinkTarget: ' + xFn0.toStr() + ' --> ' + sFnDst);
							xFnDst=new CLocalFile(sFnDst);
							sPath=xFnDst.getDirectory();
							sName=xFnDst.getLeafName();
							sExt=xFnDst.getExtension(false);
							nLen=xFnDst.getFileSize();
						}
					}else{
						xFnDst=xFn0;
					}
				}

				if(xFnDst){
					if(nLen>0 && nLen<=nMaxFileSize && !_to_ignore(sExt)){
						let sTxt=_get_file_content(sPath, sName, sStatus);
						if(sTxt && _match(sTxt)){
							_push(sPath0, sName0, sFnDst);
						}
					}
				}
			};

			let nFolders=0, nFiles=0;
			let _xAct=function(sPath, sLeaf){

				nFolders++;

				if(sLeaf && _match(sLeaf)){
					_push(sPath, sLeaf);
				}

				let xPath=new CLocalDir(sPath); if(sLeaf) xPath.append(sLeaf);

				let bContinue=ui.showProgressMsg('('+vRes.length+') '+xPath.toStr(), true);
				if(!bContinue){throw 'User abort by ESC.';}

				let vNames=xPath.listFiles();
				for(let i in vNames){
					let sName=vNames[i]; nFiles++;
					let xFn=new CLocalFile(xPath.toStr()); xFn.append(sName);
					if(xFn.isDir()){

						if(_match(sName)){
							_push(sPath, sLeaf);
						}

					}else{

						let nLen=xFn.getFileSize();

						let sLen=_scale_file_size(nLen);

						let sStatus='['+vRes.length+'/'+nFiles+'/'+nFolders+'] '+sName+' ['+sLen+']';

						let bContinue=ui.showProgressMsg(sStatus, true);
						if(!bContinue){throw 'User abort by ESC.';}

						if(bSearchNames && sName && _match(sName)){
							_push(xPath.toStr(), sName);
						}

						if(bSearchContent && nLen>0 && nLen<=nMaxFileSize){
							_search_file_content(xPath.toStr(), sName, sStatus);
						}
					}
				}

				//_gc();
			};

			try{_traverse_branch(sDir, '', _xAct);}catch(e){}

			if(xNyfCache && xNyfCache.isOpen() && xNyfCache.isModified()){
				ui.showProgressMsg('Flushing content cache', false);
				xNyfCache.save();
			}

			let nFound=vRes.length;
			let sMsg=_lc2('None', 'No entries matched "%sPattern%".').replace(/%sPattern%/g, sFor);
			if(nFound>0){
				sMsg=_lc2('Done', 'Total (%nFound%) entries matched the pattern: %sPattern%').replace(/%nFound%/g, nFound).replace(/%sPattern%/g, sFor);
			}

			ui.showProgressMsg(sMsg, false);

			let s='';
			if(nFound>0){
				for(let i in vRes){
					if(s) s+='\r\n';
					s+=vRes[i];
				}
			}

			ui.destroyProgressBar();
			if(s){
				textbox({
						sTitle: _lc2('Results', 'Search results')
						, sDescr: sMsg
						, sDefTxt: s
						, bReadonly: true
						, bWordwrap: false
						, nWidth: 70
						, nHeight: 70
					});
			}else{
				alert(sMsg);
			}
		}
	}

//}catch(e){
//	ui.destroyProgressBar();
//	alert(e);
//}
