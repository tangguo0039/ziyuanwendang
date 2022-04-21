
/////////////////////////////////////////////////////////////////////
// Essential scripts for Mybase Desktop v8.x
// Copyright 2010-2021 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

dom={

	extend: function(o, oName){
		utils.extend(this, o, 'dom', oName);
	}

	, useQwe: ()=>{return typeof(g_xWebChannel)!=='undefined';} //2021.7.15 QtWebEngine uses 'g_xWebChannel', but not for QtWebKit;

	, bUseTocJs: false
	, sTocCaption: ''

	, init: function(){

		//console.debug(navigator.userAgent + ' (Linux=' + utils.isLinux() + '; MacOS=' + utils.isMac() + ' Windows=' + utils.isWin() + ')');
		//console.debug('******** devicePixelRatio=' + window.devicePixelRatio);

		//document.addEventListener('mousedown', function(e){
			//console.debug("<mousedown> elm=" + e.target.nodeName + ' btn=' + e.button);
		//});

		document.addEventListener('mouseup', function(e){
			//console.debug("<mouseup> elm=" + e.target.nodeName + ' btn=' + e.button);
			//http://www.w3school.com.cn/jsref/event_button.asp
			//e.button: 0: left; 1: middle; 2: right
			if(dom.useQwe() && dom.isContentEditable() && e.button===0 && dom.hasSelection()){
				nyf.isFormatBrushActive(function(bActive){
					if(bActive){
						nyf.applyFormatBrush();
					}
				});
			}
		});

		document.addEventListener('mouseleave', function(e){
			//console.debug("<mouseleave> elm=" + e.target.nodeName);
			nyf.showTemporaryStatus('', 0);
		});

		document.addEventListener('mouseover', function(e){
			//console.debug("<mouseover> elm=" + e.target.nodeName);
			let xElm=e.target; if(!xElm) return;
			let bImg=(xElm.nodeName.toLowerCase()==='img'), bThread=dom.isThreadElement(xElm), xA=dom.seekOuterElementByName(xElm, 'a'), sType='', sHint='', vInfo=[];
			if(xA){
				sType='Link';
				//2021.9.3 use decodeURI instead of unescape which doesn't support UTF-8
				sHint=decodeURI(xA.getAttribute('href')||xA.href||'');
				if(/^nyf:\/\/internal-command/i.test(sHint)){
					//2020.1.4 consider of empty info items with custom document format page shown;
					sType=sHint='';
				}else if(/^#[^#]+$/i.test(sHint)){
					//2020.1.4 consider of <a href='#fragment'>
					sType='Anchor';
				}
				let s=sHint; if(sType) s=sType + ': ' + sHint;
				if(s) vInfo.push(s);
			}

			if(bImg){
				let sSrc=decodeURI(xElm.getAttribute('src')||xElm.src||'');
				if(sSrc.search(/^nyf:\/\/[0-9a-f]{6,16}.dbptr\//i)===0){
					sSrc=sSrc.replace(/^.+\/([^/]+)$/, '$1');
				}
				if(utils.isImageDataUrl(sSrc)){
					sSrc=utils.ellipsis(sSrc, 32);
				}else{
					//sSrc=utils.ellipsis(sSrc, 256);
				}
				sHint=sSrc + '  ' + xElm.width + 'x' + xElm.height + '';
				if(xElm.naturalWidth!==xElm.width || xElm.naturalHeight!==xElm.height){
					sHint+='  @ ' + xElm.naturalWidth + 'x' + xElm.naturalHeight ;
				}
				sType='<img>';
				let s=sHint; if(sType) s=sType + ': ' + sHint;
				if(s) vInfo.push(s);
			}

			if(bThread){
				let s=xElm.innerText||'';
				if(s){
					//vInfo.push('Thread: [[ ' + s + ' ]]');
					vInfo.push('Thread: ' + s + '');
				}
			}

			if(vInfo.length>0) nyf.showTemporaryStatus(vInfo.join('  '), 5000);
		});

		document.addEventListener('wheel', function(e){
			//console.debug("<wheel> delta=" + e.deltaX + ', ' + e.deltaY);
			nyf.setFocus();
		});

		let _is_keycode=(e, k)=>{
			if(typeof(k)==='string' && k.length>0) k=k.charCodeAt(0); if(typeof(k)!='number') return false;
			return e.keyCode===k;
		};

		let _is_key=(e, k)=>{
			if(typeof(k)==='string' && k.length>0) k=k.charCodeAt(0); if(typeof(k)!='number') return false;
			return !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey && e.keyCode===k;
		};

		let _is_ctrl_key=(e, k)=>{
			if(typeof(k)==='string' && k.length>0) k=k.charCodeAt(0); if(typeof(k)!='number') return false;
			if(utils.isMac()) return !e.ctrlKey && !e.shiftKey && !e.altKey && e.metaKey && e.keyCode===k;
			else return e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey && e.keyCode===k;
		};

		let _is_ctrl_shift_key=(e, k)=>{
			if(typeof(k)==='string' && k.length>0) k=k.charCodeAt(0); if(typeof(k)!='number') return false;
			if(utils.isMac()) return !e.ctrlKey && e.shiftKey && !e.altKey && e.metaKey && e.keyCode===k;
			else return e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey && e.keyCode===k;
		};

		let _is_shift_key=(e, k)=>{
			if(typeof(k)==='string' && k.length>0) k=k.charCodeAt(0); if(typeof(k)!='number') return false;
			return !e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey && e.keyCode===k;
		};

		let _char_in_range=(e, k1, k2)=>{
			if(typeof(k1)==='string' && k1.length>0) k1=k1.charCodeAt(0); if(typeof(k1)!='number') return false;
			if(typeof(k2)==='string' && k2.length>0) k2=k2.charCodeAt(0); if(typeof(k2)!='number') return false;
			return !e.ctrlKey && !e.altKey && !e.metaKey && e.keyCode>=k1 && e.keyCode<=k2; // && !e.shiftKey
		};

		let _is_alpha=(e)=>{return _char_in_range(e, kbd.KEY_A, kbd.KEY_Z);};
		let _is_num=(e)=>{return _char_in_range(e, kbd.KEY_0, kbd.KEY_9);};
		let _is_alphanum=(e)=>{return _is_alpha(e) || _is_num(e);};

		let _is_char_input=function(e){
			return _is_key(e, kbd.KEY_TAB)							//Tab without Shift
					|| _char_in_range(e, kbd.KEY_BACKSPACE, kbd.KEY_BACKSPACE)	//(Shift+) Backspace
					|| _char_in_range(e, kbd.KEY_DELETE, kbd.KEY_DELETE)		//(Shift+) Delete
					|| _char_in_range(e, kbd.KEY_ENTER, kbd.KEY_ENTER)		//(Shift+) Enter
					|| _char_in_range(e, kbd.KEY_SPACE, kbd.KEY_SPACE)		//(Shift+) Spacebar
					|| _char_in_range(e, kbd.KEY_0, kbd.KEY_9)			//(Shift+) 0 ~ 9
					|| _char_in_range(e, kbd.KEY_A, kbd.KEY_Z)			//(Shift+) a ~ z
					|| _char_in_range(e, 96, 111)					//(Shift+) KP_0 ~ 9, * + Enter - . /
					|| _char_in_range(e, 186, 192)					//(Shift+) ; = , - . / `
					|| _char_in_range(e, 219, 222)					//(Shift+) [ \ ] '
			;
		};

		let _on_caret_moved=()=>{
			//console.debug("<_on_caret_moved> sel=" + utils.ellipsis((dom.getSelRange()||'').toString().replace(/\s+/g, ' '), 90));

			//2019.2.14 when clicking or press arrow-keys in DOM, notify app of the current character formatting;
			dom.cacheSelectionInfo();

			if(dom.useQwe()){
				if(!dom.hasSelection()){
					//2019.4.6 notify app to update button-state for current selection (e.g. font name/size);
					nyf.notifyCaretMoved();
				}
			}else{
				//2021.11.12 make sure the fontFamily/Size list are updated immediately;
				nyf.notifyCaretMoved();
			}
		};

		document.addEventListener('click', function(e){
			//console.debug("<clicked> elm=" + e.target.nodeName);
			nyf.setFocus(); //2019.2.14 for QtWebEngine to update info on status bar;
			//2019.1.15 notify the app that the caret position is changed in qtwebengine/webkit;
			_on_caret_moved();
		});

		document.addEventListener('selectionchange', function(e){
			//console.debug("<selChanged> sel=" + document.getSelection() + ", bSel=" + dom.hasSelection());
			//2021.11.12 notify the app that the caret position is changed in qtwebengine/webkit;
			_on_caret_moved();
		});

		document.addEventListener('dblclick', function(e){
			console.debug("<dblclick> @elm=" + e.target.nodeName);
			if(e.target && e.target.nodeName.toLowerCase()==='img'){
				let r=document.createRange(); //r.cloneRange();
				r.selectNode(e.target);
				var xSel=window.getSelection();
				xSel.removeAllRanges();
				xSel.addRange(r);
				dom.cacheSelectionInfo();
				dom.cacheImageInContext(e.target);
				if(dom.isContentEditable()){
					setTimeout(function(){
						nyf.resizeImage();
					}, 50);
				}
			}
		});

		//QWebengineView does not receive any shortcut key events that have been handled by chromium;
		//https://codereview.qt-project.org/#/c/104901/
		//Workaround: managed to handle the shortcut keys from in DOM;
		document.addEventListener('keydown', function(e){

			let bEditable=dom.isContentEditable(), bDone=false;

			//console.debug("<keydown> elm=" + e.target.nodeName + ' ctrl=' + e.ctrlKey + ' shift=' + e.shiftKey + ' alt=' + e.altKey + ' meta=' + e.metaKey + ' key=' + e.keyCode + ' bEditable=' + bEditable); if(_is_alphanum(e)) console.debug('char=' + String.fromCharCode(e.keyCode));

			if(dom.useQwe()){

				if(e.keyCode>=kbd.KEY_PAGE_UP && e.keyCode<=kbd.KEY_ARROW_DOWN){ //_char_in_range(e, 33, 41)
					//2019.2.1 on pressing key: left/right/up/down/home/end/pagedown/pageup
					//The keydown event is emitted before the caret position is changed;
					//2021.7.20 both webengine and webkit require this code for font-name/size toolbar to be updated on selectionChanged;
					setTimeout(function(){
						_on_caret_moved();
					}, 30);
				}

				if(_is_ctrl_key(e, kbd.KEY_C)){
					nyf.copy();
					bDone=true;
				}else if(_is_ctrl_key(e, kbd.KEY_X) && bEditable){
					nyf.cut();
					bDone=true;
				}else if(_is_ctrl_key(e, kbd.KEY_V) && bEditable){
					nyf.paste();
					bDone=true;
				}else if(_is_ctrl_key(e, kbd.KEY_Z) && bEditable){
					dom.undo();
					bDone=true;
				}else if(_is_ctrl_shift_key(e, kbd.KEY_Z) && bEditable){
					dom.redo();
					bDone=true;
				}else if(_is_key(e, kbd.KEY_BACKSPACE)){
					if(bEditable){
						//2019.2.1 Backspace (w/wo Ctrl, Alt) to delete selected contents or characters on left;
						//For backspace and delete keys, immediately commit actions to UndoStack;
						dom.beginEdit();
						dom.deleteBackwards();
						dom.endEdit(100);
					}
					bDone=true; //2021.7.17 for qtwebkit to prevent from navigating-back if in ReadOnly mode;
				}else if(_is_key(e, kbd.KEY_DELETE)){
					if(bEditable){
						dom.beginEdit();
						dom.deleteForwards();
						dom.endEdit(100);
					}
					bDone=true;
				}else if(_is_key(e, kbd.KEY_TAB) && bEditable){
					//2019.2.2 Only pressing Shift+Tab key moves focus backward to the left outline view;
					//while the Tab key is used to insert a '&emsp;' html entity;
					if(dom.hasSelection()){
						//console.debug('<TAB> key to indent selection');
						dom.setTextFormat('Indent', null);
					}else{
						//console.debug('<TAB> key to insert tab-char');
						//dom.insertHtml('&emsp;&emsp;&emsp;&emsp;');
						nyf.insertTabChar();
					}
					bDone=true;
				}else if(_is_shift_key(e, kbd.KEY_TAB) && bEditable){
					if(dom.hasSelection()){
						//console.debug('<Shift+TAB> key to outdent selection');
						dom.setTextFormat('Outdent', null);
						bDone=true;
					}
				}else if(_is_shift_key(e, kbd.KEY_ESCAPE)){
					//2020.3.13 Qt is able to catch ESC, but not Shift+ESC when focused in webpage;
					//console.debug('Shift+ESC pressed');
					nyf.notifyKeyDown(e.keyCode, e.ctrlKey, e.shiftKey, e.altKey, e.metaKey);
				}

			}else{
				//2021.12.29 tweaks for qtwebkit;
				if(bEditable && _is_shift_key(e, kbd.KEY_ESCAPE)){
					//2021.12.29 Qt is able to catch ESC, but not for Shift+ESC when focused in a R/W webpage;
					//console.debug('Shift+ESC pressed');
					nyf.notifyKeyDown(e.keyCode, e.ctrlKey, e.shiftKey, e.altKey, e.metaKey);
				}
			}

			if(bDone){
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				return false;
			}
		});

		//let s_nSquareBrackets=0;
		//document.addEventListener('keypress', function(e){
		//	//console.debug("<keyPress> elm=" + e.target.nodeName + ' ctrl=' + e.ctrlKey + ' shift=' + e.shiftKey + ' alt=' + e.altKey + ' meta=' + e.metaKey + ' key=' + e.keyCode + ' char=' + String.fromCharCode(e.charCode));
		//	if(_is_key(e, '[')){
		//		s_nSquareBrackets++;
		//		if(s_nSquareBrackets>=2){
		//			s_nSquareBrackets=0;
		//			let rc=dom.getSelRange().getClientRects()[0]; //console.debug(rc.left + ', ' + rc.top + ', ' + rc.width + ', ' + rc.height);
		//			nyf.notifyThreadInput(rc.left, rc.top, rc.width, rc.height);
		//		}
		//	}else{
		//		s_nSquareBrackets=0;
		//	}
		//});

		document.addEventListener('keypress', function(e){
			//console.debug("<keyPress> elm=" + e.target.nodeName + ' ctrl=' + e.ctrlKey + ' shift=' + e.shiftKey + ' alt=' + e.altKey + ' meta=' + e.metaKey + ' key=' + e.keyCode + ' char=' + String.fromCharCode(e.charCode));
			if(_is_key(e, '[')){
				let xRng=dom.getSelRange();
				//console.debug(xRng.collapsed + ', ' + xRng.startContainer.nodeName + ', ' + xRng.startOffset);
				if(xRng.collapsed && xRng.startContainer.nodeType===Node.TEXT_NODE && xRng.startOffset>0){
					let s=utils.htmlDecode(xRng.startContainer.nodeValue); //console.debug(s);
					if(s.length>0){ //at this time, the second '[' is still on the way, not yet put into editor;
						let ch=s[xRng.startOffset-1];
						if(ch==='['){
							let rc=xRng.getClientRects()[0]; //console.debug('aboutToThread: ' + rc.left + ', ' + rc.top + ', ' + rc.width + ', ' + rc.height);
							//2021.8.27 let the second '[' character go into the editor before the Threads popup menu;
							setTimeout(function(){
								nyf.notifyThreadInput(rc.left, rc.top, rc.width, rc.height);
							}, 10);
						}
					}
				}
			}
		});

		document.addEventListener('keyup', function(e){
			//2019.2.2 For IME, when pressing SpaceBar or Enter, no keydown nor keypress is emitted, however the keyup is emitted instead;
			//console.debug("<keyup> elm=" + e.target.nodeName + ' ctrl=' + e.ctrlKey + ' shift=' + e.shiftKey + ' alt=' + e.altKey + ' meta=' + e.metaKey + ' key=' + e.keyCode); if(_is_alphanum(e)) console.debug('char=' + String.fromCharCode(e.keyCode));
			let bEditable=dom.isContentEditable();
			if(bEditable){
				if(_is_char_input(e)){ //|| k===kbd.KEY_BACKSPACE || k===kbd.KEY_DELETE
					g_xUndoStack.commitOnTyping(400);
				}
			}

			if(_is_key(e, kbd.KEY_TAB) || _is_shift_key(e, kbd.KEY_TAB)){
				//2019.2.14 workaround for QtWebEngine to update info on status bar;
				//QtWebEngine somehow doesn't send focusInEvent() on focusIn events by Tab or Shift+Tab;
				if(dom.useQwe()) nyf.setFocus();
			}
		});

		//document.addEventListener('dragstart', function(e){
		//	console.debug("<dragstart> elm=" + e.target.nodeName);
		//	//e.preventDefault();
		//	let xDiv=dom.cloneSelection();
		//	if(xDiv){
		//		//2020.9.24 workaround for QtWebEngine to capture the dragged contents;
		//		//https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer
		//		//e.dataTransfer.setData('html', sHtml); //Makes the MIME format: "chromium/x-web-custom-data"
		//		nyf.setProperty('sHtmlDragging', xDiv.innerHTML); //e.dataTransfer.getData('text/html');
		//		nyf.setProperty('sTextDragging', xDiv.innerText); //e.dataTransfer.getData('text/plain');
		//		console.debug('HtmlEdit/DragStart/MimeTypes: (' + e.dataTransfer.types.join(', ') + ')');
		//	}else{
		//		console.error('Drag-and-drop failure.');
		//	}
		//});

		//document.addEventListener('dragend', function(e){
		//	console.debug("<dragend> elm=" + e.target.nodeName);
		//	//e.preventDefault();
		//	//2021.5.1 clear the cached contents on dragEnd;
		//	nyf.setProperty('sHtmlDragging', '');
		//	nyf.setProperty('sTextDragging', '');
		//});

		//document.addEventListener('dragenter', function(e){
		//	console.debug("<dragenter> elm=" + e.target.nodeName);
		//	e.preventDefault();
		//});

		//document.addEventListener('dragleave', function(e){
		//	console.debug("<dragleave> elm=" + e.target.nodeName);
		//	e.preventDefault();
		//});

		//document.addEventListener('dragover', function(e){
		//	console.debug("<dragover> elm=" + e.target.nodeName);
		//	//let r=dom.getSelRange();
		//	//console.debug('startContainer=' + r.startContainer.nodeName + ' startOffset=' + r.startOffset);
		//	//console.debug('selectionStart=' + e.target.selectionStart);
		//});

		//document.addEventListener('drag', function(e){
		//	console.debug("<drag> elm=" + e.target.nodeName);
		//	//e.preventDefault();
		//});

		//document.addEventListener('drop', function(e){
		//	//e.preventDefault();
		//	console.debug("<drop> elm=" + e.target.nodeName);
		//	//console.debug('Dropped: ' + e.dataTransfer.getData("html"));
		//	//utils.viewObj(e.currentTarget);
		//});

		//document.addEventListener('paste', function(e){
		//	console.debug('<onDefaultPaste>');
		//});

		if(dom.useQwe()){
			//.....
		}else{

			//2021.9.9 keep the Boolean in DOM for later on updating toc when headings inserted;
			dom.bUseTocJs=(nyf.arg('bUseTocJs').search(/^(true|yes|on|positive|1)$/i)===0);
			dom.sTocCaption=nyf.arg('sTocCaption');

			let sUri=''+document.location.href; //console.debug('URL='+document.location.href);
			if(sUri && sUri!=='about:blank'){

				dom.insertCssLinks(nyf.arg('vCssLinks')||'');

				//document.body.setAttribute('style', ''); //2022.2.16 get rid of background-color preset for reducing flickers;

				let bSsgLink=nyf.isSsgEntryLink ? nyf.isSsgEntryLink(sUri) : (sUri.search(/^(nyf|file):\/\/[0-9a-z]{4,16}\.dbptr\/(.+)$/i)===0);

				//TOC/Threads/Editing supported only for ssg-links, but not for Local files linked via Shortcuts;
				if(bSsgLink){

					if(dom.useQwe()){
						//console.debug("****dom.makeToc/11111111111111");
						//if(nyf.arg('bUseTocJs').search(/^(true|yes|on|positive|1)$/i)===0)
						if(1){
							//dom.makeToc(nyf.arg('sTocCaption'));
							dom.updateToc();
						}
						console.debug("****dom.makeToc");
						//if(parseInt(nyf.arg('bHighlightThreads'))!==0)
						if(1){
							dom.highlightThreads();
						}

					}else{

						dom.updateToc();

						if(parseInt(nyf.arg('bHighlightThreads'))!==0){
							dom.highlightThreads();
						}

					}

					//2020.5.29 set class for inline code with no <pre> surrounded;
					//By default, only stylesheets for <pre> are pre-defined;
					dom.tweaksForInlineCode();

					//2019.3.26 make sure that caret is initially set at start of document, for repalceAll() to work normally;
					if(dom.useQwe()) dom.moveToStartOfDoc();

					dom.cacheSelectionInfo();
				}

				//2022.2.17 finally let contents popup after all css links have been injected;
				document.body.style.display='';
				document.body.style.visibility='';
			}
		}
	}

	, head: function(bEnsure){
		let xHead=document.head;
		if(typeof(xHead)==='undefined'){
			xHead=document.getElementsByTagName('head');
			if(xHead && xHead.length>0) xHead=xHead[0];
		}
		if(typeof(xHead)==='undefined' && bEnsure){
			xHead=document.createElement("head");
			document.appendChild(xHead);
			console.debug('<head> forcedly inserted to DOM.');
		}
		return xHead;
	}

	, updateToc: function(){
		if(dom.useQwe()){
			dom.makeToc(dom.dom.sTocCaption);
		}else{
			if(dom.bUseTocJs){
				dom.makeToc(dom.sTocCaption);
			}
		}
	}

	, execCmd: function(sCmd, xVal){
		let xRet;
		if(document.queryCommandSupported(sCmd)){
			if(document.queryCommandEnabled(sCmd)){
				//https://developer.mozilla.org/en-US/docs/Web/API/document/execCommand
				xRet=document.execCommand(sCmd, false, xVal);
				if(!xRet) console.debug('<execCmd>: ' + sCmd + ' [' + (xRet?'Succeeded':'Failed') + ']');
			}else{
				console.debug('<execCmd>: ' + sCmd + ' [Disabled]');
			}
		}else{
			//console.debug('<execCmd>: ' + sCmd + ' [Unsupported]');
		}
		return xRet;
	}

	, queryCmdValue: function(sCmd){
		let xRet;
		if(document.queryCommandSupported(sCmd)){
			xRet=document.queryCommandValue(sCmd);
			//console.debug('<queryCmdValue>: ' + sCmd + ' [' + (xRet||'???') + ']');
		}else{
			console.debug('<queryCmdValue>: ' + sCmd + ' [Unsupported]');
		}
		return xRet;
	}

	, queryCmdState: function(sCmd){
		let xRet;
		if(document.queryCommandSupported(sCmd)){
			xRet=document.queryCommandState(sCmd);
			//console.debug('<queryCmdState>: ' + sCmd + ' [' + (xRet?'True':'False') + ']');
		}else{
			console.debug('<queryCmdState>: ' + sCmd + ' [Unsupported]');
		}
		return xRet;
	}

	, isContentEditable: function(){
		//2021.7.17 with qtwebkit, 'contentEditable' may return 'inherit';
		if(dom.useQwe()){
			return document.documentElement.contentEditable===true;
		}else{
			return !nyf.isDomReadonly();
		}
	}

	, setContentEditable: function(bEditable){

		//console.debug('setContentEditable: ' + document.documentElement.contentEditable + ' --> ' + bEditable);
		//console.debug('MutationObserver: ' + typeof(MutationObserver));

		//2021.7.17 with qtwebkit, required to call: QWebView::page()->setContentEditable(!bRO);
		if(dom.useQwe()) document.documentElement.contentEditable=bEditable; //dom.execCmd('contentReadOnly', !bEditable); //Currently Not Supported;

		if(bEditable){

			//https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand
			//https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Editable_content
			dom.execCmd('styleWithCSS', true);
			dom.execCmd("defaultParagraphSeparator", false, "div");

			//2020.7.28 warning messages: <execCmd>: enableInlineTableEditing [Unsupported]
			dom.execCmd('enableInlineTableEditing', true);
			dom.execCmd('enableObjectResizing', true);

			if(typeof(g_xObserver)==='undefined'){

				//console.debug("<new MutationObserver> nyf=" + typeof(nyf));
				g_xObserver = new MutationObserver(function(vMutations, xObserver) {
					for(let i in vMutations){
						let d=vMutations[i]; if(!d) continue;
						g_xUndoStack.push(d);
					}
					//postpone commiting for group-undoing;
					//g_xUndoStack.commit(0);
					//console.debug('changed!');
					nyf.notifyContentsChanged(); //2020.8.31 no use for now;
				});

				g_xObserver.start=function(){
					//console.debug("<MutationObserver start> nyf=" + typeof(nyf));
					this.observe(document, {
							     subtree: true,
							     attributes: true,
							     childList: true,
							     characterData: true,
							     attributeOldValue: true,
							     characterDataOldValue: true
						     });
				}

				g_xObserver.stop=function(){
					//console.debug("<MutationObserver stop> nyf=" + typeof(nyf));
					this.disconnect();
				};
			}

			if(g_xObserver) g_xObserver.start();

		}else{

			if(g_xObserver) g_xObserver.stop();

		}
		return bEditable;
	}

	, checkIfEmpty: function(resultCallback){

		//console.debug('<checkIfEmpty> nyf=' + typeof(nyf));

		let vEntityTags='hr|img|table|object|svg'.split('|'), vIgnoreTags='doctype|head|title|style|meta|script|link'.split('|');
		let _traverseFromNode=function(e){
			//console.debug('>>>: '+(e?e.nodeName:'????') + ' type=' + e.nodeType);
			if(e){
				switch(e.nodeType){
				case Node.DOCUMENT_NODE:
				case Node.ELEMENT_NODE:
					//console.debug('element: '+e.nodeName + ' type=' + e.nodeType + ' ignore=' + vIgnoreTags.indexOf(sTag) + ' nLen=' + e.childNodes.length);
					let sTag=e.nodeName.toLowerCase();
					if(vIgnoreTags.indexOf(sTag)<0){
						if(vEntityTags.indexOf(sTag)>=0){
							//console.debug('NODE/Elm: '+e.nodeName + ' [FALSE]');
							throw Boolean(false);
						}else{
							_traverseChildNodes(e);
						}
					}
					break;
				case Node.TEXT_NODE:
					let sTxt=e.nodeValue||'';
					//console.debug('NODE/Txt: '+e.nodeName+" [" + sTxt + "]" + ' [FALSE]');
					if(sTxt.replace(/^\s+|\s+$/g, '')){ //sTxt.replace(/^[\r\n\t]+|[\r\n\t]+$/g, '')
						throw Boolean(false);
					}
					break;
				default:
					//console.debug('NODE/Def: '+e.nodeName + ' type=' + e.nodeType);
					break;
				}
			}
		};
		let _traverseChildNodes=function(e){
			for(let i=0; i<e.childNodes.length; ++i){
				_traverseFromNode(e.childNodes[i]);
			}
		};

		let bEmpty=true;
		try{
			_traverseFromNode(document);
		}catch(e){
			if(typeof(e)==='boolean') bEmpty=false;
			else console.error("<checkIfEmpty> error: " + e);
		}

		//console.debug('<checkIfEmpty>: ' + bEmpty);

		if(resultCallback) resultCallback(bEmpty);

		return bEmpty;
	}

	, undo: function(){
		//console.debug('<undo> len=' + g_xUndoStack.size());
		if(g_xUndoStack.isDirty()){
			console.debug('<undo/NA> Typing too fast! Slow down slightly for dirty cache to commit.');
		}else{
			g_xUndoStack.undo();
			dom.cacheSelectionInfo(); //immediately update the cache;
		}
	}

	, redo: function(){
		//console.debug('<redo> len=' + g_xUndoStack.size());
		if(g_xUndoStack.isDirty()){
			console.debug('<redo/NA> Typing too fast! Slow down slightly for dirty cache to commit.');
		}else{
			g_xUndoStack.redo();
			dom.cacheSelectionInfo(); //immediately update the cache;
		}
	}

	, clearUndoStack: function(){
		g_xUndoStack.clear();
	}

	, beginEdit: function(){
		//console.debug('<beginEdit>');
		g_xUndoStack.clearTimer();
		g_xUndoStack.commit(0); //commit previous actions and clear cache of actions immediately;
	}

	, endEdit: function(nMsec){
		//console.debug('<endEdit> nMsec=' + nMsec);
		g_xUndoStack.clearTimer();
		g_xUndoStack.commit(nMsec||300); //commit currently cached actions immediately or later on;
		dom.cacheSelectionInfo(); //immediately update the cache;
	}

	, internalTagForCssInjection: function(){return 'ID_NYF_CSS_INJECTION';} //'Nyf_InternalUseOnly'

	, insertCssLinks: function(sCssUrl){
		//console.debug('<insertCssLinks>: ' + sCssUrl);
		if(sCssUrl){
			//let xHead=document.head;
			//if(typeof(xHead)==='undefined'){xHead=document.getElementsByTagName('head'); if(xHead && xHead.length>0) xHead=xHead[0];}
			//if(typeof(xHead)==='undefined'){
			//	xHead=document.createElement("head");
			//	document.appendChild(xHead);
			//	//console.debug('<insertCssLinks/createElement> <head>');
			//}
			let xHead=dom.head();
			if(xHead){

				let _exists=function(sUrl){
					for(let i=0; i<xHead.childNodes.length; ++i){
						let e=xHead.childNodes.item(i);
						if(e.nodeType===Node.ELEMENT_NODE && (e.nodeName||'').toLowerCase()==='link' && (e.getAttribute('rel')||'').toLowerCase()==='stylesheet'){
							let href=e.getAttribute('href')||'';
							if(href===sUrl){
								return true;
							}
						}
					}
					return false;
				};

				//<link rel="stylesheet" type="text/css" href="nyf://localhost/${scripts}/marked/marked.css">
				//<link rel="stylesheet" type="text/css" href="./markdown.css">
				let v=sCssUrl.split(/[;\r\n]+/);
				for(let i=0; i<v.length; ++i){
					let sUrl=utils.trim(v[i]);
					if(sUrl){
						if(_exists(sUrl)){
							console.debug('cssLink: ' + sUrl + ' [Redundant]');
						}else{
							//console.debug('cssLink: ' + sUrl);
							let xLink=document.createElement("link");
							xLink.rel='stylesheet';
							xLink.type='text/css';
							xLink.href=sUrl;
							xLink.id=this.internalTagForCssInjection(); //2020.5.14 The hard-coded ID will be used on committing changes (dom.htmlTextOf());
							xHead.appendChild(xLink);
						}
					}
				}
			}

			//2022.2.16 get rid of background-color preset for reducing flickers;
			let vStyles=document.getElementsByTagName('style');
			if(vStyles && vStyles.length>0){
				for(let i=0; i<vStyles.length; ++i){
					let e=vStyles[i], id=e.id||'';
					if(id==='ID_NYF_PRESET_CSS'){
						e.innerHTML='';
						console.debug('cssPreset withdrawn: ' + id);
					}
				}
			}
		}
	}

	, insertCssRule: function(sCssRule){
		//When selecting text in Qt-5.10.1 (Chromium), the below error message would be logged, which was considered a bug in Chromium;
		//QtWebEngineProcess[93968:5072187] Couldn't set selectedTextBackgroundColor from default ()
		//https://github.com/electron/electron/issues/4420
		//console.debug("<insertCssRule> start");
		if(sCssRule){

			//2020.5.14 consider that CRLF may be passed in via agruments of the js-func from external .css file;
			sCssRule=(sCssRule||'').replace('\\r', '\r').replace('\\n', '\n');

			let bOK=false;
			if(0){
				try{
					//2019.1.14 With Qt5.12.0/Windows 7, insertRule may fail to call on CSSStyleSheet;
					if(document.styleSheets.length>0){
						document.styleSheets[0].insertRule(sCssRule, 0);
						//console.debug("<insertCssRule/insertRule> sCssRule: " + sCssRule);
						bOK=true;
					}
				}catch(e){
					console.error(e); //SyntaxError: Failed to execute 'insertRule' on 'CSSStyleSheet'
				}
			}

			if(!bOK){
				//let xHead=document.head;
				//if(typeof(xHead)==='undefined'){xHead=document.getElementsByTagName('head'); if(xHead && xHead.length>0) xHead=xHead[0];}
				//if(typeof(xHead)==='undefined'){
				//	xHead=document.createElement("head");
				//	document.appendChild(xHead);
				//	//console.debug('<insertCssRule/createElement> <head>');
				//}
				let xHead=dom.head();
				if(xHead){
					let xStyle=document.createElement("style"); xHead.appendChild(xStyle);
					xStyle.style='text/css';
					xStyle.id=this.internalTagForCssInjection(); //2020.4.15 The hard-coded ID will be used on committing changes (dom.htmlTextOf());
					if(xStyle.styleSheet){
						xStyle.styleSheet.cssText=sCssRule;
						//console.debug("<insertCssRule/styleSheet.cssText> sCssRule= " + sCssRule);
					}else{
						xStyle.appendChild(document.createTextNode(sCssRule));
						//console.debug("<insertCssRule/createTextNode> sCssRule= " + sCssRule);
					}
				}
			}
		}
	}

	, getActiveElement: function(){
		//https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/activeElement
		return document.activeElement;
	}

	, moveToStartOfDoc: function(){
		let xSel=window.getSelection(); //document.getSelection();
		if(xSel){
			xSel.collapse(document.body, 0);
			//console.debug('<moveToStartOfDoc> OK');
		}else{
			console.debug('<moveToStartOfDoc> N/A');
		}
	}

	, moveToEndOfDoc: function(){
		let xSel=window.getSelection(); //document.getSelection();
		if(xSel){
			xSel.collapse(document.body, document.body.childNodes.length);
			//console.debug('<moveToEndOfDoc> OK');
		}else{
			console.debug('<moveToEndOfDoc> N/A');
		}
	}

	, getSelRange: function(){
		//https://developer.mozilla.org/en-US/docs/Web/API/Window/getSelection
		//https://developer.mozilla.org/en-US/docs/Web/API/Selection
		let xRng, xSel=window.getSelection(); //document.getSelection();
		if(xSel && xSel.rangeCount>0){
			xRng = xSel.getRangeAt(0);
		}
		return xRng;
	}

	, cloneSelection: function(xRng){
		let xDiv; xRng=xRng || this.getSelRange();
		if(xRng){
			let vElms=xRng.cloneContents();
			xDiv=document.createElement('div');
			xDiv.appendChild(vElms);
		}
		return xDiv;
	}

	, hasSelection: function(){
		//2014.8.4 test if any range is selected and is not collapsed, ie. test if the selection is not empty;
		let bSel=false, xRng=this.getSelRange();
		if(xRng && !xRng.collapsed){
			bSel=true;
		}
		return bSel;
	}

	, seekOuterElementByName: function(xElm, sNodeName){
		//2014.8.5 seek the nearest element surrounding the given element by node name;
		sNodeName=sNodeName.toLowerCase();
		let _seekOut=function(e){
			let r;
			while(e){
				let n=e.nodeName.toLowerCase();
				if(n==='body' || n==='html'){
					break;
				}else if(n===sNodeName){
					r=e;
					break;
				}
				e=e.parentNode;
			}
			return r;
		};
		return _seekOut(xElm);
	}

	, seekInnerElementByName: function(xElm, sNodeName){
		//2014.8.5 seek the first element inside the given element by node name;
		sNodeName=sNodeName.toLowerCase();
		let _seekIn=function(e){
			let r;
			if(e && e.nodeType === Node.ELEMENT_NODE){
				if(e.nodeName.toLowerCase()===sNodeName){
					r=e;
				}else{
					for(let i=0; i<e.childNodes.length; ++i){
						let xSub=e.childNodes[i];
						r=_seekIn(xSub);
						if(r) break;
					}
				}
			}
			return r;
		};
		return _seekIn(xElm);
	}

	, traverseDomBranch: function(xElm, iLevel, xUserData, xActPre, xActPost){
		if(xActPre) xActPre(xElm, iLevel, xUserData);
		this.traverseDomChildren(xElm, iLevel+1, xUserData, xActPre, xActPost);
		if(xActPost) xActPost(xElm, iLevel, xUserData);
	}

	, traverseDomChildren: function(xElm, iLevel, xUserData, xActPre, xActPost){
		//xElm.children: returns only Element nodes, with no Text Nodes;
		//while xElm.childNodes returns all dom nodes, including text/comment nodes;
		if(xElm && xElm.childNodes){
			for(let i=0; i<xElm.childNodes.length; i++){
				this.traverseDomBranch(xElm.childNodes.item(i), iLevel, xUserData, xActPre, xActPost);
			}
		}
	}

	, traverseSelection: function(xAct, iLevel, xUserData){
		let xRng=this.getSelRange();
		if(xAct && xRng && xRng.commonAncestorContainer){

			let xStart=xRng.startContainer, xEnd=xRng.endContainer, bCollapsed=xRng.collapsed;
			let nStart=xRng.startOffset, nEnd=xRng.endOffset;

			//console.debug("<traverseSelection> sel=" + utils.ellipsis(this.getSelHtml(), 256));

			let _pos_of=(e)=>{return this.posOfNode(e);};

			let _is_txt_or_img=(e)=>{return e.nodeType===Node.TEXT_NODE || e.nodeName.toLowerCase()==='img';};

			let _path_of=function(e){
				let s='';
				while(e && e.nodeName.toLowerCase()!=='html'){
					if(s) s='/'+s;
					s=e.nodeName+':'+_pos_of(e)+s;
					e=e.parentNode;
				}
				return s;
			};

			//console.debug("<traverseSelection> RNG within (" + xRng.commonAncestorContainer.nodeName + ') start=' + _path_of(xStart) + '+' + nStart + ' end=' + _path_of(xEnd) + '+' + nEnd + ' collapsed=' + bCollapsed);

			let bEntering=false, bLeaving=false;

			let _act_pre=function(xElm, iLevel, xUserData){

				//console.debug("<traverseSelection/pre> e=" + _path_of(xElm));

				//2021.4.29 be sure to check the startOffset as well;
				//if(xElm===xStart && (xElm.nodeType===Node.TEXT_NODE || _pos_of(xElm)===nStart)){
				//	bEntering=true; bLeaving=false;
				//	//console.debug("<traverseSelection/pre> Entering... @e=" + _path_of(xElm) + ' offStart=' + nStart);
				//}

				//2022.1.11 for webkit/webengine, the start point of selection may vary, probably depend on mouse moving direction when the selection is made;
				if( (xElm===xStart && _pos_of(xElm)===nStart) //exact start point;
						|| (xElm===xStart && xElm.nodeType===Node.TEXT_NODE) //starting from text node in <DIV>;
						|| (xElm.parentNode===xStart && _pos_of(xElm)===nStart) //starting from last elm of parent elm, e.g. images in <DIV>: BODY:1/DIV:5/IMG:0
						){
					bEntering=true; bLeaving=false;
					//console.debug("<traverseSelection/pre> Entering... @e=" + _path_of(xElm) + ' offStart=' + nStart);
				}

				if(bEntering){
					if(!bLeaving){
						if(xElm.nodeType===Node.TEXT_NODE && xElm.nodeValue.search(/^[\r\n\t\s]+$/)===0){ //excluding indentations/blankspaces

							//2019.2.27 ignore blankspaces/indentations in HTML;
							//console.debug("<traverseSelection/preAct> Indentations/blankspaces/Ignoring... @e=" + _path_of(xElm));

						//else if(xElm===xEnd && (xElm.nodeType===Node.TEXT_NODE || nEnd===0) && !bCollapsed){
						}else if( ( xElm===xEnd && nEnd===0 && !bCollapsed )
								|| ( xElm===xEnd && xElm.nodeType===Node.TEXT_NODE && !bCollapsed )
								){

							//2019.2.26 the end-point may be in the last paragraph with nothing selected;
							//2019.2.27 consider of collapsed selection;
							//console.debug("<traverseSelection/preAct> Last/Empty/Leaving... @e=" + _path_of(xElm) + ' offEnd=' + nEnd);
							bLeaving=true; throw 'endOfSel';

						}else if( xElm.parentNode===xEnd && _pos_of(xElm)===nEnd-1 ){

							//2021.1.11 the end-point may be at the last element of parent;
							//console.debug("<traverseSelection/preAct> applyAction/last/leaving... @e=" + _path_of(xElm) + ' offEnd=' + nEnd);
							xAct(xElm, iLevel, xUserData);

							bLeaving=true; throw 'endOfSel';

						}else{
							//console.debug("<traverseSelection/preAct> applyAction... @e=" + _path_of(xElm) + ' offEnd=' + nEnd);
							xAct(xElm, iLevel, xUserData);
						}
					}
				}
			};

			let _act_post=function(xElm, iLevel, xUserData){
				//console.debug("<traverseSelection/postAct> e=" + _path_of(xElm));
				//if(xElm.parentNode===xEnd && _pos_of(xElm)===nEnd-1){
				//	console.debug("<traverseSelection/postAct> Leaving... @e=" + _path_of(xElm) + ' offEnd=' + nEnd);
				//	bEntering=false; bLeaving=true; throw 'endOfSel';
				//}
			};

			let xElm=xRng.commonAncestorContainer;

			//console.debug('commonAnscestor=' + _path_of(xElm) + ', xStart=' + _path_of(xStart) + '+' + nStart + ', xEnd=' + _path_of(xEnd) + '+' + nEnd + ', bCollapsed=' + bCollapsed);

			//if(xElm.nodeType===Node.TEXT_NODE) xElm=xElm.parentNode;
			if(xElm.nodeType===Node.TEXT_NODE){
				//2020.1.7 consider of just one single text node in selection;
				//console.debug('Selection range lies within a single #text node.');
				xAct(xElm, 0, xUserData);
			}else{
				//2021.5.2 traverse from child nodes with the common ancestor node skipped, except for text node;
				this.traverseDomChildren(xElm, (iLevel||0), xUserData, _act_pre, _act_post);
			}
		}
	}

	, selectedAnchors: function(nMax){
		let v=[];
		let _act_on_elm=function(xElm){
			if(xElm){

				if(0){

					//let a=dom.seekOuterElementByName(xElm, 'a');
					//if(a){
					//	v.push(a);
					//	if(typeof(nMax)==='number' && v.length>=nMax) throw 'done';
					//}

				}else{

					//2021.5.2 consider of selection lies in/on a [text, image] node;
					if(xElm.nodeType===Node.TEXT_NODE || xElm.nodeName.toLowerCase()==='img'){
						xElm=dom.seekOuterElementByName(xElm, 'a'); //xElm.parentNode;
					}

					if(xElm.nodeName.toLowerCase()==='a'){
						if(v.indexOf(xElm)<0){
							v.push(xElm);
							console.debug('<A> in selection: ' + (xElm.getAttribute('href')||xElm.href||''));
						}
						if(typeof(nMax)==='number' && v.length>=nMax) throw 'done';
					}
				}
			}
		};
		try{dom.traverseSelection(_act_on_elm);}catch(e){}
		return v;
	}

	, selectedImages: function(nMax){
		let v=[];
		let _act_on_elm=function(xElm){
			if(xElm && xElm.nodeName.toLowerCase()==='img'){
				if(v.indexOf(xElm)<0){
					v.push(xElm);
					console.debug('<IMG> in selection: ' + utils.ellipsis(xImg.getAttribute('src')||xElm.src, 256));
				}
				if(typeof(nMax)==='number' && v.length>=nMax) throw 'done';
			}
		};
		try{dom.traverseSelection(_act_on_elm);}catch(e){}
		return v;
	}

	, selectedTables: function(nMax){
		let v=[];
		let _act_on_elm=function(xElm){
			if(xElm){
				let xTb=dom.seekOuterElementByName(xElm, 'table');
				if(xTb && xTb.rows.length>0){
					if(v.indexOf(xTb)<0){
						console.debug('<TABLE> in selection:' + ' #' + v.length + ': ' + xTb.rows.length + '*' + xTb.rows[0].cells.length + ' @<' + xElm.nodeName + '>');
						v.push(xTb);
						if(typeof(nMax)==='number' && v.length>=nMax) throw 'done';
					}
				}
			}
		};
		if(this.hasSelection()){
			try{dom.traverseSelection(_act_on_elm);}catch(e){}
		}else{
			//2021.8.17 consider of the case there's no selection but only with in a <TD> focused, and requesting for table/cell stylesheet attributes;
			let xRng=this.getSelRange();
			if(xRng && xRng.commonAncestorContainer){
				let xStart=xRng.startContainer, xEnd=xRng.endContainer, bCollapsed=xRng.collapsed;
				try{_act_on_elm(xStart||xEnd);}catch(e){}
			}
		}
		return v;
	}

	, getSelHtml: function(){
		let sSel='';
		if(this.hasSelection()){
			if(0){
				//unfeasible, but only plain text retrieved.
				sSel=document.getSelection().toString();
			}else{
				let xDiv=this.cloneSelection(null);
				if(xDiv){
					//2019.1.17 the custom script htmlTextOf() doesn't work well in some cases;
					//sSel=this.htmlTextOf(xDiv, 0, true); //2014.12.27 an advanced version for HTML indentation;
					//sSel=xDiv.outerHTML;
					sSel=xDiv.innerHTML;
				}
			}
		}
		//console.debug('<getSelHtml>: ' + utils.ellipsis(sSel, 100) + ' --> ' + (utils.thousandths(sSel.length)||'0') + ' Bytes');
		return sSel;
	}

	, cacheImgElementRightClicked: function(xImg){
		this.m_xImgElementInContext=xImg;
	}

	, getLastImgElementRightClicked: function(){
		return this.m_xImgElementInContext;
	}

	, cacheImageInContext: function(xImg){
		let sSrc='', sDataUrl='';
		if(xImg){
			//2019.1.25 The 'xImg.src' contains computed values which can be qualified as http:// or file:// or nyf://...;
			//Consider of attached images, the 'src' attribute just contains the image file name exactly as supplied in HTML;
			sSrc=xImg.getAttribute('src');

			//console.debug("cacheImageInContext: " + utils.ellipsis(sSrc, 160));
			if(utils.isImageDataUrl(sSrc)){
				sDataUrl=sSrc;
			}else{
				let cvs = document.createElement('canvas');
				let w=xImg.naturalWidth;
				let h=xImg.naturalHeight;
				cvs.width=w;
				cvs.height=h;
				cvs.getContext("2d").drawImage(xImg, 0, 0, w, h);
				let sExt=sSrc.replace(/\?[^?]*$/i, '').replace(/(.+)\/([^/]+)$/i, '$2').replace(/(.+)\.(png|jpg|jpeg|gif|svg|bmp|tif)$/i, '$2') || 'png';
				//console.debug('sSrc='+ sSrc + ' sExt=' + sExt);
				sDataUrl=cvs.toDataURL('image/' + sExt); //2021.6.11 this may fail with cross-origin links;
			}
		}

		nyf.setProperty('bImageInContext', xImg?true:false);
		nyf.setProperty('sDataUrlOfImgInContext', sDataUrl);
		nyf.setProperty('sSrcAttrOfImgInContext', sSrc);
	}

	, isThreadElement(xElm){
		return (xElm && xElm.nodeName==='SPAN' && (xElm.className||'').search(/\bCLS_THREAD\b/i)>=0 && xElm.childNodes.length===1 && xElm.childNodes[0].nodeType===Node.TEXT_NODE);
	}

	, cacheContextMenuData: function(x, y){
		//2019.3.11 on right-clicking, dom.cacheSelectionInfo() will be called prior to this function;
		//console.debug('<cacheContextMenuData> @Point(' + x + ', ' + y + ')');

		this.cacheImgElementRightClicked(null); //be sure first to clear the last one;

		let xElm=document.elementFromPoint(x, y), xImg, xTbl, sThread='';
		if(xElm){

			let xRng=this.getSelRange();
			if(this.isThreadElement(xElm)){
				//2020.10.2 consider of context menu for threads;
				sThread=utils.htmlDecode(xElm.childNodes[0].nodeValue).replace(/\s+/g, ' ');
				xRng.selectNode(xElm.childNodes[0]); console.debug('Thread(s) in context: ' + sThread);
				this.cacheSelectionInfo(); //2021/5.1 selection changed;
			}else{
				//2020.8.16 make sure to have the currently pointed hyperlink selected;
				let xA=this.seekOuterElementByName(xElm, 'a');
				if(xA && xRng){
					xRng.selectNode(xA); console.debug('<A> in context: ' + utils.ellipsis(xA.getAttribute('href')||xA.href||'N/A', 256));
					this.cacheSelectionInfo(); //2021/5.1 selection changed;
				}
			}

			if(xElm.nodeName.toLowerCase()==='img'){
				xImg=xElm;
				this.cacheImgElementRightClicked(xImg); //keep it in buffer;
				//console.debug('<IMG> in context: ' + utils.ellipsis(xImg.getAttribute('src')||xImg.src||'N/A', 256));
			}else{
				//2019.3.11 on right-clicking on other elements than <img>, but with <img> existing in selection;
				let vImgs=this.selectedImages(1);
				if(vImgs.length>0){
					xImg=vImgs[0];
					//console.debug('<IMG> in context: ' + utils.ellipsis(xImg.getAttribute('src')||xImg.src||'N/A', 256));
				}
			}

			xTbl=this.seekOuterElementByName(xElm, 'table');
			if(xTbl) console.debug('<TABLE> in context.');
		}

		this.cacheImageInContext(xImg);

		nyf.setProperty('bTableInContext', xTbl?true:false);
		nyf.setProperty('sThreadInContext', utils.trim(sThread));
	}

	, cacheSelectionInfo: function(){
		//2019.2.14 For state/value updating of tool buttons, notify app of the current character formatting;
		//This function will be invoked from in CPP by runJs() on selection changed, and clicking in DOM, or pressing arrow-keys in DOM;
		//console.debug('<cacheSelectionInfo>');
		if(1){
			let vPara=[], s;
			s=this.queryCmdState('SubScript') ? 'sub' : this.queryCmdState('SuperScript') ? 'super' : ''; if(s) vPara.push(s);
			s=this.queryCmdState('JustifyLeft') ? 'left' : this.queryCmdState('JustifyRight') ? 'right' : this.queryCmdState('JustifyCenter') ? 'center' : ''; if(s) vPara.push(s);
			s=this.queryCmdState('InsertOrderedList') ? 'number' : this.queryCmdState('InsertUnorderedList') ? 'bullet' : ''; if(s) vPara.push(s);
			nyf.setProperty('paragraph', vPara);
		}

		if(1){
			nyf.setProperty('fontname', (this.queryCmdValue('FontName')||'').replace(/['"]/gi, ''));
			nyf.setProperty('fontsize', parseFloat(this.queryCmdValue('FontSize')||'0'));
			nyf.setProperty('bold', this.queryCmdState('Bold'));
			nyf.setProperty('italic', this.queryCmdState('Italic'));
			nyf.setProperty('underline', this.queryCmdState('Underline'));
			nyf.setProperty('strikethrough', this.queryCmdState('StrikeThrough'));
		}

		if(1){
			let _fromRgb=function(s){
				//2019.4.2 execCommand(forecolor/backcolor) returns colors in either form of rgb() or rgba();
				//tries to convert rgb(###,###,###) and rgba(###,###,###,###) to #hex that is compatible with QColor();
				s=s.replace(/^rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)$|^rgba\((\d{1,3}), (\d{1,3}), (\d{1,3}), (\d{1,3})\)$/i, function(m0, m1, m2, m3, m4){
					let r=parseInt(m1||'0');
					let g=parseInt(m2||'0');
					let b=parseInt(m3||'0');
					let a=parseInt(m4||'0');
					if(m4){
						return '#'
								+utils.strPadLeft(a.toString(16), 2, '0')
								+utils.strPadLeft(r.toString(16), 2, '0')
								+utils.strPadLeft(g.toString(16), 2, '0')
								+utils.strPadLeft(b.toString(16), 2, '0')
						;
					}else{
						return '#'
								+utils.strPadLeft(r.toString(16), 2, '0')
								+utils.strPadLeft(g.toString(16), 2, '0')
								+utils.strPadLeft(b.toString(16), 2, '0')
						;
					}

				});
				return s;
			};

			let fg=_fromRgb(this.queryCmdValue('ForeColor')||'');
			nyf.setProperty('forecolor', fg);
			//console.debug('FG-COLOR='+fg);

			let bg=_fromRgb(this.queryCmdValue('BackColor')||'');
			nyf.setProperty('backcolor', bg);
			//console.debug('BG-COLOR='+bg);
		}

		if(1){
			nyf.setProperty('doc/margin-top', document.body.style.marginTop);
			nyf.setProperty('doc/margin-right', document.body.style.marginRight);
			nyf.setProperty('doc/margin-bottom', document.body.style.marginBottom);
			nyf.setProperty('doc/margin-left', document.body.style.marginLeft);
		}

		if(0){ //2021.6.11 temporarily disabled for performance issues;
			let vImgs=dom.selectedImages(1), xImg;
			if(vImgs.length>0) xImg=vImgs[0];
			this.cacheImageInContext(xImg); //this may cause performance issues;
		}

		if(1){
			let vAnchors=dom.selectedAnchors(1), s='';

			if(0){
				let vUris=[];
				for(let a of vAnchors){
					//2020.1.4 For fragment href to work, use href attribute instead, A.href always returns qualified url;
					vUris.push(a ? ( a.getAttribute('href') || a.href ) : '');
				}
				s=vUris.join('\n');
			}else if(0){
				//use the first one;
				let xA; if(vAnchors.length>0) xA=vAnchors[0];
				s=xA?(xA.getAttribute('href')||xA.href):'';
			}else{
				//2021.11.11 consider of "Open link" to work with bookmark & attachment links;
				//"Open link" requires fully-qualified urls, but opposite for bookmarks;
				let xA; if(vAnchors.length>0) xA=vAnchors[0];
				if(xA){
					let h1=xA.getAttribute('href'), h2=xA.href;
					if((/^#.+$/).test(h1)) s=h1; else s=h2;
				}
			}

			nyf.setProperty('sLinkInSelection', s);

			//with webengine, the link is given via QWebEngineContextMenuData;
			//with webkit, using QWebFrame::hitTestContent() instead;
			//nyf.setProperty('sLinkInContext', s);
		}

		if(1){
			nyf.setProperty('bTableInContext', this.curTable()?true:false);
		}

		if(1){
			nyf.setProperty('sSelectedHtml', this.getSelHtml()); //this may cause performance issues;
		}

		if(1){
			//nyf.setProperty('bHasSelection', this.hasSelection()); //2021.8.15 QWebView::hasSelection always returns true
		}

		if(1){
			let xRng=this.getSelRange(), sCaret='';
			if(xRng){
				//let sStart=this.addressOfNode(xRng.startContainer) + '+' + utils.strPadLeft(xRng.startOffset.toString(16), 6, '0');
				//let sEnd=this.addressOfNode(xRng.endContainer) + '+' + utils.strPadLeft(xRng.endOffset.toString(16), 6, '0');
				//sCaret=sStart; if(sCaret && sEnd) sCaret += ', ' + sEnd;
				//console.debug('Caret @ <' + xRng.startContainer.parentNode.nodeName + '/' + xRng.startContainer.nodeName + '> +' + xRng.startOffset + ' [ ' + sCaret + ' ]');
			}else{
				//console.debug('No selection range available at this time!')
			}
			nyf.setProperty('sCaretPosition', sCaret);
		}
	}

	, addressOfNode: function(e){
		let vRes=[];
		while(e && e.parentNode){
			//let i=Array.prototype.indexOf.call(e.parentNode.childNodes, e);
			let i=this.posOfNode(e);
			if(i>=0) vRes.unshift(utils.strPadLeft(i.toString(16), 5, '0')); else break;
			e=e.parentNode;
		}
		return vRes.join('/');
	}

	, pathOfNode: function(e){
		//2017.9.27 retrieve path of current element in HTML DOM tree;
		// http://www.javascriptkit.com/domref/nodetype.shtml
		// nodeType values
		// 1 	Node.ELEMENT_NODE
		// 2 	Node.ATTRIBUTE_NODE
		// 3 	Node.TEXT_NODE
		// 4 	Node.CDATA_SECTION_NODE
		// 5 	Node.ENTITY_REFERENCE_NODE
		// 6 	Node.ENTITY_NODE
		// 7 	Node.PROCESSING_INSTRUCTION_NODE
		// 8 	Node.COMMENT_NODE
		// 9 	Node.DOCUMENT_NODE
		// 10 	Node.DOCUMENT_TYPE_NODE
		// 11 	Node.DOCUMENT_FRAGMENT_NODE
		// 12 	Node.NOTATION_NODE
		let vRes=[], sTag;
		while(e){
			if(e.nodeType===Node.ELEMENT_NODE) sTag=e.nodeName;
			else if(e.nodeType===Node.TEXT_NODE) sTag='#TEXT';
			else if(e.nodeType===Node.ENTITY_NODE) sTag='#ENTITY';
			else if(e.nodeType===Node.DOCUMENT_NODE) sTag='#DOCUMENT';
			else sTag='?';
			if(sTag) vRes.unshift(sTag);
			e=e.parentNode;
		}
		return vRes.join('/');
	}

	, posOfNode: function(e){
		//let i=Array.prototype.indexOf.call(e.parentNode.childNodes, e);
		//let i=Array.from(e.parentNode.childNodes).indexOf(e); //ES6
		//let i=[...e.parentNode.childNodes].indexOf(e); //ES6
		let i=0; while( (e=e.previousSibling) ) i++;
		return i;
	}

	, parentBlockElement: function(e){
		while(e && !dom.isBlockLevelElement(e.nodeName)) e=e.parentNode;
		return e;
	}

	, isBlockLevelElement: function(s){
		//2019.12.23 See also: https://www.w3schools.com/htmL/html_blocks.asp
		//return (/^(address|article|aside|blockquote|canvas|dd|div|dl|dt|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|header|hr|li|main|nav|noscript|ol|p|pre|section|table|tfoot|ul|video)$/i).test(s||'');
		//2020.8.16 https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements
		return (/^(address|article|aside|blockquote|details|dialog|dd|div|dl|dt|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|header|hgroup|hr|li|main|nav|ol|p|pre|section|table|ul)$/i).test(s||'');
	}

	, isInlineElement: function(s){
		//2019.12.23 See also: https://www.w3schools.com/htmL/html_blocks.asp
		//return (/^(a|abbr|acronym|b|bdo|big|br|button|cite|code|dfn|em|i|img|input|kbd|label|map|object|output|q|samp|script|select|small|span|strong|sub|sup|textarea|time|tt|var)$/i).test(s||'');
		//2020.8.16 https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements
		return (/^(a|abbr|acronym|audio|b|bdi|bdo|big|br|button|canvas|cite|code|data|datalist|del|dfn|em|embed|i|iframe|img|input|ins|kbd|label|map|mark|meter|noscript|object|output|picture|progress|q|ruby|s|samp|script|select|slot|small|span|strong|sub|sup|svg|template|textarea|time|u|tt|var|video|wbr)$/i).test(s||'');
	}

	, isTableElement: function(s){
		//2020.8.16 https://www.runoob.com/html/html-tables.html
		return (/^(table|tbody|thead|tr|th|td|col|colgroup|caption|tfoot)$/i).test(s||'');
	}

	, isParagraphsSelected: function(){

		//let s_vTagsBlock='body|address|blockquote|center|div|p|pre|h1|h2|h3|h4|h5|h6|hr|dl|dd|dt|table|tbody|thead|tfoot|th|tr|td|ul|ol|li|fieldset|form|meta|link|title|colgroup|col'.split('|');
		//let _is_block_elm=function(e){return e && (s_vTagsBlock.indexOf(e.nodeName.toLowerCase())>=0);};

		let _is_block_elm=function(e){return e && dom.isBlockLevelElement(e.nodeName);};

		let xPara = null, bRes = false;

		let _act_on_elm=function(xElm, iLevel, xUserData){

			let e=xElm;

			//2015.5.21 Do not seek parent node, but just skip TEXT_NODE;
			//It may go beyond the current selection, as blankspace/CR/LF separators
			//between HTML tags are also parsed as 'TEXT_NODE's within DOM;
			//if(e.nodeType==Node.TEXT_NODE) e=e.parentNode;

			if(e && (e.nodeType===Node.ELEMENT_NODE || e.nodeType===Node.TEXT_NODE)){

				while(e && !_is_block_elm(e)){ //2015.5.21 only apply to the block-level tags;
					e=e.parentNode;
				}

				if(e && _is_block_elm(e)){
					if(xPara && xPara !== e){
						bRes = true;
					}
					if(!xPara) xPara = e;
				}
			}

		};

		try{this.traverseSelection(_act_on_elm);}catch(e){}

		return bRes;
	}

	, htmlTextOf: function(xNode, iLevel, bInner){

		let s_CRLF='\n';
		let s_sDefDocType='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';

		let _qualify_uri=function(sUri){
			return sUri;
		};

		let s_xTagsXhtml={
			  'font': 'span'
			, 'b': 'strong'
			, 'i': 'em'
			, 's': 'del'
			, 'strike': 'del'
			};

		let _upgrade_tagname_to_xhtml=function(sTag){
			return s_xTagsXhtml[sTag] || sTag;
		};

		let _make_indentation=function(n){
			let s='';
			while(n-- > 0) s+='\t';
			return s;
		};

		let _doctype=function(sDefDocType, sDefPubID, sDefSysID){
			let xDT=document.doctype, sDT;
			if(xDT){
				sDT='<!DOCTYPE html';

				let sPubID=xDT.publicId||sDefPubID||'';
				if(sPubID){
					sDT+=' PUBLIC '+'"'+sPubID+'"';
				}

				let sSysID=xDT.systemId||sDefSysID||'';
				if(sSysID){
					sDT+=' '+'"'+sSysID+'"';
				}
				sDT+='>';
			}
			return sDT||sDefDocType||'';
		};

		// http://www.javascriptkit.com/domref/nodetype.shtml
		// nodeType values
		// 1 	ELEMENT_NODE
		// 2 	ATTRIBUTE_NODE
		// 3 	TEXT_NODE
		// 4 	CDATA_SECTION_NODE
		// 5 	ENTITY_REFERENCE_NODE
		// 6 	ENTITY_NODE
		// 7 	PROCESSING_INSTRUCTION_NODE
		// 8 	COMMENT_NODE
		// 9 	DOCUMENT_NODE
		// 10 	DOCUMENT_TYPE_NODE
		// 11 	DOCUMENT_FRAGMENT_NODE
		// 12 	NOTATION_NODE

		let _get_inner_html=function(xNode, iLevel){
			let s = '';
			for(let i=0; i<xNode.childNodes.length; i++){
				s += _get_outer_html(xNode.childNodes.item(i), iLevel);
			}
			return s;
		};

		//http://syntaxsandbox.co.uk/learnhtml/blocktags.html
		//http://www.w3schools.com/htmL/html_blocks.asp
		//http://www.htmlhelp.com/reference/html40/block.html
		//http://www.w3resource.com/html/HTML-block-level-and-inline-elements.php
		//http://xahlee.info/js/html5_non-closing_tag.html
		//http://stackoverflow.com/questions/97522/what-are-all-the-valid-self-closing-elements-in-xhtml-as-implemented-by-the-maj

		let s_vTagsSelfClosing='|area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr'.split('|');
		let s_vTagsNoSelfClosing='html|body|head|style|p|div|span'.split('|');
		//let s_vTagsBlock='html|head|style|body|address|blockquote|center|div|p|pre|h1|h2|h3|h4|h5|h6|hr|dl|dd|dt|table|tbody|thead|tfoot|th|tr|td|ul|ol|li|fieldset|form|script|noscript|meta|link|title|nav|aside|article|main|header|footer|colgroup|col'.split('|');
		//let s_vTagsInline='a|span|font|b|u|i|s|em|strong|ins|del|strike|small|sub|sup'.split('|');
		let s_vTagsToIgnore='frame|iframe|frameset|frame|noscript|script'.split('|');
		let s_vTextToIgnore='<![CDATA[;]]>;/*<![CDATA[*/;/*]]>*/;//<![CDATA[;//]]>'.split(';');
		let s_vBoolAttr='checked,compact,declare,defer,disabled,ismap,multiple,noresize,noshade,nowrap,readonly,selected'.split(',');
		let s_vHtmlFontSize=[7, 10, 12, 13.5, 18, 24, 36];

		let _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
		let _is_boolean_attr=function(k){return s_vBoolAttr.indexOf(k||'')>=0};
		let _is_block_elm=function(s){return dom.isBlockLevelElement(s);};
		let _is_table_elm=function(s){return dom.isTableElement(s);};

		let _htmlEncode=function(s){

			//http://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references
			//http://www.utf8-chartable.de/unicode-utf8-table.pl?utf8=dec
			s=s.replace(/&/g,		'&amp;');
			s=s.replace(/</g,		'&lt;');
			s=s.replace(/>/g,		'&gt;');
			s=s.replace(/\"/g,		'&quot;');
			s=s.replace(/\'/g,		'&apos;');

			//https://mathiasbynens.be/notes/javascript-escapes
			//http://www.regular-expressions.info/nonprint.html
			//http://www.fileformat.info/info/unicode/char/a0/index.htm
			//http://www.fileformat.info/info/unicode/char/2002/index.htm
			//http://www.fileformat.info/info/unicode/char/2003/index.htm

			s=s.replace(/\xA0/g,		'&nbsp;');
			s=s.replace(/\u2002/g,		'&ensp;');
			s=s.replace(/\u2003/g,		'&emsp;');

			//Do not translate Tabs in 'nodeValue', just keep them there if any;
			//s=s.replace(/\t/g,		'&nbsp; &nbsp; &nbsp; &nbsp; '); //&emsp;

			s=s.replace(/  /g,		'&nbsp; '); //&nbsp; = non-breaking space;

			return s;
		};

		let _get_outer_html=function(xNode, iLevel){
			let s = '';
			switch(xNode.nodeType){
				case Node.DOCUMENT_NODE:

					s += _get_inner_html(xNode, iLevel+1);

					break;

				case Node.ELEMENT_NODE:

					let sTag=xNode.nodeName.toLowerCase();
					let sTagSubst=_upgrade_tagname_to_xhtml(sTag);

					//2020.4.14 ignore those internally used tags, e.g. custom css for HTML contents;
					//2020.5.15 the tag may be set within <link> <style> for internal use of CSS injection;
					if(xNode.id===dom.internalTagForCssInjection()) break;

					//2021.8.17 ingore the TOC pane;
					if(xNode.id===dom.internalTagForTocPane()) break;

					//ignore frames/scripts...;
					if(s_vTagsToIgnore.indexOf(sTag)<0){

						let bNewLine=_is_block_elm(sTagSubst) || _is_table_elm(sTagSubst);

						if(bNewLine) s += (s_CRLF + _make_indentation(iLevel));

						s += ('<' + sTagSubst);

						let sCls='';
						for(let j=0; j < xNode.attributes.length; j++){

							let attr = xNode.attributes.item(j);
							let sKey=(attr.nodeName||'').toLowerCase(), sVal=attr.nodeValue||'';

							//if(sVal.indexOf('"')>=0)
							{
								//2016.6.9 MS-Word gives malformed CSS when copying HTML, like this:
								//<span style="font-size:42.0pt;mso-bidi-font-size:12.0pt;font-family:AAA;mso-ascii-font-family:"Times New Roman";
								//mso-hansi-font-family:"Times New Roman";mso-bidi-font-family:"Times New Roman";color:red;mso-font-width:80%;
								//mso-font-kerning:1.0pt;mso-ansi-language:EN-US;mso-fareast-language:ZH-CN;mso-bidi-language:AR-SA">TEXT</span>
								sVal=sVal.replace(/\"/g, '\'');
							}

							//Redirect to local filenames;
							if(sTag==='img' && sKey==='src'){ //img;

								//2015.6.18 gzhaha reported an issue:
								//Draging an image inside a document, its location may alter with current document's URL applied,
								//within v7x, the document's URL is dynamic and always varies after db reopens,
								//that's to say, the altered image would not work after db reopens;
								//workaround: match the characteristic URL by RE pattern and forcedly get rid of the location path;
								//for example: file://82173928/Organizer/data/0/2_7/3/4/5.cpmv/6/7/9/btn_about.png
								//Note that SSG path is supposed to contain only ASCII characters [0-9a-z_.];

								sVal=sVal.replace(/^file:\/\/\d+\/Organizer\/data\/([0-9a-z_\.]+?\/)+(.+)$/i, '$2');

							}else if(sTag==='meta' && sKey==='content'){ //meta/charset;
								if(sVal.indexOf('text/html')>=0 && sVal.indexOf('charset')>0){
									sVal='text/html; charset=utf-8';
								}
							}else if(sTag==='a' && sKey==='href'){ //a;
								if(sVal){
									if(sVal.indexOf('javascript:')===0){
										sVal='';
									}else{
										sVal=_qualify_uri(sVal);
									}
								}
							}else if(sTag==='a' && sKey==='title'){ //a;
								if(sVal){
									//2015.6.24 consider of special characters in <a title='...'>;
									sVal=_htmlEncode(sVal);
								}
							}else if(sTag==='font'){
								if(sKey==='size'){
									let n=parseInt(''+sVal); if(n<=0 || n>s_vHtmlFontSize.length) n=3;
									if(sCls) sCls+='; ';
									sCls+='font-size: ' + s_vHtmlFontSize[n-1] + 'pt';
								}else if(sKey==='face'){
									if(sCls) sCls+='; ';
									sCls+='font-family: '+sVal;
								}else if(sKey==='color'){
									if(sCls) sCls+='; ';
									sCls+='color: '+sVal;
								}else if(sKey==='style'){ //webkit may use this field;
									if(sCls) sCls+='; ';
									sCls+=sVal;
								}
								sKey='';
							}

							if(sKey==='class'){

								//2014.12.20 elimiate webkit specific classes;
								let vCls=(sVal||'').split(' '), v='';
								for(let i in vCls){
									let a=vCls[i]||'';
									if(a.indexOf('Apple-style-')===0 || a.indexOf('Apple-tab-')===0){
										continue;
									}
									if(v) v+=' '; v+=a;
								}
								sVal=v;
								if(!sVal) sKey='';

							}else if(sKey==='style'){

								//2022.2.16 get rid of -webkit-* specific css attributes;
								//style="word-wrap: break-word; -webkit-nbsp-mode: space; -webkit-line-break: after-white-space;"
								//console.debug('******* remove-webkit-*: ' + sKey + ': ' + sVal);
								sVal=sVal.replace(/-webkit-([^:\s]+)\s*:\s*[^;\"\'\s]+[;\s]*/gi, '');

								//2020.2.9 Html text copied from in VSCode: <div style='...; white-space: pre;'> produces duplicate line-breaks;
								//workaround: simply clear the 'white-space' css attribute;
								//https://www.w3school.com.cn/cssref/pr_text_white-space.asp
								if(sTag==='p' || sTag==='div'){

									sVal=sVal.replace(/white-space:\s*(pre|pre-wrap|pre-line|nowrap)[;\s]*/gi, '');

								}else if(sTag==='body'){

									//2022.2.16 background-color may be preset into <body style='...'> in order to reduce flickers on loading contents in custom UI themes;
									//this workaround has been moved into <style>
									//sVal=sVal.replace(/background-color:[^;]+[;]*/i, '');
								}

							}else if(sKey==='contenteditable'){

								//2020.4.13 get rid of the contenteditable=true tag given by QtWebEngine;
								//<html xmlns="http://www.w3.org/1999/xhtml" contenteditable="true">
								sKey='';

							}else if(sKey.search(/^on(.+)/)===0){

								//on... events ignored;
								sVal='';

							}

							if(sKey){

								//2015.1.8 xhtml doesn't allow minimized attributes;
								//http://www.pubpixel.com/article/18/what-are-html-xhtml-boolean-attributes-and-how-do-i-use-them
								if(!sVal && _is_boolean_attr(sKey)){
									sVal=sKey;
								}

								s += (' ' + sKey + '=' + '\"' + sVal + '\"');
							}
						}

						if(sCls){
							s += ' ' + 'style';
							s += '=' + '\"' + sCls.replace('"', '\'') + '\"';
						}

						if(!xNode.hasChildNodes() && s_vTagsSelfClosing.indexOf(sTag)>=0){

							s += ' />';

						}else{

							s += '>';

							let bPreCode=(sTag==='pre'); //|| sTag==='code' //2022.3.23 avoid prepending line-breaks in <code>;
							let bSingleLine=(sTag.search(/^(title|footer)$/i)===0); //2018.4.2 avoid line-break within the <title/footer> tags;

							if(sTag==='body'){
								//2014.12.27 'sSelection': inteneded for composing a complete HTML document with given HTML content; Not used in this project;
								let sSelection;
								if(sSelection){
									s += sSelection;
								}else{
									s += _get_inner_html(xNode, iLevel+(bNewLine?1:0));
								}
							}else{
								if(sTag==='style'){
									let vLines=utils.trim(xNode.innerHTML).split('\n');
									for(let i in vLines){
										s += (s_CRLF + _make_indentation(iLevel+1) + utils.trim(vLines[i]));
									}
								}else if(bPreCode){
									s += s_CRLF;
									s += xNode.innerHTML;
								}else{
									s += _get_inner_html(xNode, iLevel+(bNewLine?1:0));
								}
							}

							if(bNewLine && !bPreCode && !bSingleLine) s += (s_CRLF + _make_indentation(iLevel));

							//2015.2.2 Trailing Returns have been trimmed while handling the last TEXT_NODE;
							//if(bNewLine && !bPreCode){
							//	if(!s.match(/\n+$/)) s += s_CRLF;
							//	s += _make_indentation(iLevel);
							//}

							s += ('</' + sTagSubst + '>');
						}
					}

					break;

				case Node.TEXT_NODE:

					let sVal=(xNode.nodeValue||'').replace(/^[\r\n\t]+|[\r\n\t]+$/g, ''); //preserve leading Tabs, but not trailing Tabs;

					//2015.2.15 The <head> section wouldn't contain literal text content execpt for blank spaces,
					//it's safe to trim all leading and trailing blankspaces for indentation in HTML source;
					let xParent=xNode.parentNode;
					if(xParent && xParent.nodeName.toLowerCase()==='head'){
						sVal=utils.trim(sVal);
					}

					//2015.2.2 Within Webkit, 'xNode.nodeValue' always returns text content with all '&nbsp;' evaluated,
					//it's no way to determine if leading blankspaces should be trimmed or preserved for HTML source indentation;
					//so we assumed that all HTML source should use 'Tab' for indentation with all blankspaces preserved as HTML entities '&nbsp;'
					if(sVal){
						//2015.2.2 Avoid using Blankspaces for HTML indentation, Tab characters are proposed for this purpose instead;
						s+=_htmlEncode(sVal);
					}

					break;
			}
			return s;
		};

		if(typeof(iLevel)!=='number') iLevel=0;

		if(!xNode){
			xNode=document;
			iLevel=-1;
		}

		let sHtml='NULL Element';
		if(xNode){
			sHtml=bInner ? _get_inner_html(xNode, iLevel) : _get_outer_html(xNode, iLevel);
		}

		sHtml=utils.trim(sHtml);

		if(!bInner){
			let sDT=_doctype(s_sDefDocType);
			if(sDT){
				sHtml=sDT+s_CRLF+sHtml
			}
		}

		//console.debug(sHtml);
		return sHtml;
	}

};
