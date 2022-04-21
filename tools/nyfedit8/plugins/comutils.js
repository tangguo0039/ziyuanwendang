
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var _ls=(o)=>{
	let vMsg=[], t=typeof(o);

	vMsg.push('TYPE = '+t);

	if(t!=='undefined') vMsg.push('CTOR = '+(o ? o.constructor : ''));

	if(t==='object'){
		for(let k in o){
			vMsg.push('"' + k + '"' +': ' + o[k]);
		}
	}else{
		vMsg.push(o);
	}

	alert(vMsg.join('\n'));
};

var thousandths=(n)=>{
	return (n||'').toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,");
}

var trim=(s)=>{return (s||'').replace(/^\s+|\s+$/g, '');};

var ellipsis=(s, n)=>{
	var p='^([\\s\\S]{100})([\\s\\S]+)$'; n=parseInt(''+n);
	if(n>0) p=p.replace('100', n);
	var re=new RegExp(p);
	return (s||'').replace(re, '$1...');
};

var validateFilename=(s, n)=>{
	//test RE: alert(validateFilename("ABCDE\t\r\n__   __/[*?.()\[\]{}<>/\\!$^&+|,;:\"'`~@#]/gim", 8));
	s=s||''; n=(!n || n<=0) ? 128 : n;
	s=s.replace(/[_*?.()\[\]{}<>/\\!$^&+|,;:"'`~@#\s\t\r\n]+/g, ' ');
	s=trim(s);
	if(s.length>n) s=s.substr(0, n);
	s=trim(s);
	s=s.replace(/[\s]+/g, '_');
	return s;
};

var esc$=(s)=>{
	//2021.6.4 in case of substitution string containing '$', that may be interpreted as captured patterns (e.g. $1, $2...) when replace() with regexp;
	//For example: let s='$$test$$'; alert('test case'.replace(/test/i, s)); ==> '$test$ case'
	//In order to solve the problem, consider making $ doubled;
	//Someone else encountered this issue as well: https://stackoverflow.com/questions/16018831/string-replace-throws-error-with-sign
	return (s||'').replace(/[$]/g, '$$$$');
};

var htmlEncode=(s)=>{
	//http://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references
	//http://www.utf8-chartable.de/unicode-utf8-table.pl?utf8=dec
	if(s){
		//s=s.replace(/&/g,	'&amp;');
		//s=s.replace(/</g,	'&lt;');
		//s=s.replace(/>/g,	'&gt;');
		//s=s.replace(/\"/g,	'&quot;');
		//s=s.replace(/\'/g,	'&apos;');
		//s=s.replace(/\xA0/g,	'&nbsp;'); //http://www.fileformat.info/info/unicode/char/a0/index.htm
		//s=s.replace(/  /g,	'&nbsp; ');
		//s=s.replace(/\t/g,	'&nbsp; &nbsp; &nbsp; &nbsp; '); //&emsp;
		//and more ...

		s=platform.htmlEncode(s);
	}
	return s||'';
};

var htmlDecode=(s)=>{
	if(s){
		//s=s.replace(/&lt;/g,		'<');
		//s=s.replace(/&gt;/g,		'>');
		//s=s.replace(/&quot;/g,		'"');
		//s=s.replace(/&apos;/g,		'\'');
		//s=s.replace(/&nbsp;/g,		' ');
		//s=s.replace(/&circ;/g,		'^');
		//s=s.replace(/&tilde;/g,		'~');
		////and more ...
		//s=s.replace(/&amp;/g,		'&');

		s=platform.htmlDecode(s);
	}
	return s||'';
};

var percentEncode=(sTxt, sExcl, sIncl)=>{
	let sRes='';
	if(sTxt){
		let v=new CByteArray(sTxt, 'utf8');
		if(!v.isEmpty()){
			if(v.percentEncoded){
				//By default, this function will encode all characters that are not one of the following:
				//ALPHA ("a" to "z" and "A" to "Z") / DIGIT (0 to 9) / "-" / "." / "_" / "~"
				v=v.percentEncoded(sExcl||'', sIncl||'');
				if(v) sRes=v.toStr('utf8');
			}else{
				sRes=sTxt;
			}
		}
	}
	return sRes;
};

var percentDecode=(sTxt)=>{
	let sRes='';
	if(sTxt){
		let v=new CByteArray(sTxt, 'utf8');
		if(!v.isEmpty()){
			if(v.percentDecoded){
				v=v.percentDecoded();
				if(v) sRes=v.toStr('utf8');
			}else{
				sRes=sTxt;
			}
		}
	}
	return sRes;
};

//var urlFromLocalFile=(sFn, bPercentEncoding, sExcl, sIncl)=>{
//	let sUrl=''; sFn=(sFn||'').replace(/\\/g, '/');
//	if(sFn){

//		if(bPercentEncoding){
//			sFn=percentEncode(sFn, (sExcl || '/:'), sIncl)||'';
//		}

//		sUrl='file://';

//		//2015.1.15 prepend a slash for local file path if necessary e.g. for DOS;
//		//2015.3.2 consider of UNC path: file://///servername/share/file.txt
//		//http://rubenlaguna.com/wp/2007/04/20/firefox-and-file-windows-unc-paths/
//		//http://en.wikipedia.org/wiki/File_URI_scheme
//		if(sFn.search(/^\//)<0 || sFn.search(/^\/\/[\w\d]+/)===0){
//			sUrl+='/';
//		}

//		sUrl+=sFn;
//	}
//	return sUrl;
//};

//var localFileFromUrl=(sUrl, bPercentDecoding)=>{
//	let sFn='', sScheme='file://'; sUrl=(sUrl||'');
//	if(sUrl.search(/^file:\/\//i)===0){

//		sFn=sUrl.replace(/^file:\/\//i, '');

//		if(sFn && sFn.search(/^\/[c-z][\:\|]\/.+/i)===0 || sFn.search(/^\/\/\/.+/i)===0|| sFn.search(/^\/\.\/.+/i)===0 || sFn.search(/^\/\$\{.+?\}/i)===0){
//			//2016.4.6 consider of UNC names on Windows & old style of relative path; e.g.
//			//file:///C:/temp/123.txt
//			//file://///t440p/temp/123.txt
//			//file://./temp/123.txt
//			//file:///${HOME}/temp/123.txt
//			sFn=sFn.substr(1);
//		}

//		//2016.4.7 consider of special characters in percent-encoding;
//		if(bPercentDecoding && sFn.indexOf('%')>=0 ){
//			sFn=percentDecode(sFn)||'';
//		}
//	}
//	return sFn;
//};

//var localFileFromUrl=(sUrl, bPercentDecoding)=>{
//	let sFn='', re=/^file:\/\/(.+)$/i, m=(sUrl||'').match(re);
//	if(m && m[1]){

//		sFn=(m[1]||'');

//		//2016.4.7 consider of special characters in percent-encoding;
//		if(bPercentDecoding && sFn.indexOf('%')>=0 ){
//			sFn=percentDecode(sFn)||'';
//		}

//		//2016.4.6 consider of UNC names on Windows & old style of relative path; e.g.
//		//file:///C:/temp/123.txt		=> /C:/temp/123.txt
//		//file://///t440p/temp/123.txt		=> ///t440p/temp/123.txt
//		//file://t440p/temp/123.txt		=> //t440p/temp/123.txt
//		//file:///./temp/123.txt		=> /./temp/123.txt
//		//file:///${HOME}/temp/123.txt		=> /${HOME}/temp/123.txt

//		sFn=sFn
//		.replace(/^[/\\]+([c-z][:|][/\\].+)$/i, '$1')
//		.replace(/^[/\\]+([/\\]{2}.+)$/i, '$1')
//		.replace(/^[/\\]([.][/\\].+)$/i, '$1')
//		.replace(/^[/\\]([$][{].+?[}])/i, '$1')
//		;

//		//alert(sFn);
//	}
//	return sFn;
//};

var urlFromLocalFile=(sFn, bPercentEncoding, sExcl, sIncl)=>{
	return platform.fromLocalFile(sFn, bPercentEncoding, sExcl, sIncl);
};

var localFileFromUrl=(sUrl, bPercentDecoding)=>{
	return platform.toLocalFile(sUrl, bPercentDecoding);
};

var makeUriQueryString=(kv)=>{
	let v=[];
	for(let k in kv){
		v.push(k + '=' + kv[k]);
	}
	return v.join('&');
};

var parseUriQueryString=(sUri)=>{
	//nyf://entry?dbfile=/Users/wjj/temp/mybase_4.nyf&itemid=1&itemtext=TITLETEXT
	//nyf://entry?dbfile=/Users/wjj/temp/mybase_4.nyf&itemid=1&file=FILENAME.PDF
	//nyf://label?itempath=abc/def/hijk
	let m=trim(sUri||'').match(/^([0-9a-z]{2,32}):(\/\/)(.*)\?(.+)$/i), kv; //={};
	if(m && m[4]){
		let v2=m[4].split(/&/);
		for(let s of v2){
			let v1=s.split(/=/);
			if(v1 && v1.length>=2){
				let k=v1[0], v=v1[1];
				if(k && v){
					if(!kv) kv={};
					kv[k.toLowerCase()]=percentDecode(v);
				}
			}
		}
	}
	return kv;
};

var changeHtmlCharset=(sHtml, sCodec)=>{

	//<meta http-equiv=Content-Type content="text/html; charset=unicode">
	//<meta http-equiv=Content-Type content="text/html; charset=windows-1253">

	let s=(sHtml||''); sCodec=(sCodec||'').replace(/^\s+|\s+$/g, '');
	s=s.replace(/(<meta\s+http-equiv=(['"]?)Content-Type\2\s+content=(['"])text\/html;\s+charset=)\s*([\w-]+)\s*(\3\s*>)/im, function(s0, s1, s2, s3, s4, s5){
		if(sCodec){
			return s1+sCodec+s5;
		}else{
			return '';
		}
	});
	return s;
};

//var substituteUriWithinHtml=(sHtml, sUri0, sUri2, bWithQuotations)=>{

//	let _replace=function(s, sFrom, sTo){
//		let sRes='', sRight=s;
//		while(sRight && sFrom){
//			let p=sRight.indexOf(sFrom);
//			if(p>=0){
//				sRes+=sRight.substr(0, p)+sTo;
//				sRight=sRight.substr(p+sFrom.length);
//			}else{
//				sRes+=sRight;
//				break;
//			}
//		}
//		return sRes;
//	};

//	let sRes=sHtml;
//	if(sUri0!==sUri2){

//		sRes=_replace(sRes, ( '"'+sUri0+'"' ), ( '"'+sUri2+'"' ) );
//		sRes=_replace(sRes, ( "'"+sUri0+"'" ), ( "'"+sUri2+"'" ) );

//		if(!bWithQuotations && sRes===sHtml){
//			//in case of urls with no quotation marks;
//			sRes=_replace(sRes, sUri0, sUri2);
//		}
//	}

//	return sRes;
//};

var substituteUrisWithinHtml=(sHtml, sTagNames, xUserData, xHandler)=>{

	//2016.4.14 detect linked images/links and then redirect them accordingly by calling app-defined xHandler;

	//2022.2.11 allows xUserData to be omitted;
	if(typeof(xUserData)==='function'){
		xHandler=xUserData;
		xUserData=xHandler;
		//logd('xUserData is optional and omitted.');
	}

	let sNew=sHtml||'', vTagNames=(sTagNames||'img,link').toLowerCase().replace(/[,;\s-+]/g, '|').split('|');
	if(sNew && xHandler && vTagNames.length>0){

		if(0 && sNew.indexOf('<!--[if gte vml 1]>')>=0){ //No longer required.

			//2016.5.6 what a mess with filenames in HTML contents exported by MS-Outlook, e.g.
			//<img src="xxx_files/image004.gif" alt="cid:image001.png@01D0D9C1.74D05430" v:shapes="Picture_x0020_2">
			//it indicates that the image file is located at "xxx_files/image004.gif", but with the filename 'image001.png' in the attachments area;

			//Here's another sample code with image file names that is totally in a mess:
			//<!--[if gte vml 1]><v:shape id=...>...
			//<v:imagedata src="__nyf7_import_msoutlook_items_files/image001.png" o:href="cid:image008.png@01D1A137.70036940"/>
			//</v:shape><![endif]--><![if !vml]><img width=808 height=517
			//src="__nyf7_import_msoutlook_items_files/image002.jpg"
			//alt="cid:image008.png@01D1A137.70036940" v:shapes="Picture_x0020_7"><![endif]></span></p>

			//In order to fix the file names, composed the regexp to match the image filenames, and make corrections to filenames accordingly;

			//It's said that Qt::QRegExp doesn't handle well multi-line patterns, as matter of fact, it simply doesn't work in this case;
			//therefore a workaround: the <CRLN> temporarily substitutes for all of [\r\n].
			//see also: http://stackoverflow.com/questions/20660579/can-qregexp-do-multiline-and-dotall-match
			//see also: http://doc.qt.io/qt-4.8/qregexp.html

			sNew=sNew.replace(/\r\n/g, '\n').replace(/\n/g, '<CRLN>'); //line-break substitution;

			let xRE=/(<!--\[if\s+gte\s+vml\s+1\]>.*?<v:imagedata\s+src=")(.*?)("\s+o:href="cid:)(image\d{3}\.(png|jpg|jpeg|gif|bmp|tif|svg))(@[\w\.\-]+"\/>.*?<!\[endif\]-->.*?<!\[if\s+!vml\]>.*?<img\b.+?src=")(.*?)(".*?>.*?<!\[endif\]>)/igm;
			sNew=sNew.replace(xRE, function(s0, s1, s2, s3, s4, s5, s6, s7, s8){
				if(s2 && s4 && s7){
					let sDir=new CLocalFile(s2).getDirectory(false) || new CLocalFile(s7).getDirectory(false);
					if(!sDir || sDir==='./'){
						s2=s7=s4;
					}else{
						s2=s7=new CLocalFile(sDir, s4).toStr();
					}
				}
				return s1+s2+s3+s4+s6+s7+s8; //ignore +s5 => (png|jpg|jpeg|gif|bmp|tif|svg)
			});

			sNew=sNew.replace(/<CRLN>/igm, '\n'); //restore normal line-breaks;
		}

		//2013.11.13 MSOutlook embeds images with different filenames in <v:imageata> & <img>;
		//<v:imagedata src="~jj5C7A_files/image001.jpg" o:href="cid:image003.jpg@01CEDF8C.24786AD0"/>
		//<![if !vml]><img width=385 height=326 src="~jj5C7A_files/image001.jpg" v:shapes="Picture_x0020_1"><![endif]>
		//Track the <img ...> tag for linked image filenames, but with <v:imagedata src=...> ignored;

		//2016.5.12 For MS-Outlook, the <v:imagedata o:href='cid:...'> stands for files in attachments area of messages;
		//However, we still need to retrieve image files from <img src='...'> in the HTML content,
		//as all the linked images are already present in the accompanying sub folder when MS-Outlook exports the HTML contents;
		//As for the attached files, it's handled later on by calling to MSOutlook OLE APIs;

		let _extract_html_elements=function(s, sTagName, vElms){
			if(s && vElms){

				//2016.5.8 MS-Office exports HTML contents with line-breaks, there may be no blankspaces but linebreaks after the tag '<img', like this:
				//<span lang=EN-US style='font-family:"Times New Roman","serif"'><img
				//width=789 height=43 src=“xx_files/image003.png"></span><span lang=EN-US><br>
				//</span><span lang=EN-US style='font-family:"Times New Roman","serif"'><img
				//width=249 height=35 src=“xx_files/image004.png"></span>
				//so the regexp /<tag[^>]?>/gi may not work in this case;

				let sElm;
				while(s){
					sElm='';
					let p=s.indexOf('<'+sTagName.toLowerCase()); if(p<0) p=s.indexOf('<'+sTagName.toUpperCase());
					if(p<0) break;
					s=s.substr(p); //+sTag.length
					p=s.indexOf('>');
					if(p>=0){
						sElm=s.substr(0, p+1);
						s=s.substr(p+1);
					}else if(p<0){
						sElm=s;
						s='';
					}

					if(sElm && vElms.indexOf(sElm)<0){
						vElms.push(sElm);
					}
				}
			}
		};

		//let _extract_attr_value_1=function(s, sAttrName){
		//	let sVal='';
		//	if(s && sAttrName){
		//		//e.g. <img src="cid:687392502@12112013-049d" />
		//		//e.g. <img src="image004.gif" alt="cid:image001.png@01D0D9C1.74D05430" v:shapes="Picture_x0020_2">
		//		//let re=new RegExp('\\b'+sAttrName+'=([\\\'\\"])(.+?)\\1', 'ig');
		//		let re=new RegExp('\\b'+sAttrName+'=([\'"])(.+?)\\1', 'ig');
		//		let m=re.exec(s);
		//		if(m && m[1] && m[2]){
		//			sVal=m[2].replace(/^\s+|\s+$/g, '').replace(/[\r\n]+/g, '');
		//		}
		//	}
		//	return sVal;
		//};

		//let _extract_attr_value_2=function(s, sAttrName){
		//	let sVal='';
		//	if(s && sAttrName){
		//		//e.g. <img src="cid:687392502@12112013-049d" />
		//		//e.g. <img src="image004.gif" alt="cid:image001.png@01D0D9C1.74D05430" v:shapes="Picture_x0020_2">
		//		let xRE=new RegExp('\\b'+sAttrName+'=([\'"])(.*?)\\1', 'im');
		//		let m=s.match(xRE);
		//		if(m && m[2]){
		//			sVal=m[2].replace(/^\s+|\s+$/g, '').replace(/[\r\n]+/g, '');
		//		}
		//	}
		//	return sVal;
		//};

		let _extract_attr_value=function(s, sAttrName){
			//2022.2.8 consider of the special case in which the fiename is used in both src/alt/title fields, that could be unconditionally replaced in error:
			//e.g. <img src="clip.png" alt="clip.png" title="clip.png" width="100" />
			//so it's unsafe only to handle the urls;
			//workaround: cache the whole element code for replacements.
			let d;
			if(s && sAttrName){
				//e.g. <img src="cid:687392502@12112013-049d" />
				//e.g. <img src="image004.gif" alt="cid:image001.png@01D0D9C1.74D05430" v:shapes="Picture_x0020_2">
				let xRE=new RegExp('\\b'+sAttrName+'[\\s]*=[\\s]*([\'"])(.*?)\\1', 'im');
				let m=s.match(xRE);
				if(m && m[2]){
					let u=m[2].replace(/^\s+|\s+$/g, '').replace(/[\r\n]+/g, '');
					d={m0: m[0], u: u};
				}
			}
			return d;
		};

		let substituteUriWithinHtml=(sHtml, m, sUri2)=>{

			//let _replace=function(s, sFrom, sTo){
			//	let sRes='', sRight=s;
			//	while(sRight && sFrom){
			//		let p=sRight.indexOf(sFrom);
			//		if(p>=0){
			//			sRes+=sRight.substr(0, p)+sTo;
			//			sRight=sRight.substr(p+sFrom.length);
			//		}else{
			//			sRes+=sRight;
			//			break;
			//		}
			//	}
			//	return sRes;
			//};

			//logd(">>>>>> " + m + ': ' + m.m0 + ' --> ' + m.u + ' --> ' + ellipsis(sUri2, 256));
			let s0=m.m0, s1=s0.replace(m.u, sUri2);
			return s0 ? sHtml.replace(s0, s1) : sHtml;
		};

		let _vLog=[];
		for(let j in vTagNames){
			let sTagName=vTagNames[j];
			if(sTagName){
				let vMatchOccur=[];
				if(1){
					let sAttrName='src';
					if(1){
						if(sTagName==='link') sAttrName='href';
						else if(sTagName==='a') sAttrName='href';
					}
					if(sAttrName){
						let vElms=[]; _extract_html_elements(sNew, sTagName, vElms);
						for(var i in vElms){
							let sElm=vElms[i].replace(/[\r\n]+/g, ' ');
							let m=_extract_attr_value(sElm, sAttrName);
							if(m && m.m0 && m.u){
								let u=m.u;

								//2021.4.30 on win32, within the retrieved urls, some special characters [&,?] may be htmlEncoded, like this;
								//nyf://entry?dbfile=/Users/xyz/Desktop/mybase_1.nyf&amp;itempath=/Organizer/data/rl/96j/q56/dzf/&amp;file=CMakeLists.txt
								u=platform.htmlDecode(u);

								//_vLog.push('');
								//_vLog.push('elm['+i+']='+sElm);
								//_vLog.push('uri['+i+']='+u);
								if(u){
									//if(vMatchOccur.indexOf(m)<0)
									{
										vMatchOccur.push(m);
									}
								}
							}
						}
					}
				}
				for(let m of vMatchOccur){
					if(!m) continue;
					//var sPat=sUri.replace(/([\.\/\\\!\[\]])/ig, '\\$1');
					//sNew=sNew.replace(new RegExp(sPat, 'ig'), sUriNew);
					sNew=substituteUriWithinHtml(sNew, m, xHandler(m.u, sTagName, xUserData));
				}
			}
		}

		if(_vLog.length>0){
			textbox(
				{
					sTitle: plugin.getScriptTitle()
					, sDescr: 'Debug info'
					, sDefTxt: _vLog.join('\n')
					, bReadonly: true
					, bWordwrap: false
					, nWidth: 80
					, nHeight: 60
					, bFind: false
				}
				);
		}
	}
	return sNew;
};

var getUniqueSsgFileName=(xNyf, sSsgPath, sSsgName0)=>{

	let sRes='';

	sSsgPath=sSsgPath || ''; //avoid using non-string wrapped objects, e.g. CLocalFile;
	sSsgName0=sSsgName0 || 'untitled';

	if(xNyf && sSsgPath && sSsgName0){
		let xFn=new CLocalFile(sSsgPath, sSsgName0), n=1, sMagic='';
		let sTitle=xFn.getTitle(), sExt=xFn.getExtension(false); //false: without dot;
		do{
			let sName=sTitle; if(sMagic) sName=sName+'_'+sMagic; if(sExt) sName+=('.'+sExt);
			let f=new CLocalFile(sSsgPath, sName);
			if(!xNyf.entryExists(f.toStr())){
				sRes=sName;
				break;
			}
			sMagic=''+n; n++;
		}while(n<=0xffff);
	}

	return sRes;
};

var importAccompanyingObjsWithinHtml=(xNyf, sSsgPath, sHtml, sDir, xActPre, xActPost)=>{

	if(sHtml){

		sSsgPath=sSsgPath || ''; //avoid using Qt-Objects;
		sDir=sDir || '';

		sHtml=substituteUrisWithinHtml(sHtml, 'img,link', function(sObj, sTagName){

			let u=sObj||'';

			if(!xActPre || xActPre(sObj, sTagName)){

				let nBytes=-1;

				//2011.12.3 test if it's javascript:, mailto:, xxxx://, or contains any of ?/*/#;
				if(u.search(/^javascript:/i)<0 && u.search(/^mailto:/i)<0 && u.search(/^\w+?:\/\//i)<0 && u.search(/[\?\*\#]/)<0){

					if(u.search(/(\.jpg|\.jpeg|\.gif|\.png|\.bmp|\.svg|\.swf|\.css)$/i)>0){ //images or styles;

						var f, sLeaf;
						if(1){
							if(u.search(/^[\/\\].+/)===0 || u.search(/^[a-z]\:[\/\\].+/i)===0){
								//absolute path; e.g. "/Users/uid/1.png", "C:/Users/uid/2.png"
								f=new CLocalFile(u);
							}else if(u.search(/^\.[\/\\].+/)===0 ){
								//relative path with a prefix dot; e.g. "./xxx.files/image001.png"
								f=new CLocalFile(sDir, u.substr(2));
							}else{
								//relative path with no prefix dots, it may be NON-ASCII chars; e.g. "NON-ASCIIxxx.files/image001.png"
								f=new CLocalFile(sDir, u);
							}
							sLeaf=f ? f.getLeafName() : '';
						}

						if(f && sLeaf){
							var xSsg=new CLocalFile(sSsgPath, sLeaf);
							if(f.exists()){
								if(!xNyf.fileExists(xSsg.toStr()) || xNyf.getFileSize(xSsg.toStr())!==f.getFileSize()){
									sLeaf=getUniqueSsgFileName(xNyf, sSsgPath, sLeaf);
									if(sLeaf){
										xSsg=new CLocalFile(sSsgPath, sLeaf);
										nBytes=xNyf.createFile(xSsg.toStr(), f.toStr());
									}
								}
								u=percentEncode(xSsg.getLeafName())||'';
							}else if(xNyf.fileExists(xSsg.toStr())){
								//2016.5.13 consider of the case that the image is already present in SSG;
								u=percentEncode(xSsg.getLeafName())||'';
							}
						}
					}

				}else if(u.search(/^file:\/\//i)===0){ //consider of full file:// paths;

					let bImg=(sTagName==='src' && u.search(/(\.jpg|\.jpeg|\.gif|\.png|\.bmp|\.svg|\.swf)$/i)>0);
					let bCss=(sTagName==='href' && u.search(/\.css$/i)>0);

					if(bImg || bCss){ //images or styles;
						let sFn=localFileFromUrl(u, true);
						if(sFn){
							sFn=xNyf.evalRelativePath(sFn);
							if(sFn){
								let f=new CLocalFile(sFn), sLeaf=f.getLeafName();
								if(f.exists() && sLeaf){
									let xSsg=new CLocalFile(sSsgPath, sLeaf);
									if(!xNyf.fileExists(xSsg.toStr()) || xNyf.getFileSize(xSsg.toStr())!==f.getFileSize()){
										sLeaf=getUniqueSsgFileName(xNyf, sSsgPath, sLeaf);
										if(sLeaf){
											xSsg=new CLocalFile(sSsgPath, sLeaf);
											nBytes=xNyf.createFile(xSsg.toStr(), f.toStr());
										}
									}
									u=percentEncode(xSsg.getLeafName())||'';
								}
							}
						}
					}
				}

				if(xActPost){
					u=xActPost(sObj, sTagName, u, nBytes);
				}
			}
			return u;
		});
	}
	return sHtml;
};

var copySsgEntryAttr=(xDbDst, sPathDst, xDbSrc, sPathSrc)=>{

	xDbDst.setEntryHint(sPathDst, xDbSrc.getEntryHint(sPathSrc));
	xDbDst.setEntryAttr(sPathDst, xDbSrc.getEntryAttr(sPathSrc));
	xDbDst.setEntryAppAttr(sPathDst, xDbSrc.getEntryAppAttr(sPathSrc));

	let n=xDbSrc.getEntryAppDataCount(sPathSrc);
	for(let i=0; i<n; ++i){
		let x=xDbSrc.getEntryAppDataAt(sPathSrc, i, -1);
		xDbDst.setEntryAppDataAt(sPathDst, i, x);
	}

	xDbDst.setCreateTime(sPathDst, xDbSrc.getCreateTime(sPathSrc));
	xDbDst.setModifyTime(sPathDst, xDbSrc.getModifyTime(sPathSrc));
};

var copySsgFile=(xDbDst, sPathDst, xDbSrc, sFnSrc)=>{
	let sFnTmp=platform.getTempFile(); plugin.deferDeleteFile(sFnTmp);
	if(xDbSrc.exportFile(sFnSrc, sFnTmp)>=0){
		let sName=new CLocalFile(sFnSrc).getLeafName(); //sFnSrc.replace(/^.+[/\\]([^/\\]+?)$/, '$1');
		let sFnNew=new CLocalFile(sPathDst, sName).toStr();
		if(xDbDst.createFile(sFnNew, sFnTmp)>=0){
			copySsgEntryAttr(xDbDst, sFnNew, xDbSrc, sFnSrc);
		}
	}
};

var copySsgFiles=(xDbDst, sPathDst, xDbSrc, sPathSrc, bInclTrash, xCB)=>{
	let vNames=xDbSrc.listFiles(sPathSrc, bInclTrash);
	for(let sName of vNames){
		let sFnSrc=new CLocalFile(sPathSrc, sName).toStr();
		if(xCB) xCB(xDbSrc, sFnSrc);
		copySsgFile(xDbDst, sPathDst, xDbSrc, sFnSrc);
	}
};

var copySsgBranch=(xDbDst, sPathDst, xDbSrc, sPathSrc, bInclTrash, xCB)=>{
	if(xCB) xCB(xDbSrc, sPathSrc);
	let sNew=xDbDst.getUniqueChildName(sPathDst, 0);
	if(sNew){
		let sPathNew=new CLocalFile(sPathDst, sNew).toStr();
		if(xDbDst.createFolder(sPathNew)){
			copySsgEntryAttr(xDbDst, sPathNew, xDbSrc, sPathSrc);
			copySsgFiles(xDbDst, sPathNew, xDbSrc, sPathSrc, bInclTrash, xCB);
			copySsgChildren(xDbDst, sPathNew, xDbSrc, sPathSrc, bInclTrash, xCB);
		}
	}
};

var copySsgChildren=(xDbDst, sPathDst, xDbSrc, sPathSrc, bInclTrash, xCB)=>{
	let vNames=xDbSrc.listFolders(sPathSrc, bInclTrash);
	for(let sName of vNames){
		let sPathSub=new CLocalDir(sPathSrc, sName).toStr();
		copySsgBranch(xDbDst, sPathDst, xDbSrc, sPathSub, bInclTrash, xCB);
	}
};
