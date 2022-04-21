
//sValidation=nyfjs
//sCaption=Rotate image ...
//sHint=Rotate the image in context by a given angle
//sCategory=Context.ImgUtils
//sPosition=
//sCondition=CURDB; DBRW; CURINFOITEM; FORMATTED; EDITING; IMAGE;
//sID=p.Image.Rotate
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

		if(!xNyf.isReadonly()){

			if(plugin.isContentEditable()){

				var vVals=[];
				for(var i=0; i<72; ++i){
					var d=5*(i);
					var sTmp='' + d; //+ ' ' +_lc2('Degree', 'Degree');
					vVals.push(sTmp);
				}

				var sCfgKey1='RotateImage.iAngle';
				var vFields = [
					{sField: "comboedit", sLabel: _lc2('Angle', 'Angle'), vItems: vVals, sInit: localStorage.getItem(sCfgKey1)||''}
				];

				var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 400, vMargins: [8, 0, 30, 0]});
				if(vRes && vRes.length>0){

					var nAngle=parseFloat(vRes[0]);
					localStorage.setItem(sCfgKey1, nAngle);

					var bProceed=true;
					{
						//2018.1.1 For images inserted with hyperlinks in richedit, rotation operations will insert image data instead of just setting values of attributes;
						var sEditor=plugin.getCurEditorType().toLowerCase();
						if(sEditor==='richedit'){
							var sSrc=plugin.getImageUrl();
							//2021.6.2 consider of SVG: data:image/svg+xml;base64,iVBORw0KGgo...
							if(sSrc.search(/^data:image\/[a-z0-9+]{1,4};base64,/i)<0){
								var sMsg=_lc2('ConfirmToEmbed', 'The image data will be embedd into the rich text document after roated, and may significantly enlarge the document size; Proceed?');
								bProceed=confirm(sMsg);
							}
						}
					}
					if(bProceed) plugin.rotateImage(-1, nAngle);
				}

			}else{
				alert(_lc('Prompt.Warn.ReadonlyContent', 'Cannot modify the content opened as Readonly.'));
			}

		}else{
			alert(_lc('Prompt.Warn.ReadonlyDb', 'Cannot modify the database opened as Readonly.'));
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	alert(e);
//}
