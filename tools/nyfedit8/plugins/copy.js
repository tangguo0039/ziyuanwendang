
//sValidation=nyfjs
//sCaption=Copy selected items/contents
//sHint=Copy currently selected items/content at input focus
//sCategory=
//sCondition=CURDB;
//sID=p.CopyCurSel
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

//try{

	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		include('comutils');

		let sCurSsgPath=ui.getCurInfoItem();
		let sCurInputFocus=ui.getFocusPane();

		let searchResFocus=()=>{return (/^SearchResults$/i).test(sCurInputFocus);};
		let outlineFocus=()=>{return (/^Outline$/i).test(sCurInputFocus);};
		let labelsFocus=()=>{return (/^Labels$/i).test(sCurInputFocus);};
		let tagResultsFocus=()=>{return (/^TagResults$/i).test(sCurInputFocus);};
		let overviewFocus=()=>{return (/^Overview$/i).test(sCurInputFocus);};
		let relationFocus=()=>{return (/^Relation$/i).test(sCurInputFocus);};
		let htmlEditFocus=()=>{return (/^Html(Edit|View)$/i).test(sCurInputFocus);};
		let richEditFocus=()=>{return (/^Rich(Edit|View)$/i).test(sCurInputFocus);};
		let plainEditFocus=()=>{return (/^(Text|Plain)(Edit|View)$/i).test(sCurInputFocus);};

		let bWin=(/^win/i).test(platform.getOsType());
		let sEol=bWin ? '\r\n' : '\n';

		let _anchor_link=(sHref, sLabel, sTitle, bMd)=>{
			let s;
			if(bMd){
				s='[%sLabel%](%sHref% "%sTitle%")'
				.replace(/%sLabel%/gi, esc$(sLabel).replace(/[\[\]]+/g, ''))
				.replace(/%sHref%/gi, esc$(sHref).replace(/\s/g, '%20'))
				.replace(/%sTitle%/gi, esc$(sTitle).replace(/["]+/g, ''))
				;
			}else{
				s='<a href="%sHref%" title="%sTitle%">%sLabel%</a>'
				.replace(/%sHref%/gi, esc$(sHref).replace(/["]+/g, ''))
				.replace(/%sTitle%/gi, esc$(sTitle).replace(/["]+/g, ''))
				.replace(/%sLabel%/gi, platform.htmlEncode(esc$(sLabel)))
				;
			}
			return s;
		};

		if(sCurSsgPath){

			let vHtml=[], sText='', vLines=[], vUrls=[], sImgData;

			let _push_url=(u)=>{if(u && vUrls.indexOf(u)<0) vUrls.push(u);};

			let _output_ssgentry=(xDb, sSsgEntry)=>{
				let e=sSsgEntry;
				if(e){
					let sSsgPath='', sSsgName='', sItemText='', sLink='', sHtml, sTxt, bRO=true; //xDb.isReadonly();
					if( e.search(/[/\\]/)<0 ){ //in the case of only ssg names supplied without path;

						sSsgPath=sCurSsgPath; sSsgName=e; sItemText='';
						sLink=xDb.makeHyperlinkOfSsgEntry(xDb.getDbFile(), sSsgPath, sSsgName, sItemText, bRO);
						sHtml=_anchor_link(sLink, sSsgName, sSsgName + ' @ ' + xDb.getDbFile(), false);
						sTxt=sSsgName;

					}else if(xDb.fileExists(e)){

						let xFn=new CLocalFile(e);
						sSsgPath=xFn.getDirectory(true); sSsgName=xFn.getLeafName(); sItemText='';
						sLink=xDb.makeHyperlinkOfSsgEntry(xDb.getDbFile(), sSsgPath, sSsgName, sItemText, bRO);
						sHtml=_anchor_link(sLink, sSsgName, sSsgName + ' @ ' + xDb.getDbFile(), false);
						sTxt=sSsgName;

					}else if(xDb.folderExists(e)){

						sSsgPath=e; sSsgName=''; sItemText=xDb.getFolderHint(e) || '... ...';
						sLink=xDb.makeHyperlinkOfSsgEntry(xDb.getDbFile(), sSsgPath, sSsgName, sItemText, bRO);
						sHtml=_anchor_link(sLink, sItemText, sItemText + ' @ ' + xDb.getDbFile(), false);
						sTxt=sItemText;

					}

					if(sTxt) vLines.push(sTxt);
					if(sHtml) vHtml.push(sHtml);
					if(sLink) _push_url(sLink);
				}
			};

			let _output_ssgentries=(vSsgEntries)=>{
				if(vSsgEntries && vSsgEntries.length>0){
					for(let e of vSsgEntries){
						_output_ssgentry(xNyf, e);
					}
				}
			};

			let _output_searchres=(v)=>{
				let xDbList={};
				for(let d of v){
					let sDbFn=d.sDbFn, sSsgPath=d.sSsgPath, sSsgName=d.sSsgName;
					if(sDbFn && sSsgPath){
						let xDb=xDbList[sDbFn];
						if(!xDb || !xDb.isOpen()){
							if(sDbFn===xNyf.getDbFile()){
								xDb=xNyf;
							}else{
								xDb=new CNyfDb();
								if(!xDb.open(sDbFn, true)){
									logd('Failure opening database: ' + sDbFn);
								}
							}
							xDbList[sDbFn]=xDb;
						}
						if(xDb && xDb.isOpen()){
							_output_ssgentry(xDb, new CLocalFile(sSsgPath, sSsgName).toStr());
						}
					}
				}
			};

			if(searchResFocus()){

				let vSearchResults=ui.getSelectedResults();
				_output_searchres(vSearchResults);

			}else if(outlineFocus()){

				let vInfoItems=ui.getSelectedInfoItems(-1);
				_output_ssgentries(vInfoItems);

			}else if(labelsFocus()){

				let sLabel=ui.getCurLabelItem(-1), bRO=true;
				let sUri=xNyf.makeHyperlinkOfLabelItem(xNyf.getDbFile(), sLabel, bRO);
				_push_url(sUri);
				vHtml.push(_anchor_link(sUri, sLabel, sLabel, false));
				vLines.push(sLabel);

			}else if(relationFocus()){

				let bFullPath=false, vAttachments=ui.getSelectedAttachments(-1, bFullPath);
				if(vAttachments) _output_ssgentries(vAttachments);

				let vLabels=ui.getSelectedLabels(-1);
				for(let sLabel of vLabels){
					let bRO=true, sUri=xNyf.makeHyperlinkOfLabelItem(xNyf.getDbFile(), sLabel, bRO);
					_push_url(sUri);
					vHtml.push(_anchor_link(sUri, sLabel, sLabel, false));
					vLines.push(sLabel);
				}

				let vLabeledItems=ui.getSelectedLabeledItems(-1);
				if(vLabeledItems) _output_ssgentries(vLabeledItems);

				let vItemLinks=ui.getSelectedItemLinks(-1);
				if(vItemLinks) _output_ssgentries(vItemLinks);

				let vSymLinks=ui.getSelectedSymbolicLinks(-1);
				if(vSymLinks) _output_ssgentries(vSymLinks);

				let vThreds=ui.getSelectedThreads(-1); for(let s of vThreds) vLines.push(s);
				let vThrededItems=ui.getSelectedThreadedItems(-1);
				if(vThrededItems) _output_ssgentries(vThrededItems);

			}else if(tagResultsFocus()){

				let vTagRes=ui.getSelectedTagResults(-1);
				_output_ssgentries(vTagRes);

			}else if(overviewFocus()){

				let v=ui.getSelectedOverviewItems(-1);
				for(let s of v){
					vLines.push(s);
				}

			}else if(htmlEditFocus() || richEditFocus()){

				ui.initProgressRange(plugin.getScriptTitle(), 0);

				let du=ui.getDataUrlOfImageInContext(-1);
				if(du){
					let re=new RegExp('data:image\\/(png|jpg|jpeg|gif|bmp|tiff|svg);base64,(.+)$', 'i');
					let m=re.exec(du);
					if(m && m.length>2){
						let sExt=m[1], sDat=m[2];
						if(sExt && sDat){
							sImgData=sDat;
						}
					}
				}

				let sHtml=ui.getSelectedText(-1, true);
				let sTxt=ui.getSelectedText(-1, false);

				//2021.5.2 Copy <img> or other objects may produce only one character '0xFFFC'; alert(sTxt.charCodeAt(0).toString(16));
				//https://unicodemap.org/details/0xFFFC/index.html
				//Range: 0xFFF0 - 0xFFFD : Specials
				//Unicode Hexadecimal: 0xFFFC ==> OBJECT REPLACEMENT CHARACTER
				if(sTxt.length===1 && sTxt.charCodeAt(0)===0xFFFC) sTxt='';

				if(sHtml===sTxt) sHtml=''; //2021.5.7 avoid redundant clip data types;

				sHtml=substituteUrisWithinHtml(sHtml, 'img,link', function(sObj, sTagName){
					let u=sObj.toString();

					let bContinue=ui.ctrlProgressBar(u, 1, true);
					if(!bContinue) throw 'User abort by Esc.';

					//2019.1.22 attempt to embed all images into HTML in BASE64
					if(u.search(/[:\?\*\|\/\\<>]/)<0){ //for linked objs, possibly saved in the attachments section;
						if(u.search(/\.(png|jpg|jpeg|gif|svg|bmp|tif)$/i)>0){
							let xSsgFn=new CLocalFile(sCurSsgPath, percentDecode(u));
							let sExt=xSsgFn.getSuffix(false).toLowerCase();
							if(xNyf.fileExists(xSsgFn.toStr())){
								let v=xNyf.loadBytes(xSsgFn.toStr());
								if(v.size()>0){
									u='data:image/%TYPE%;base64,'.replace(/%TYPE%/gi, sExt) + v.base64();
									//log('==>' + u);
								}
							}
						}
					}

					return u;
				});

				if(sTxt) sText=sTxt; //vText.push(sTxt);

				if(sHtml) vHtml.push(sHtml);

				//2021.4.29 consider of the current hyperlink at caret when no text is selected;
				let u=ui.getCurrentHyperlink(-1);
				if(u) _push_url(u);

				//2021.4.24 extract 'href' from within the selected html;
				substituteUrisWithinHtml(sHtml, 'a', function(sObj, sTagName){

					let u=sObj.toString();
					if(u) _push_url(u);

					let bContinue=ui.ctrlProgressBar(u, 1, true);
					if(!bContinue) throw 'User abort by Esc.';

					return u;
				});

				ui.destroyProgressBar();

			}else if(plainEditFocus()){

				let sTxt=ui.getSelectedText(-1, false);
				sText=sTxt; //vText.push(sTxt);

			}

			let vData=[];
			if(1){
				if(vHtml && vHtml.length>0){
					let s=(vHtml.length===1) ? vHtml[0] : ('<div>'+ vHtml.join('</div>' + sEol + '<div>') + '</div>');
					vData.push({type: 'html', val: s});
				}

				if(vUrls && vUrls.length>0){
					vData.push({type: 'urls', val: vUrls});
				}

				if(sImgData){
					vData.push({type: 'base64img', val: sImgData});
				}
			}

			if(1){
				let s=sText.replace(/\r\n/g, '\n').replace(/\r/g, '\n'); if(bWin) s=s.replace(/\n/g, sEol);
				if(vLines && vLines.length>0){
					if(s) s+=sEol;
					s+=vLines.join(sEol);
				}
				if(s){
					vData.push({type: 'text', val: s});
				}
			}

			if(vData.length>0){
				platform.setClipboardData(vData);
			}else{
				alert('No contents selected to copy.');
			}

		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

//}catch(e){
//	ui.destroyProgressBar();
//	alert(e);
//}
