
//sValidation=nyfjs
//sCaption=Export CHM project ...
//sHint=Export contents in current branch and generate CHM project files
//sCategory=MainMenu.Share
//sCondition=CURDB; CURINFOITEM; OUTLINE
//sID=p.ExportChm
//sAppVerMin=8.0
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

function _showobj(obj)
{
	let s='';
	if(obj){

		let type=typeof(obj);
		s='TYPE = '+type;

		if(type==='object'){
			for(let x in obj){

				if(x==='typeDetail') continue; //weird thing in IE7

				let val=obj[x];
				if(val){
					type=typeof(val);
					if(type==='string' || type==='number'){
						val=obj[x];
					}else if(type==='function'){
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
		}else if(type==='string'){
			s+='\n';
			s+=obj;
		}else{
		}
	}
	alert(s);
}

var g_vTmpFilesToDel=[], _clean_up_tmpfiles=()=>{
	for(let i in g_vTmpFilesToDel){
		let xFn=new CLocalFile(g_vTmpFilesToDel[i]);
		xFn.remove();
	}
};

try{
	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		if(plugin.isContentEditable()) plugin.commitCurrentChanges();

		let vRange=[
				  _lc('p.Common.CurBranch', 'Current branch')
				, _lc('p.Common.CurDB', 'Current database')
			];

		let vLang=[
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
			, '0xc04' + ' ' + _lc2('zh-HK', 'Chinese (Traditional, Hong Kong S.A.R.)')
			, '0x1404' + ' ' + _lc2('zh-MO', 'Chinese (Traditional, Macao S.A.R.)')
			, '0x404' + ' ' + _lc2('zh-TW', 'Chinese (Traditional, Taiwan)')
			, '0x1004' + ' ' + _lc2('zh-SG', 'Chinese (Simplified, Singapore)')
			, '0x804' + ' ' + _lc2('zh-CN', 'Chinese (Simplified, PRC)')
			, '0x483 Corsican (France)'
			, '0x41a Croatian (Croatia)'
			, '0x101a Croatian (Latin, Bosnia and Herzegovina)'
			, '0x405' + ' ' + _lc2('cs-CZ', 'Czech (Czech Republic)')
			, '0x406' + ' ' + _lc2('da-DK', 'Danish (Denmark)')
			, '0x48c Dari (Afghanistan)'
			, '0x465 Divehi (Maldives)'
			, '0x813' + ' ' + _lc2('nl-BE', 'Dutch (Belgium)')
			, '0x413' + ' ' + _lc2('nl-NL', 'Dutch (Netherlands)')
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
			, '0x40b' + ' ' + _lc2('fi-FI', 'Finnish (Finland)')
			, '0x80c' + ' ' + _lc2('fr-BE', 'French (Belgium)')
			, '0xc0c' + ' ' + _lc2('fr-CA', 'French (Canada)')
			, '0x40c' + ' ' + _lc2('fr-FR', 'French (France)')
			, '0x140c French (Luxembourg)'
			, '0x180c French (Monaco)'
			, '0x100c' + ' ' + _lc2('fr-CH', 'French (Switzerland)')
			, '0x462 Frisian (Netherlands)'
			, '0x456 Galician (Galician)'
			, '0x437 Georgian (Georgia)'
			, '0xc07' + ' ' + _lc2('de-AT', 'German (Austria)')
			, '0x407' + ' ' + _lc2('de-DE', 'German (Germany)')
			, '0x1407 German (Liechtenstein)'
			, '0x1007 German (Luxembourg)'
			, '0x807' + ' ' + _lc2('de-CH', 'German (Switzerland)')
			, '0x408 Greek (Greece)'
			, '0x46f Greenlandic (Greenland)'
			, '0x447 Gujarati (India)'
			, '0x468 Hausa (Latin, Nigeria)'
			, '0x40d' + ' ' + _lc2('he-IL', 'Hebrew (Israel)')
			, '0x439 Hindi (India)'
			, '0x40e Hungarian (Hungary)'
			, '0x40f Icelandic (Iceland)'
			, '0x470 Igbo (Nigeria)'
			, '0x421 Indonesian (Indonesia)'
			, '0x85d Inuktitut (Latin, Canada)'
			, '0x45d Inuktitut (Syllabics, Canada)'
			, '0x83c Irish (Ireland)'
			, '0x410' + ' ' + _lc2('it-IT', 'Italian (Italy)')
			, '0x810' + ' ' + _lc2('it-CH', 'Italian (Switzerland)')
			, '0x411' + ' ' + _lc2('ja-JP', 'Japanese (Japan)')
			, '0x486 Kiche (Guatemala)'
			, '0x44b Kannada (India)'
			, '0x43f Kazakh (Kazakhstan)'
			, '0x453 Khmer (Cambodia)'
			, '0x487 Kinyarwanda (Rwanda)'
			, '0x441 Kiswahili (Kenya)'
			, '0x457 Konkani (India)'
			, '0x412' + ' ' + _lc2('ko-KR', 'Korean (Korea)')
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
			, '0x415' + ' ' + _lc2('pl-PL', 'Polish (Poland)')
			, '0x416' + ' ' + _lc2('pt-BR', 'Portuguese (Brazil)')
			, '0x816' + ' ' + _lc2('pt-PT', 'Portuguese (Portugal)')
			, '0x446 Punjabi (India)'
			, '0x46b Quechua (Bolivia)'
			, '0x86b Quechua (Ecuador)'
			, '0xc6b Quechua (Peru)'
			, '0x418' + ' ' + _lc2('ro-RO', 'Romanian (Romania)')
			, '0x417 Romansh (Switzerland)'
			, '0x419' + ' ' + _lc2('ru-RU', 'Russian (Russia)')
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
			, '0x41b' + ' ' + _lc2('sk-SK', 'Slovak (Slovakia)')
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
			, '0x41d' + ' ' + _lc2('sv-SE', 'Swedish (Sweden)')
			, '0x45a Syriac (Syria)'
			, '0x428 Tajik (Cyrillic, Tajikistan)'
			, '0x85f Tamazight (Latin, Algeria)'
			, '0x449 Tamil (India)'
			, '0x444 Tatar (Russia)'
			, '0x44a Telugu (India)'
			, '0x41e' + ' ' + _lc2('th-TH', 'Thai (Thailand)')
			, '0x451 Tibetan (PRC)'
			, '0x41f' + ' ' + _lc2('tr-TR', 'Turkish (Turkey)')
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

		let sCfgKey1='ExportChm.sDir', sCfgKey2='ExportChm.iRange', sCfgKey3='ExportChm.iLang';

		let iLangSel=-1;
		if(1){
			let sLangSel=localStorage.getItem(sCfgKey3);
			if(sLangSel){
				iLangSel=parseInt(sLangSel);
			}
		}

		let vLocales=[platform.getLanguageName(true), platform.getCountryName(true), platform.getLanguageName(false), platform.getCountryName(false)];
		if(iLangSel<0){
			let vCandidates=[];
			for(let i=0; i<vLang.length; ++i){
				let nRank=0;
				for(let l of vLocales){
					if(vLang[i].toLowerCase().indexOf(l.toLowerCase())>=0){
						nRank++;
						if(nRank>=2){
							iLangSel=i;
							break;
						}
						vCandidates.push(i);
					}
				}
				if(iLangSel>=0) break;
			}
			if(iLangSel<0 && vCandidates.length>0){
				iLangSel=vCandidates[0];
			}
		}

		let vFields = [
			{sField: "folder", sLabel: _lc2('DstPath', 'Destination folder'), sTitle: plugin.getScriptTitle(), sInit: localStorage.getItem(sCfgKey1)||''}
			, {sField: "combolist", sLabel: _lc('p.Common.Range', 'Range'), vItems: vRange, sInit: localStorage.getItem(sCfgKey2)||'0'}
			, {sField: "combolist", sLabel: _lc2('Language', 'Language'), vItems: vLang, sInit: iLangSel}
			, {sField: 'label', sText: _lc2('SysLocale', 'System locale') + ': ' + [...vLocales,  platform.getBcp47Name()].join(', ')}
		];

		let vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 500, vMargins: [2, 0, 50, 0], bVert: true});
		if(vRes && vRes.length===3){

			let sDstDir=vRes[0], iRange=vRes[1], iLang=vRes[2];
			if(sDstDir && iRange>=0 && iLang>=0){

				if(new CLocalDir(sDstDir).exists()){

					localStorage.setItem(sCfgKey1, sDstDir);
					localStorage.setItem(sCfgKey2, iRange);
					localStorage.setItem(sCfgKey3, iLang);

					ui.initProgressRange(plugin.getScriptTitle());

					include('comutils');

					let _validate_filename=function(s){
						//test RE: alert(_validate_filename("ABC\t\r\n   /[*?.()\[\]{}<>/\\!$^&+|,;:\"'`~@#]/gim"));
						s=s||'';
						s=s.replace(/[*?.()\[\]{}<>/\\!$^&+|,;:"'`~@#\s\t\r\n]+/g, ' ');
						s=trim(s);
						if(s.length>64) s=s.substr(0, 64);
						s=trim(s);
						s=s.replace(/\s/g, '_');
						return s;
					};

					let bCurBranch=(iRange===0);
					let sCurItem=bCurBranch ? plugin.getCurInfoItem(-1) : plugin.getDefRootContainer();

					let sTitle=bCurBranch ? xNyf.getFolderHint(sCurItem) : xNyf.getDbTitle();
					if(iRange>0) sTitle=xNyf.getDbTitle();

					let sLang=vLang[iLang];

					let sDstFnBase=_validate_filename(sTitle||'nyf2chm');
					let xDstFn=new CLocalFile(sDstDir, sDstFnBase+'.chm');
					let sPathSrc=new CLocalFile(plugin.getScriptFile()).getDirectory();

					let _unique_filename=function(sDir, sName, sExt){
						let sRes=sName+sExt, xFn=new CLocalFile(sDir, sRes);
						while(xFn.exists()){
							sRes=sName+'-'+Math.round(Math.random()*1000)+sExt;
							xFn=new CLocalFile(sDir, sRes);
						}
						return sRes;
					};

					var _xNamesUsed={};
					let _hash_name=function(s1, s2, sExt){
						let sName='', i=0;
						do{
							//2011.2.8 make signed into unsigned by using the operator 'n>>>0';
							//http://hi.baidu.com/ebiyuan/blog/item/d0691adb9c78156ed1164e4b.html
							sName=(adler32(s1)>>>0).toString(16).toLowerCase();
							if(s2) sName+='_'+(adler32(s2)>>>0).toString(16).toLowerCase();
							sName+=('_'+i);
							sName+=('.'+sExt.replace(/^[.]+/, ''));
							i++;
						}while(_xNamesUsed[sName]);
						//2013.11.2 save the name to avoid file overwriting;
						_xNamesUsed[sName]=1;
						return sName;
					};

					let _remove_utf8_charset=function(sHtml){
						//2020.1.11 consider of the following 2 formats of charset directives;
						//<meta charset="utf-8">
						//<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
						//return sHtml.replace(/<meta\s([^>]*)\b(charset=UTF-8)\b([^>]*)>/gmi, '');
						return sHtml.replace(/<meta\s[^>]*charset=(['"]?)utf-8\1[^>]*>/gmi, '');
					};

					let _remove_comments=function(sHtml){
						//2020.1.22 get rid of remarks, but multiple blank lines may exist in <code>
						return sHtml.replace(/<!--([\s\S]+?)-->/g, ''); //.replace(/[\r\n]{2,}/g, '\n');
					};

					let _remove_msword_remarks=function(sHtml){

						//2016.5.1 msword may produce code like this:
						//<!--[if gte vml 1]> ... <v:imagedata src="./__nyf8_import_msword_doc.files/image001.png" o:title=""/> ... </v:shape><![endif]-->
						//that may not work within CHM, or may depend on specific versions of IE;
						let l='', r=sHtml;

						//skip the <style> section;
						let p=r.search(/<body.*?>/i);
						if(p>=0){
							l+=r.substr(0, p);
							r=r.substr(p);
						}

						while(r){
							p=r.indexOf('<!--');
							if(p>=0){
								l+=r.substr(0, p);
								p=r.indexOf('-->');
								if(p>0){
									r=r.substr(p+3);
								}else{
									break;
								}
							}else{
								l+=r;
								break;
							}
						}
						return l;
					};

					let _remove_msword_vml_tags=function(sHtml){

						//2016.5.1 msword may produce code like this:
						//<![if !vml]><img width=132 height=38 src="c4b0dc3_1adf0405_0.jpg" v:shapes="_x0000_i1025"><![endif]>
						//which is possibly not working within CHM, and could be related to version of IE;

						let v=['<![if !vml]>', '<![endif]>'];
						for(let i in v){
							let sPat=v[i].replace(/([/.\\!\[\]])/g, '\\$1'); ///([\.\/\\\!\[\]])/g
							sHtml=sHtml.replace(new RegExp(sPat, 'ig'), '');
						}
						return sHtml;
					};

					let _remove_scripts=function(sHtml){
						sHtml=sHtml.replace(/<script\b.*?>[\s\S]*?<\/script>/ig, '');
						return sHtml;
					};

					let _remove_toc=function(sHtml){
						//2020.1.22 hard-coded 'id' to identify the TOC that can be removed when exporting contents;
						return sHtml.replace(/<div (id="ID_NYF_TOC_PANE") style="(.+)">/gi, '<div $1 style="display: none; $2">');
					};

					let sJsFileItemLink='itemlink.js';
					let _install_script=function(sHtml, sJsFn){
						let sRes=sHtml;
						let p=sHtml.indexOf('</body>'); if(p<0) p=sHtml.indexOf('</head>');
						if(p>=0){
							sRes=sHtml.substr(0, p)
									+ '<script type="text/javascript" language="javascript" src="'+sJsFn+'"></script>'
									+ sHtml.substr(p)
							;
						}
						return sRes;
					};

					let _add_promotional_tag=(sHtml)=>{
						let c_sInfoFooter='Generated with <a href="http://www.wjjsoft.com/mybase.html?ref=chm_export" target=_blank>' + plugin.getAppTitle() + ' ' + plugin.getAppVerStr() + '</a>';
						let c_sCssFooter='font-size: small; font-style: italic; text-align: right; margin-top: 16em; padding-top: 4px; border-top: 2px solid gray;';
						let sFooter='<footer style="' + c_sCssFooter + '">' + c_sInfoFooter + '</footer>';
						return sHtml.replace(/<\/body>/i, sFooter + '</body>');
					};

					let _fix_tab_spaces=function(s){
						return s.replace(/  /g, ' &nbsp;');
					};

					let _updated=function(sSsgFn, sWinFn){
						let xWinFn=new CLocalFile(sWinFn), t1=xNyf.getModifyTime(sSsgFn), bUpd=true;
						if(xWinFn.exists()){
							let t2=xWinFn.getModifyTime();
							bUpd=t1>t2;
						}
						return bUpd;
					}

					let _qualify_ssgpath=(s)=>{return ((s||'')+'/').replace(/[\//]+/g, '/');};

					let _preferred_file=(sSsgPath)=>{return xNyf.detectPreferredFile(sSsgPath||'', 'html;htm;qrich;md;txt>rtf>jpg;png;gif;bmp;tif;tiff;svg;webp');};

					//2013.3.27 enable item links to work;
					var xID$Path={}, xPath$ID={};
					if(1){
						let vLines=xNyf.listItemIDs().split(/[\r\n]+/);
						for(let i in vLines){
							let v=vLines[i].split('\t');
							if(v.length===2){
								let sID=v[0], sPath=v[1];
								if(sID && sPath){
									sPath=_qualify_ssgpath(sPath);
									xID$Path[sID]=sPath;
									xPath$ID[sPath]=sID;
								}
							}
						}
					}

					//2013.3.29 for bookmark links to work in chm;
					var xBkmk$Info={};
					if(1){
						let vLines=xNyf.listBookmarks().split(/[\r\n]+/);
						for(let i in vLines){
							//300	12	sSsgName	sAnchor
							let v=vLines[i].split('\t');
							if(v.length>=2){
								let sBkmkID=v[0], sItemID=v[1], sSsgName=v[2], sAnchor=v[3]; //2017.10.21 new data format;
								if(sBkmkID && sItemID){
									xBkmk$Info[sBkmkID]=[sItemID , sSsgName, sAnchor].join('\t');
								}
							}
						}
					}

					let sCss=''
							+ 'table{border: 1px solid gray;} td{border: 1px dotted gray;} '
							+ 'p{margin: 3px 0 3px 0; padding: 0;} '
							+ '#ID_Footer{font-size: small; font-style: italic;} '

							//+ 'a{padding-right: 20px; background: URL(./icon_newwin.gif) no-repeat center right;}'
							//+ 'a[href ^= "mailto:"]{padding: 0 20px 0 0; background: URL(./icon_email.gif) no-repeat center right;}'
							//+ 'a[href ^= "nyf:"]{padding: 0 20px 0 0; background: URL(./icon_jump.gif) no-repeat center right;}'

					;

					var vInfoItems=[], xID$Doc={}, xMapHref={}, vHtmlFiles=[], vExtraItems=[];
					let _export_ssgfile=function(sSsgPath, sSsgName, bCache){

						sSsgPath=_qualify_ssgpath(sSsgPath);

						let sID=xPath$ID[sSsgPath];
						let xSrc=new CLocalFile(sSsgPath, sSsgName);

						let sNameRes=xID$Doc[sSsgPath];
						if(sNameRes){
							logd('Cached info item: ' + xSrc.toStr() + ' => ' + sNameRes);
							return sNameRes; //2021.6.2 be sure to return the target file name, or it may log errors;
						}

						if(!xNyf.isShortcut(xSrc.toStr())){
							let sExt=xSrc.getExtension(false).toLowerCase();

							let sName=_hash_name(xSrc.toStr(), sTitle||'Untitled', sExt);
							if(sExt.search(/^(rtf|md|qrich)$/i)===0){
								//2021.5.30 for non-html documents to work with in CHM, required to change suffix to .html, and with no multi-part suffixes;
								//sName+='.html'; //if(sExt.search(/^(html|htm)$/i)<0) sName+='.html';
								sName=sName.replace(/\.(rtf|md|qrich)$/i, '.html');
							}

							let xDst=new CLocalFile(sDstDir, sName);
							if(xNyf.exportFile(xSrc.toStr(), xDst.toStr())>=0){

								g_vTmpFilesToDel.push(xDst.toStr());

								//2021.6.2 be sure to cache this item for recursively handling linked items;
								if(bCache){
									if(sID) xID$Doc[sID]=sName;
									xID$Doc[sSsgPath]=sName; //2021.5.29 consider of hyperlinks created within earlier versions using ssgpaths instead of ids;
									xID$Doc[xSrc.toStr()]=sName; //2021.5.30 for attachment links;
									xMapHref[sSsgPath]=sName;
									logd('Cache info item: <' + (xNyf.getFolderHint(sSsgPath)||'Untitled Item') + '> sSsgPath=' + sSsgPath + ' sID=' + (sID||'?') + ' sSsgName=' + sSsgName + ' ==> ' + sName);
								}

								if(sExt.search(/^(rtf|md|html|htm|qrich)$/i)===0){
									let s0=xDst.loadText('auto'), s=s0;
									if(sExt==='rtf'){
										s=platform.convertRtfToHtml(s
													    , {bInner: false
														    , bPicture: true
														    , sImgDir: sDstDir
														    , sTitle: sTitle
														    //, sFooter: (plugin.isAppLicensed() ? '' : 'Generated with Mybase/CHM Maker by Wjj Software')
														    //, sFooter: (plugin.isAppLicensed() ? '' : '%MYBASE-CHM-MAKER%')
														    , sStyle: sCss
														    , sJsFiles: 'jquery.js;itemlink.js'
													    }
													    );
										//s=s.replace('%MYBASE-CHM-MAKER%', 'Generated with <a href="http://www.wjjsoft.com/mybase.html#chm_export" target="_blank">Mybase/CHM Maker</a>');
									}else if(sExt==='md'){
										s=platform.convertMarkdownToHtml(s, false, xNyf.getFolderHint(sSsgPath, 'untitled'));
										s=_remove_scripts(s); //2019.1.27 Get rid of scripts of hljs contained in the MD template file, CHM doesn't support them well;
									}else if(sExt==='html' || sExt==='htm'){
										//s=s.replace(/\n/g, '\r\n');
										s=_remove_msword_remarks(s); //2016.5.1 get rid of remarks msword produces, which may contain this code '<v:imagedata src="./__nyf8_import_msword_doc.files/image001.png" o:title=""/>' not working with CHM;
										s=_remove_msword_vml_tags(s); //2016.5.1 CHM doesn't regconize vml tags msword produces;
										s=_remove_scripts(s); //2016.5.17 get rid of all scripts;
									}else if(sExt==='qrich'){
										//2021.5.30 for Tabs/multiple blanks to be correctly rendered with in CHM;
										s=_fix_tab_spaces(s);
									}

									if(s){
										s=substituteUrisWithinHtml(s, 'img,link,a', function(sObj, sTagName){

											//2021.6.2 firstly look into cache;
											let u=xID$Doc[sObj] || xID$Doc[new CByteArray(sObj, 'utf8').digest('sha1')];
											if(u){
												logd('Cached link: ' + ellipsis(sObj, 80) + ' ==> ' + u);
												return u;
											}else{
												u=sObj||'';
											}

											//2021.6.2 consider of SVG: data:image/svg+xml;base64,PHN2ZyB4bWxucz0...
											let xRE_ImgSrcData=/^data:image\/(png|jpe?g|gif|bmp|svg|svg\+xml|webp);base64\,(.+)$/i;
											let r=xRE_ImgSrcData.exec(u);
											if(r && r.length>2){

												//the image type could be: svg+xml;
												let sExt2=r[1].split('+')[0], sDat=r[2];
												let ba=new CByteArray(sDat, 'base64');
												if(!ba.isEmpty()){
													let sObjWinName=_hash_name(xSrc.toStr(), u, sExt2);
													let xObjDst=new CLocalFile(sDstDir, sObjWinName);
													if(xObjDst.writeBytes(ba)>=0){
														u=sObjWinName;
														xID$Doc[new CByteArray(sObj, 'utf8').digest('sha1')]=sObjWinName; //2021.6.2 put its hash-val into cache, instead of dataUrl that is usually too long;
														g_vTmpFilesToDel.push(xObjDst.toStr()); //2014.12.8 remember to remove linked images;
														logd('Resolve base64 image: ' + ellipsis(sObj, 80) + ' [OK]' + ' ==> ' + sObjWinName);
														if(sExt2.search(/^(svg|webp)$/i)===0) logw('The svg/webp image may be incompatible with CHM.');
													}
												}

											}else if(u.search(/\.(jpg|jpeg|gif|png|bmp|svg|swf|css)$/i)>0){

												//2020.1.22 for markdown documents, it may contain local file links and/or relative file path to attached css;
												//("nyf://localhost/${scripts}/hljs/styles/${SyntaxHighlightStyleName}.css")
												//("nyf://localhost/${scripts}/marked/marked.css")
												//("./markdown.css")

												u=u.replace(/^\.\/([^/\\]+)$/i, '$1'); //"./markdown.css"  --> "markdown.css"
												u=u.replace(/^nyf:\/\/localhost\//i, 'file:///'); //make nyf:// to file:// for consistency with nyf7;

												if(u.search(/[:?*|/\\<>]/)<0){ //for linked objs, possibly saved in the attachments section;

													let xObjSrc=new CLocalFile(sSsgPath), bOK=false;
													xObjSrc.append(percentDecode(u)); //2016.5.8 it's required to perform percentDecoding;
													if(xNyf.fileExists(xObjSrc.toStr())){
														let sExt2=xObjSrc.getExtension(false)||'';
														if(sExt2 && sExt2.length<8 && sExt2.toLowerCase()!=='js'){
															//2013.11.2 no js put into CHM;
															let sObjWinName=_hash_name(xSrc.toStr(), u, sExt2);
															let xObjDst=new CLocalFile(sDstDir, sObjWinName);
															if(xNyf.exportFile(xObjSrc.toStr(), xObjDst.toStr())>=0){
																u=sObjWinName;
																xID$Doc[sObj]=sObjWinName; //2021.6.2 put it into cache;
																g_vTmpFilesToDel.push(xObjDst.toStr()); //2014.12.8 remember to remove linked images;
																bOK=true;
																logd('Resolve image/css link: ' + sObj + ' [OK]' + ' ==> ' + u + ' nSize=' + xObjDst.getFileSize());
															}
														}
													}
													if(!bOK) logw('Failed to resolve image/css link: ' + sObj);

												}else if(u.search(/^file:\/\//i)===0){ //for href objects, possibly linked to local files;

													let sFn=localFileFromUrl(u, true);
													if(sFn){
														sFn=xNyf.evalRelativePath(sFn);
														let xFn=new CLocalFile(sFn);
														if(xFn.exists()){
															let sExt2=xFn.getExtension(false)||'';
															if(sExt2 && sExt2.length<8 && sExt2.toLowerCase()!=='js'){
																//2013.11.2 no js put into CHM;
																//2021.6.2 should avoid dupliates of same file contents;
																let sObjWinName=_hash_name(xSrc.toStr(), u, sExt2);
																let xObjDst=new CLocalFile(sDstDir, sObjWinName);
																if(xFn.copyTo(sDstDir, sObjWinName)>=0){
																	u=sObjWinName;
																	xID$Doc[sObj]=sObjWinName; //2021.6.2 put it into cache;
																	g_vTmpFilesToDel.push(xObjDst.toStr()); //2014.12.8 remember to remove linked images;
																	logd('Resolve local image/css link: ' + sObj + ' [OK]' + ' ==> ' + u + ' nSize=' + xObjDst.getFileSize());
																}
															}
														}
													}
												}

											}else if(u.search(/^file:\/\//i)===0){ //consider evaluation of file links with relative paths; e.g. file:///${xxx}/...

												let sFn=localFileFromUrl(u, true);
												if(sFn){
													sFn=xNyf.evalRelativePath(sFn);
													if(sFn){
														u=urlFromLocalFile(sFn, true);
														xID$Doc[sObj]=u; //2021.6.2 put it into cache;
														logd('Resolve local file link: ' + sObj + ' [OK]' + ' ==> ' + u);
													}
												}
												logd('Resolve local file link: ' + sObj + ' --> ' + u);

											}else if(u.search(/^nyf:\/\/entry/i)===0){

												//2021.6.2 no need to move any nyf://entry links, that will be handled with onclick events;
												let p=xNyf.parseNyfHyperlink(u), sResDoc='';
												if(p){
													let dbid=p['dbid'];
													let dbfile=p['dbfile'];
													let bkmkid=p['bkmkid'];
													let itemid=p['itemid'];
													let itempath=p['itempath'];
													let itemtext=p['itemtext'];
													let ssgname=p['ssgname'];
													let labelpath=p['labelpath'];
													if(bkmkid>=0){
														let v=(xBkmk$Info[bkmkid]||'').split('\t');
														if(v && v.length>2){
															let sItemID=parseInt(v[0]), sSsgName=v[1], sAnchor=v[2];
															if(sItemID){
																sResDoc=xID$Doc[sItemID];
																if(!sResDoc){
																	let sItemPath=xID$Path[sItemID];
																	if(sItemPath){
																		//2016.7.27 the document not yet exported;
																		sDef=_preferred_file(sItemPath); //xNyf.detectPreferredFile(sItemPath, 'html;htm;qrich>rtf>txt;ini;log;>jpg;png;gif;bmp');
																		if(sDef){
																			sResDoc=_export_ssgfile(sItemPath, sDef, true);
																			if(sResDoc){
																				vExtraItems.push(sItemPath);
																				logd('Resolve bookmark link: ' + u + ' [OK]' + ' ==> ' + sResDoc);
																			}
																		}
																	}
																}
															}
														}
														if(!sResDoc) logw('Failed to resolve bookmark link: ' + u);
													}else if(itemid>=0){
														if(ssgname){
															let sItemPath=xID$Path[itemid];
															if(sItemPath){
																sResDoc=_export_ssgfile(sItemPath, ssgname, false);
																if(sResDoc){
																	//vExtraItems.push(sItemPath);
																	logd('Resolve attachment link: ' + u + ' [OK]' + ' ==> ' + sResDoc);
																}
															}
															if(!sResDoc) logw('Failed to resolve attachment link: ' + u);
														}else{
															sResDoc=xID$Doc[itemid];
															if(!sResDoc){
																let sItemPath=xID$Path[itemid];
																if(sItemPath){
																	//2016.7.27 the document not yet exported;
																	sDef=_preferred_file(sItemPath); //xNyf.detectPreferredFile(sItemPath, 'html;htm;qrich>rtf>txt;ini;log;>jpg;png;gif;bmp');
																	if(sDef){
																		sResDoc=_export_ssgfile(sItemPath, sDef, true);
																		if(sResDoc){
																			vExtraItems.push(sItemPath);
																			logd('Resolve info-item link: ' + u + ' [OK]' + ' ==> ' + sResDoc);
																		}
																	}
																}
															}
															if(!sResDoc) logw('Failed to resolve info-item link: ' + u);
														}
													}else{
														logw('Invalid link: ' + sObj);
													}
												}else{
													logw('Failed to parse link: ' + sObj);
												}

											}else if(u.search(/[:/\\?*]/)<0){ //attachment file names;
												//...
											}else{
												logd('Resolve ordinary link: ' + ellipsis(sObj, 128) + ' [AS-IS]');
											}

											return u;
										});

										//2013.11.2 CHM doesn't support UTF-8 encoding;
										s=_remove_utf8_charset(s);

										//2020.1.22 get rid of redundant comments;
										s=_remove_comments(s);

										//2020.1.22 no need to get rid of TOC, as it's not yet produced by MD-renderer;
										//s=_remove_toc(s);

										//2021.5.29 for item links to work in chm;
										s=_install_script(s, sJsFileItemLink);

										s=_add_promotional_tag(s);
									}

									if(s!==s0){
										xDst.saveAnsi(s);
									}
									vHtmlFiles.push(xDst.toStr());
								}
								sNameRes=sName;
							}
						}
						return sNameRes;
					};

					let sFnPlaceholder='_placeholder.html';
					let xFnPlaceholder=new CLocalFile(sDstDir, sFnPlaceholder);

					let _act_on_treeitem=function(sSsgPath, iLevel){

						//let xLI={};
						let sTitle=xNyf.getFolderHint(sSsgPath);

						let bContinue=ui.ctrlProgressBar(sTitle||'Untitled', 1, true);
						if(!bContinue) throw 'User abort by ESC.'; //return true;

						//xLI['sSsgPath']=sSsgPath;
						//xLI['sTitle']=sTitle;
						//xLI['iLevel']=iLevel;
						//xLI['sHref']='';
						//xLI['vFiles']=[];
						//xLI['nSub']=xNyf.getFolderCount(sSsgPath);
						//xLI['nID']=plugin.getItemIDByPath(-1, sSsgPath)

						let sRel='', vRel=xNyf.listRelated(sSsgPath);
						for(let i in vRel){
							let nID=xNyf.getItemIDByPath(vRel[i], false);
							if(nID>=0){
								if(sRel) sRel+=';';
								sRel+=nID;
							}
						}
						//xLI['sRelated']=sRel;

						//let vFiles=xNyf.listFiles(sSsgPath), sDef=_default_name(vFiles);
						//let sDefNoteFN=xNyf.detectPreferredFile(sSsgPath, 'html;htm>rtf>txt;ini;log;>jpg;png;gif;bmp');
						//let sDefNoteFn=xNyf.detectPreferredFile(sSsgPath, 'html;htm;qrich>rtf>txt>jpg;png;gif;bmp');

						let sDefNoteFn=_preferred_file(sSsgPath);

						//firstly handle and export default content for the info item;
						if(sDefNoteFn){
							_export_ssgfile(sSsgPath, sDefNoteFn, true);
						}

					};

					xNyf.traverseOutline(sCurItem, bCurBranch, _act_on_treeitem);

					if(vHtmlFiles.length>0){

						if(vExtraItems.length>0){
							//2021.6.2 remove duplicates which are already listed;
							xNyf.traverseOutline(sCurItem, bCurBranch, function(sSsgPath, iLevel){
								let i=vExtraItems.indexOf(_qualify_ssgpath(sSsgPath));
								if(i>=0) vExtraItems[i]='';
							});
							//2021.6.2 get rid of empty entries;
							vExtraItems=trim(vExtraItems.join('\t')).replace(/[\t]{2,}/g, '\t').split('\t');
						}

						//2013.3.27 export IDs of info items, for the nyf://entry links to work within CHM.
						if(1){
							let xFnLinks=new CLocalFile(sPathSrc, '_nyf2chm_itemlink.js'); //itemlink.js
							let s=xFnLinks.loadText('auto');
							if(s){

								//for item links;
								if(1){
									let sTmp='';
									for(let sID in xID$Doc){
										if(sTmp) sTmp+='\n\t, ';
										sTmp+='"'+sID+'": ';
										sTmp+='"'+xID$Doc[sID]+'"';
									}
									sTmp='{'+sTmp+'\n}';
									s=s.replace(/%xItemIDs%/gi, sTmp);
								}

								//for bookmark links;
								if(1){
									let sTmp='';
									for(let sBkmkID in xBkmk$Info){
										if(sTmp) sTmp+='\n\t, ';
										sTmp+='"'+sBkmkID+'": ';
										sTmp+='"'+xBkmk$Info[sBkmkID]+'"';
									}
									sTmp='{'+sTmp+'\n}';
									s=s.replace(/%xBkmkIDs%/gi, sTmp);
								}

								//2014.12.8 convert line-seperator into \r\n;
								//2021.6.2 loadText/saveAnsi automatically deals with '\r\n' for windows/unix specs;
								s=trim(s).replace(/[\r\n]+/g, '\n'); //get rid of blank lines;

								xFnLinks=new CLocalFile(sDstDir, sJsFileItemLink);
								xFnLinks.saveUtf8(s);
								g_vTmpFilesToDel.push(xFnLinks.toStr());
							}
						}

						////2013.8.9 make a placeholder file;
						//{
						//	let sInfo=_lc2('NoContent', 'No content available to view.');
						//	xFnPlaceholder.saveAnsi('<html><body>'+sInfo+'</body></html>');
						//	g_vTmpFilesToDel.push(xFnPlaceholder.toStr());

						//	//2013.8.9 the placeholder page shoud put at end of the list, in stead of at begining;
						//	//as the default page is not specified in HHP, so the first page is selected automatically;
						//	vHtmlFiles.push(xFnPlaceholder.toStr());
						//}

						let _indent=function(n){let s=''; while(n-->0) s+='\t'; return s;};

						let _sitemap_export_title=function(sTitle, sHref, iLevel){
							//2013.8.8 "<LI> <OBJECT..." must be in the same line without CR/LF;
							let s=_indent(iLevel)+'<LI> <OBJECT type="text/sitemap">\n';
							s+=_indent(iLevel)+'<param name="Name" value="'+platform.htmlEncode(sTitle)+'">\n';
							s+=_indent(iLevel)+'<param name="Local" value="'+sHref+'">\n';
							s+=_indent(iLevel)+'</OBJECT>\n';
							//sHhc+=_indent(iLevel)+'</LI>\n';
							return s;
						};

						let _sitemap_export_ssgentry=function(sSsgPath, iLevel){
							let s='';
							if(xNyf.folderExists(sSsgPath)){
								let sTitle=xNyf.getFolderHint(sSsgPath)||'New info item';
								let sHref=xMapHref[_qualify_ssgpath(sSsgPath)]||''; //||sFnPlaceholder;
								//if(!sHref) sTitle+='(-)'; //2013.11.2 to indicate empty content;
								s=_sitemap_export_title(sTitle, sHref, iLevel);
							}
							return s;
						};

						let _sitemap_export_ssgentries=(vSsgPaths, iLevel, bRecursive, bHierarchy)=>{
							let s='';
							if(vSsgPaths && vSsgPaths.length>0){
								if(bHierarchy || iLevel===0) s+=_indent(iLevel)+'<UL>\n';
								for(let sSsgPath of vSsgPaths){
									s+=_sitemap_export_ssgentry(sSsgPath, iLevel+1);
									if(bRecursive){
										s+=_sitemap_export_subentries(sSsgPath, iLevel+1, bRecursive, bHierarchy);
									}
								}
								if(bHierarchy || iLevel===0) s+=_indent(iLevel)+'</UL>\n';
							}
							return s;
						};

						let _sitemap_export_subentries=(sSsgPath, iLevel, bRecursive, bHierarchy)=>{
							let s='';
							let v=xNyf.listFolders(sSsgPath);
							if(v.length>0){
								let v2=[];
								for(let sName of v){
									v2.push(_qualify_ssgpath(sSsgPath+'/'+sName));
								}
								s+=_sitemap_export_ssgentries(v2, iLevel, bRecursive, bHierarchy);
							}
							return s;
						};

						let _sitemap_export_extraentries=(vSsgPaths)=>{
							let s='';
							if(vSsgPaths && vSsgPaths.length>0){
								let sTitle='Other referred pages', sHref='', iLevel=0;

								s+=_indent(iLevel)+'<UL>\n';

								s+=_sitemap_export_title(sTitle, sHref, iLevel+1);

								s+=_sitemap_export_ssgentries(vSsgPaths, iLevel+1, false, true);

								s+=_indent(iLevel)+'</UL>\n';
							}
							return s;
						};

						let _sitemap=(sItems)=>{
							return s='<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML//EN">\n'
							+ '<HTML>\n'
							+ '<HEAD>\n'
							+ '<meta name="GENERATOR" content="Wjjsoft Mybase/CHM Maker">\n'
							+ '<!-- Sitemap 1.0 -->\n'
							+ '</HEAD><BODY>\n'

							+ sItems

							+ '</BODY></HTML>\n'
							;
						};

						//2013.8.7 make .hhc file;
						let xFnHhc=new CLocalFile(sDstDir, sDstFnBase+'.hhc');
						if(1){
							let s;
							if(bCurBranch){
								s=_sitemap_export_ssgentries([sCurItem], 0, true, true);
							}else{
								s=_sitemap_export_subentries(sCurItem, 0, true, true);
							}

							s=_sitemap(s + _sitemap_export_extraentries(vExtraItems)); //add the title for extra pages;
							s=trim(s).replace(/[\r\n]+/g, '\n'); //get rid of blank lines;

							xFnHhc.saveAnsi(s); //2021.6.2 saveAnsi translates '\n' into '\r\n' for windows;
							g_vTmpFilesToDel.push(xFnHhc.toStr());
							logd('Construct ' + xFnHhc.toStr() + ' [OK]');
						}

						//2013.8.9 make .hhk file;
						let xFnHhk=new CLocalFile(sDstDir, sDstFnBase+'.hhk');
						if(1){
							let s;
							if(bCurBranch){
								s=_sitemap_export_ssgentries([sCurItem], 0, true, true);
							}else{
								s=_sitemap_export_subentries(sCurItem, 0, true, true);
							}

							s=_sitemap(s + _sitemap_export_ssgentries(vExtraItems, 0, false, true));
							s=trim(s).replace(/[\r\n]+/g, '\n'); //get rid of blank lines;

							xFnHhk.saveAnsi(s); //2021.6.2 saveAnsi translates '\n' into '\r\n' for windows;
							g_vTmpFilesToDel.push(xFnHhk.toStr());
							logd('Construct ' + xFnHhk.toStr() + ' [OK]');
						}

						//2013.8.7 make .hhp file;
						let xFnHhp=new CLocalFile(sDstDir, sDstFnBase+'.hhp');
						if(1){
							let s='[OPTIONS]' + '\n'
									+ 'Auto Index=Yes' + '\n'
									+ 'Binary TOC=Yes' + '\n'
									+ 'Compatibility=1.1 or later' + '\n'
									//+ 'Compiled file=' + xDstFn.toStr().replace(/\//g, '\\') + '\n'
									//+ 'Contents file=' + xFnHhc.toStr().replace(/\//g, '\\') + '\n'
									+ 'Compiled file=' + xDstFn.getLeafName() + '\n'
									+ 'Contents file=' + xFnHhc.getLeafName() + '\n'
									+ 'Language=' + sLang + '\n'
									+ 'Default Font=' + '\n'
									+ 'Display compile progress=yes' + '\n'
									+ 'Error log file=' + sDstFnBase + '.log' + '\n'
									+ 'Flat=No' + '\n'
									//+ 'Full text search stop list file=' + '\n'
									+ 'Full-text search=Yes' + '\n'
									//+ 'Index file=' + xFnHhk.toString().replace(/\//g, '\\') + '\n'
									+ 'Index file=' + xFnHhk.getLeafName() + '\n'
									+ 'Title=' + sTitle + '\n'
									+ '\n'
									+ '[FILES]' + '\n'
							;

							s+=vHtmlFiles.join('\n').replace(/[/]/g, '\\');

							s=trim(s).replace(/[\r\n]+/g, '\n'); //get rid of blank lines;

							xFnHhp.saveAnsi(s); //HHW doesn't recognize UTF8 BOM;
							g_vTmpFilesToDel.push(xFnHhp.toStr());
							logd('Construct ' + xFnHhp.toStr() + ' [OK]');
						}

						let xFnHhcExe=new CLocalFile(sPathSrc, 'hhc.exe');
						if(!xFnHhcExe.exists()){
							//2014.1.5 look into the default setup folder for HTML Help Workshop;
							let vPathPF=['C:/Program Files (x86)', 'C:/Program Files', 'D:/Program Files (x86)', 'D:/Program Files', 'E:/Program Files (x86)', 'E:/Program Files'];
							for(let p of vPathPF){
								let xHhc=new CLocalFile(p, 'HTML Help Workshop/hhc.exe');
								if(xHhc.exists()){
									xFnHhcExe=xHhc;
									break;
								}
							}
						}

						ui.destroyProgressBar();

						if(xFnHhcExe.exists() && (/^win(32|64)/i).test(platform.getOsType())){
							logd('Attempt to invoke Microsoft Html Help Workshop to compile the .chm document.');
							let sFnHhp=xFnHhp.toStr('\\'); //2014.12.8 Back-slash is required for DOS programs;
							if(xFnHhcExe.exec(['"'+sFnHhp+'"'])){
								let sMsg=_lc2('Done', 'Please wait a while for CHM compiling to complete. If all goes OK, you may press Yes button to view the CHM document when done.');
								if(confirm(sMsg)){
									xDstFn.exec();
								}
								_clean_up_tmpfiles();
							}else{
								alert('Failed to open the project with HTML Help Workshop.'+'\n\n'+xFnHhcExe.toStr()+'\n'+xFnHhp.toStr());
							}
						}else{
							let sMsg=_lc2('NeedHHW', 'The CHM project files have successfully been generated in the specified folder. Now you can compile the project files into a CHM document by utilizing Microsoft HTML Help Workshop.');
							alert(sMsg+'\n\n'+xFnHhp.toStr());
						}
					}

				}else{
					alert('Directory not found.' + '\n\n' + sDstDir);
				}

			}else{
				alert('Bad input of directory or range');
			}
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

}catch(e){
	alert(e);
	_clean_up_tmpfiles();
	ui.destroyProgressBar();
}
