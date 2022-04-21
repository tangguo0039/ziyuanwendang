//sValidation=nyfjs
//sCaption=Open as plain text ...
//sHint=Open the currently selected attachment as plain text file
//sCategory=MainMenu.Attachments; Context.Relation.Attachment;
//sCondition=CURDB; CURDOC; FILESELECTED
//sID=p.OpenAsText
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

//try{
	let xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		let xArg=plugin.argument();
		let sSsgFn=xArg['sSsgFn'];

		if(sSsgFn) logd('Open as plain text: '+ sSsgFn + ' [Specific]');

		if(!sSsgFn){
			let bFullPath=true, v=ui.getSelectedAttachments(-1, bFullPath);
			if(v && v.length>0){
				sSsgFn=v[0]; //select the first one if no matches;
			}
		}

		if(sSsgFn){

			if(ui.isContentEditable()) ui.commitCurrentChanges();

			ui.openSsgFileInplace(-1, sSsgFn, 'text');

		}else{
			alert('No attachments selected to open as plain text.');
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	alert(e);
//}
