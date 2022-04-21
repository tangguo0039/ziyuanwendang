
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

//sValidation=domjs
//sAuthor=wjjsoft

if(!window.doSyntaxHighlighting){

	window.doSyntaxHighlighting=function(sCodeBlockID){
		hljs.configure({tabReplace: function(n){if(n<1 || n>32) n=4; var r=""; while(n-- > 0) r+=" "; return r;}(4)});
		if(sCodeBlockID){
			//2016.12.15 just highlight the mentioned code block, instead of all code blocks, running twice would destory the code formats;
			var e=document.getElementById(sCodeBlockID);
			if(e) hljs.highlightBlock(e);
		}else{
			//hljs.initHighlighting(); //avoid doing with all code blocks in the document;
		}
	};
}

if(!window.makeLinkWithHighlightStyle){

	window.makeLinkWithHighlightStyle_OLD=function(){
		var vHead=document.getElementsByTagName('head');
		var xHead=(vHead && vHead.length>0) ? vHead[0] : null;
		if(!xHead){
			xHead=document.createElement('head');
			if(document.firstChild) document.insertBefore(xHead, document.firstChild);
			else document.appendChild(xHead);
		}

		if(xHead){

			//2019.9.4 use '${scripts}' instead of '${exe}' for the code to work in debug mode as well as at runtime;
			var sCssLoc='nyf://localhost/${scripts}/hljs/styles/';
			var sCssUri=sCssLoc+'${SyntaxHighlightStyleName}.css';

			var bCssLinked=false;
			for(var i=0; i<xHead.childNodes.length; ++i){
				var e=xHead.childNodes[i];
				if((e.nodeName||'').toLowerCase()==='link' && (e.getAttribute('rel')||'').toLowerCase()==='stylesheet' && (e.getAttribute('href')||'').indexOf(sCssLoc)===0){
					bCssLinked=true;
				}
			}

			if(!bCssLinked){
				var xLink=document.createElement('link');
				xLink.setAttribute('rel', 'stylesheet');
				xLink.setAttribute('type', 'text/css');
				xLink.setAttribute('href', sCssUri);
				if(xHead.firstChild) xHead.insertBefore(xLink, xHead.firstChild);
				else xHead.appendChild(xLink);
			}
		}
	};

	window.makeLinkWithHighlightStyle=function(){
		//2020.5.15 Use the inbuilt dom.insertCssLinks for consistency with custom CSS subsystem;
		if(dom.insertCssLinks){

			//2019.9.4 use '${scripts}' instead of '${exe}' for the code to work in debug mode as well as at runtime;
			var sCssLoc='nyf://localhost/${scripts}/hljs/styles/';
			var sCssUri=sCssLoc+'${SyntaxHighlightStyleName}.css';

			//dom.insertCssLinks(sCssUri, function(sHref, sUrl){
			//	return sHref.indexOf(sCssLoc)===0;
			//});

			//2020.5.16 there's currrently no need to manually inject hljs-css because it's already present on initialization of all html contents;
			//dom.insertCssLinks(sCssUri);
		}
	};
}

if(!window.autoNumberCodeLines){

	window.autoNumberCodeLines=function(sCodeBlockID, bAutoNumber){
		if(sCodeBlockID && bAutoNumber){
			var e=document.getElementById(sCodeBlockID);
			if(e){
				var vLines=e.innerHTML.split('\n');
				for(var i in vLines){
					var sLine=vLines[i];
					vLines[i]='<li>'+sLine+'</li>';
				}
				e.innerHTML='<ol>'+vLines.join('')+'</ol>';
			}
		}
	};
}
