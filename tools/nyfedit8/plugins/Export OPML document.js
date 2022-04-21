
//sValidation=nyfjs
//sCaption=Export OPML document ...
//sHint=Export sub items in the current branch as OPML
//sCategory=MainMenu.Share
//sCondition=CURDB; OUTLINE; CURINFOITEM
//sID=p.ExportOpml
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

//try{

	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		if(plugin.isContentEditable()) plugin.commitCurrentChanges();

		var sCurItem=plugin.getCurInfoItem(-1);
		var sItemTitle=xNyf.getFolderHint(sCurItem)||'untitled';

		var sCfgKey='ExportOpml.Dir';

		var xInitFn = new CLocalFile(localStorage.getItem(sCfgKey)||platform.getHomePath()||'', _validate_filename(sItemTitle) + '.opml');

		var sDstFn=platform.getSaveFileName(
			{ sTitle: plugin.getScriptTitle()
			, sInitDir: xInitFn.toStr()
			, sFilter: 'OPML documents (*.opml);;XML documents (*.xml);;All files (*.*)'
			});

		if(sDstFn){

			var sDir=new CLocalFile(sDstFn).getDirectory();
			localStorage.setItem(sCfgKey, sDir);

			var nFolders=0;

			//To estimate the progress range;
			//xNyf.traverseOutline(sCurItem, true, function(){
			//	nFolders++;
			//});

			plugin.initProgressRange(plugin.getScriptTitle(), nFolders);

			var _parseFields=function(xElm, sSsgPath){

				var sPreferred=xNyf.detectPreferredFile(sSsgPath, "html;qrich;txt;md;rtf>htm;ini;log");
				if(sPreferred){
					var xSsgFn=new CLocalFile(sSsgPath, sPreferred);
					var sTxt=xNyf.loadText(xSsgFn.toStr(), 'auto');
					if(sTxt){
						if(sPreferred.search(/\.(html|htm|qrich)$/i)>0) sTxt = platform.extractTextFromHtml(sTxt);
						else if(sPreferred.search(/\.rtf$/i)>0) sTxt = platform.extractTextFromRtf(sTxt);
						var v=sTxt.split('\n');
						for(var i in v){
							var sLine=v[i]||'';
							var p=sLine.indexOf('=');
							if(p>0){
								var sName=sLine.substring(0, p); sName=sName.replace(/\s+/g, ''); //sName=_trim(sName);
								var sVal=sLine.substring(p+1); sVal=_trim(sVal);
								if(sName && sVal){
									if(sName.toLowerCase()!='title'){
										xElm.addAttribute(sName, sVal);
									}
								}
							}
						}
					}
				}
			};

			var _traverseBranch=function(xElm, sSsgPath, iLevel, _actPre){
				if(xNyf.folderExists(sSsgPath)){

					var sTitle=xNyf.getFolderHint(sSsgPath)||'untitled';

					plugin.ctrlProgressBar(sTitle);

					var xItem=xElm.createElement('outline');
					xItem.addAttribute('text', sTitle);
					xItem.addAttribute('title', sTitle);

					//_parseFields(xItem, sSsgPath);

					if(_actPre) _actPre(xElm, sSsgPath, iLevel);
					_traverseChildren(xItem, sSsgPath, iLevel+1, _actPre);
				}
			};

			var _traverseChildren=function(xElm, sSsgPath, iLevel, _actPre){
				var v=xNyf.listFolders(sSsgPath);
				for(var i in v){
					var sName=v[i];
					if(sName){
						var xSsgSub=new CLocalFile(sSsgPath, sName); xSsgSub.append('/');
						_traverseBranch(xElm, xSsgSub.toStr(), iLevel, _actPre);
					}
				}
			};

			var xActPre=function(xElm, sSsgPath, iLevel){
				return;
			};

			var xml=new CXmlDocument();
			if(xml){
				var xRoot=xml.getElement('/opml', true);
				if(xRoot){
					xRoot.addAttribute('version', '1.0');
					var xHead=xRoot.createElement('head');
					if(xHead){
						xHead.createElement('title', sItemTitle);
					}
					var xBody=xRoot.createElement('body');
					if(xBody){
						//2013.3.21 just export child items without the current item, it's set as document title instead;
						//_traverseBranch(xBody, sCurItem, 0, xActPre, null);
						_traverseChildren(xBody, sCurItem, 0, xActPre, null);
					}
				}
				var sXml=xml.serialize();
				if(sXml){
					var xDstFn=new CLocalFile(sDstFn);
					if(xDstFn.saveUtf8(sXml)>0){
						plugin.destroyProgressBar();
						var sMsg=_lc2('Done', 'Successfully generated the OPML document.');
						alert(sMsg+'\n\n'+xDstFn.toStr());
					}
				}
			}
		}
	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	alert(e);
//}
