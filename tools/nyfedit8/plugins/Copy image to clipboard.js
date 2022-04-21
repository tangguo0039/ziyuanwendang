
//sValidation=nyfjs
//sCaption=Copy image
//sHint=Copy the image in context to clipboard
//sCategory=Context.ImgUtils
//sPosition=
//sCondition=CURDB; DBRW; CURINFOITEM; FORMATTED; IMAGE;
//sID=p.Image.Copy
//sAppVerMin=8.0
//sShortcutKey=
//sAuthor=wjjsoft

/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2022 Wjj Software. All rights Reserved.
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

		var sDataUrl=plugin.getDataUrlOfImageInContext(-1)||'', vRes, sType='base64img';
		if(sDataUrl){
			var re=new RegExp('data:image/(png|jpg|jpeg|gif|bmp|tiff|svg);base64,(.+)$', 'i');
			var m=re.exec(sDataUrl);
			if(m && m.length>2){
				var b64=m[2];
				if(b64){
					//2022.3.30 this operation should only copy the current image itself, without any other data formats;
					//vRes=platform.setClipboardData([{type: sType, val: b64}, {type: 'url', val: sDataUrl}, {type: 'text', val: sDataUrl}]);
					vRes=platform.setClipboardData([{type: sType, val: b64}]);
				}
			}
		}
		if(vRes && vRes.length>=1 && vRes[0]===sType){
			//done;
		}else{
			alert('Failed to copy the image to system clipboard.');
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	alert(e);
//}
