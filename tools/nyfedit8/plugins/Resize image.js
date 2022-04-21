
//sValidation=nyfjs
//sCaption=Resize image ...
//sHint=Resize the image in context
//sCategory=Context.ImgUtils
//sPosition=
//sCondition=CURDB; DBRW; CURINFOITEM; FORMATTED; EDITING; IMAGE;
//sID=p.Image.Resize
//sAppVerMin=8.0
//sShortcutKey=
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
	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			if(plugin.isContentEditable()){

				var sEditor=plugin.getCurEditorType().toLowerCase();
				if(sEditor==='htmledit' || sEditor==='richedit'){

					//var s=plugin.getImageDimension(-1, true);
					//var v=(s||'').split('x');

					var dim=plugin.getImageDimension(-1, true); //true -> natural size;

					//if(v && v.length>=2){
					if(dim && dim.width>0 && dim.height>0){

						let xCurScreen=platform.getScreenProperties(-1);
						let szCurView=ui.getContentViewSize();
						let nMarginCurView=60;
						let nDevPixRatio=xCurScreen ? xCurScreen.devicePixelRatio : 1.0;

						let sCfgKey1='ResizeImage.iImgDimSel';
						let iSelImgDim0=localStorage.getItem(sCfgKey1)||-1;

						//var w0=parseInt(v[0]), h0=parseInt(v[1]);
						var w0=dim.width, h0=dim.height;

						var vOpts=[], vWidth=[], vHeight=[];

						let wView=szCurView.width - nMarginCurView;
						if(sEditor==='richedit'){
							let w=wView, h=Math.floor(h0 * w / w0);
							let d=Math.floor(wView / w0 * 1000)/10;
							vWidth.push(w);
							vHeight.push(-1);
							let sTmp;
							if(w0>=wView){
								sTmp=_lc2('ShrinkToFit', 'Shrink to fit current content view');
							}else{
								sTmp=_lc2('EnlargeToFit', 'Enlarge to fit current content view');
							}
							sTmp+=(': ' + '( ' + w + ' x ' + h + ' ) ' + d + '%');
							vOpts.push(sTmp);
						}

						if(sEditor==='htmledit'){
							//2022.1.21 Rich text editor doesn't proportionally resize images;
							for(let i=0; i<20; ++i){
								let w=(i+1) * 5;
								vWidth.push(w + '%');
								vHeight.push(-1);
								let sTmp=_lc2('DynamicWidth', 'Dynamic width: %nPercWidth% of view size').replace(/%nPercWidth%/g, (w+'%'));
								vOpts.push(sTmp);
							}
						}

						for(var i=0; i<40; ++i){
							var d=5*(i+1);
							var w=Math.floor(w0*d/100), h=Math.floor(h0*d/100);
							vWidth.push(w);
							vHeight.push(-1);
							//var sTmp='' + d + '%  ( ' + w + ' x ' + h + ' )'; if(d===100) sTmp+=' ('+_lc2('Natural', 'Natural')+')';
							//let sTmp='' + d + '%  ( ' + w + ' x ' + h + ' )';
							let sTmp=_lc2('FixedWidth', 'Fixed width: %nPercWidth% of natural size ( %nNaturalSize% )')
							.replace(/%nPercWidth%/g, (d+'%'))
							.replace(/%nNaturalSize%/g, (w0 + ' x ' + h0))
							;
							if(d===50){
								sTmp+=' ('+_lc2('Half', 'Half')+')';
								if(iSelImgDim0<0 && nDevPixRatio>1.5) iSelImgDim0=i; //defaults to 50% on MacBook Retina 2x displays;
							}else if(d===100){
								sTmp+=' ('+_lc2('Natural', 'Natural')+')';
								if(iSelImgDim0<0) iSelImgDim0=i; //for other displays defaults to 100% at the first time pasting images;
							}else if(d===200){
								sTmp+=' ('+_lc2('Double', 'Double')+')';
							}
							vOpts.push(sTmp);
						}

						for(var i=0; i<50; ++i){
							var w=20*(i+1);
							var d=Math.floor(w*100.0/w0), h=Math.floor(h0*d/100);
							vWidth.push(w);
							vHeight.push(-1);
							//var sTmp='' + w + ' x ' + h + ' ( ' + d + '% )';
							let sTmp=_lc2('FixedSize', 'Fixed size') + ': ' + w + ' x ' + h + ' ( ' + d + '% )';
							vOpts.push(sTmp);
						}

						for(var i=0; i<64; ++i){
							var w=16*(i+1), h=w;
							vWidth.push(w);
							vHeight.push(h);
							let sTmp=_lc2('FixedSize', 'Fixed size') + ': ' + w + ' x ' + h;
							vOpts.push(sTmp);
						}

						for(var i=0; i<50; ++i){
							var w=20*(i+1), h=w;
							vWidth.push(w);
							vHeight.push(h);
							let sTmp=_lc2('FixedSize', 'Fixed size') + ': ' + w + ' x ' + h;
							vOpts.push(sTmp);
						}

						var vFields = [
							{sField: "combolist", sLabel: _lc2('DispSize', 'Adjust display size of image:'), vItems: vOpts, iInit: iSelImgDim0}
						];

						var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 400, vMargins: [8, 0, 30, 0], bVert: true});
						if(vRes && vRes.length>=1){

							var iSel=vRes[0];

							localStorage.setItem(sCfgKey1, iSel);

							var w=vWidth[iSel], h=vHeight[iSel];

							plugin.setImageDimension(-1, w, h);
						}
					}
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
