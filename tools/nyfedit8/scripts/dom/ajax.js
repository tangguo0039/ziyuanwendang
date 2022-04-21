
/////////////////////////////////////////////////////////////////////
// Essential scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

ajax={
	run: function(sType, sUri, sCgiParams, xUserData, bBinary, onSucc, onFail){

		//https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest

		var xReq=new XMLHttpRequest();

		var _onload=function(xReq){
			if(onSucc){
				onSucc(xReq, xUserData);
			}
		};

		var _onerror=function(xReq){

			var sMsg='', scode=xReq.status;;

			if(scode>=400 && scode<500) sMsg='Request URI specific error';
			if(scode>=500 && scode<600) sMsg='HTTP server specific error';

			if(sMsg){
				sMsg='Failed to complete the Ajax request.\n\n[ ErrCode: '+scode+' '+sMsg+' ]';
			}else{
				sMsg='Failed to talk to the website.\n\n[ ErrCode: '+scode+' '+xReq.statusText+' ]'+'\n\n'+sUri;
			}

			if(onFail){
				onFail(xReq, sMsg, xUserData);
			}else{
				console.error(sMsg);
			}
		};

		var _onabort=function(xReq){
			var sMsg='Ajax request aborted';
			if(onFail){
				onFail(xReq, sMsg, xUserData);
			}else{
				console.warn(sMsg);
			}
		};

		try{
			//xReq.onreadystatechange=_onStateChange;
			xReq.addEventListener("load", function(e){_onload(e.target);});
			xReq.addEventListener("error", function(e){_onerror(e.target);});
			xReq.addEventListener("abort", function(e){_onabort(e.target);});

			//2016.08.09 refused by Google Chrome;
			//"Refused to set unsafe header "referer""
			//"Refused to set unsafe header "Accept-Charset""

			//xReq.setRequestHeader('referer', this.sReferer||'');
			//xReq.setRequestHeader('Accept-Charset', 'x-user-defined');

			//xReq.setRequestHeader('Cache-Control', 'no-cache');
			//xReq.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			//xReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

			//2018.2.14 a method Receiving binary data in older browsers
			//xReq.overrideMimeType('text/plain; charset=x-user-defined');

			//https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
			//https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
			if(bBinary){
				xReq.responseType="arraybuffer";
			}

			//2018.2.13 Ajax in Firefox addons requires full path, at least a leading slash in URI;
			//2018.2.19 consider of special URLs containg query-strings & fragments
			// /static/styles/libs/font-awesome/fonts/fontawesome-webfont.90186830c9c5.eot?v=4.1.0
			// /static/styles/libs/font-awesome/fonts/fontawesome-webfont.90186830c9c5.eot?#iefix&v=4.1.0

			if(sUri.search(/[\\\/]/)<0 || sUri.search(/^\./)===0){
				var sLoc=document.location.origin + document.location.pathname; //window.location.href.replace(/(#.*)$/, '').replace(/(\?.*)$/, '');
				sLoc=sLoc.replace(/(\/[^\/]*)$/, '');
				sUri=sLoc + '/' + sUri;
			}

			//2018.2.19 in case of query-string supplied in the URL;
			//SyntaxError: The URI is malformed.: /static/styles/libs/font-awesome/fonts/fontawesome-webfont.4f0022f25672.ttf?v=4.1.0
			var m=sUri.match(/([^?]+)\?([^?]*)$/);
			if(m){
				sUri=m[1];
				sCgiParams=sCgiParams||m[2];
			}

			xReq.open((sCgiParams ? 'POST' : sType), sUri, true);
			xReq.send(sCgiParams||'');

		}catch(e){
			if(onFail){
				onFail(xReq, e.toString(), xUserData);
			}else{
				console.error(e.toString() + ' URI=' + sUri);
			}
		}
	}

};
