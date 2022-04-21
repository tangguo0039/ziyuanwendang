
/////////////////////////////////////////////////////////////////////
// Essential scripts for Mybase Desktop v8.x
// Copyright 2010-2021 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var __xImg={

	dimOfImage: function(xImg, bNatural){

		//console.debug('<dimOfImage> bNatural=' + bNatural);

		if(!xImg){
			var vImgs=dom.selectedImages(1);
			if(vImgs.length>0) xImg=vImgs[0];
			//if(xImg) console.debug('<dimOfImage> first selected <img>; img.src=' + utils.ellipsis(xImg.src));
		}

		if(!xImg){
			xImg=dom.getLastImgElementRightClicked();
			//if(xImg) console.debug('<dimOfImage> right-clicked <img>; img.src=' + utils.ellipsis(xImg.src));
		}

		var sRes;
		if(xImg){
			var r={width: xImg.naturalWidth, height: xImg.naturalHeight};
			if(!bNatural){
				var w=xImg.getAttribute('width')||xImg.width;
				var h=xImg.getAttribute('height')||xImg.height;
				if(w && h){
					w=parseInt(w);
					h=parseInt(h);
					if(w>0 && h>0) r={width: w, height: h};
				}
			}
			sRes=''+r.width+'x'+r.height;
			//console.debug('<dimOfImage> ==> ' + sRes + ' bNatural=' + bNatural);
		}
		return sRes;
	}

	, resizeImage: function(xImg, w, h){

		w=w||''; h=h||'';
		var _resize=function(e){
			if(e && e.nodeName.toLowerCase()==='img'){
				//e.setAttribute('width', ''+w);
				//e.setAttribute('height', ''+h);
				if(w) e.setAttribute('width', ''+w); else e.removeAttribute('width');
				if(h) e.setAttribute('height', ''+h); else e.removeAttribute('height');
				//console.debug('<resizeImage> img.src=' + utils.ellipsis(e.src) + ' >>> ' + w + 'x' + h + ' [Succ]');
			}
		};

		if(xImg){
			//2019.3.11 for a specified <img>;
			_resize(xImg);
		}else{
			//2019.3.11 on right-clicking in selection but not on any <img>;
			var vImgs=this.selectedImages();
			if(vImgs.length>0){
				//console.debug('<resizeImage> nSelectedImages=' + vImgs.length);
				for(var xImg of vImgs){
					_resize(xImg);
				}
			}else{
				xImg=dom.getLastImgElementRightClicked();
				if(xImg){
					//console.debug('<resizeImage> right-clicked=' + utils.ellipsis(xImg.src));
					_resize(xImg);
				}
			}
		}
	}

	, rotateImage: function(xImg, d){

		var _rotate=function(e, d){
			if(e && e.nodeName.toLowerCase()==='img'){
				if(typeof(d)!=='number') d=parseFloat(d||'0');
				var sVal=''; if((d%360)!=0) sVal='rotate(%nDegree%deg)'.replace('%nDegree%', ''+d);
				var vCss=[];
				//vCss.push({key: '-webkit-transform', val: sVal});
				//vCss.push({key: '-moz-transform', val: sVal});
				//vCss.push({key: '-ms-transform', val: sVal});
				//vCss.push({key: '-o-transform', val: sVal});
				vCss.push({key: 'transform', val: sVal});
				dom.cssUtil(e, vCss);
			}
		};

		if(xImg){
			//2019.3.11 for a specified <img>;
			_rotate(xImg, d);
		}else{
			//2019.3.11 on right-clicking in selection but may not on <img>;
			var vImgs=this.selectedImages();
			if(vImgs.length>0){
				//console.debug('<rotateImage> nSelectedImages=' + vImgs.length);
				for(var xImg of vImgs){
					_rotate(xImg, d);
				}
			}else{
				//2019.3.11 for the right-clicked <img> in context;
				xImg=dom.getLastImgElementRightClicked();
				if(xImg){
					//console.debug('<rotateImage> right-clicked=' + utils.ellipsis(xImg.src));
					_rotate(xImg, d);
				}
			}
		}
	}

	, replaceImageSrc: function(sSrc, sNew){
		sNew=sNew||nyf.arg('sNewSrc');
		console.debug('<replaceImageSrc>: ' + utils.ellipsis(sSrc, 40) + ' --> ' + utils.ellipsis(sNew, 40));
		dom.traverseDomChildren(document, 0, null, function(xElm, iLvl, xUserData){
			if(xElm.nodeName.toLowerCase()==='img'){
				if(xElm.src===sSrc || xElm.getAttribute('src')===sSrc){
					//console.debug('<replaceImageSrc> --> ' + utils.ellipsis(sNew));
					xElm.setAttribute('src', sNew); //xElm.src=sNew;
				}
			}
		});
	}

};

if(dom) dom.extend(__xImg, 'image');



