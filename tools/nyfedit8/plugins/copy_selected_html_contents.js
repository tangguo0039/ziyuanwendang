
//sValidation=nyfjs
//sCaption=Copy selected Html contents
//sHint=Copy selected HTML content to clipboard with images cached in TEMP folder
//sCategory=
//sCondition=CURDB; CURINFOITEM
//sID=p.CopySelHtml
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

var g_bPutImagesInTmpDir=false;

try{

	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		include('comutils');

		if(g_bPutImagesInTmpDir){
			var sTmpDir=platform.getTempFolder();
			var sImgDirName='__nyf8_clip_images';
			var xImgDir=new CLocalDir(sTmpDir, sImgDirName);

			if(xImgDir.exists()){
				var vFiles=xImgDir.listFiles();
				for(var i in vFiles){
					var xImgFn=new CLocalFile(xImgDir.toStr(), vFiles[i]);
					xImgFn.remove();
				}
			}else{
				var xTmp=new CLocalDir(sTmpDir);
				xTmp.createDirectory(sImgDirName);
			}
		}

		var sCurDocPath=plugin.getCurInfoItem();
		if(sCurDocPath){
			var sHtml=plugin.getSelectedText(-1, true), sTxt=plugin.getSelectedText(-1, false);
			if(1){
				plugin.initProgressRange(plugin.getScriptTitle(), 0);

				sHtml=substituteUrisWithinHtml(sHtml, 'img,link', function(sObj, sTagName){
					var u=sObj.toString();

					var bContinue=plugin.ctrlProgressBar(u, 1, true);
					if(!bContinue) throw 'User abort by Esc.';

					if(g_bPutImagesInTmpDir){
						//attempts to put all embedded images into the temp folder;
						var m=u.match(/(data:image\/)(gif|jpg|jpeg|png|bmp|tif|svg)(;base64,)/i);
						if(m && m[1] && m[2] && m[3]){

							var sExt=m[2], sDat=u.replace(m[0], ''), sTmpFn=platform.getTempFile(xImgDir.toStr(), 'image_', sExt);
							var ba=new CByteArray(sDat, 'base64');
							var nBytes=ba.saveToFile(sTmpFn);
							if(nBytes>0){
								platform.deferDeleteFile(sTmpFn);
								u=urlFromLocalFile(sTmpFn);
								//log('==>' + u);
							}

						//}else if(u.search(/[\/\\]/)<0){
						}else if(u.search(/[:\?\*\|\/\\<>]/)<0){ //for linked objs, possibly saved in the attachments section;

							var xSsgFn=new CLocalFile(sCurDocPath, percentDecode(u));
							if(xNyf.fileExists(xSsgFn.toStr()) && xImgDir.exists()){
								var sLeaf=xSsgFn.getLeafName();
								if(sLeaf){
									let sTmpFn=new CLocalFile(xImgDir.toStr(), sLeaf);
									let nBytes=xNyf.exportFile(xSsgFn.toStr(), sTmpFn.toStr());
									if(nBytes>0){
										platform.deferDeleteFile(sTmpFn);
										u=urlFromLocalFile(sTmpFn);
									}
								}
							}
						}
					}else{
						//2019.1.22 attempt to embed all images into HTML in BASE64
						if(u.search(/[:\?\*\|\/\\<>]/)<0){ //for linked objs, possibly saved in the attachments section;
							if(u.search(/\.(png|jpg|jpeg|gif|svg|bmp|tif)$/i)>0){
								let xSsgFn=new CLocalFile(sCurDocPath, percentDecode(u));
								let sExt=xSsgFn.getSuffix(false).toLowerCase();
								if(xNyf.fileExists(xSsgFn.toStr())){
									var v=xNyf.loadBytes(xSsgFn.toStr());
									if(v.size()>0){
										u='data:image/%TYPE%;base64,'.replace(/%TYPE%/gi, sExt) + v.base64();
										//log('==>' + u);
									}
								}
							}
						}
					}

					return u;
				});

				plugin.destroyProgressBar();
			}

			var vUrls=[]; //2016.5.8 ignore urls, since it has higher priority than HTML/TEXT on pasting;
			if(0){
				//substituteUrisWithinHtml(sHtml, 'a', function(sObj, sTagName){
				//	var u=sObj.toString();
				//	if(vUrls.indexOf(u)<0) vUrls.push(u);
				//	return u;
				//});
			}

			var vData=[];
			if(sHtml){
				vData.push({type: 'html', val: sHtml});
			}
			if(sTxt){
				vData.push({type: 'text', val: sTxt});
			}
			if(vUrls.length>0){
				vData.push({type: 'urls', val: vUrls});
			}
			if(vData.length>0){
				var v=platform.setClipboardData(vData);
			}else{
				alert('No contents copied to clipboard.');
			}

		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

}catch(e){
	plugin.destroyProgressBar();
	alert(e);
}
