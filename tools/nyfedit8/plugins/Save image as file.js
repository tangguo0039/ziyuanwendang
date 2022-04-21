
//sValidation=nyfjs
//sCaption=Save image as ...
//sHint=Save the image in context to a disk folder
//sCategory=Context.ImgUtils
//sPosition=
//sCondition=CURDB; DBRW; CURINFOITEM; FORMATTED; IMAGE;
//sID=p.Image.SaveAs
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

		var sUrl=plugin.getImageUrl(-1)||'';
		var sSrc=plugin.getDataUrlOfImageInContext(-1)||''; //getDataImageBase64
		if(sUrl && sSrc){
			var re=new RegExp('data:image\\/(png|jpg|jpeg|gif|bmp|tiff|svg);base64,(.+)$', 'i');
			var m=re.exec(sSrc);
			if(m && m.length>2){
				var sExt=m[1], sDat=m[2];
				if(sExt && sDat){
					var ba=new CByteArray(sDat, 'base64');
					if(ba.size()>0){

						var p=sUrl.lastIndexOf('#');
						if(p>=0) sUrl=sUrl.substr(0, p);

						var sName;
						{
							if(sUrl!==sSrc) sName=new CLocalFile(sUrl).getLeafName();
							if(!sName) sName='image_' + Math.floor(Math.random()*0xffff)+'.'+sExt;
							//if(!sName) sName='image_' + new Date().getTime() + '.' + sExt;
						}

						var sCfgKey='SaveImageAs.sDstFn';

						var xInitFn = new CLocalFile(localStorage.getItem(sCfgKey)||platform.getHomePath()||'', sName);

						var sDstFn=platform.getSaveFileName(
									{ sTitle: plugin.getScriptTitle()
										, sInitDir: xInitFn.toStr()
										, sFilter: 'Images (*.jpg *.jpeg *.png *.gif *.svg *.bmp);;All files (*.*)'
									});

						if(sDstFn){

							var xDstFn=new CLocalFile(sDstFn);
							localStorage.setItem(sCfgKey, xDstFn.getParent());

							if(ba.saveToFile(xDstFn.toStr())<=0){
								sMsg='Failed to save the image as file;';
								alert(sMsg + '\n\n' + xDstFn.toStr());
							}
						}
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
