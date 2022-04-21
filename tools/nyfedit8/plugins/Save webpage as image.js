
//sValidation=nyfjs
//sCaption=Save webpage as image ...
//sHint=Download and save a specified webpage as an image file
//sCategory=MainMenu.Tools
//sCondition=
//sID=p.SaveWebAsImg
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

let _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
let _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

try{

	let sCfgKey='SaveWebAsImg.sDstFn';

	let sInitDir=localStorage.getItem(sCfgKey)||platform.getHomePath()||'';
	let sFilter='JPEG (*.jpg);;PNG (*.png);;Bitmap (*.bmp)';

	let sCfgKey1='SaveWebAsImg.Url', sCfgKey2='SaveWebAsImg.DstFn';
	let vFields = [
				{sField: 'lineedit', sLabel: _lc2('Url', 'Enter a webpage Url:'), sInit: localStorage.getItem(sCfgKey1)||'', bReq: true}
				, {sField: "savefile", sLabel: _lc2('DstFn', 'Local file to save the webpage:'), sTitle: plugin.getScriptTitle(), sInit: sInitDir, sFilter: sFilter, bReq: true}
			];
	let vRes=input(plugin.getScriptTitle(), vFields, {nMinSize: 500, vMargins: [6, 0, 30, 0], bVert: true});
	if(vRes && vRes.length===2){

		let sUrl=vRes[0], sDstFn=vRes[1];
		if(sUrl && sDstFn){

			let xDstFn=new CLocalFile(sDstFn);

			//let sExt=xDstFn.getSuffix(false);
			//if(!sExt) xDstFn.changeExtension('jpg'); //defaults to jpg;

			localStorage.setItem(sCfgKey1, sUrl);
			localStorage.setItem(sCfgKey2, xDstFn.getParent());

			let c=new CCanvas();

			c.renderHtml({url: sUrl, bAutoResize: true, bAutoImages: true, nMsecTimeout: 10000});

			let nJpegQuality=99;
			if(c.saveAs(xDstFn.toStr(), xDstFn.getSuffix(false)||'jpg', nJpegQuality)){
				let sMsg=_lc2('Done', 'Finished saving the webpage as an image file. View it now?');
				if(confirm(sMsg+'\n\n'+xDstFn.toStr())){
					xDstFn.launch('open');
				}
			}else{
				alert(_lc2('Failure', 'Failed to save the webpage as image file.'));
			}

		}
	}

}catch(e){
	alert(e);
}
