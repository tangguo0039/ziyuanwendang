
//sValidation=nyfjs
//sCaption=Copy link address
//sHint=Copy link address to system clipboard
//sCategory=Context.Outline; Context.Hyperlink; Context.Attachment; Context.SearchResults
//sPosition=
//sCondition=CURDB; DBRW; CURINFOITEM
//sID=p.CopyUrl
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

		var sCurSsgPath=ui.getCurInfoItem();
		var sCurInputFocus=ui.getFocusPane();

		var isLinux=()=>{return (/linux/i).test(platform.getOsType());};
		var isMac=()=>{return (/macOS/i).test(platform.getOsType());};
		var isWin=()=>{return (/(windows|win32|win64|win|dos)/i).test(platform.getOsType());};

		var searchResFocus=()=>{return (/^SearchResults$/i).test(sCurInputFocus);};
		var outlineFocus=()=>{return (/^Outline$/i).test(sCurInputFocus);};
		var labelsFocus=()=>{return (/^Labels$/i).test(sCurInputFocus);};
		var tagResultsFocus=()=>{return (/^TagResults$/i).test(sCurInputFocus);};
		var overviewFocus=()=>{return (/^Overview$/i).test(sCurInputFocus);};
		var relationFocus=()=>{return (/^Relation$/i).test(sCurInputFocus);};
		var htmlEditFocus=()=>{return (/^Html(Edit|View)$/i).test(sCurInputFocus);};
		var richEditFocus=()=>{return (/^Rich(Edit|View)$/i).test(sCurInputFocus);};
		var plainEditFocus=()=>{return (/^(Text|Plain)(Edit|View)$/i).test(sCurInputFocus);};

		var v0=[];
		if(outlineFocus()){
			let vInfoItems=ui.getSelectedInfoItems(-1), bRO=true;
			for(let s of vInfoItems){
				let sTitle=xNyf.getFolderHint(s);
				s=xNyf.makeHyperlinkOfSsgEntry(xNyf.getDbFile(), s, '', sTitle, bRO);
				if(s) v0.push(s);
			}
		}else if(relationFocus()){
			let bFullPath=false, vAttachments=ui.getSelectedAttachments(-1, bFullPath), bRO=true;
			for(let s of vAttachments){
				s=xNyf.makeHyperlinkOfSsgEntry(xNyf.getDbFile(), sCurSsgPath, s, '', bRO);
				if(s) v0.push(s);
			}
		}else if(searchResFocus()){
			var vSearchResults=ui.getSelectedResults();
			for(let d of vSearchResults){
				let sDbFn=d.sDbFn, sSsgPath=d.sSsgPath, sSsgName=d.sSsgName, bRO=true;
				let sTitle=sSsgName ? '' : xNyf.getFolderHint(sSsgPath);
				s=xNyf.makeHyperlinkOfSsgEntry(sDbFn, sSsgPath, sSsgName, sTitle, bRO);
				if(s) v0.push(s);
			}
		}else if(htmlEditFocus() || richEditFocus || plainEditFocus()){
			let s=ui.getCurrentHyperlink(-1, true);
			if(s) v0.push(s);
		}

		if(v0.length>0){
			let v2=[];
			for(let s of v0){
				let u=s;
				if( (/^[a-z0-9_+-]{1,32}@([a-z0-9_-]+\.){1,5}([a-z]{2,6})$/i).test(s) ){
					//2021.6.8 in case of address with no protocol-scheme, like: xyz@abc.com
					u='mailto:' + s;
				}else if( (/^([a-z0-9_-]+\.){1,5}([a-z]{2,6})[\/]*/i).test(s) ){
					//2021.6.8 consider of urls with no protocol-scheme, like: www.wjjsoft.com
					u='http://' + s;
				}else if( !(/^(data|file|https?|s?ftp|gopher|mailto|nyf|[a-z0-9]{2,16}):/i).test(s) ){
					u='file://';
					if( (/^[^/\\]/).test(s) ){
						u+='/';
						if(s.search(/[/\\]/i)<0){
							//2021.4.23 For attached images, link address may be copied like this: file:///./clip.png
							u+='./'; // ==> ./file.txt
						}
						u+=s; // ==> file:///
					}else{
						u+=s.replace(/^[/\\]{3,}/, '//'); // ==> file://server/dir/file.txt
					}
				}
				v2.push(u);
			}
			var v=platform.setClipboardData([{type: 'url', val: v2}, {type: 'text', val: v0.join(isWin() ? '\r\n' : '\n')}]);
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	alert(e);
//}
