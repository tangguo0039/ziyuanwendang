
/////////////////////////////////////////////////////////////////////
// Essential scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var __xBkmk={

	makeBookmarkAnchor: function(){
		var sBkmkName, xRng=dom.getSelRange();
		if(xRng){
			var xElm=xRng.startContainer;
			//if(xElm && xElm.nodeType==Node.TEXT_NODE) xElm=xElm.parentNode;
			if(xElm && xElm.parentNode){

				{
					var t=new Date();
					var n=Math.floor(t.getTime()/1000);
					sBkmkName='nyf_'+n.toString(16);
					console.debug('bookmarkAnchor: ' + sBkmkName);
				}

				var xA=document.createElement('A');
				xA.setAttribute('name', sBkmkName);
				xElm.parentNode.insertBefore(xA, xElm);
			}
		}
		return sBkmkName;
	}

	, triggerBookmarkAnchor: function(sBkmkName){
		console.debug('triggerBookmarkAnchor: ' + sBkmkName);
		var bFound=false;
		if(sBkmkName){

			var s_vTagsBlock="body|address|blockquote|center|code|div|p|pre|h1|h2|h3|h4|h5|h6|hr|dl|dd|dt|table|tbody|thead|tfoot|th|tr|td|ul|ol|li|fieldset|form|script|noscript|meta|link|title|colgroup|col".split('|');

			var _is_block_elm=function(e){return e && (s_vTagsBlock.indexOf(e.nodeName.toLowerCase())>=0);};

			var xPara = null;
			var v=document.getElementsByTagName('a');
			for(var i=0; i<v.length; ++i){
				var xA=v[i];
				if(xA){
					var sName=xA.getAttribute('name');
					if(sName===sBkmkName){
						xPara = xA.parentNode;
						while(xPara && !_is_block_elm(xPara)){
							xPara = xPara.parentNode;
						};
						bFound=true;
						break;
					}
				}
			}

			if(!bFound){
				if(document.getElementById(sBkmkName)){
					xPara = document.getElementById(sBkmkName);
					bFound=true;
				}
			}

			if(bFound && window.location){
				window.location.hash = "";
				window.location.hash = "#" + sBkmkName;

				var _blink=function(o)
				{
					var bg = document.createElement("div");
					bg.style.width = o.offsetWidth + "px";
					bg.style.height = o.offsetHeight + "px";
					bg.style.position = "absolute";
					bg.style.left = o.offsetLeft + "px";
					bg.style.top = o.offsetTop + "px";
					bg.style.background = "rgb(70, 162, 218)";
					bg.style.zIndex = -1;
					bg.style.opacity = 1.0;
					document.body.appendChild(bg);

					var interval = setInterval(function () {
						bg.style.opacity-=0.06;
						if (bg.style.opacity <= 0.05) {
							clearInterval(interval);
							document.body.removeChild(bg);
						}
					}, 50);
				}

				_blink(xPara);
			}
		}
		return bFound;
	}

};

if(dom) dom.extend(__xBkmk, 'bookmark');


