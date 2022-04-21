
//sValidation=nyfjs
//sCaption=Copy image address
//sHint=Copy the image address to system clipboard
//sCategory=Context.ImgUtils
//sPosition=
//sCondition=CURDB; DBRW; CURINFOITEM; FORMATTED; IMAGE;
//sID=p.Image.CopyLink
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

//try{
	var xNyf=new CNyfDb(-1);

	if(xNyf.isOpen()){

		var sSrc=plugin.getImageUrl(-1);
		if(sSrc){
			let u=sSrc;
			if(sSrc.search(/^(data|file|https?|s?ftp|gopher|mailto|nyf|[a-z0-9]{2,16}):/i)<0){
				u='file://';
				if( (/^[^/\\]/).test(sSrc) ){
					u+='/';
					if(sSrc.search(/[/\\]/i)<0){
						//2021.4.23 For attached images, link address may be copied like this: file:///./clip.png
						u+='./'; // ==> ./file.txt
					}
					u+=sSrc; // ==> file:///
				}else{
					u+=sSrc.replace(/^[/\\]{3,}/, '//'); // ==> file://server/dir/file.txt
				}
			}
			var v=platform.setClipboardData([{type: 'url', val: u}, {type: 'text', val: u}]);
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	alert(e);
//}
