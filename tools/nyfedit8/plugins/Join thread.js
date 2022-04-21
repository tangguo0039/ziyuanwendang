
//sValidation=nyfjs
//sCaption=Join thread ...
//sHint=Join an existing thread or add a new one
//sCategory=MainMenu.Edit; Context.HtmlEdit; Context.RichEdit; Context.PlainEdit; Context.Action.Edit
//sCondition=CURDB; DBRW; CURINFOITEM; EDITING;
//sID=p.JoinThread
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

//var _html_encode=function(s)
//{
//	//http://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references
//	s=s.replace(/&/g,	'&amp;');
//	s=s.replace(/</g,	'&lt;');
//	s=s.replace(/>/g,	'&gt;');
//	s=s.replace(/\"/g,	'&quot;');
//	s=s.replace(/\'/g,	'&apos;');
//	s=s.replace(/\xA0/g,	'&nbsp;'); //http://www.fileformat.info/info/unicode/char/a0/index.htm
//	s=s.replace(/  /g,	'&nbsp; ');
//	s=s.replace(/\t/g,	'&nbsp; &nbsp; &nbsp; &nbsp; '); //&emsp;
//	//and more ...
//	return s;
//};

//try{
	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen() && !xNyf.isReadonly() && plugin.isContentEditable()){
		var sSel=_trim(plugin.getSelectedText(-1, false).replace(/\[\[|\]\]/ig, ''));
		if(!sSel){
			var vThreads=xNyf.listThreads(true); //true: list all aliases;
			if(vThreads && vThreads.length>0){

				var vFields=[
							{sField: "combolist", sLabel: _lc2('Descr', 'Choose a thread to join'), vItems: vThreads, sInit: 0}
						];

				var vRes=input(plugin.getScriptTitle(), vFields, {nMinSize: 500, vMargins: [8, 0, 80, 0], bVert: true});
				if(vRes && vRes.length>0){
					var iSel=vRes[0];
					if(iSel>=0 && iSel<vThreads.length){
						var v=vThreads[iSel].split(',');
						if(v && v.length>0){
							sSel=v[0]; //take only the first alias;
						}
					}
				}
			}else{
				alert(_lc2('NoSel', 'No threads available to join. You may simply type thread tags like: [[ keyword ]] into text contents.'));
			}
		}
		if(sSel){

			//sSel=sSel.replace(/\s+/ig, ' ').replace(/^(.{1,256})/ig, '$1');
			if(sSel){
				var v=sSel.split('\n'), v2=[];
				for(var i=0; i<v.length; ++i){
					var s=_trim(v[i]||'').replace(/^(.{1,32})/ig, '$1');
					if(s) v2.push(s);
				}
				sSel=v2.join(', ');
			}
			if(sSel){
				var sEditor=plugin.getCurEditorType().toLowerCase();
				if(sEditor==='htmledit'){
					var sThreads=' [[ <span class=CLS_THREAD>'+ platform.htmlEncode(sSel) + '</span> ]] ';
					plugin.replaceSelectedText(-1, sThreads, true);
				}else if(sEditor==='plainedit' || sEditor==='richedit'){
					var sThreads=' [[ '+ sSel + ' ]] ';
					plugin.replaceSelectedText(-1, sThreads, false);
				}
			}
		}else{
			//alert('No keywords selected.');
		}
	}

//}catch(e){
//	alert(e);
//}
