
//sValidation=nyfjs
//sCaption=Extract text from specific documents
//sHint=Extract text from specific documents
//sCategory=
//sCondition=
//sID=p.DocParser
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

//2021.9.13 Parsing large xml files is currently not supported, it may cause the user interface to stop responding;
//The default size limit of .xml files is currently set to 20MiB;
//You may want to redefine what size is considered to be a large file by manually adjusting the file size limit below;
var c_nXmlSizeLimit=1024*1024*20;

var _xmlFromZipFile=function(z, sFnXml){
	if(z && sFnXml){
		let d=z.getEntryInfo(sFnXml);
		if(d){
			if(d.nUncompressedSize<=c_nXmlSizeLimit){
				let xBA=z.extractEntry(sFnXml);
				if(xBA && xBA.size && xBA.size()>0){
					let sXml=xBA.toStr('auto');
					if(sXml){
						if(sXml.length<=c_nXmlSizeLimit){
							let xml=new CXmlDocument();
							xml.initWith(sXml);
							return xml;
						}else{
							logw('Large xml contents not supported: ' + sFnXml + '; nSize=' + sXml.length + ', nLimit=' + c_nXmlSizeLimit);
						}
					}else{
						loge('Failed to load the data file: ' + sFnXml);
					}
				}else{
					loge('Failed to extract the data file: ' + sFnXml);
				}
			}else{
				logw('Large xml contents not supported: ' + sFnXml + '; nSize=' + d.nUncompressedSize + ', nLimit=' + c_nXmlSizeLimit);
			}
		}else{
			loge('Failed to extract attributes of file entry: ' + sFnXml);
		}
	}
};

var _getSrcFile=function(ba, sSrc, sExt){
	let sFn=sSrc||'';
	if(ba && ba.size()>0){
		let sTmpFn=platform.getTempFile('', '', sExt||''); plugin.deferDeleteFile(sTmpFn);
		if(ba.saveToFile(sTmpFn)>0){
			sFn=sTmpFn;
		}
	}
	return sFn;
};

var _parse_with_ifilter=function(ba, sSrc, sExt){
	let sRes;
	if( (/^win/i).test(platform.getOsType()) ){
		let sFn=_getSrcFile(ba, sSrc, sExt);
		if(sFn){
			sRes=platform.extractTextByIFilter(sFn);
			if(sRes){
				let s2=sRes.replace(/^\s+|\s+$/g, '');
				logd('File parsed: ' + sFn + ' --> ' + sRes.length + (s2!==sRes ? (' --> ' + s2.length) : '') );
			}
		}
	}
	return sRes||'';
};

var _parse_random_file=function(ba, sSrc, sExt){

	let sRes;

	if(ba && ba.size()>0){

	}else if(sSrc){
		ba=new CLocalFile(sSrc).loadBytes();
	}

	if(ba && ba.size()>0){
		sRes=ba.toStr('auto').replace(/[^a-z0-9]+/ig, ' ');
	}

	return sRes||'';
};

var _parse_docx=function(ba, sSrc, sExt){

	let sRes=_parse_with_ifilter(ba, sSrc, sExt); if(sRes) return sRes; //2021.9.13 for win32 try first parsing with ifilter;

	let sFn=_getSrcFile(ba, sSrc, sExt);
	if(sFn){
		let z=new CZip();
		if(z && z.open(sFn, true)){

			let _parse=function(e){

				let vPara=[], s='';
				let _traverse=function(e){
					let c=e.getElementCount();
					for(let i=0; i<c; ++i){
						let sub=e.getElementByIndex(i);
						if(sub.getTagName()==='w:t'){
							s+=sub.getText();
						}else{
							if(sub.getTagName()==='w:p'){
								if(s){
									vPara.push(s);
									s='';
								}
							}
							_traverse(sub);
						}
					}
				}

				_traverse(e);

				if(s) vPara.push(s); //make sure the last paragraph is collected;

				return vPara;
			}

			let sFnXml='word/document.xml';
			let xml=_xmlFromZipFile(z, sFnXml);
			if(xml){
				let xBody=xml.getElement('w:document/w:body');
				if(xBody && xBody.isValid()){
					return _parse(xBody).join('\n');
				}else{
					logw('Bad document: [w:document/w:body] not found in ' + sFnXml + ' @ ' + sSrc);
				}
			}
		}else{
			loge('Failed to load the zipped document: ' + sSrc);
		}
	}
};

var _parse_xlsx=function(ba, sSrc, sExt){

	let sRes=_parse_with_ifilter(ba, sSrc, sExt); if(sRes) return sRes; //2021.9.13 for win32 try first parsing with ifilter;

	let sFn=_getSrcFile(ba, sSrc, sExt);
	if(sFn){
		let z=new CZip();
		if(z && z.open(sFn, true)){

			let _list_strings=function(){

				let _get_text=function(e){
					let s='';
					let _traverse=function(e){
						let c=e.getElementCount();
						for(let i=0; i<c; ++i){
							let sub=e.getElementByIndex(i);
							if(sub.getTagName()==='t'){
								s+=sub.getText();
							}else{
								_traverse(sub);
							}
						}
					};
					_traverse(e);
					return s;
				};

				let v=[];
				let sFnXml='xl/sharedStrings.xml';
				let xml=_xmlFromZipFile(z, sFnXml);
				if(xml){
					let xSst=xml.getElement('sst');
					if(xSst && xSst.isValid()){
						let c=xSst.getElementCount();
						for(let i=0; i<c; ++i){
							let sub=xSst.getElementByIndex(i);
							if(sub.getTagName()==='si'){
								let s=_get_text(sub);
								if(s){
									v[i]=s;
								}
							}
						}
					}else{
						logw('Bad document: [sst] not found in ' + sFnXml + ' @ ' + sSrc);
					}
				}

				return v;
			};

			let _list_sheets=function(){
				let v=[];
				let sFnXml='xl/workbook.xml';
				let xml=_xmlFromZipFile(z, sFnXml);
				if(xml){
					let xSheets=xml.getElement('workbook/sheets');
					if(xSheets && xSheets.isValid()){
						let c=xSheets.getElementCount();
						for(let i=0; i<c; ++i){
							let sub=xSheets.getElementByIndex(i);
							if(sub.getTagName()==='sheet'){
								let sID=sub.getAttrValue('sheetId'), sName=sub.getAttrValue('name');
								if(sID){
									v.push({id: sID, name: sName});
								}
							}
						}
					}else{
						logw('Bad document: [workbook/sheets] not found in ' + sFnXml + '\n\n' + sSrc);
					}

				}
				return v;
			};

			let vSST=_list_strings();

			let _parse_sheet=function(iPos, vRows){

				//<sheetData>
				//	<row r="1" spans="1:3" s="1" customFormat="1" x14ac:dyDescent="0.25">
				//		<c r="A1" s="1" t="s">
				//			<v>0</v>
				//		</c>
				//		<c r="B1" s="1" t="s">
				//			<v>1</v>
				//		</c>
				//		<c r="C1" s="1" t="s">
				//			<v>2</v>
				//		</c>
				//	</row>
				//	<row r="2" spans="1:3" s="1" customFormat="1" x14ac:dyDescent="0.25">
				//		<c r="A2" s="1">
				//			<v>1301</v>
				//		</c>
				//		<c r="B2" s="1">
				//			<v>1</v>
				//		</c>
				//		<c r="C2" s="2" t="s">
				//			<v>254</v>
				//		</c>
				//	</row>
				//</sheetData>

				let _parse=function(xSheetData, vRows){
					for(let j=0; j<xSheetData.getElementCount(); ++j){
						let xRow=xSheetData.getElementByIndex(j);
						if(xRow){
							let sLine='';
							for(let i=0; i<xRow.getElementCount(); ++i){
								let xCol=xRow.getElementByIndex(i);
								if(xCol){
									let xVal=xCol.getElementByTagName('v');
									if(xVal){
										let s=xVal.getText();
										if(s){
											let t=xCol.getAttrValue('t');
											if(t==='s') s=vSST[s];
											if(s){
												if(sLine) sLine+=' | ';
												sLine+=s;
											}
										}
									}
								}
							}
							if(sLine) vRows.push(sLine);
						}
					}
				}

				let sFnXml='xl/worksheets/sheet[POS].xml'.replace('[POS]', iPos);
				let xml=_xmlFromZipFile(z, sFnXml);
				if(xml){
					let xSheetData=xml.getElement('worksheet/sheetData');
					if(xSheetData && xSheetData.isValid()){
						_parse(xSheetData, vRows);
					}else{
						logw('Bad document: [worksheet/sheetData] not present in ' + sFnXml + ' @ ' + sSrc);
					}
				}
			};

			let vSheets=_list_sheets(), vRows=[];
			for(let i=0; i<vSheets.length; ++i){
				let d=vSheets[i];
				vRows.push('===== ' + d.name + ' =====');
				_parse_sheet(i+1, vRows); //_parse_sheet(d.id, vRows);
			}

			return vRows.join('\n');

		}else{
			loge('Failed to load the document: ' + sSrc);
		}
	}
};

var _parse_pptx=function(ba, sSrc, sExt){

	let sRes=_parse_with_ifilter(ba, sSrc, sExt); if(sRes) return sRes; //2021.9.13 for win32 try first parsing with ifilter;

	let sFn=_getSrcFile(ba, sSrc, sExt);
	if(sFn){
		let z=new CZip();
		if(z && z.open(sFn, true)){

			let _list_slides=function(){
				let v=[];
				let sFnXml='ppt/presentation.xml';
				let xml=_xmlFromZipFile(z, sFnXml);
				if(xml){
					let xSlides=xml.getElement('p:presentation/p:sldIdLst');
					if(xSlides && xSlides.isValid()){
						let c=xSlides.getElementCount();
						for(let i=0; i<c; ++i){
							let sub=xSlides.getElementByIndex(i);
							if(sub.getTagName()==='p:sldId'){
								let sID=sub.getAttrValue('id'), sRID=sub.getAttrValue('r:id');
								if(sID){
									v.push({id: sID, rid: sRID});
								}
							}
						}
					}else{
						logw('Bad document: [p:presentation/p:sldIdLst] not found in ' + sFnXml + ' @ ' + sSrc);
					}
				}
				return v;
			};

			let _parse_slide=function(iPos, vLines){

				let _parse=function(e){

					let s='';
					let _traverse=function(e){
						let c=e.getElementCount();
						for(let i=0; i<c; ++i){
							let sub=e.getElementByIndex(i);
							if(sub.getTagName()==='a:t'){
								s+=(sub.getText() || ' ');
							}else{
								if(sub.getTagName().search(/^(p:txBody|p:sp|a:p)$/)===0){
									if(s){
										vLines.push(s);
										s='';
									}
								}
								_traverse(sub);
							}
						}
					}

					_traverse(e);

					if(s) vLines.push(s); //make sure the last paragraph is collected;
				}

				let sFnXml='ppt/slides/slide[POS].xml'.replace('[POS]', iPos);
				let xml=_xmlFromZipFile(z, sFnXml);
				if(xml){
					let xSpTree=xml.getElement('p:sld/p:cSld/p:spTree');
					if(xSpTree && xSpTree.isValid()){
						_parse(xSpTree, vLines);
					}else{
						logw('Bad document: [p:sld/p:cSld/p:spTree] not present in ' + sFnXml + ' @ ' + sSrc);
					}
				}
			};

			//2020.5.24 currently only ppt/slides/slide*.xml are parsed, disregarding ppt/drawings/drawing*.xml & ppt/charts/chart*.xml
			let vSlides=_list_slides(), vLines=[];
			for(let i=0; i<vSlides.length; ++i){
				let d=vSlides[i];
				vLines.push('==========');
				_parse_slide(i+1, vLines);
			}

			return vLines.join('\n');

		}else{
			loge('Failed to load the document: ' + sSrc);
		}
	}
};

var _parse_doc=function(ba, sSrc, sExt){

	let sRes=_parse_with_ifilter(ba, sSrc, sExt); if(sRes) return sRes; //2021.9.13 for win32 try first parsing with ifilter;

	let sFn=_getSrcFile(ba, sSrc, sExt);
	if(sFn){
		if(CAppWord){
			let xMsw=new CAppWord();
			if(xMsw && xMsw.init()){

				//xMsw.setVisible(true);

				let xDocs=xMsw.getDocuments();
				let xDoc=xDocs ? xDocs.open(sFn, true) : undefined;

				let sRes, bSucc=false;
				if(xDoc){

					let xTmpFn=new CLocalFile(platform.getTempFile('', '', 'txt')); plugin.deferDeleteFile(xTmpFn.toStr());

					bSucc=xDoc.saveAs(xTmpFn.toStr(), 2); //wdFormatText = 2
					xDoc.close();
					xDoc.release();

					if(bSucc){
						sRes=xTmpFn.loadText('auto');
					}

					xTmpFn.remove();
				}else{
					loge('Failed to open document: ' + sSrc);
				}

				if(xMsw) xMsw.quit(); xMsw=undefined;

				return sRes;
			}
		}
	}
};

var _parse_zip=function(ba, sSrc, sExt){
	let sFn=_getSrcFile(ba, sSrc, sExt);
	if(sFn){
		let z=new CZip();
		if(z && z.open(sFn, true)){
			let v=z.listEntries();
			if(v && v.length>0 && 0){
				for(let i in v){
					let d=z.getEntryInfo(v[i]);
					if(d) log(d.sFileName
						  + ', Date=' + d.tLastModified
						  + ', Method=' + d.iCompressionMethod
						  + ', Packed=' + d.nCompressedSize
						  + ', Size=' + d.nUncompressedSize
						  + ', CRC=' + d.nCrc
						  + ', Ver=' + d.nVersion
						  + ', VerNeed=' + d.nVersionNeeded
						  + ', Flag=' + d.nFlag
						  + ', DosDate=' + d.nDosDate
						  + ', Start=' + d.nDiskNumStart
						  + ', Offset=' + d.nDiskOffset
						  );
				}
			}
			z.close();
			return v.join('\n');
		}
	}
};

var _parse_html=function(ba, sSrc, sExt){
	let sRes;
	if(ba && ba.size()>0){
		sRes=ba.toStr('html');
	}else if(sSrc){
		sRes=new CLocalFile(sSrc).loadText('html');
	}
	return platform.extractTextFromHtml(sRes);
};

var _parse_rtf=function(ba, sSrc, sExt){
	let sRes;
	if(ba && ba.size()>0){
		sRes=ba.toStr('auto');
	}else if(sSrc){
		sRes=new CLocalFile(sSrc).loadText('auto');
	}
	return platform.extractTextFromRtf(sRes);
};

var _parse_txt=function(ba, sSrc, sExt){
	let sRes;
	if(ba && ba.size()>0){
		sRes=ba.toStr('auto');
	}else if(sSrc){
		sRes=new CLocalFile(sSrc).loadText('auto');
	}
	return sRes||'';
};

var parseFile=function(ba, sSrc, sExt0, sInfo, nSizeLimit){

	//let c_sExtTxt=('txt;ini;log;csv'
	//	       + ';ada;apacheconf;arm;osascript;adoc' //ada, apache, armasm, applescript
	//	       + ';sh;zsh' //bash
	//	       + ';bf;clean;icl'
	//	       + ';dcl;clj;cs;csharp;cr;crm;pcmk;cos;cls;coffee;cson;iced;cmake.in;capnp'
	//	       + ';css'
	//	       + ';c;cc;cpp;cxx;h;h++;hpp;hxx' //c/c++
	//	       + ';dst;bat;cmd;docker;bind;zone;jinja' //dos, docker-file, dns-zone-file
	//	       + ';patch' //diff
	//	       + ';dpr;dfm;pas;pascal;freepascal;lazarus;lpr;lfm' //delphi
	//	       + ';erl' //erlang
	//	       + ';fs;f90;f95' //fortan
	//	       + ';go;golang' //golang
	//	       + ';nc;gss;gms'
	//	       + ';hx;hs;hbs'
	//	       + ';ini;js;json;java' //ini, js, java
	//	       + ';jl' //google julia
	//	       + ';lua;lisp'
	//	       + ';mips;matlib;m;moo;mma'
	//	       + ';md;mkdown;mkd;mk;mak' //markdown, makefile
	//	       + ';nixos;nim;nginxconf'
	//	       + ';scad;ml;mm;objc;obj-c' //objective-c
	//	       + ';py;gyp;bp;bpi;pp;ps;php;php3;php4;php5;php6;pl;pm' //python, php, perl
	//	       + ';qt;qml;k;kdb' //qml
	//	       + ';r' //R-lang
	//	       + ';rs;rb;gemspec;podspec;thor;irb' //rust, ruby
	//	       + ';swift;sql'
	//	       + ';ts;craftcms;tex;tk' //typescript, tex, tcl
	//	       + ';v;sv;svh;vbs;vb' //vbscript, vb.net
	//	       + ';xpath;xq' //xquery
	//	       + ';html;xhtml;htm;rss;atom;xjb;xsd;xsl;plist;xml' //xml
	//	       + ';tao' //XL
	//	       + ';yml;YAML;yaml' //yaml
	//	       + ';zep' //Zephir
	//	       + ';lnk' //shortcuts
	//	       + ';svg' //svg images
	//	       ).replace(/[\s\r\n]+/g, '').replace(/([.+-])/g, '\\$1').replace(/;/g, '|');

	//2021.5.28 file types parsed as plain text are defined in ./specs/plain.filetypes & source.filetypes;
	let c_sExtTxt=platform.getFileTypesParsingAsText().join('|').replace(/([.+-])/g, '\\$1'); //in case of special chars: h++, obj-c, etc.

	let c_vParsers=[ {t: 'docx', f: _parse_docx}
			, {t: 'xlsx', f: _parse_xlsx}
			, {t: 'pptx', f: _parse_pptx}
			, {t: 'zip', f: _parse_zip}

			//2020.5.29 this code may be activated in the case of failure parsing *.doc by IFilter;
			//, [t: 'doc', f: _parse_doc]

			, {t: 'html|htm|qrich', f: _parse_html}
			, {t: 'rtf', f: _parse_rtf}
			, {t: c_sExtTxt, f: _parse_txt} //put at end of the list;
	    ];

	let sRes='';
	let xFn=new CLocalFile(sSrc), sExt=sExt0; if(!sExt) sExt=xFn.getExtension(false);
	let sDoc=sInfo||sSrc||''; if(sDoc.search(/^\/Organizer\/data\//i)===0) sDoc=sDoc.replace(/^(.*)[\/\\]([^\/\\]+)$/, '$2').replace(plugin.getDefNoteFn(sExt), 'defnote.' + sExt);

	//log('Parsing: ' + sDoc);
	//{let xLog=new CLocalFile(platform.getHomePath(), 'nyf8_idx_dbg.log'); xLog.saveUtf8(xLog.loadText()+'\n'+sDoc);}

	if( (ba && ba.size()>0) || xFn.exists() ){
		let len=ba ? ba.size() : 0; if(xFn.exists()) len=xFn.getFileSize();
		if(len<=nSizeLimit){
			if(sExt){
				let j;
				for(j=0; j<c_vParsers.length; ++j){
					let d=c_vParsers[j], re=new RegExp('^(' + d.t + ')$', 'i'); //logd(re);
					if(sExt.search(re)===0){
						let s=d.f(ba, sSrc, sExt);
						if(s){
							sRes= s;
							let s2=sRes.replace(/^\s+|\s+$/g, '');
							logd('File parsed: ' + sDoc + ' --> ' + sRes.length + (s2!==sRes ? (' --> ' + s2.length) : '') );
							break;
						}
					}
				}
				if(j===c_vParsers.length){
//					if( (/^win/i).test(platform.getOsType()) ){
//						let sFn=sSrc;
//						if(ba && ba.size()>0){
//							let sTmpFn=platform.getTempFile('', '', sExt); plugin.deferDeleteFile(sTmpFn);
//							if(ba.saveToFile(sTmpFn)>0){
//								sFn=sTmpFn;
//							}
//						}
//						sRes=platform.extractTextByIFilter(sFn);
//						if(sRes){
//							let s2=sRes.replace(/^\s+|\s+$/g, '');
//							logd('File parsed: ' + sDoc + ' --> ' + sRes.length + (s2!==sRes ? (' --> ' + s2.length) : '') );
//						}else{
//							sRes=_parse_random_file(ba, sSrc);
//							logd('Random file parsed: ' + sDoc + ' --> ' + sRes.length );
//							//logd('No text extracted; Maybe IFilter unavailable for: ' + sDoc);
//						}
//					}else{
//						sRes=_parse_random_file(ba, sSrc);
//						//logd('No parser for: ' + sDoc);
//						logd('Random file parsed: ' + sDoc + ' --> ' + sRes.length );
//					}

					sRes=_parse_with_ifilter(ba, sSrc, sExt); //2021.9.13 try it again with win32/ifilter;
					if(!sRes){
						sRes=_parse_random_file(ba, sSrc);
						logd('Random file parsed: ' + sDoc + ' --> ' + sRes.length );
						//logd('No text extracted; Maybe IFilter unavailable for: ' + sDoc);
					}
				}
			}else{
				//sRes=_parse_txt(ba, sSrc);
				//let s2=sRes.replace(/^\s+|\s+$/g, '');
				//logd('Text file assumed: ' + sDoc + ' --> ' + sRes.length + (s2!==sRes ? (' --> ' + s2.length) : '') );
				sRes=_parse_random_file(ba, sSrc);
				logd('Random file parsed: ' + sDoc + ' --> ' + sRes.length );
			}
		}else{
			sRes='Large files not supported.';
			logw('Large file ignored: ' + sDoc + '; nSize=' + len + ', nLimit=' + nSizeLimit);
		}
	}else{
		loge('No data supplied or file not found: ' + sDoc);
	}
	//2020.7.21 the item titles may also contains special characters, so this tweak went into the c++ side;
	//sRes='=\u00A0+++++\u2000--\u200f++++\u2028--\u202f+++\u205f--\u206f=\n'; //test case;
	//return sRes.replace(/([\xA0]|[\u2000-\u200f]|[\u2028-\u202f]|[\u205f-\u206f])+/g, ' ');
	return sRes;
};

var xArg=plugin.argument();
if(xArg && (xArg.data || xArg.src) && (xArg.limit>0)){
	try{
		returnValue=parseFile(xArg.data, xArg.src, xArg.ext, xArg.info, xArg.limit);
	}catch(e){
		returnValue='[Uncaught exception parsing documents]';
		loge(e);
	}
}else{
	logw('No document file available to parse.');
}
