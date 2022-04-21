
//sValidation=nyfjs
//sCaption=Insert hyperlink ...
//sHint=Insert internet URL with a label text into current content
//sCategory=MainMenu.Insert; ToolBar.Insert
//sCondition=CURDB; DBRW; CURINFOITEM; FORMATTED; EDITING;
//sID=p.Ins.Hyperlink
//sAppVerMin=8.0
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

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

//var _html_encode=function(s){
//	//http://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references
//	//http://www.utf8-chartable.de/unicode-utf8-table.pl?utf8=dec
//	s=s.replace(/&/g,	'&amp;');
//	s=s.replace(/</g,	'&lt;');
//	s=s.replace(/>/g,	'&gt;');
//	s=s.replace(/\"/g,	'&quot;');
//	s=s.replace(/\'/g,	'&apos;');
//	s=s.replace(/\xA0/g,	'&nbsp;'); //http://www.fileformat.info/info/unicode/char/a0/index.htm
//	s=s.replace(/  /g,	'&nbsp; ');
//	s=s.replace(/\t/g,	'&nbsp; &nbsp; &nbsp; &nbsp; '); //&emsp;
//	//more ...
//	return s;
//};

//try{
	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		if(!xNyf.isReadonly()){

			if(plugin.isContentEditable()){

				var sCfgKey1='InsHyperlink.sURL', sCfgKey2='InsHyperlink.sLabel', sCfgKey3='InsHyperlink.sTitle';

				var sUrl0=localStorage.getItem(sCfgKey1), sLabel0=localStorage.getItem(sCfgKey2), sTitle0=localStorage.getItem(sCfgKey3);

				var sUrlCandidate, sLabelCandidate;
				{
					var sSel=plugin.getSelectedText(-1, false);
					if(sSel){

						include('comutils');

						sSel=sSel.replace(/[\r\n\t\s]+/g, ' ');
						var v=sSel.split(' ');
						for(var i in v){
							var s=_trim(v[i]);
							if(s.search(/^(file|http[s]?|ftp|gopher):\/\/[\S]+$/i)===0){
								//e.g. http://www.domain.com/sub/dir/index.html?p1=abcdefg&p2=123456
								sLabelCandidate=sSel;
								sUrlCandidate=s;
							}else if(s.search(/^(www|ftp)(\.[\S]+){1,5}\.[a-z]{1,8}([\/]+[^\/]+){0,32}[\/]?$/i)===0){
								//e.g. www.domain.com/sub/dir/index.html?p1=abcdefg&p2=123456
								if(s.search(/^www/i)===0){
									sUrlCandidate='http://'+s;
								}else if(s.search(/^ftp/i)===0){
									sUrlCandidate='ftp://'+s;
								}
								if(sUrlCandidate) sLabelCandidate=sSel;
							}else if(s.search(/^(mailto:)[\w\-\+\.]{1,40}@([\w\-]+\.){1,5}[a-z]{1,8}$/i)===0){
								//e.g. mailto:username+tag@subdomain.domain.com
								sLabelCandidate=sSel;
								sUrlCandidate=s;
							}else if(s.search(/^[\w\-\+\.]{1,40}@([\w\-]+\.){1,5}[a-z]{1,8}$/i)===0){
								//e.g. username+tag@subdomain.domain.com
								sLabelCandidate=sSel;
								sUrlCandidate="mailto:"+s;
							}else if(s.search(/^([\/]+[^\/]+){2,32}[\/]?$/i)===0){
								//e.g. /Users/wjj/Downloads/file.zip
								sLabelCandidate=sSel;
								sUrlCandidate=urlFromLocalFile(s, true);
							}else if(s.replace(/\\/g, '/').search(/^[a-z]:([\/]+[^\/]+){2,32}[\/]?$/i)===0){
								//e.g. C:\Users\wjj\sub\backslash.zip or C:/Users/wjj/sub/slash.zip
								sLabelCandidate=sSel;
								sUrlCandidate=urlFromLocalFile(s.replace(/\\/g, '/'), true);
							}else if(s.replace(/\\/g, '/').search(/^\/([\/]+[^\/]+){2,32}[\/]?$/i)===0){
								//e.g. UNC: //servername/share/file.txt
								sLabelCandidate=sSel;
								s=s.replace(/\\/g, '/').replace(/[\/]{2,}/g, '/');
								sUrlCandidate="file:////"+s;
							}
							if(sUrlCandidate) break;
						}
					}
				}

				if(sUrlCandidate){
					sUrl0=sUrlCandidate;
				}

				if(sLabelCandidate){
					sLabel0=sLabelCandidate;
					sTitle0='';
				}else if(sSel){
					sLabel0=sSel;
					sTitle0='';
				}

				var vFields = [
					{sField: 'lineedit', sLabel: _lc2('Url', 'URL or E-mail address'), sInit: ''} //sUrl0||'http://'
					, {sField: 'lineedit', sLabel: _lc2('Label', 'Label text to display'), sInit: '', bReq: false} //sLabel0||''
					, {sField: 'lineedit', sLabel: _lc2('Title', 'Title text (optional)'), sInit: '', bReq: false} //sTitle0||''
					];
				var vRes=input(plugin.getScriptTitle(), vFields, {nMinSize: 500, nSpacing: 10, vMargins: [2, 0, 30, 0], bVert: true});
				if(vRes && vRes.length>=3){

					var sUrl=vRes[0], sLabel=vRes[1], sTitle=vRes[2];//.replace(/[\'\"\r\n]/g, '');
					if(sUrl){

						localStorage.setItem(sCfgKey1, sUrl);
						localStorage.setItem(sCfgKey2, sLabel);
						localStorage.setItem(sCfgKey3, sTitle);

						if(!sLabel) sLabel=sUrl;

						if(!sUrl.match(/^(http\:\/\/|https\:\/\/|ftp:\/\/|ftps:\/\/|file\:\/\/|gopher\:\/\/|telnet\:\/\/|wais\:\/\/|ed2k\:\/\/|mailto\:|news\:)/)){
							if(sUrl.match(/^[a-z]([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i)){
								sUrl='mailto:'+sUrl;
							}else{
								sUrl='http://'+sUrl;
							}
						}

						var sHtml='<a href="' + sUrl + '" title="'+platform.htmlEncode(sTitle)+'">' + platform.htmlEncode(sLabel) + '</a>&nbsp;';
						plugin.replaceSelectedText(-1, sHtml, true);

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
