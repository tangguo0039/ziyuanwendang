
//sValidation=nyfjs
//sCaption=Paste special
//sHint=Paste with mime data
//sCategory=
//sCondition=CURDB; DBRW; CURINFOITEM
//sID=p.PasteMimeData
//sAppVerMin=8.0
//sAuthor=wjjsoft

/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2022 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

let _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
let _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

//try{
	let xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		include('comutils');

		let xArg=plugin.argument();

		let xMimeData=xArg["xMimeData"];

		let a_bCheckToPasteSpecial=true; //2021.4.29 set to false to disable switching over to Paste special for the default Paste with multiple mime-types;
		let a_bPasteSpecial=xArg['bPasteSpecial'];
		let a_bPasteUnformatted=xArg['bPasteUnformatted'];

		let a_bPromptOnPasteToApplyLabels=xArg['bPromptOnPasteToApplyLabels'];
		let a_bPromptOnPasteToReplicateInfoItems=xArg['bPromptOnPasteToReplicateInfoItems'];
		let a_bPromptOnPasteToNewAttachment=xArg['bPromptOnPasteToNewAttachment'];
		let a_bPromptOnPasteToNewImgFile=xArg['bPromptOnPasteToNewImgFile'];

		let a_sPasteImgIntoHtmlAs=xArg['sPasteImgIntoHtmlAs']; //base64 or attachment;
		let a_sPasteImgIntoMdAs=xArg['sPasteImgIntoMdAs']; //base64 or attachment;

		let sCurSsgPath=ui.getCurInfoItem();

		//2021.7.20 consider of specific location of inputFocus, e.g. drag-dropping items into editors;
		let sCurInputFocus=xArg['sCurInputFocus'] || ui.getFocusPane();

		let xCurScreen=platform.getScreenProperties(-1);
		let nDevPixRatio=xCurScreen ? xCurScreen.devicePixelRatio : 1.0;
		let nMarginCurView=40;

		//application/vnd.oasis.opendocument.text
		//application/x-qt-windows-mime;value=\"Rich Text Format\"

		let sMimeTypeHtml='text/html';
		let sMimeTypePlain='text/plain';
		let sMimeTypeUriList='text/uri-list';
		let sMimeTypeRtf='application/x-qt-windows-mime;value="Rich Text Format"';
		let sMimeTypeImage='application/x-qt-image';
		let sMimeTypeDataImages='application/x-nyf-dataimages';
		let sMimeTypeDiskFiles='application/x-nyf-diskfiles';
		let sMimeTypeDiskDirs='application/x-nyf-diskdirs';
		let sMimeTypeUrls='application/x-nyf-urls';

		let sMimeTypeInfoItems='application/x-nyf-infoitems';
		let sMimeTypeLabelItems='application/x-nyf-labelitems';
		let sMimeTypeAttachments='application/x-nyf-attachments';

		let isLinux=()=>{return (/linux/i).test(platform.getOsType());};
		let isMac=()=>{return (/macOS/i).test(platform.getOsType());};
		let isWin=()=>{return (/(windows|win32|win64|win|dos)/i).test(platform.getOsType());};

		let isHtml=(f)=>{return f===sMimeTypeHtml;}; //{return (/^text\/html$/i).test(f);};
		let isPlain=(f)=>{return f===sMimeTypePlain;}; //{return (/^text\/plain$/i).test(f);};
		let isUriList=(f)=>{return f===sMimeTypeUriList;}; //{return (/^text\/uri-list$/i).test(f);};
		let isImage=(f)=>{return f===sMimeTypeImage;}; //{return (/^application\/x-qt-image$/i).test(f);};
		let isDataImage=(f)=>{return f===sMimeTypeDataImages;}; //{return (/^application\/x-nyf-dataimage$/i).test(f);};

		let isRtf=(f)=>{return f===sMimeTypeRtf;}; //{return f.search(/Rich\s+Text\s+Format/i)>=0;};

		let isDiskDirList=(f)=>{return f===sMimeTypeDiskDirs;};
		let isDiskFileList=(f)=>{return f===sMimeTypeDiskFiles;};
		let isUrlList=(f)=>{return f===sMimeTypeUrls;};

		let isInfoItemList=(f)=>{return f===sMimeTypeInfoItems;};
		let isLabelItemList=(f)=>{return f===sMimeTypeLabelItems;};
		let isAttachmentList=(f)=>{return f===sMimeTypeAttachments;};

		let searchResFocus=()=>{return (/^SearchResults$/i).test(sCurInputFocus);};
		let outlineFocus=()=>{return (/^Outline$/i).test(sCurInputFocus);};
		let labelsFocus=()=>{return (/^Labels$/i).test(sCurInputFocus);};
		let tagResultsFocus=()=>{return (/^TagResults$/i).test(sCurInputFocus);};
		let overviewFocus=()=>{return (/^Overview$/i).test(sCurInputFocus);};
		let relationFocus=()=>{return (/^Relation$/i).test(sCurInputFocus);};
		let htmlEditFocus=()=>{return (/^Html(Edit|View)$/i).test(sCurInputFocus);};
		let richEditFocus=()=>{return (/^Rich(Edit|View)$/i).test(sCurInputFocus);};
		let plainEditFocus=()=>{return (/^(Text|Plain)(Edit|View)$/i).test(sCurInputFocus);};

		let _is_markdown_doc=()=>{
			let sCurDocFn=ui.getCurDocFile(), sExt=new CLocalFile(sCurDocFn).getSuffix(false);
			return (sExt.toLowerCase()==='md');
		};

		let _length=(d)=>{
			if(d && d.length){
				if(typeof(d.length)==='number') return d.length; //for js-String
				else if(typeof(d.length)==='function') return d.length(); //for js-Array, CByteArray, CImage;
				else if(typeof(d.size)==='function') return d.size(); //for js-Array, CByteArray;
			}
			return -1;
		};

		let _extract_entries_from=(vUris)=>{
			let vDirs=[], vFiles=[], vUrls=[], vInfoItems=[], vAttachments=[], vDataImages=[], vLabelItems=[];
			for(let u of vUris){
				u=trim(u||'').replace(/\s/g, '%20');
				//let m=(u||'').match(/^file:\/\/(.+)$/i);
				//if(m && m[1]){
				if(u.search(/^file:\/\/(.+)$/i)===0){
					//let sPath=percentDecode(m[1]); //2021.8.27 in case of any percent-decoded characters;
					//if(isWin()) sPath=sPath.replace(/^([/]+)/, ''); //e.g. file:///C:/Users/uid/abc.txt
					let sPath=platform.toLocalFile(u, true);
					logd('toLocalFile: ' + u + ' ==> ' + sPath);
					if(new CLocalFile(sPath).exists()){
						vFiles.push(sPath);
					}else if(new CLocalDir(sPath).exists()){
						//2021.4.30 disk-folders currently work as file:// links;
						vUrls.push(u); //vDirs.push(sPath);
					}else{
						//2021.4.23 For urls copied with "Copy image address" on attached images, it may look like this: file:///./clip.png
						m=(u||'').match(/^file:[\//]{2,}\.\/([^/\\]+)$/i);
						if(m && m[1]){
							let sSsgName=m[1];
							let xSsgFn=new CLocalFile(sCurSsgPath, sSsgName);
							if(xNyf.fileExists(xSsgFn.toStr())){
								vAttachments.push({dbfile: xNyf.getDbFile(), itempath: sCurSsgPath, ssgname: sSsgName, uri: u});
							}else{
								logd('Linked file not found in the attachment list: ' + u);
							}
						}else{
							logd('Linked file not found in the local disk file system: ' + u);
						}
					}
				}else if( (/^nyf:\/\/entry\?/i).test(u) ){
					let p=xNyf.parseNyfHyperlink(u);
					if(p){
						let dbid=p['dbid'];
						let dbfile=p['dbfile'];
						let itemid=p['itemid'];
						let itempath=p['itempath'];
						let itemtext=p['itemtext'];
						let ssgname=p['ssgname'];
						let labelpath=p['labelpath'];
						if(dbfile){
							if(labelpath){
								vLabelItems.push({dbfile: dbfile, labelpath: labelpath, uri: u});
							}else if(itempath || itemid>=0){
								let xDb=xNyf;
								if(!new CLocalFile(dbfile).equals(xNyf.getDbFile())){ //if(sDbFile!==xNyf.getDbFile()){
									xDb=new CNyfDb();
									xDb.open(dbfile, true);
								}
								if(xDb.isOpen()){
									if(itemid>=0){
										//2021.4.26 'itemid' has higher priority, and make sure 'itempath' is retrieved for later use;
										let s=xDb.getPathByItemID(itemid);
										if(s) itempath=s;
									}
									if(ssgname){
										vAttachments.push({dbfile: dbfile, itemid: itemid, itempath: itempath, ssgname: ssgname, uri: u, db: xDb});
									}else{
										vInfoItems.push({dbfile: dbfile, itemid: itemid, itempath: itempath, itemtext: itemtext, uri: u, db: xDb});
									}
								}
							}else{
								logd('Bad ssg entry link: ' + u);
							}
						}else{
							logd('Bad ssg entry link: ' + u);
						}
					}else{
						logd('Malformed ssg entry link: ' + u);
					}
				}else if( (/^(file|nyf|https?|s?ftp|gopher|mailto|mms|ed2k|thunder|flashget):/i).test(u) ){
					vUrls.push(u);
				}else if( (/^data:image\/([0-9a-z+]{2,16});base64,/i).test(u) ){
					//2021.6.2 consider of SVG: data:image/svg+xml;base64,iVBORw0KGgo...
					vDataImages.push(u);
				}else{
					//logd('Unsupported uri: ' + u.replace(/^(.{200})(.+)$/, '$1...'));
					logd('Unsupported uri: ' + ellipsis(u, 200));
				}
			}
			return {vDirs: vDirs, vFiles: vFiles, vUrls: vUrls, vInfoItems: vInfoItems, vAttachments: vAttachments, vDataImages: vDataImages, vLabelItems: vLabelItems};
		};

		let sCfgKey1='PasteMimeData.sLastMimeType', sCfgKey2='PasteMimeData.sSaveImgAs', sCfgKey3='PasteMimeData.iImgDimSel', sCfgKey4='PasteMimeData.sPasteFilesAs';
		let sMimeTypeInit=localStorage.getItem(sCfgKey1)||'', sSaveImgAs0=localStorage.getItem(sCfgKey2)||'', iSelImgDim0=localStorage.getItem(sCfgKey3)||0, sPasteFilesAs0=localStorage.getItem(sCfgKey4)||'';

		let vMimeTypes0=[], vMimeDisp0=[], xNamedTypes={}, sImgFmt0='png', vDiskDirs0=[], vDiskFiles0=[], vUrls0=[], vInfoItems0=[], vAttachments0=[], vDataImages0=[], vLabelItems0=[];

		let _push_mimetype=(f, sHint)=>{
			xNamedTypes[f]=sHint; //cache it for later reference;
			if(vMimeDisp0.length>0) vMimeDisp0.push(''); //line-breaks;
			if(sMimeTypeInit===f) sHint='true' + '|' + sHint;
			vMimeDisp0.push(sHint);
			vMimeTypes0.push(f);
		};

		let _fix_crlf=(s)=>{
			//2021.4.27 on macOS, it seemed that the '\r' is used as separator when copying filenames from in Finder;
			return (s||'').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
		};

		let _imgsize=(d)=>{
			if(d){
				let w=0, h=0;
				if(d.width && d.height && d.load && d.save){
					//d: CImage
					w=d.width();
					h=d.height();
				}else{
					//d: CByteArray
					let img=new CImage();
					if(img.load(d)){
						w=img.width();
						h=img.height();
						img.clear();
					}
				}
				return {w: w, h: h};
			}
		};

		let _img_dimension_info=(d)=>{
			let sz=_imgsize(d);
			return _lc2('Image.Details', 'Dimension: %nWidth% x %nHeight%, Bytes: %nBytes%')
			.replace(/%nWidth%/gi, sz.w)
			.replace(/%nHeight%/gi, sz.h)
			.replace(/%nBytes%/gi, thousandths(_length(d)))
			;
		};

		for(let t in xMimeData){
			let d=xMimeData[t];
			if(isHtml(t)){

				let h=_lc2('Mime.HtmlText', 'Html text  ( Characters: %nChars%)').replace(/%nChars%/gi, thousandths(_length(d))); //js String
				_push_mimetype(t, h);

				xMimeData[t]=_fix_crlf(d);

			}else if(isPlain(t)){

				let h=_lc2('Mime.PlainText', 'Plain text  ( Characters: %nChars% )').replace(/%nChars%/gi, thousandths(_length(d))); //js String
				_push_mimetype(t, h);

				xMimeData[t]=_fix_crlf(d);

			}else if(isRtf(t)){

				let h=_lc2('Mime.RTF', 'RTF text  ( Bytes: %nBytes% )').replace(/%nBytes%/gi, thousandths(_length(d))); //Qt ByteArray
				_push_mimetype(t, h);

			}else if(isImage(t)){

				//let h=_lc2('Mime.Image', 'Image/Binary  ( Bytes: %nBytes%)').replace(/%nBytes%/gi, thousandths(_length(d))); //Qt ByteArray
				let h=_lc2('Mime.Image', 'Image/Binary  ( %sImgInfo% )').replace(/%sImgInfo%/gi, _img_dimension_info(d));
				_push_mimetype(t, h);

			}else if(isUriList(t)){
				let o=_extract_entries_from(d);
				if(o){
					vDiskDirs0=o.vDirs;
					vDiskFiles0=o.vFiles;
					vUrls0=o.vUrls;
					vInfoItems0=o.vInfoItems;
					vAttachments0=o.vAttachments;
					vDataImages0=o.vDataImages;
					vLabelItems0=o.vLabelItems;
				}

				if(vDiskDirs0.length>0){
					let h=_lc2('Mime.DiskDirs', 'Local disk folders  ( Count: %nCount% )').replace(/%nCount%/gi, thousandths(_length(vDiskDirs0)));
					_push_mimetype(sMimeTypeDiskDirs, h);
				}
				if(vDiskFiles0.length>0){
					let h=_lc2('Mime.DiskFiles', 'Local disk files  ( Count: %nCount% )').replace(/%nCount%/gi, thousandths(_length(vDiskFiles0)));
					_push_mimetype(sMimeTypeDiskFiles, h);
				}
				if(vUrls0.length>0){
					let h=_lc2('Mime.Urls', 'URLs  ( Count: %nCount% )').replace(/%nCount%/gi, thousandths(_length(vUrls0)));
					_push_mimetype(sMimeTypeUrls, h);
				}
				if(vInfoItems0.length>0){
					let h=_lc2('Mime.InfoItems', 'Info items  ( Count: %nCount% )').replace(/%nCount%/gi, thousandths(_length(vInfoItems0)));
					_push_mimetype(sMimeTypeInfoItems, h);
				}
				if(vAttachments0.length>0){
					let h=_lc2('Mime.Attachments', 'Attachments  ( Count: %nCount% )').replace(/%nCount%/gi, thousandths(_length(vAttachments0)));
					_push_mimetype(sMimeTypeAttachments, h);
				}
				if(vDataImages0.length>0){
					let h=_lc2('Mime.DataImages', 'Image/DataUrl  ( Count: %nCount% )').replace(/%nCount%/gi, thousandths(_length(vDataImages0)));
					_push_mimetype(sMimeTypeDataImages, h);
				}
				if(vLabelItems0.length>0){
					let h=_lc2('Mime.Labels', 'Label items  ( Count: %nCount% )').replace(/%nCount%/gi, thousandths(_length(vLabelItems0)));
					_push_mimetype(sMimeTypeLabelItems, h);
				}

			}else{
				logd('Unsupported MimeData: ' + t);
			}
		}

		logd(sCurInputFocus + '/Paste/MimeTypes: (' + vMimeTypes0.join(', ') + ')');

		let _cur_focus=()=>{
			let sCurFocus='???';
			if(1){
				if(htmlEditFocus()){
					sCurFocus=_lc2('Focus.HtmlEdit', 'Html content');
				}else if(richEditFocus()){
					sCurFocus=_lc2('Focus.RichEdit', 'Rich text');
				}else if(plainEditFocus()){
					sCurFocus=_is_markdown_doc() ? _lc2('Focus.Markdown', 'Markdown text') : _lc2('Focus.PlainText', 'Plain text');
				}else if(outlineFocus()){
					sCurFocus=_lc2('Focus.Outline', 'Outline view');
				}else if(labelsFocus()){
					sCurFocus=_lc2('Focus.Labels', 'Label view');
				}else if(relationFocus()){
					sCurFocus=_lc2('Focus.Attachments', 'Attachments list');
				}else if(searchResFocus()){
					sCurFocus=_lc2('Focus.SearchRes', 'Search results list');
				}
			}
			return sCurFocus;
		};

		let _supported_mimetypes=()=>{

			let v=[];

			if(htmlEditFocus() || richEditFocus()){

				v=[sMimeTypeDiskFiles, sMimeTypeImage, sMimeTypeDataImages, sMimeTypeAttachments, sMimeTypeInfoItems, sMimeTypeLabelItems, sMimeTypeHtml, sMimeTypeRtf, sMimeTypePlain];

			}else if(plainEditFocus()){

				if(_is_markdown_doc()){
					v=[sMimeTypeDiskFiles, sMimeTypeImage, sMimeTypeDataImages, sMimeTypeAttachments, sMimeTypeInfoItems, sMimeTypeLabelItems, sMimeTypePlain, sMimeTypeHtml, sMimeTypeRtf];
				}else{
					v=[sMimeTypePlain, sMimeTypeDiskFiles, sMimeTypeInfoItems, sMimeTypeLabelItems, sMimeTypeAttachments, sMimeTypeHtml, sMimeTypeRtf, sMimeTypeDataImages, sMimeTypeImage];
				}

			}else if(outlineFocus()){

				v=[sMimeTypeDiskFiles, sMimeTypeInfoItems, sMimeTypeLabelItems, sMimeTypeAttachments, sMimeTypeImage, sMimeTypeDataImages, sMimeTypeHtml, sMimeTypeRtf, sMimeTypePlain];

			}else if(labelsFocus()){

				v=[sMimeTypeInfoItems];

			}else if(relationFocus()){

				v=[sMimeTypeDiskFiles, sMimeTypeLabelItems, sMimeTypeImage, sMimeTypeDataImages, sMimeTypeHtml, sMimeTypeRtf, sMimeTypePlain];

			}else if(searchResFocus()){

				v=[sMimeTypeInfoItems, sMimeTypeAttachments];

			}

			return v;
		};

		let bCancelled=false;
		let _determine_mimetype=()=>{

			let t, bUnformatted=a_bPasteUnformatted, bSpecial=a_bPasteSpecial;

			//2021.4.30 don't show [Paste special] dialog if only one mimetype avail.
			if(!bUnformatted && !bSpecial && vMimeTypes0.length===1){
				t=vMimeTypes0[0]; logd('Only one MimeType: <' + t + '> for <' + _cur_focus() + '>');
				return t;
			}

			if(!bUnformatted && !bSpecial && a_bCheckToPasteSpecial){

				//2021.4.29 for default Paste command, switch over to the Paste special to show a list of data formats if any formats other than [text/Html, Text/Plain] applicable;
				//hope this can reduce confusions while using Copy/paste with multiple data formats/sources/applications;
				if(htmlEditFocus() || richEditFocus() || plainEditFocus()){

					let _only_image=()=>{
						return vMimeTypes0.length===1 && isImage(vMimeTypes0[0]);
					};

					let _only_text=()=>{
						let b=true;
						for(let t of vMimeTypes0){
							if(!isHtml(t) && !isPlain(t)){
								b=false;
								break;
							}
						}
						return b;
					};

					if(!_only_text() && !_only_image()) bSpecial=true;

				}else if(outlineFocus() || labelsFocus || relationFocus()){

					if(vMimeTypes0.length>1){
						bSpecial=true;
					}

				}else if(searchResFocus()){

					if(vMimeTypes0.indexOf(sMimeTypeInfoItems)>=0 && vMimeTypes0.indexOf(sMimeTypeAttachments)>=0){
						bSpecial=true;
					}

				}
			}

			if(bUnformatted){

				//2021.4.27 for Paste unformatted, the <text/plain> is automatically selected;

				if(vMimeTypes0.indexOf(sMimeTypePlain)>=0){
					t=sMimeTypePlain;
					logd('Requested for unformatted clip data: <' + t + '> at <' + _cur_focus() + '>');
				}else{
					logd('No plain text available on the system clipboard.');
				}

			}else if(bSpecial){

				//2021.4.27 for Paste special (Ctrl+Cmd+V), show the mime-types for end-users to choose;

				//Have the first item checked if none checked at the first time using this utility;
				if(vMimeDisp0.length>0 && vMimeDisp0.join('\n').search(/\bTrue\|.+/i)<0){
					vMimeDisp0[0] = 'true|' + vMimeDisp0[0];
				}

				let vFields = [
					{sField: 'radio', sLabel: _lc2('SelMimeTypes', 'Please choose one of the following data types to paste;'), vItems: vMimeDisp0}
					, {sField: 'label', sText: '', bWordwrap: false}
					, {sField: 'label', sText: _lc2('InputFocus', 'Input focus') + ': ' + _cur_focus(), bWordwrap: false}
				];

				let vRes=input(plugin.getScriptTitle(), vFields, {nMinSize: 480, vMargins: [6, 0, 30, 0], bVert: true});
				if(vRes && vRes.length>=1){
					let vRadio=vRes[0];
					for(let i=0; i<vRadio.length; ++i){
						let b=vRadio[i];
						if(b){
							t=vMimeTypes0[i];
							logd('Specified MimeType: <' + t + '> at <' + _cur_focus() + '>');
							break;
						}
					}
				}else{
					bCancelled=true;
				}

			}else{

				//2021.4.27 for default Paste (Cmd+V), auto-select a preferred mime-type to paste;
				if(vMimeTypes0.length===1){

					t=vMimeTypes0[0];
					logd('Only one MimeType: <' + t + '> for <' + _cur_focus() + '>');

				}else if(vMimeTypes0.length>1){

					let _prefer=(vPrefs)=>{
						for(let t of vPrefs){
							if(vMimeTypes0.indexOf(t)>=0){
								logd('Auto-selected MimeType: <' + t + '> for <' + _cur_focus() + '>');
								return t;
							}
						}
					};

					t=_prefer(_supported_mimetypes());
				}

			}

			return t;
		};

		let t=_determine_mimetype();
		if(t){

			localStorage.setItem(sCfgKey1, t);

			let _anchor_link=(sHref, sLabel, sTitle, bMd)=>{
				if(bMd){
					return '[%sLabel%](%sHref% "%sTitle%")'
					.replace(/%sLabel%/gi, esc$(sLabel).replace(/[\[\]]+/g, ''))
					.replace(/%sHref%/gi, esc$(sHref).replace(/\s/g, '%20'))
					.replace(/%sTitle%/gi, esc$(sTitle).replace(/["]+/g, ''))
					;
				}else{
					return '<a href="%sHref%" title="%sTitle%">%sLabel%</a>'
					.replace(/%sHref%/gi, esc$(sHref).replace(/["]+/g, ''))
					.replace(/%sTitle%/gi, esc$(sTitle).replace(/["]+/g, ''))
					.replace(/%sLabel%/gi, platform.htmlEncode(esc$(sLabel)))
					;
				}
			};

			let _image_link=(sSrc, sAlt, sTitle, bMd, w, h)=>{

				//2021.9.13 consider of local image source files containing relative path variables,
				//e.g. "${HOME}/temp/123.jpg", that will be assumed relative to the current ssg-path,
				//obviously a leading forward-slash character is required for web contents to use the image file;
				if( (/^\$\{[\w\d]{1,64}\}\/.+/i).test(sSrc) ){
					sSrc='/' + sSrc;
				}

				if(bMd && typeof(w)==='undefined' && typeof(h)==='undefined'){ //(w<=0 || h<=0)
					return '![%sAlt%](%sSrc% "%sTitle%")'
					.replace(/%sAlt%/gi, esc$(sAlt).replace(/[\[\]]+/g, ''))
					.replace(/%sSrc%/gi, esc$(sSrc).replace(/\s/g, '%20'))
					.replace(/%sTitle%/gi, esc$(sTitle).replace(/["]+/g, ''))
				}else{
					let x='', y='';

					if(typeof(w)==='string') x='width="' + w + '"'; else if(parseInt(w)>0) x='width="' + parseInt(w) + '"'; //2022.1.21 RichEdit doesn't accept units e.g. "px"
					if(typeof(h)==='string') y='height="' + h + '"'; else if(parseInt(h)>0) y='height="' + parseInt(h) + '"';

					return '<img src="%sSrc%" alt="%sAlt%" title="%sTitle%" %sAttrWidth% %sAttrHeight%/>'
						.replace(/%sAttrWidth%/gi, x)
						.replace(/%sAttrHeight%/gi, y)
						.replace(/%sSrc%/gi, esc$(sSrc).replace(/["]+/g, ''))
						.replace(/%sAlt%/gi, esc$(sAlt).replace(/["]+/g, ''))
						.replace(/%sTitle%/gi, esc$(sTitle).replace(/["]+/g, ''))
						;
				}
			};

			let _to_dataurl=(ba, fmt)=>{
				return "data:image/%sFmt%;base64,%sCode%".replace(/%sFmt%/gi, fmt||sImgFmt0||'png').replace(/%sCode%/gi, ba.toBase64());
			};

			let _base64image_link=(ba, w, h)=>{
				let u=_to_dataurl(ba);
				return _image_link(u, '', '', false, w, h);
			};

			let _uri_list=(vUris, bMd)=>{
				let v=[];
				for(let u0 of vUris){
					//file:///....
					//nyf://entry?dbfile=/Users/wjj/temp/mybase_4.nyf&itemid=1&itemtext=TITLE%20TEXT
					//nyf://entry?dbfile=/Users/wjj/temp/mybase_4.nyf&itemid=1&file=FILENAME.PDF
					//u0=trim(u0||'').replace(/\s/g, '%20');
					if(u0){
						//2021.4.27 non-ascii characters in URIs may be supplied in percent-decoding;
						let u=percentDecode(u0), sLabel=u, sTitle=sLabel;
						if( /^file:\/\/(.+)$/.test(u) ){
							sLabel=u.replace(/^(.+?)(\?[^?]+)$/, '$1').replace(/^(.*?)\/([^\/\\]+)$/, '$2')||u;
							sTitle=sLabel;
						}else if( /^nyf:\/\/entry\?(.+)$/.test(u) ){
							let p=xNyf.parseNyfHyperlink(u);
							if(p){
								//2021.4.26 priority: labels > attachments > infoitems;
								sLabel=p['labelpath']||p['file']||p['itemtext']||p['dbname']||p['dbfile']||u;
								sTitle=sLabel;
								let sDbFile=p['dbfile']||p['dbname'];
								if(sDbFile && sTitle.indexOf(sDbFile)<0){
									sTitle+= ' @ ' + sDbFile;
								}
							}
						}
						v.push(_anchor_link(u0, sLabel, sTitle, bMd));
					}
				}
				let s='';
				if(v.length>0){
					if(bMd){
						if(v.length>1) v.push(''); //to produce a trailing <br>
						s=v.join('<br>\n');
					}else{
						if(v.length===1){
							s='<span>&nbsp;</span>' + v[0] + '<span>&nbsp;</span>';
						}else{
							s='<div>' + v.join('</div>\n<div>') + '</div>\n';
						}
					}
				}
				return s;
			};

			let _localfile_list=(vFiles, bMd)=>{
				//make local filenames into a list of uris;
				let vUris=[];
				for(let fn of vFiles){
					if(0){
						t=t.replace(/\\/g, '/');
						let p='file://'; if( !(/^[/]/).test(fn) ) p+='/';
						vUris.push(p + percentEncode(fn, '/'));
					}else{
						//2021.5.7 attempts to apply relative path variables;
						let u=xNyf.makeFileLinkWithRelativePath(fn);
						if(u) vUris.push(u);
					}
				}
				return _uri_list(vUris, bMd);
			};

			let _prompt_image_storage=(ba)=>{
				let img=new CImage();
				if(img.load(ba) && img.width()>0 && img.height()>0){

					if(1){
						//2022.1.7 large image may be shrinked to fit the view port, in order to get exact size of content view, the Relation Pane should first open up before pasting;
						ui.setRelationPaneVisible(-1, true);
						ui.showProgressMsg("", true); //true: non-blocking mode for the Relation pane to show up
					}
					let szCurView=ui.getContentViewSize();

					let vOpts=[], vWidth=[], vHeight=[], w0=img.width(), h0=img.height();

					let wView=szCurView.width - nMarginCurView;
					if(richEditFocus()){
						//2022.1.21 For images in Rich text editor to be proportionally resized to fit current view;
						let w=wView, h=Math.floor(h0 * w / w0);
						let d=Math.round(wView / w0 * 1000)/10;
						vWidth.push(w);
						vHeight.push(-1);
						let sTmp;
						if(w0>=wView){
							sTmp=_lc2('ShrinkToFit', 'Shrink to fit current view size');
						}else{
							sTmp=_lc2('EnlargeToFit', 'Enlarge to fit current view size');
						}
						sTmp+=(': ' + '( ' + w + ' x ' + h + ' ) ' + d + '%');
						vOpts.push(sTmp);
					}

					let xNoteContainer;
					if(htmlEditFocus() || (plainEditFocus() && _is_markdown_doc())){
						//2022.1.21 Rich text editor doesn't proportionally resize images;
						for(let i=0; i<20; ++i){
							let w=(i+1) * 5;
							vWidth.push(w + '%');
							vHeight.push(-1);
							let sTmp=_lc2('DynamicWidth', 'Dynamic width: %nPercWidth% of the container size').replace(/%nPercWidth%/g, (w+'%'));
							vOpts.push(sTmp);
						}
						xNoteContainer={sField: 'label', sText: _lc2('Note.ContainerSize', 'The container size is usually same as the Html content view size and may vary when the splitter moves. Note that the container may also have a constrained/fixed size larger or smaller than the view size, e.g. when pasting images within a captured web snippet from other website.'), bWordwrap: true};
					}

					for(let i=0; i<40; ++i){
						let d=5*(i+1);
						let w=Math.floor(w0*d/100), h=Math.floor(h0*d/100);
						vWidth.push(w);
						vHeight.push(-1);
						let sTmp=_lc2('FixedWidth', 'Fixed width: %nPercWidth% of natural size ( %nNaturalSize% )')
						.replace(/%nPercWidth%/g, (d+'%'))
						.replace(/%nNaturalSize%/g, (w0 + ' x ' + h0))
						;
						if(d===50){
							sTmp+=' ('+_lc2('Half', 'Half')+')';
							if(iSelImgDim0<0 && nDevPixRatio>1.5) iSelImgDim0=i; //defaults to 50% on MacBook Retina 2x displays;
						}else if(d===100){
							vWidth[vWidth.length-1]=-1; //2022.1.21 defaults to natural width;
							sTmp+=' ('+_lc2('Natural', 'Natural')+')';
							if(iSelImgDim0<0) iSelImgDim0=i; //for other displays defaults to 100% at the first time pasting images;
						}else if(d===200){
							sTmp+=' ('+_lc2('Double', 'Double')+')';
						}
						vOpts.push(sTmp);
					}

					for(let i=0; i<50; ++i){
						let w=20*(i+1);
						let d=Math.floor(w*100.0/w0), h=Math.floor(h0*d/100);
						vWidth.push(w);
						vHeight.push(-1);
						let sTmp=_lc2('FixedSize', 'Fixed size') + ': ' + w + ' x ' + h + ' ( ' + d + '% )';
						vOpts.push(sTmp);
					}

					for(let i=0; i<64; ++i){
						let w=16*(i+1), h=w;
						vWidth.push(w);
						vHeight.push(h);
						let sTmp=_lc2('FixedSize', 'Fixed size') + ': ' + w + ' x ' + h;
						vOpts.push(sTmp);
					}

					for(let i=0; i<50; ++i){
						let w=20*(i+1), h=w;
						vWidth.push(w);
						vHeight.push(h);
						let sTmp=_lc2('FixedSize', 'Fixed size') + ': ' + w + ' x ' + h;
						vOpts.push(sTmp);
					}

					if(sSaveImgAs0.search(/^(base64|attachment)$/i)<0) sSaveImgAs0='base64'; //defaults to base64;
					let vSaveAs=[(sSaveImgAs0==='base64' ? 'true' : '') + '|' + _lc2('ImageBase64', 'Data:image/png;base64, fully embedding into contents')
						    , ''
						    , (sSaveImgAs0==='attachment' ? 'true' : '') + '|' + _lc2('ImageAttachment', 'Attachment, with a link put into contents')
					];

					let vFields = [
						{sField: 'radio', sLabel: _lc2('SaveImgAs', 'Save clip image data ( %sImgInfo% ) as:').replace(/%sImgInfo%/gi, _img_dimension_info(img)), vItems: vSaveAs, bReq: true}
						, {sField: "combolist", sLabel: _lc2('SizeToDisplay', 'Display size:'), vItems: vOpts, iInit: iSelImgDim0, bReq: true}
						, {sField: 'label', sText: _lc2('CurViewSize', 'Current content view size is ( %sViewSize% ) including margins.').replace(/%sViewSize%/gi, (szCurView.width + ' x ' + szCurView.height)), bWordwrap: true}
					];

					if(htmlEditFocus() || (plainEditFocus() && _is_markdown_doc())){
						vFields.push({sField: 'label', sText: _lc2('Note.ZoomLevel', 'Display size of images may be affected by the content zoom level. To have a normal display size, you may want first to reset the zoom level by selecting the [View - Content - Zoom reset] menu item or pressing Ctrl/Command+0 before pasting images.'), bWordwrap: true});
					}

					if(xNoteContainer) vFields.push(xNoteContainer);

					if(isMac()){
						vFields.push({sField: 'label', sText: _lc2('Note.MacRetina', 'On macOS with Retina displays, natural dimensions of screenshots are always at 2x so you may want to paste at half (50%) for a normal display size or choose to fit the content view.'), bWordwrap: true});
					}

					if(htmlEditFocus() || (plainEditFocus() && _is_markdown_doc())){
						vFields.push({sField: 'label', sText: _lc2('Note.MaxWidth', 'For Html contents, display size of images may be constrained by the CSS attribute max-width, that is customizable in Options/Preferences - Format - Html contents.'), bWordwrap: true});
					}

					img.clear();

					let vRes=input(plugin.getScriptTitle(), vFields, {nMinSize: 600, vMargins: [6, 0, 30, 0], bVert: true});
					if(vRes && vRes.length>=2){
						let vStg=vRes[0], iDispSize=vRes[1], r={stg: '', w: 0, h: 0};
						if(vStg[0]) r.stg='base64'; else if(vStg[1]) r.stg='attachment';
						if(iDispSize>=0){r.w=vWidth[iDispSize]; r.h=vHeight[iDispSize];}
						localStorage.setItem(sCfgKey2, r.stg);
						localStorage.setItem(sCfgKey3, iDispSize);
						return r;
					}
				}else{
					alert('Invalid image data supplied.');
				}
			};

			let _import_files=(vFiles)=>{
				if(vFiles && vFiles.length>0){
					let sPasteAs='';
					if(1){
						if( !(/^(attachments|shortcuts)$/i).test(sPasteFilesAs0) ) sPasteFilesAs0='attachments'; //defaults to attachments;
						let vTypes=[ ((/^attachments$/i).test(sPasteFilesAs0) ? 'true' : 'false') + '|' + _lc2('SaveAsAttachments', 'Attachments, with whole files added')
							    , ''
							    , ((/^shortcuts$/i).test(sPasteFilesAs0) ? 'true' : 'false') + '|' + _lc2('SaveAsShortcuts', 'Shortcuts, with only file links added')
						];

						let vFields = [
							{sField: 'radio', sLabel: _lc2('PasteFilesAs', 'Paste local files as:'), vItems: vTypes}
						];

						let vAns=input(plugin.getScriptTitle(), vFields, {nMinSize: 350, vMargins: [6, 0, 30, 0], bVert: true});
						if(vAns && vAns.length>=1){
							let v=vAns[0], r='';
							if(v[0]){sPasteAs='attachments';}
							else if(v[1]){sPasteAs='shortcuts';}
							localStorage.setItem(sCfgKey4, sPasteAs);
						}
					}

					let _prompt_overwrite=(sSsgFn)=>{
						let bProceed=true;
						if(xNyf.entryExists(sSsgFn)){
							if(!confirm(_lc2('Overwrite', 'Attachment file already exists; Overwrite it?') + '\n\n' + new CLocalFile(sSsgFn).getLeafName())){
								bProceed=false;
							}
						}
						return bProceed;
					};

					let vRes=[];
					if( (/^shortcuts$/i).test(sPasteAs) ){
						for(let s of vFiles){
							let sSsgName=new CLocalFile(s).getLeafName();
							if(sSsgName){
								let xSsgFn=new CLocalFile(sCurSsgPath, sSsgName);
								if(_prompt_overwrite(xSsgFn.toStr())){
									let u=xNyf.makeFileLinkWithRelativePath(s);
									if(xNyf.createShortcut(xSsgFn.toStr(), u)){
										vRes.push(sSsgName);
									}
								}
							}
						}
					}else if( (/^attachments$/i).test(sPasteAs) ){
						for(let s of vFiles){
							let sSsgName=new CLocalFile(s).getLeafName();
							if(sSsgName){
								let xSsgFn=new CLocalFile(sCurSsgPath, sSsgName);
								if(_prompt_overwrite(xSsgFn.toStr())){
									if(xNyf.createFile(xSsgFn.toStr(), s, true)>0){
										vRes.push(sSsgName);
									}
								}
							}
						}
					}else{
						; //ignore
					}

					if(vRes.length>0) ui.refreshRelationPane(-1, sCurSsgPath);
				}
			};

			let _save_text=(s, t)=>{
				let bProceed=true;
				if(a_bPromptOnPasteToNewAttachment){
					let sMsg=isHtml(t) ? _lc2('NewHtmlFile', 'Saving the Html text content as a single attachment file; Proceed?')
							   : _lc2('NewTextFile', 'Saving the plain text content as a single attachment file; Proceed?');
					bProceed=confirm(sMsg
							 + '\n\n' + _lc2('ClipData', 'Clip data') + ': ' + xNamedTypes[t]
							 + '\n\n' + ellipsis(s, 256)
							 );
				}
				if(bProceed){
					let sSsgName=xNyf.getUniqueSsgFileName(sCurSsgPath, 'clip.' + (isHtml(t)?'html':'txt'));
					if(sSsgName){
						let xSsgFn=new CLocalFile(sCurSsgPath, sSsgName);
						if(xNyf.saveUtf8(xSsgFn.toStr(), s, true, true)>=0){
							ui.refreshRelationPane(-1, sCurSsgPath);
							return sSsgName;
						}
					}
				}
			};

			let _save_rtf=(s)=>{
				let bProceed=true; s=platform.convertRtfToHtml(s);
				if(a_bPromptOnPasteToNewAttachment){
					bProceed=confirm(_lc2('NewRtfFile', 'Saving the RTF text content as a single attachment file; Proceed?') + '\n\n' + ellipsis(s, 256));
				}
				if(bProceed){
					let sSsgName=xNyf.getUniqueSsgFileName(sCurSsgPath, 'clip.' + 'html');
					if(sSsgName){
						let xSsgFn=new CLocalFile(sCurSsgPath, sSsgName);
						if(xNyf.saveUtf8(xSsgFn.toStr(), s, true, true)>=0){
							ui.refreshRelationPane(-1, sCurSsgPath);
							return sSsgName;
						}
					}
				}
			};

			let _save_image_binary=(ba, t)=>{
				let bProceed=true;
				if(a_bPromptOnPasteToNewImgFile){
					bProceed=confirm(_lc2('NewImgFile', 'Saving the image data as a single attachment file; Proceed?') + '\n\n' + _img_dimension_info(ba));
				}
				if(bProceed){
					t=t||'png'; if((/svg\+xml/i).test(t)) t='svg';
					let sSsgName=xNyf.getUniqueSsgFileName(sCurSsgPath, 'clip.' + t);
					if(sSsgName){
						let xSsgFn=new CLocalFile(sCurSsgPath, sSsgName);
						if(xNyf.saveBytes(xSsgFn.toStr(), ba, true)>=0){
							ui.refreshRelationPane(-1, sCurSsgPath);
							return sSsgName;
						}
					}
				}
			};

			let _save_image_dataurl=(u)=>{
				//2021.6.2 consider of SVG: data:image/svg+xml;base64,iVBORw0KGgo...
				let m=(u||'').match(/^data:image\/([0-9a-z+]{2,16});base64,(.+)$/i);
				if(m){
					let t=m[1].split('+')[0], ba=new CByteArray(m[2], 'base64');
					if(t && ba){
						_save_image_binary(ba, t);
					}
				}
			};

			let _copy_infoitems=(vItems)=>{
				if(vItems){
					let x, vDispInfo=[];
					for(x of vItems){
						let sDbFile=x['dbfile'], sItemPath=x['itempath'], nItemID=x['itemid'], sItemText=x['itemtext'], u=x['uri'], xDb=x['db'];
						if(xDb && xDb.isOpen() && sDbFile && sItemPath){ //if(xDb && sDbFile && (sItemPath || nItemID>=0)){
							if(xDb.folderExists(sItemPath)){
								sItemText=xDb.getFolderHint(sItemPath);
								if(xDb!==xNyf || !new CLocalFile(sItemPath).contains(sCurSsgPath)){
									vDispInfo.push(sItemText);
									x['verified']=1;
								}else{
									alert('Cannot paste with the item itself or any of its ancestor items.' + '\n\n' + sItemText);
								}
							}else{
								logd('Item path not found: ' + sItemText);
							}
						}else{
							logd('Invalid item id or path supplied with in the link: ' + u);
						}
					}

					if(vDispInfo.length>0){
						let bProceed=true;
						if(a_bPromptOnPasteToReplicateInfoItems){
							bProceed=confirm(_lc2('ReplicateInfoItems', 'Replicating the info items (including child items if any) under the current item; Proceed?') + '\n\n' + vDispInfo.join('\n'));
						}
						if(bProceed){
							for(x of vItems){
								if(x['verified']){
									let xDbSrc=x['db'], sPathSrc=x['itempath'];
									try{
										ui.initProgressRange(plugin.getScriptTitle(), 0);
										copySsgBranch(xNyf, sCurSsgPath, xDbSrc, sPathSrc, false, function(xDb, sSsgPath){
											let sHint;
											if(xDb.folderExists(sSsgPath)){
												sHint=xDb.getFolderHint(sSsgPath) || '... ...';
											}else if(xDb.fileExists(sSsgPath)){
												let xFn=new CLocalFile(sSsgPath);
												sHint=xFn.getLeafName();
												if(plugin.isReservedNoteFn(sHint)){
													sHint=xDb.getFolderHint(xFn.getDirectory()) || '... ...';
												}
											}
											let bContinue=ui.ctrlProgressBar('Copy: '+sHint, 1, true);
											if(!bContinue) throw 'User abort by Esc.';
										});
									}catch(e){
										alert(e);
									}finally{
										ui.destroyProgressBar();
										ui.refreshOutline(-1, sCurSsgPath);
									}
								}
							}
						}
					}

					for(x of vItems){
						let xDb=x['db'];
						if(xDb && xDb.isOpen()) xDb.close();
					}
				}
			};

			let _apply_labels=(vLabels, vSsgPaths)=>{
				let v1=[], v2=[];
				for(let sLabel of vLabels){
					v1.push('\t' + sLabel);
				}
				for(let sSsgPath of vSsgPaths){
					v2.push('\t' + (xNyf.getFolderHint(sSsgPath)||'... ...'));
				}

				let bProceed=true;
				if(a_bPromptOnPasteToApplyLabels){
					bProceed=confirm(_lc2('ApplyLabels', 'Applying labels to the following info items; Proceed?')
						+ '\n\n' + _lc2('Labels', 'Labels') + ':\n' + v1.join('\n')
						+ '\n\n' + _lc2('InfoItems', 'Info Items') + ':\n' + v2.join('\n')
						);
				}
				if(bProceed){
					let vRefresh=[];
					for(let sLabel of vLabels){
						for(let sSsgPath of vSsgPaths){
							if(xNyf.labelInfoItem(sLabel, sSsgPath)){
								if(vRefresh.indexOf(sSsgPath)<0) vRefresh.push(sSsgPath);
							}else{
								logd('Failed to label info item: ' + sLabel + ' => ' + sSsgPath);
							}
						}
					}
					if(vRefresh.length>0){
						for(let sSsgPath of vRefresh){
							ui.refreshRelationPane(-1, sSsgPath);
						}
						ui.refreshTagResList(-1);
						ui.refreshLabels(-1);
					}
				}
			};

			let _label_infoitems=(vItems)=>{
				if(vLabelItems0.length>0){
					if(vItems && vItems.length>0){
						let vLabels=[], vIgnore=[];
						for(let d of vLabelItems0){
							if(xNyf.getDbFile()===d['dbfile']){
								vLabels.push(d['labelpath']);

							}else{
								vIgnore.push(d['labelpath'] + ' @ ' + d['dbfile']);
								logd('Label item of different database ignored: ' + vIgnore[vIgnore.length-1]);
							}
						}
						if(vLabels.length>0){
							_apply_labels(vLabels, vItems);
						}else{
							alert(_lc2('InvalidLabels', 'Cannot apply the label items of another database.') + '\n\n' + vIgnore.join('\n'));
						}
					}
				}
			};

			let d0=xMimeData[t], bSucc=false;
			if(htmlEditFocus() || richEditFocus()){

				if(isHtml(t) || isPlain(t) || isRtf(t) || isDiskFileList(t) || isUrlList(t) || isInfoItemList(t) || isAttachmentList(t) || isLabelItemList(t)){

					let s=d0, bRich=false, bAutoDownload=false;
					if(isRtf(t)){

						s=platform.convertRtfToHtml(d0.toStr('ANSI'));
						bRich=true;

					}else if(isPlain(t)){

						bRich=false;

					}else if(isHtml(t)){

						bRich=true;
						bAutoDownload=true;

					}else if(isDiskFileList(t)){

						if(0){
							s=_localfile_list(vDiskFiles0, false);
							bRich=true;
						}else{
							//2021.9.13 with in markdown, if all the copied files indicate any of supported image types, consider pasting as images, instead of file links;
							let vImg=[], vOther=[];
							for(let fn0 of vDiskFiles0){
								let fn=xNyf.applyRelativePath(fn0);
								let f=new CLocalFile(fn);
								let sExt=f.getExtension(false), sName=f.getLeafName();
								if( (/^(jpe?g|png|gif|bmp|tiff?|ico|svg|webp)$/i).test(sExt) ){
									let w=0, h=0;
									let img=new CImage();
									if(img.load(fn0) && img.width()>0){
										let szCurView=ui.getContentViewSize(), wView=szCurView.width - nMarginCurView;
										if(img.width()>wView){
											w=wView;
											h=-1; //Math.floor(img.height() * w / img.width());
										}
										img.clear();
									}
									vImg.push(_image_link(fn, sName, sName, false, w, h));
								}else{
									vOther.push(fn);
								}
							}
							if(vOther.length>0){
								//if any non-image files listed, simply insert as local file links;
								s=_localfile_list(vDiskFiles0, false);
							}else{
								s=vImg.join('<br>');
							}
							bRich=true;
						}

					}else if(isUrlList(t)){

						s=_uri_list(vUrls0, false);
						bRich=true;

					}else if(isInfoItemList(t)){

						let v=[]; for(let o of vInfoItems0) v.push(o.uri);
						s=_uri_list(v, false);
						bRich=true;

					}else if(isLabelItemList(t)){

						let v=[]; for(let o of vLabelItems0) v.push(o.uri);
						s=_uri_list(v, false);
						bRich=true;

					}else if(isAttachmentList(t)){

						let v=[]; for(let o of vAttachments0) v.push(o.uri);
						s=_uri_list(v, false); //.replace(/<div>/gi, '<p>').replace(/<\/div>/gi, '<\/p>');;
						bRich=true;

					}

					ui.replaceSelectedText(-1, s, bRich, {bTweaks: true, bDownloadImages: bAutoDownload});
					bSucc=true;

				}else if(isImage(t)){

					let stg=a_sPasteImgIntoHtmlAs, w=0, h=0;
					if(/^(base64|attach|attachments?)$/i.test(stg)){
						//let r=_imgsize(d0);
						//if(r){
						//	w=r.w;
						//	h=r.h;
						//}
					}else{
						let r=_prompt_image_storage(d0);
						if(r && r.stg){
							stg=r.stg;
							w=r.w;
							h=r.h;
						}
						bSucc=true; //2021.5.2 Stop warning message once prompted for image formats, even on Cancelled;
					}
					if(/^(base64)$/i.test(stg)){
						let s=_base64image_link(d0, w, h);
						if(s){
							ui.replaceSelectedText(-1, s, true);
							bSucc=true;
						}
					}else if(/^(attach|attachments?)$/i.test(stg)){
						let sSsgName=_save_image_binary(d0);
						if(sSsgName){
							let s=_image_link(sSsgName, sSsgName, sSsgName, false, w, h);
							ui.replaceSelectedText(-1, s, true , {bTweaks: false
										       , bDownloadImages: false //2021.9.26 No auto-downloading of images;
										       , sPostJs: 'console.debug("Image saved as attachment with a link put into text content. [OK]")'}
									       );
							bSucc=true;
						}
					}

				}else if(isDataImage(t)){

					let v=[];
					for(let u of vDataImages0){
						let s=_image_link(u);
						if(s) v.push(s);
					}
					ui.replaceSelectedText(-1, v.join('\n'), true);
					bSucc=true;
				}

			}else if(plainEditFocus()){

				let bMd=_is_markdown_doc();

				bSucc=true;
				if(isHtml(t)){

					ui.replaceSelectedText(-1, d0, false);

				}else if(isPlain(t)){

					if(bMd){
						let v=d0.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/[\n]{3,}/g, '\n\n').split('\n');
						//if(v.length>1) v.push(''); //make sure to append the trailing <br>
						//ui.replaceSelectedText(-1, v.join('<br>\n'), false);
						ui.replaceSelectedText(-1, v.join('\n'), false);
					}else{
						ui.replaceSelectedText(-1, d0, false);
					}

				}else if(isRtf(t)){

					ui.replaceSelectedText(-1, d0.toStr('ANSI'), false);

				}else if(isImage(t)){

					if(bMd){
						let stg=a_sPasteImgIntoMdAs, w=0, h=0;
						if(/^(base64|attach|attachments?)$/i.test(stg)){
							//let r=_imgsize(d0);
							//if(r){
							//	w=r.w;
							//	h=r.h;
							//}
						}else{
							let r=_prompt_image_storage(d0);
							if(r && r.stg){
								stg=r.stg;
								w=r.w;
								h=r.h;
							}
						}
						if(/^(base64)$/i.test(stg)){
							let s=_base64image_link(d0, w, h);
							if(s){
								ui.replaceSelectedText(-1, s, false);
							}
						}else if(/^(attach|attachments?)$/i.test(stg)){
							let sSsgName=_save_image_binary(d0);
							if(sSsgName){
								let s=_image_link(sSsgName, sSsgName, sSsgName, true, w, h);
								ui.replaceSelectedText(-1, s, false);
							}
						}

					}else{

						let s=_to_dataurl(d0); //_base64image_link(d0);
						if(s){
							ui.replaceSelectedText(-1, s, false);
						}
					}

				}else if(isDataImage(t)){

					if(bMd){
						let v=[];
						for(let u of vDataImages0){
							let s=_image_link(u);
							if(s) v.push(s);
						}
						ui.replaceSelectedText(-1, v.join('\n'), false);
					}else{
						ui.replaceSelectedText(-1, vDataImages0.join('\n'), false);
					}

				}else if(isDiskFileList(t)){
					if(0){
						let s=bMd ? _localfile_list(vDiskFiles0, true) : vDiskFiles0.join('\n');
						ui.replaceSelectedText(-1, s, false);
					}else{
						if(bMd){
							//2021.9.13 with in markdown, if all the copied files indicate any of supported image types, consider pasting as images, instead of file links;
							let vImg=[], vOther=[];
							for(let fn of vDiskFiles0){
								fn=xNyf.applyRelativePath(fn);
								let f=new CLocalFile(fn);
								let sExt=f.getExtension(false), sName=f.getLeafName();
								if( (/^(jpe?g|png|gif|bmp|tiff?|ico|svg|webp)$/i).test(sExt) ){
									vImg.push(_image_link(fn, sName, sName, true));
								}else{
									vOther.push(fn);
								}
							}
							let s;
							if(vOther.length>0){
								//if any non-image files listed, insert as file links;
								s=_localfile_list(vDiskFiles0, true);
							}else{
								s=vImg.join('<br>');
							}
							ui.replaceSelectedText(-1, s, false);
						}else{
							//with random plain text contents, simply insert the file paths;
							let s=vDiskFiles0.join('\n');
							ui.replaceSelectedText(-1, s, false);
						}
					}

				}else if(isUrlList(t)){

					let s=bMd ? _uri_list(vUrls0, true) : vUrls0.join('\n');
					ui.replaceSelectedText(-1, s, false);

				}else if(isInfoItemList(t)){

					let v=[]; for(let o of vInfoItems0) v.push(o.uri);
					let s=bMd ? _uri_list(v, true) : v.join('\n');
					ui.replaceSelectedText(-1, s, false);

				}else if(isLabelItemList(t)){

					let v=[]; for(let o of vLabelItems0) v.push(o.uri);
					let s=bMd ? _uri_list(v, true) : v.join('\n');
					ui.replaceSelectedText(-1, s, false);

				}else if(isAttachmentList(t)){

					let v=[]; for(let o of vAttachments0) v.push(o.uri);
					let s=bMd ? _uri_list(v, true) : v.join('\n');
					ui.replaceSelectedText(-1, s, false);

				}else{
					bSucc=false;
				}

			}else if(relationFocus()){

				bSucc=true;
				if(isHtml(t)){
					_save_text(d0, sMimeTypeHtml);
				}else if(isPlain(t)){
					_save_text(d0, sMimeTypePlain);
				}else if(isRtf(t)){
					_save_rtf(d0.toStr('ANSI'));
				}else if(isImage(t)){
					_save_image_binary(d0);
				}else if(isDataImage(t)){
					for(let u of vDataImages0){
						//data:image/png;base64,iVBORw0KGgo...
						_save_image_dataurl(u);
					}
				}else if(isDiskFileList(t)){
					if(vDiskFiles0.length>0){
						_import_files(vDiskFiles0);
					}
				}else if(isAttachmentList(t)){
					if(vAttachments0.length>0){
						//alert('Pasting attachments in the relation pane is currently not supported.');
						bSucc=false;
					}
				}else if(isLabelItemList(t)){
					//if(vLabelItems0.length>0){
					//	let vLabels=[]; for(let d of vLabelItems0) if(xNyf.getDbFile()===d['dbfile']) vLabels.push(d['labelpath']); else logd('Label item from another database ignored: ' + d['labelpath'] + ' @ ' + d['dbfile']);
					//	if(vLabels.length>0) _apply_labels(vLabels, [sCurSsgPath]); else alert('No label applicable to the current database.');
					//}
					if(vLabelItems0.length>0){
						_label_infoitems([sCurSsgPath]);
					}
				}else{
					bSucc=false;
				}

			}else if(outlineFocus()){

				bSucc=true;
				if(isHtml(t)){
					_save_text(d0, sMimeTypeHtml);
				}else if(isPlain(t)){
					_save_text(d0, sMimeTypePlain);
				}else if(isRtf(t)){
					_save_rtf(d0.toStr('ANSI'));
				}else if(isImage(t)){
					_save_image_binary(d0);
				}else if(isDataImage(t)){
					for(let u of vDataImages0){
						//data:image/png;base64,iVBORw0KGgo...
						_save_image_dataurl(u);
					}
				}else if(isInfoItemList(t)){
					if(vInfoItems0.length>0){
						_copy_infoitems(vInfoItems0);
					}
				}else if(isLabelItemList(t)){
					//if(vLabelItems0.length>0){
					//	let vSel=ui.getSelectedInfoItems(-1);
					//	if(vSel && vSel.length>0){
					//		let vLabels=[]; for(let d of vLabelItems0) if(xNyf.getDbFile()===d['dbfile']) vLabels.push(d['labelpath']); else logd('Label item from another database ignored: ' + d['labelpath'] + ' @ ' + d['dbfile']);
					//		if(vLabels.length>0) _apply_labels(vLabels, vSel); else alert('No label applicable to the current database.');
					//	}
					//}
					if(vLabelItems0.length>0){
						_label_infoitems(ui.getSelectedInfoItems(-1));
					}
				}else if(isDiskFileList(t)){
					if(vDiskFiles0.length>0){
						_import_files(vDiskFiles0);
					}
				}else{
					bSucc=false;
				}

			}else if(labelsFocus()){

				if(isInfoItemList(t)){
					if(vInfoItems0.length>0){
						let sCurLabel=ui.getCurLabelItem(-1);
						if(sCurLabel){
							let vSsgPaths=[];
							for(let d of vInfoItems0){
								let sDbFn=d['dbfile'], sSsgPath=d['itempath'];
								if(sDbFn===xNyf.getDbFile()){
									if(sSsgPath){
										vSsgPaths.push(sSsgPath);
									}
								}
							}
							if(vSsgPaths.length>0){
								_apply_labels([sCurLabel], vSsgPaths);
								bSucc=true;
							}
						}
					}
				}

			}else if(searchResFocus()){

				if(isInfoItemList(t)){

					ui.beginUpdateResultsList();
					for(let d of vInfoItems0){
						let sDbFn=d['dbfile'], sSsgPath=d['itempath'], sSsgName=d['ssgname'];
						if(sSsgPath){
							ui.appendToResults(sDbFn, sSsgPath, sSsgName);
						}
					}
					ui.endUpdateResultsList();
					bSucc=true;

				}else if(isAttachmentList(t)){

					ui.beginUpdateResultsList();
					for(let d of vAttachments0){
						let sDbFn=d['dbfile'], sSsgPath=d['itempath'], sSsgName=d['ssgname'];
						if(sSsgPath){
							ui.appendToResults(sDbFn, sSsgPath, sSsgName);
						}
					}
					ui.endUpdateResultsList();
					bSucc=true;

				}

			}

			if(!bSucc){
				alert(_lc2('Inapplicable', 'The specified clip data is not applicable to the current input focus.')
				      + '\n\n' + _lc2('ClipData', 'Clip data') + ': ' + '\n' + '\t' + xNamedTypes[t]
				      + '\n\n' + _lc2('InputFocus', 'Input focus') + ': ' + '\n' + '\t' + _cur_focus()
				      , 'warning');
			}

		}else{
			if(!bCancelled){
				let v=[];
				for(let t in xNamedTypes){
					v.push('\t' + xNamedTypes[t]);
				}
				alert(_lc2('NoClipData', 'No clip data applicable to the current input focus')
				      + '\n\n' + _lc2('ClipData', 'Clip data') + ':' + '\n' + v.join('\n')
				      + '\n\n' + _lc2('InputFocus', 'Input focus') + ':' + '\n' + '\t' + _cur_focus()
				      , 'warning');
			}
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'), 'error');
	}

//}catch(e){
//	ui.destroyProgressBar();
//	alert(e);
//}
