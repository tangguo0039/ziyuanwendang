
//sValidation=nyfjs
//sCaption=Export CHM project ...
//sHint=Export content in current branch and generate a CHM project
//sCategory=MainMenu.Tools
//sID=p.ExportChm
//sAppVerMin=7.0
//sShortcutKey=
//sAuthor=wjjsoft

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_l=function(s){return (s||'').replace(/^\s+/g, '');};
var _trim_r=function(s){return (s||'').replace(/\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

var _html_encode=function(s)
{
	//http://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references
	s=s.replace(/&/g,	'&amp;');
	s=s.replace(/</g,	'&lt;');
	s=s.replace(/>/g,	'&gt;');
	s=s.replace(/\"/g,	'&quot;');
	s=s.replace(/\'/g,	'&apos;');
	s=s.replace(/  /g,	' &nbsp;'); //&nbsp; = non-breaking space;
	//and more ...
	return s;
};

var _html_decode=function(s)
{
	s=s.replace(/&lt;/g,		'<');
	s=s.replace(/&gt;/g,		'>');
	s=s.replace(/&quot;/g,		'"');
	s=s.replace(/&apos;/g,		'\'');
	s=s.replace(/&nbsp;/g,		' ');
	s=s.replace(/&circ;/g,		'^');
	s=s.replace(/&tilde;/g,		'~');
	//and more ...
	s=s.replace(/&amp;/g,		'&');
	return s;
};

var _validate_filename=function(s){
	s=s||'';
	s=s.replace(/[\*\?\.\(\)\[\]\{\}\<\>\\\/\!\$\^\&\+\|,;:\"\'`~@#]/g, ' ');
	s=s.replace(/\s{2,}/g, ' ');
	s=_trim(s);
	if(s.length>64) s=s.substr(0, 64);
	s=_trim(s);
	s=s.replace(/\s/g, '_');
	return s;
};

function _showobj(obj)
{
	var s='';
	if(obj){
		
		var type=typeof(obj);
		s='TYPE = '+type;

		if(type == 'object'){
			for(var x in obj){

				if(x=='typeDetail') continue; //weird thing in IE7
			
				var val=obj[x];
				if(val){
					type=typeof(val);
					if(type=='string' || type=='number'){
						val=obj[x];
					}else if(type=='function'){
						val='{function}';
					}else{
						val='['+type+']';
					}
				}else{
					val='?';
				}

				if(s) s+='\n';

				s+=x;
				s+=' = ';
				s+=val;
			}
		}else if(type=='string'){
			s+='\n';
			s+=obj;
		}else{
		}
	}
	alert(s);
}

try{

	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		var vActs=[
				  _lc2('CurBranch', '1. Export the current branch')
				, _lc2('WholeDb', '2. Export the whole database')
			];

		var sCfgKey='ExportChm.iAction';
		var sMsg=_lc('p.Common.SelAction', 'Please select an action from within the dropdown list');
		var iSel=dropdown(sMsg, vActs, localStorage.getItem(sCfgKey));
		if(iSel>=0){

			localStorage.setItem(sCfgKey, iSel);

			var bCurBranch=(iSel==0);
			var sCurItem=bCurBranch ? plugin.getCurInfoItem(-1) : plugin.getDefRootContainer();

			var sTitle=bCurBranch ? xNyf.getFolderHint(sCurItem) : xNyf.getDbTitle();
			if(iSel>0) sTitle=xNyf.getDbTitle();


			sCfgKey='ExportChm.sPathDst';
			var sDstDir=platform.browseForFolder(_lc2('SelDstDir', 'Please select a directory to store CHM project files'), localStorage.getItem(sCfgKey));
			if(sDstDir){

				localStorage.setItem(sCfgKey, sDstDir);

				var sDstFnBase=_validate_filename(sTitle||'nyf2chm');
				var xDstFn=new CLocalFile(sDstDir); xDstFn.append(sDstFnBase+'.chm');
				var sPathSrc=new CLocalFile(plugin.getScriptFile()).getDirectory();

				var sLang='';
				{
					var vLangs=[
						'0x436 Afrikaans (South Africa)'
						, '0x41c Albanian (Albania)'
						, '0x484 Alsatian (France)'
						, '0x45e Amharic (Ethiopia)'
						, '0x1401 Arabic (Algeria)'
						, '0x3c01 Arabic (Bahrain)'
						, '0xc01 Arabic (Egypt)'
						, '0x801 Arabic (Iraq)'
						, '0x2c01 Arabic (Jordan)'
						, '0x3401 Arabic (Kuwait)'
						, '0x3001 Arabic (Lebanon)'
						, '0x1001 Arabic (Libya)'
						, '0x1801 Arabic (Morocco)'
						, '0x2001 Arabic (Oman)'
						, '0x4001 Arabic (Qatar)'
						, '0x401 Arabic (Saudi Arabia)'
						, '0x2801 Arabic (Syria)'
						, '0x1c01 Arabic (Tunisia)'
						, '0x3801 Arabic (U.A.E.)'
						, '0x2401 Arabic (Yemen)'
						, '0x42b Armenian (Armenia)'
						, '0x44d Assamese (India)'
						, '0x82c Azeri (Cyrillic, Azerbaijan)'
						, '0x42c Azeri (Latin, Azerbaijan)'
						, '0x46d Bashkir (Russia)'
						, '0x42d Basque (Basque)'
						, '0x423 Belarusian (Belarus)'
						, '0x845 Bengali (Bangladesh)'
						, '0x445 Bengali (India)'
						, '0x201a Bosnian (Cyrillic, Bosnia and Herzegovina)'
						, '0x141a Bosnian (Latin, Bosnia and Herzegovina)'
						, '0x47e Breton (France)'
						, '0x402 Bulgarian (Bulgaria)'
						, '0x403 Catalan (Catalan)'
						, '0x804 Chinese (Simplified, PRC)'
						, '0x1004 Chinese (Simplified, Singapore)'
						, '0xc04 Chinese (Traditional, Hong Kong S.A.R.)'
						, '0x1404 Chinese (Traditional, Macao S.A.R.)'
						, '0x404 Chinese (Traditional, Taiwan)'
						, '0x483 Corsican (France)'
						, '0x41a Croatian (Croatia)'
						, '0x101a Croatian (Latin, Bosnia and Herzegovina)'
						, '0x405 Czech (Czech Republic)'
						, '0x406 Danish (Denmark)'
						, '0x48c Dari (Afghanistan)'
						, '0x465 Divehi (Maldives)'
						, '0x813 Dutch (Belgium)'
						, '0x413 Dutch (Netherlands)'
						, '0xc09 English (Australia)'
						, '0x2809 English (Belize)'
						, '0x1009 English (Canada)'
						, '0x2409 English (Caribbean)'
						, '0x4009 English (India)'
						, '0x1809 English (Ireland)'
						, '0x2009 English (Jamaica)'
						, '0x4409 English (Malaysia)'
						, '0x1409 English (New Zealand)'
						, '0x3409 English (Republic of the Philippines)'
						, '0x4809 English (Singapore)'
						, '0x1c09 English (South Africa)'
						, '0x2c09 English (Trinidad and Tobago)'
						, '0x809 English (United Kingdom)'
						, '0x409 English (United States)'
						, '0x3009 English (Zimbabwe)'
						, '0x425 Estonian (Estonia)'
						, '0x438 Faroese (Faroe Islands)'
						, '0x464 Filipino (Philippines)'
						, '0x40b Finnish (Finland)'
						, '0x80c French (Belgium)'
						, '0xc0c French (Canada)'
						, '0x40c French (France)'
						, '0x140c French (Luxembourg)'
						, '0x180c French (Monaco)'
						, '0x100c French (Switzerland)'
						, '0x462 Frisian (Netherlands)'
						, '0x456 Galician (Galician)'
						, '0x437 Georgian (Georgia)'
						, '0xc07 German (Austria)'
						, '0x407 German (Germany)'
						, '0x1407 German (Liechtenstein)'
						, '0x1007 German (Luxembourg)'
						, '0x807 German (Switzerland)'
						, '0x408 Greek (Greece)'
						, '0x46f Greenlandic (Greenland)'
						, '0x447 Gujarati (India)'
						, '0x468 Hausa (Latin, Nigeria)'
						, '0x40d Hebrew (Israel)'
						, '0x439 Hindi (India)'
						, '0x40e Hungarian (Hungary)'
						, '0x40f Icelandic (Iceland)'
						, '0x470 Igbo (Nigeria)'
						, '0x421 Indonesian (Indonesia)'
						, '0x85d Inuktitut (Latin, Canada)'
						, '0x45d Inuktitut (Syllabics, Canada)'
						, '0x83c Irish (Ireland)'
						, '0x410 Italian (Italy)'
						, '0x810 Italian (Switzerland)'
						, '0x411 Japanese (Japan)'
						, '0x486 Kiche (Guatemala)'
						, '0x44b Kannada (India)'
						, '0x43f Kazakh (Kazakhstan)'
						, '0x453 Khmer (Cambodia)'
						, '0x487 Kinyarwanda (Rwanda)'
						, '0x441 Kiswahili (Kenya)'
						, '0x457 Konkani (India)'
						, '0x412 Korean (Korea)'
						, '0x440 Kyrgyz (Kyrgyzstan)'
						, '0x454 Lao (Lao P.D.R.)'
						, '0x426 Latvian (Latvia)'
						, '0x427 Lithuanian (Lithuania)'
						, '0x82e Lower Sorbian (Germany)'
						, '0x46e Luxembourgish (Luxembourg)'
						, '0x42f Macedonian (Former Yugoslav Republic of Macedonia)'
						, '0x83e Malay (Brunei Darussalam)'
						, '0x43e Malay (Malaysia)'
						, '0x44c Malayalam (India)'
						, '0x43a Maltese (Malta)'
						, '0x481 Maori (New Zealand)'
						, '0x47a Mapudungun (Chile)'
						, '0x44e Marathi (India)'
						, '0x47c Mohawk (Mohawk)'
						, '0x450 Mongolian (Cyrillic, Mongolia)'
						, '0x850 Mongolian (Traditional Mongolian, PRC)'
						, '0x461 Nepali (Nepal)'
						, '0x414 Norwegian, Bokml (Norway)'
						, '0x814 Norwegian, Nynorsk (Norway)'
						, '0x482 Occitan (France)'
						, '0x448 Oriya (India)'
						, '0x463 Pashto (Afghanistan)'
						, '0x429 Persian'
						, '0x415 Polish (Poland)'
						, '0x416 Portuguese (Brazil)'
						, '0x816 Portuguese (Portugal)'
						, '0x446 Punjabi (India)'
						, '0x46b Quechua (Bolivia)'
						, '0x86b Quechua (Ecuador)'
						, '0xc6b Quechua (Peru)'
						, '0x418 Romanian (Romania)'
						, '0x417 Romansh (Switzerland)'
						, '0x419 Russian (Russia)'
						, '0x243b Sami, Inari (Finland)'
						, '0x103b Sami, Lule (Norway)'
						, '0x143b Sami, Lule (Sweden)'
						, '0xc3b Sami, Northern (Finland)'
						, '0x43b Sami, Northern (Norway)'
						, '0x83b Sami, Northern (Sweden)'
						, '0x203b Sami, Skolt (Finland)'
						, '0x183b Sami, Southern (Norway)'
						, '0x1c3b Sami, Southern (Sweden)'
						, '0x44f Sanskrit (India)'
						, '0x491 Scottish Gaelic (United Kingdom)'
						, '0x1c1a Serbian (Cyrillic, Bosnia and Herzegovina)'
						, '0x301a Serbian (Cyrillic, Montenegro)'
						, '0xc1a Serbian (Cyrillic, Serbia and Montenegro (Former))'
						, '0x281a Serbian (Cyrillic, Serbia)'
						, '0x181a Serbian (Latin, Bosnia and Herzegovina)'
						, '0x2c1a Serbian (Latin, Montenegro)'
						, '0x81a Serbian (Latin, Serbia and Montenegro (Former))'
						, '0x241a Serbian (Latin, Serbia)'
						, '0x46c Sesotho sa Leboa (South Africa)'
						, '0x432 Setswana (South Africa)'
						, '0x45b Sinhala (Sri Lanka)'
						, '0x41b Slovak (Slovakia)'
						, '0x424 Slovenian (Slovenia)'
						, '0x2c0a Spanish (Argentina)'
						, '0x200a Spanish (Bolivarian Republic of Venezuela)'
						, '0x400a Spanish (Bolivia)'
						, '0x340a Spanish (Chile)'
						, '0x240a Spanish (Colombia)'
						, '0x140a Spanish (Costa Rica)'
						, '0x1c0a Spanish (Dominican Republic)'
						, '0x300a Spanish (Ecuador)'
						, '0x440a Spanish (El Salvador)'
						, '0x100a Spanish (Guatemala)'
						, '0x480a Spanish (Honduras)'
						, '0x80a Spanish (Mexico)'
						, '0x4c0a Spanish (Nicaragua)'
						, '0x180a Spanish (Panama)'
						, '0x3c0a Spanish (Paraguay)'
						, '0x280a Spanish (Peru)'
						, '0x500a Spanish (Puerto Rico)'
						, '0xc0a Spanish (Spain, International Sort)'
						, '0x40a Spanish (Spain, Traditional Sort)'
						, '0x540a Spanish (United States)'
						, '0x380a Spanish (Uruguay)'
						, '0x81d Swedish (Finland)'
						, '0x41d Swedish (Sweden)'
						, '0x45a Syriac (Syria)'
						, '0x428 Tajik (Cyrillic, Tajikistan)'
						, '0x85f Tamazight (Latin, Algeria)'
						, '0x449 Tamil (India)'
						, '0x444 Tatar (Russia)'
						, '0x44a Telugu (India)'
						, '0x41e Thai (Thailand)'
						, '0x451 Tibetan (PRC)'
						, '0x41f Turkish (Turkey)'
						, '0x442 Turkmen (Turkmenistan)'
						, '0x422 Ukrainian (Ukraine)'
						, '0x42e Upper Sorbian (Germany)'
						, '0x420 Urdu (Islamic Republic of Pakistan)'
						, '0x480 Uyghur (PRC)'
						, '0x843 Uzbek (Cyrillic, Uzbekistan)'
						, '0x443 Uzbek (Latin, Uzbekistan)'
						, '0x42a Vietnamese (Vietnam)'
						, '0x452 Welsh (United Kingdom)'
						, '0x488 Wolof (Senegal)'
						, '0x485 Yakut (Russia)'
						, '0x478 Yi (PRC)'
						, '0x46a Yoruba (Nigeria)'
						, '0x434 isiXhosa (South Africa)'
						, '0x435 isiZulu (South Africa)'
					];
					sCfgKey='ExportChm.iLang';
					sMsg=_lc2('SelLang', 'Please select a language appropriate for the CHM project');
					var iLang=dropdown(sMsg, vLangs, localStorage.getItem(sCfgKey));
					if(iLang>=0){
						localStorage.setItem(sCfgKey, iLang);
						sLang=vLangs[iLang];
					}
				}

				if(sLang){

					var _unique_filename=function(sDir, sName, sExt){
						var sRes=sName+sExt, xFn=new CLocalFile(sDir); xFn.append(sRes);
						while(xFn.exists()){
							sRes=sName+'-'+Math.round(Math.random()*1000)+sExt;
							xFn=new CLocalFile(sDir); xFn.append(sRes);
						}
						return sRes;
					};

					var _xNamesUsed={};
					var _hash_name=function(s1, s2, sExt){
						var sName='', i=0;
						do{
							//2011.2.8 make signed into unsigned by using the operator 'n>>>0';
							//http://hi.baidu.com/ebiyuan/blog/item/d0691adb9c78156ed1164e4b.html
							sName=(adler32(s1)>>>0).toString(16).toLowerCase();
							if(s2) sName+='_'+(adler32(s2)>>>0).toString(16).toLowerCase();
							sName+=('_'+i);
							sName+=sExt;
							i++;
						}while(_xNamesUsed[sName]);
						//2013.11.2 save the name to avoid file overwriting;
						_xNamesUsed[sName]=1;
						return sName;
					};

					var _remove_utf8_charset___2=function(s){
						var vLines=(s||'').split('\n');
						for(var i in vLines){
							var sLine=vLines[i]||'';
							if(sLine.match(/<meta\s(.*)(charset=UTF-8)/i)){
								vLines[i]=''; //2014.12.8 Failed if all HTML are in one line;
								break;
							}else if(sLine.match(/<body(.*)>/i)){
								break;
							}
						}
						var s='';
						for(var i in vLines){
							if(s) s+='\n';
							s+=vLines[i];
						}
						return s;
					};

					var _remove_utf8_charset=function(sHtml){
						//2014.12.8 consider the scenario: all HTML are in one line;
						//<meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/>
						var p=sHtml.indexOf('<meta '), sRes=sHtml;
						if(p>=0){
							var p2=sHtml.indexOf('>', p+5);
							var sLine=sHtml.substring(p, p2);
							if(sLine.match(/<meta\s(.*)(charset=UTF-8)/i)){
								sRes=sHtml.substr(0, p)+sHtml.substr(p2+1);
							}
						}
						return sRes;
					};

					var sJsFileItemLink='itemlink.js';
					var _install_script=function(sHtml, sJsFn){
						var sRes=sHtml;
						var p=sHtml.indexOf('</body>'); if(p<0) p=sHtml.indexOf('</head>');
						if(p>=0){
							sRes=sHtml.substr(0, p)
							+ '<script type="text/javascript" language="javascript" src="'+sJsFn+'"></script>'
							+ sHtml.substr(p)
							;
						}
						return sRes;
					};

					var sDefNoteFn=plugin.getDefNoteFn();

					var _default_name=function(vFiles, bWebOnly){
						var sDef='';
						{
							var vDefNames=[sDefNoteFn, 'index.html', 'index.htm', 'home.html', 'home.htm', 'default.html', 'default.htm'];
							for(var i in vDefNames){
								if(i==0 && bWebOnly) continue;
								var sName=vDefNames[i];
								if((vFiles||[]).indexOf(sName)>=0){
									sDef=sName;
									break;
								}
							}
						}

						if(!sDef){
							var vBands='.html;.htm;.url>.xml;.eml>.gif;.png;.jpg;.jpeg;.bmp'.split('>');
							for(var j in vBands){
								var vExts=vBands[j].split(';');
								for(var i in vFiles){
									var sName=vFiles[i];
									var sExt=new CLocalFile(sName).getExtension().toLowerCase();
									if(vExts.indexOf(sExt)>=0){
										sDef=sName;
										break;
									}
								}
								if(sDef) break;
							}
						}
						return sDef;
					};

					var _updated=function(sSsgFn, sWinFn){
						var xWinFn=new CLocalFile(sWinFn), t1=xNyf.getModifyTime(sSsgFn), bUpd=true;
						if(xWinFn.exists()){
							var t2=xWinFn.getModifyTime();
							bUpd=t1>t2;
						}
						return bUpd;
					}

					plugin.initProgressRange(plugin.getScriptTitle());

					var sCss=''
						+ 'table{border: 1px solid gray;} td{border: 1px dotted gray;} '
						+ 'p{margin: 3px 0 3px 0; padding: 0;} '
						+ '#ID_Footer{font-size: small; font-style: italic;} '
						/*
						+ 'a{padding-right: 20px; background: URL(./icon_newwin.gif) no-repeat center right;}'
						+ 'a[href ^= "mailto:"]{padding: 0 20px 0 0; background: URL(./icon_email.gif) no-repeat center right;}'
						+ 'a[href ^= "nyf:"]{padding: 0 20px 0 0; background: URL(./icon_jump.gif) no-repeat center right;}'
						*/
						;

					//2013.3.27 enable item links to work;
					var xIDofPath={}, xPathOfID={}, xIDofDoc={};
					{
						var vLines=xNyf.listItemIDs().split('\r\n');
						for(var i in vLines){
							var v=vLines[i].split('\t');
							if(v.length==2){
								var sID=v[0], sPath=v[1];
								if(sID && sPath){
									var xTmp=new CLocalFile(sPath); xTmp.append('/');
									sPath=xTmp;
									xIDofPath[sID]=sPath;
									xPathOfID[sPath]=sID;
								}
							}
						}
					}

					//2013.3.29 enable bookmarks to work;
					var xIDofBkmk={};
					{
						var vLines=xNyf.listBookmarks().split('\r\n');
						for(var i in vLines){
							var v=vLines[i].split('\t');
							if(v.length>=2){
								var sBkmkID=v[0], sItemID=v[1];
								if(sBkmkID && sItemID){
									xIDofBkmk[sBkmkID]=sItemID;
								}
							}
						}
					}

					var _is_local_file=function(s){
						//2011.12.3 test if it's javascript, mailto, http://, or contains any of :?#;
						return s.match(/^javascript:/i)==null 
							&& s.match(/^mailto:/i)==null 
							&& s.match(/:\/\//i)==null 
							&& s.match(/[:\?\#]/i)==null
							//&& s.match(/[^\:\?\*\<\>\|\/\\]/)
							;
					};

					var _detect_linked_objs=function(s, sTag, vObjs){
						if(s && sTag){
							//2011.8.20 '\s' seems not to function within the [...] operator, so replace it with ' \t';

							//2012.7.30 consider all 3 possible formats of the linked objects;
							var vRE=[
								  '=\"(.+?)\"'				//src="abc def.jpg"
								, '=\'(.+?)\''				//src='abc def.jpg'
								//2013.11.2 this may produce some mismatches;
								//, '=(?!\"|\')(.+?)[> \t]'		//src=abc.jpg, spaces not allowed;
							];
							for(var i in vRE){
								var re=new RegExp(sTag+vRE[i], 'ig'), v=[];
								while(v=re.exec(s)){
									if(v && v.length>1){
										//2011.8.21 in case of empty filenames which would cause problems, like this: herf="" or src='';
										var sObj=v[1].replace(/[\'\"]/g, '');
										if(sObj && _is_local_file(sObj)){
											if(vObjs.indexOf(sObj)<0){
												vObjs.push(sObj);
											}
										}
									}
								}
							}
						}
					};

					var sFnPlaceholder='_placeholder.html';
					var xFnPlaceholder=new CLocalFile(sDstDir); xFnPlaceholder.append(sFnPlaceholder);

					var nDone=0, vInfoItems=[], xMapHref={}, vHtmlFiles=[], vTmpFilesToDel=[];
					var _act_on_treeitem=function(sSsgPath, iLevel){

						//var xLI={};
						var sTitle=xNyf.getFolderHint(sSsgPath);

						var bContinue=plugin.ctrlProgressBar(sTitle||'Untitled', 1, true);
						if(!bContinue) return true;

						//xLI['sSsgPath']=sSsgPath;
						//xLI['sTitle']=sTitle;
						//xLI['iLevel']=iLevel;
						//xLI['sHref']='';
						//xLI['vFiles']=[];
						//xLI['nSub']=xNyf.getFolderCount(sSsgPath);
						//xLI['nID']=plugin.getItemIDByPath(-1, sSsgPath)

						var xPath=new CLocalFile(sSsgPath); xPath.append('/');
						var sID=xPathOfID[xPath.toString()];

						var sRel='', vRel=xNyf.listRelated(sSsgPath);
						for(var i in vRel){
							var nID=xNyf.getItemIDByPath(vRel[i], false);
							if(nID>=0){
								if(sRel) sRel+=';';
								sRel+=nID;
							}
						}
						//xLI['sRelated']=sRel;

						//var vFiles=xNyf.listFiles(sSsgPath), sDef=_default_name(vFiles);
						var sDef=xNyf.detectPreferredFile(sSsgPath, 'html;htm>rtf>txt;ini;log;>jpg;png;gif;bmp');

						//first handle and export default content for the info item;
						if(sDef){
							var xSrc=new CLocalFile(sSsgPath); xSrc.append(sDef);
							if(!xNyf.isShortcut(xSrc)){
								//if(sDef==sDefNoteFn){
								if(xSrc.getExtension(true).toLowerCase()=='.rtf'){
									var sExt='.html';
									var sName=_hash_name(xSrc, sTitle||'Untitled', sExt);
									var xDst=new CLocalFile(sDstDir); xDst.append(sName);
									//if(_updated(xSrc, xDst))
									{
										var s=xNyf.loadText(xSrc);
										s=platform.convertRtfToHtml(s
											, {bInner: false
											, bPicture: true
											, sImgDir: sDstDir
											, sTitle: sTitle
											//, sFooter: (plugin.isAppLicensed() ? '' : 'Generated with myBase/NYF2CHM Converter by Wjj Software')
											, sFooter: (plugin.isAppLicensed() ? '' : '%MYBASE-NYF2CHM-CONVERTER%')
											, sStyle: sCss
											, sJsFiles: sJsFileItemLink
											}
										);

										//2013.11.2 CHM isn't able to search documents encoded in UTF-8;
										s=s.replace('%MYBASE-NYF2CHM-CONVERTER%', 'Generated with <a href="http://www.wjjsoft.com/cgi-bin/redir.cgi?ref=chm&q=mybase" target="_blank">myBase/Nyf2Chm</a> Converter by <a href="http://www.wjjsoft.com/cgi-bin/redir.cgi?ref=chm&q=home" target="_blank">Wjj Software</a>');
										s=_install_script(s, sJsFileItemLink);
										xDst.saveAnsi(s); //xDst.saveUtf8(s);

										vHtmlFiles.push(xDst.toString());
										vTmpFilesToDel.push(xDst.toString());

										var vBmps=[];
										_detect_linked_objs(s, 'src', vBmps);

										for(var i in vBmps){
											var xFn=new CLocalFile(sDstDir); xFn.append(vBmps[i]);
											if(xFn.exists()){
												vTmpFilesToDel.push(xFn.toString());
											}
										}
									}
									//xLI['sHref']=sName;
									if(sID) xIDofDoc[sID]=sName;
									xMapHref[xPath.toString()]=sName;
								}else{
									var sExt=xSrc.getExtension(true);
									var sName=_hash_name(xSrc, sTitle||'Untitled', sExt);
									var xDst=new CLocalFile(sDstDir); xDst.append(sName);
									if(xNyf.exportFile(xSrc, xDst)>=0){

										vHtmlFiles.push(xDst.toString());
										vTmpFilesToDel.push(xDst.toString());

										if('.html;.htm'.split(';').indexOf(sExt.toLowerCase())>=0){
											var sHtml=xDst.loadText('auto');
											if(sHtml){
												var vObjs=[];
												_detect_linked_objs(sHtml, 'src', vObjs); //images
												_detect_linked_objs(sHtml, 'href', vObjs); //css
												if(vObjs.length>0){
													var xRE_Exts=new RegExp('(\.jpg|\.jpeg|\.gif|\.png|\.bmp|\.swf|\.css)', 'i');
													for(var i in vObjs){
														var sObj=vObjs[i]||'';
														if(sObj.match(xRE_Exts) && sObj.match(/[^:\?\*\|\/\\\<\>]/)){
															var xObjSrc=new CLocalFile(sSsgPath);
															try{
																//2013.11.2 For random names, this function may fail if any invalid characters contained;
																xObjSrc.append(sObj);
															}catch(e){
																//alert(e.toString());
																continue;
															}
															var sExt2=xObjSrc.getExtension(true)||'';
															if(sExt2 && sExt2.length<8 && sExt2.toLowerCase()!='.js'){
																//2013.11.2 no js put into CHM;
																var sObjWinName=_hash_name(xSrc, sObj, sExt2);
																var xObjDst=new CLocalFile(sDstDir); xObjDst.append(sObjWinName);
																if(xNyf.exportFile(xObjSrc, xObjDst)>=0){
																	var sPat=sObj.replace(/[\.\[\]]/g, function(w){return '\\'+w;});
																	var xRE=new RegExp(sPat, 'g');
																	sHtml=sHtml.replace(xRE, sObjWinName);
																	vTmpFilesToDel.push(xObjDst.toString()); //2014.12.8 don't forget to remove linked images;
																}
															}
														}
													}
												}

												//2013.11.2 CHM seemed not to fully support documents encoded in UTF-8;
												//It won't search document encoded in UTF8, and some documents in UTF-8 
												//may not show all the linked images from time to time;
												sHtml=_remove_utf8_charset(sHtml);

												//2014.12.8 get inner item links to work;
												//if(sDef==sDefNoteFn)
												{
													sHtml=_install_script(sHtml, sJsFileItemLink);
												}

												/*var sType=xDst.typeOfEncoding();
												if(sType=='ANSI'){
													xDst.saveAnsi(sHtml);
												}else{
													xDst.saveUtf8(sHtml);
												}*/

												xDst.saveAnsi(sHtml);
											}
										}
									}else{
										sName='';
									}

									//xLI['sHref']=sName;
									if(sID) xIDofDoc[sID]=sName;
									xMapHref[xPath.toString()]=sName;
								}
							}
						}

						//2013.11.2 export linked images only, instead of all existing attachments; See above;
						/*
						//export image or CSS files linked with webpages;
						for(var i in vFiles){
							var sName=vFiles[i];
							if(sName!=sDef){
								var xSrc=new CLocalFile(sSsgPath); xSrc.append(sName);
								if(!xNyf.isShortcut(xSrc)){
									if('.gif;.jpg;.jpeg;.png;.bmp;.css'.split(';').indexOf(xSrc.getExtension().toLowerCase())>=0){
										var xDst=new CLocalFile(sDstDir); xDst.append(sName);
										//if(_updated(xSrc, xDst))
										{
											if(xNyf.exportFile(xSrc, xDst)<0){
												sName='';
											}else{
												vTmpFilesToDel.push(xDst.toString());
											}
										}
										if(sName){
											//var v=xLI['vFiles']; v[v.length]=sName;
										}
									}
								}
							}
						}
						*/

						//vInfoItems[vInfoItems.length]=xLI;

					};

					xNyf.traverseOutline(sCurItem, bCurBranch, _act_on_treeitem);

					if(vHtmlFiles.length>0){

						//2013.3.27 export IDs of info items, so the item link can work within web pages.
						var xFnLinks=new CLocalFile(sPathSrc); xFnLinks.append('_nyf2chm_itemlink.html'); //itemlink.js
						var sTxt=xFnLinks.loadText('auto');
						if(sTxt){

							//2014.12.8 convert line-seperator into \r\n;
							var v=sTxt.split('\n'), sTxt='';
							for(var i in v){
								if(sTxt) sTxt+='\r\n';
								sTxt+=v[i];
							}

							//for item links;
							{
								var sTmp='';
								for(var sID in xIDofDoc){
									if(sTmp) sTmp+='\r\n\t, ';
									sTmp+='"'+sID+'": ';
									sTmp+='"'+xIDofDoc[sID]+'"';
								}
								sTmp='{'+sTmp+'}';
								sTxt=sTxt.replace(/%xItemIDs%/gi, sTmp);
							}
							//for bookmark links;
							{
								var sTmp='';
								for(var sBkmkID in xIDofBkmk){
									if(sTmp) sTmp+='\r\n\t, ';
									sTmp+='"'+sBkmkID+'": ';
									sTmp+='"'+xIDofBkmk[sBkmkID]+'"';
								}
								sTmp='{'+sTmp+'}';
								sTxt=sTxt.replace(/%xBkmkIDs%/gi, sTmp);
							}

							xFnLinks=new CLocalFile(sDstDir); xFnLinks.append(sJsFileItemLink);
							xFnLinks.saveUtf8(sTxt);
							vTmpFilesToDel.push(xFnLinks.toString());
						}

						/*
						//2013.8.9 make a placeholder file;
						{
							var sInfo=_lc2(		'NoContent', 'No content available to view.');
							xFnPlaceholder.saveAnsi('<html><body>'+sInfo+'</body></html>');
							vTmpFilesToDel.push(xFnPlaceholder.toString());

							//2013.8.9 the placeholder page shoud put at end of the list, in stead of at begining;
							//as the default page is not specified in HHP, so the first page is selected automatically;
							vHtmlFiles.push(xFnPlaceholder.toString());
						}
						*/

						var _margin=function(n){var s=''; while(n-->0) s+='\t'; return s;};

						//2013.8.7 make .hhc file;
						var xFnHhc=new CLocalFile(sDstDir); xFnHhc.append(sDstFnBase+'.hhc');
						{
							var sHhc='<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML//EN">\r\n'
								+ '<HTML>\r\n'
								+ '<HEAD>\r\n'
								+ '<meta name="GENERATOR" content="Wjjsoft myBase/NYF2CHM Converter">\r\n'
								+ '<!-- Sitemap 1.0 -->\r\n'
								+ '</HEAD><BODY>\r\n'
								//+ '<OBJECT type="text/site properties">\r\n'
								//+ '<param name="ImageType" value="Folder">\r\n'
								//+ '</OBJECT>\r\n'
								;

							if(bCurBranch){
								sHhc+='<UL>\r\n';
							}

							var _xHhc_branch=function(sSsgPath, iLevel){
								if(xNyf.folderExists(sSsgPath)){
									var sTitle=xNyf.getFolderHint(sSsgPath)||'New info item';
									var sHref=xMapHref[sSsgPath]||''; //||sFnPlaceholder;
									//if(!sHref) sTitle+='(-)'; //2013.11.2 to indicate empty content;
									//2013.8.8 "<LI> <OBJECT..." must be in the same line without CR/LF;
									sHhc+=_margin(iLevel)+'<LI> <OBJECT type="text/sitemap">\r\n';
									sHhc+=_margin(iLevel)+'<param name="Name" value="'+_html_encode(sTitle)+'">\r\n';
									sHhc+=_margin(iLevel)+'<param name="Local" value="'+sHref+'">\r\n';
									sHhc+=_margin(iLevel)+'</OBJECT>\r\n';

									_xHhc_children(sSsgPath, iLevel);

									//sHhc+=_margin(iLevel)+'</LI>\r\n';
								}
							};
							var _xHhc_children=function(sSsgPath, iLevel){
								var v=xNyf.listFolders(sSsgPath);
								if(v.length>0){
									sHhc+=_margin(iLevel)+'<UL>\r\n';
									for(var i in v){
										var sName=v[i];
										if(sName){
											var xSub=new CLocalFile(sSsgPath); xSub.append(sName); xSub.append('/');
											_xHhc_branch(xSub, iLevel+1);
										}
									}
									sHhc+=_margin(iLevel)+'</UL>\r\n';
								}
							};

							if(bCurBranch){
								_xHhc_branch(sCurItem, 1);
								sHhc+='</UL>\r\n'
							}else{
								_xHhc_children(sCurItem, 1);
							}

							sHhc+='</BODY></HTML>\r\n';

							xFnHhc.saveAnsi(sHhc);
							vTmpFilesToDel.push(xFnHhc.toString());
						}

						//2013.8.9 make .hhk file;
						var xFnHhk=new CLocalFile(sDstDir); xFnHhk.append(sDstFnBase+'.hhk');
						{
							var sHhk='<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML//EN">\r\n'
								+ '<HTML>\r\n'
								+ '<HEAD>\r\n'
								+ '<meta name="GENERATOR" content="Wjjsoft myBase/NYF2CHM Converter">\r\n'
								+ '<!-- Sitemap 1.0 -->\r\n'
								+ '</HEAD><BODY>\r\n'
								+ '<UL>\r\n'
								;

							var _xHhk_branch=function(sSsgPath, iLevel){
								if(xNyf.folderExists(sSsgPath)){
									var sTitle=xNyf.getFolderHint(sSsgPath)||'New info item';
									var sHref=xMapHref[sSsgPath]||''; //||sFnPlaceholder;
									if(sHref){
										//2013.8.8 "<LI> <OBJECT..." must be there without CR/LF;
										sHhk+=_margin(1)+'<LI> <OBJECT type="text/sitemap">\r\n';
										sHhk+=_margin(2)+'<param name="Name" value="'+_html_encode(sTitle)+'">\r\n';
										sHhk+=_margin(2)+'<param name="Name" value="'+_html_encode(sTitle)+'">\r\n';
										sHhk+=_margin(2)+'<param name="Local" value="'+sHref+'">\r\n';
										sHhk+=_margin(2)+'</OBJECT>\r\n';
										//sHhk+=_margin(1)+'</LI>\r\n';
									}

									_xHhk_children(sSsgPath, iLevel);

								}
							};
							var _xHhk_children=function(sSsgPath, iLevel){
								var v=xNyf.listFolders(sSsgPath);
								if(v.length>0){
									//sHhk+=_margin(iLevel)+'<UL>\r\n';
									for(var i in v){
										var sName=v[i];
										if(sName){
											var xSub=new CLocalFile(sSsgPath); xSub.append(sName); xSub.append('/');
											_xHhk_branch(xSub, iLevel+1);
										}
									}
									//sHhk+=_margin(iLevel)+'</UL>\r\n';
								}
							};

							if(bCurBranch) _xHhk_branch(sCurItem, 1); else _xHhk_children(sCurItem, 1);

							sHhk+= '</UL>\r\n'
							sHhk+='</BODY></HTML>\r\n';

							xFnHhk.saveAnsi(sHhk);
							vTmpFilesToDel.push(xFnHhk.toString());
						}

						//2013.8.7 make .hhp file;
						var xFnHhp=new CLocalFile(sDstDir); xFnHhp.append(sDstFnBase+'.hhp');
						{
							var sHhp='[OPTIONS]' + '\r\n'
								+ 'Auto Index=Yes' + '\r\n'
								+ 'Binary TOC=Yes' + '\r\n'
								+ 'Compatibility=1.1 or later' + '\r\n'
								//+ 'Compiled file=' + xDstFn.toString().replace(/\//g, '\\') + '\r\n'
								//+ 'Contents file=' + xFnHhc.toString().replace(/\//g, '\\') + '\r\n'
								+ 'Compiled file=' + xDstFn.getLeafName() + '\r\n'
								+ 'Contents file=' + xFnHhc.getLeafName() + '\r\n'
								+ 'Language=' + sLang + '\r\n'
								+ 'Default Font=' + '\r\n'
								+ 'Display compile progress=yes' + '\r\n'
								+ 'Error log file=' + sDstFnBase + '.log' + '\r\n'
								+ 'Flat=No' + '\r\n'
								//+ 'Full text search stop list file=' + '\r\n'
								+ 'Full-text search=Yes' + '\r\n'
								//+ 'Index file=' + xFnHhk.toString().replace(/\//g, '\\') + '\r\n'
								+ 'Index file=' + xFnHhk.getLeafName() + '\r\n'
								+ 'Title=' + sTitle + '\r\n'
								+ '\r\n'
								+ '[FILES]' + '\r\n'
							;
							for(var i in vHtmlFiles){
								var sFn=vHtmlFiles[i];
								sHhp+=sFn.replace(/\//g, '\\'); //.replace(/\\/g, '/');
								sHhp+='\r\n';
							}

							xFnHhp.saveAnsi(sHhp); //HHC sucks, but doesn't recognize UTF8 BOM;
							vTmpFilesToDel.push(xFnHhp.toString());
						}

						var xFnHhcExe=new CLocalFile(sPathSrc); xFnHhcExe.append('hhc.exe');
						if(!xFnHhcExe.exists()){
							//2014.1.5 look into the default setup folder for HTML Help Workshop;
							//Unfortunately 'PROGRAM_FILES' not supported in WIN32;
							//var sPathProgramFiles=platform.getSpecialFolder('PROGRAM_FILES');
							var vPathPF=['C:/Program Files (x86)', 'C:/Program Files', 'D:/Program Files (x86)', 'D:/Program Files'];
							for(var i in vPathPF){
								var xHhc=new CLocalFile(vPathPF[i]); xHhc.append('HTML Help Workshop/hhc.exe');
								if(xHhc.exists()){
									xFnHhcExe=xHhc;
									break;
								}
							}
						}

						if(xFnHhcExe.exists() && platform.getOsType()=='Win32'){
							//var sFnHhp=xFnHhp.toString().replace(/\//g, '\\'); //2014.12.8 Back-slash is required for DOS programs;
							var sFnHhp=xFnHhp.toString('\\'); //2014.12.8 Back-slash is required for DOS programs;
							if(xFnHhcExe.exec(['"'+sFnHhp+'"'])){
								var sMsg=_lc2('Done', 'Please wait a while for CHM compiling to complete. If all goes OK, you may press Yes button to view the CHM document when done.');
								if(confirm(sMsg)){
									xDstFn.exec();
								}
								for(var i in vTmpFilesToDel){
									var xFn=new CLocalFile(vTmpFilesToDel[i]);
									xFn.remove();
								}
							}else{
								alert('Failed to open the project with HTML Help Workshop.'+'\n\n'+xFnHhcExe+'\n'+xFnHhp);
							}
						}else{
							var sMsg=_lc2('NeedHHW', 'The CHM project files have been successfully generated in the specified folder. Now you can compile the project into a CHM document by utilizing Microsoft HTML Help Workshop.');
							alert(sMsg+'\n\n'+xFnHhp);
						}

					}
				}
			}
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

}catch(e){
	alert(e);
}
