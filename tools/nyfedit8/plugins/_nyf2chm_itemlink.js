
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2021 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var xItemIDs=%xItemIDs%;

var xBkmkIDs=%xBkmkIDs%;

var _init=function(e){

	var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};

	var _parse_nyflink=function(s){
		//nyf://entry?dbfile=/Users/wjj/temp/mybase_4.nyf&itemid=17&itemtext=p222222
		//nyf://entry/?dbfile=C%3A/Users/wjj/Desktop/mybase_2.nyf&itemid=16&itemtext=plain%20text%2033333333
		//2021.5.30 CHM/IE automatically appends a slash after hostname, like this; nyf://entry/?...
		var m=s.match(/^(nyf:\/\/entry)[/\\]*\?(.+)$/i), xRes;
		if(m){
			var v2=m[2].replace(/&amp;/g, '&').split('&');
			for(var i=0; i<v2.length; ++i){
				s=v2[i];
				var p=s.indexOf('=');
				if(p>0){
					var k=_trim(s.substring(0, p)).toLowerCase();
					var v=_trim(s.substring(p+1));
					if(k && v){
						if(xRes===undefined) xRes={};
						xRes[k]=v;
					}
				}
			}
		}
		return xRes;
	};

	var _target_of=function(sHref){
		var sRes;
		var d=_parse_nyflink(sHref);
		if(d){
			var sItemID=d.itemid, sSsgPath=d.itempath||d.ssgpath, sSsgName=d.file||d.ssgname, sBmID=d.bmid;
			if(sSsgName){
				var sFn=xItemIDs[ (sItemID + '/' + sSsgName) ] || xItemIDs[ (sSsgPath + '/' + sSsgName).replace(/[/\\]+/g, '/').replace(/[/\\]+$/, '') ];
				if(sFn){
					sRes=sFn;
				}else{
					alert('Could not locate the attachment file. \n\n' + sHref);
				}
			}else{
				if(sSsgPath || sItemID){
					var sFn=xItemIDs[sItemID] || xItemIDs[ (sSsgPath + '/').replace(/[/\\]+/g, '/') ];
					if(sFn){
						sRes=sFn;
					}else{
						alert('Could not locate the target page. \n\n' + sHref);
					}
				}else if(sBmID){
					var v=(xBkmkIDs[sBmID]||'').split('\t');
					if(v && v.length>2){
						var sItemID=parseInt(v[0]), sSsgName=v[1], sAnchor=v[2];
						var sFn=xItemIDs[sItemID];
						if(sFn){
							sRes=(sFn + '#' + sAnchor).replace(/#+$/, '');
						}else{
							alert('Could not locate the bookmarked page. \n\n' + sHref);
						}
					}
				}else{
					alert('Invalid page tags. \n\n' + sHref);
				}
			}
		}
		return sRes;
	};

	var _link_of=function(p){
		//2018.4.5 the target element could be a <SPAN> inside of <a> with in qrich --> html;
		var sHref='';
		while(p && !sHref){
			sHref=p.href||'';
			p=p.parentNode;
		}
		return sHref;
	};

	var _click=function(e){
		//2021.5.30 for qirch->html, the "e.srcElement" may return <span> embraced inside <a>;
		var sHref=_link_of(e.srcElement||e.target);
		if(sHref){
			var sRes=_target_of(sHref);
			if(sRes){
				if(sRes.replace(/#+$/, '').replace(/^(.+?)([^/.]+)$/, '$2').search(/^(html?)$/i)===0){
					//2021.5.29 let only html documents open in-place;
					document.location.href=sRes;
				}else{
					//2021.5.29 non-html documents (attachments) open in a new window;
					document.location.href=sRes; //window.open(sRes);
				}
			}else{
				window.open(sHref); //for other ordinary website/file links;
			}

			e.cancelBubble=true; //for CHM/IE;
			if(e.preventDefault) e.preventDefault();
			if(e.stopPropagation) e.stopPropagation();

			return false;
		}
	};

	var v=document.getElementsByTagName('a');
	if(v && v.length && v.length>0){
		for(var i=0; i<v.length; ++i){
			var a=v[i];
			if(a){
				if(a.addEventListener){
					a.addEventListener('click', _click, false);
				}else if(a.attachEvent){
					a.attachEvent('onclick', _click);
				}
				if(!a.getAttribute('title')){
					a.setAttribute('title', a.getAttribute('href'));
				}
			}
		}
	}
};

//document.addEventListener('DOMContentLoaded', _init});

window.onload=_init; //for CHM/IE;

