
//sValidation=nyfjs
//sCaption=Append to results list
//sHint=Append selected items or attachments to search results list
//sCategory=MainMenu.Organize; Context.Outline; Context.TagResults; Context.Relation.Attachment; Context.Relation.InfoItem
//sCondition=CURDB; CURINFOITEM;
//sID=p.AppendToResults
//sAppVerMin=8.0
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

//try{

	var xNyf=new CNyfDb(-1);

	if(xNyf.isOpen()){

		var sCurFocus=plugin.getFocusPane(), vEntries=[];

		var _push=function(v){
			for(var i=0; i<v.length; ++i){
				var s=v[i]||'';
				if(s){
					var sDbFn=xNyf.getDbFile(), sSsgPath='', sSsgName='';
					if(xNyf.fileExists(s)){
						var xSsgFn=new CLocalFile(s);
						sSsgPath=xSsgFn.getDirectory();
						sSsgName=xSsgFn.getLeafName();
					}else if(xNyf.folderExists(s)){
						sSsgPath=s;
					}else{
						logd('Item/file not found: ' + s);
					}

					if(sDbFn && sSsgPath){
						plugin.appendToResults(sDbFn, sSsgPath, sSsgName);
					}
				}
			}
		};

		var bClear=false, bCache=true, t=new Date();
		plugin.showResultsPane(true, bClear);
		plugin.beginUpdateResultsList('Manually added' + ' (' + t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds() + ')', bClear);

		if(sCurFocus==='TagResults'){

			_push(plugin.getSelectedTagResults(-1));

		}else if(sCurFocus==='Relation' || sCurFocus==='Attachments'){

			_push(plugin.getSelectedAttachments(-1, true));
			_push(plugin.getSelectedItemLinks(-1));
			_push(plugin.getSelectedSymbolicLinks(-1));
			_push(plugin.getSelectedLabeledItems(-1));
			_push(plugin.getSelectedThreadedItems(-1));

		}else if(sCurFocus==='Outline'){

			_push(plugin.getSelectedInfoItems(-1));

		}

		plugin.endUpdateResultsList('', bCache);

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	alert(e);
//}
