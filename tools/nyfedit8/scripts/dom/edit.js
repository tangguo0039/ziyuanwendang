
/////////////////////////////////////////////////////////////////////
// Essential scripts for Mybase Desktop v8.x
// Copyright 2010-2021 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var __xEdit={

	clearContents: function(){
		if(document.body){
			if(g_xObserver) g_xObserver.stop();
			//console.debug("<clearContents> URL=" + document.location.href);
			document.body.innerHTML="";
		}
	}

	, joinElement: function(e, xDstToJoin, xRefToIns){

		if(e.nodeType===Node.TEXT_NODE){
			e=e.parentNode;
			if(e && e.nodeName==='A'){
				e=e.parentNode;
			}
		}

		var bSucc=false, bIdentical=(e===xDstToJoin), bBody=(e.nodeName==='BODY');

		//console.debug('Join: ' + e.nodeName + '  ==> ' + xDstToJoin.nodeName + ' Identical=' + bIdentical);

		if(e && xDstToJoin){
			if(!bIdentical && !bBody){

				//For blank lines, get rid of the <br /> if present in destination element;
				if(xDstToJoin.children.length===1 && xDstToJoin.children[0].nodeName==='BR'){
					xDstToJoin.removeChild(xDstToJoin.children[0]);
				}

				for(var i=0; i<e.childNodes.length; ++i){
					//console.debug('Move: #' + i + ' ' + e.childNodes[i].nodeName);
					if(xRefToIns){
						xDstToJoin.insertBefore(e.removeChild(e.childNodes[i]), xRefToIns);
					}else{
						xDstToJoin.appendChild(e.removeChild(e.childNodes[i]));
					}
				}
				if(e.childNodes.length===0){
					//console.debug('Clean: ' + e.nodeName);
					e.parentNode.removeChild(e);
				}
				bSucc=true;
			}else{
				//console.debug('Already inside the same block/body: ' + xDstToJoin.nodeName);
			}
		}

		return bSucc;
	}

	, deleteForwards: function(){
		//2020.9.12 Qt-5.12.8 QWebEngineView mistakenly deletes next paragraph in whole on pressing the Delete key;
		var xSel=window.getSelection();
		if(xSel && xSel.rangeCount>0){
			var r=xSel.getRangeAt(0);
			if(r){
				var rsc=r.startContainer, rso=r.startOffset;
				if(rsc.nodeName==='BODY'){
					//2020.9.14 on document first loaded, it may be focused at <body>+0; simply seek to next caret position and then re-try;
					r.setStart(rsc.childNodes[0], 0);
					r.collapse(true);
					xSel.removeAllRanges();
					xSel.addRange(r);
					this.deleteForwards();
					return;
				}

				var bTxtNode=(rsc.nodeType===Node.TEXT_NODE);
				var bAtTail=bTxtNode ? (rso===utils.htmlDecode(utils.trim_crlf(rsc.nodeValue)).length) : (!rsc.childNodes[rso].nextSibling);

				//console.debug('nLen=' + utils.htmlDecode(utils.trim_crlf(rsc.nodeValue)).length + ' rso=' + rso + ' bTail=' + bAtTail);

				var xNodeToSel=undefined, iPosToSel=-1, xSrcToJoin;
				if(r.collapsed){

					var _next_obj_or_txt=function(rsc, rso){
						var xNext, bAfterCaret=false;
						var xActPost, xActPre=function(e, iLevel, xUserData){
							//console.debug('Traverse:' + e.nodeName + ' @ <' + e.parentNode.nodeName +'>');
							var bTxtNode=(e.nodeType===Node.TEXT_NODE), bElm=(e.nodeType===Node.TEXT_NODE), bObj=(e.nodeName.search(/^(img|br|hr)$/i)===0), iPos=dom.posOfNode(e);

							if( (bTxtNode && e===rsc) || (bElm && e===rsc && rso===iPos) || (bObj && e.parentNode===rsc && rso===iPos) ){
								//console.debug('Caret Got! @<' + e.parentNode.nodeName +'>' + ' bTxt=' + bTxtNode + ' bElm=' + bElm + ' bObj=' + bObj);
								bAfterCaret=true;
								return;
							}

							if(bAfterCaret){
								if(bObj){
									xNext=e;
									//console.debug('++++: @' + e.nodeName + ' +' + dom.posOfNode(e));
								}else if(bTxtNode){
									var s=utils.htmlDecode(utils.trim_crlf(e.nodeValue));
									if(s){
										if(s.search(/[^\r\n\t]/i)>=0){ //consider of cascaded indented nested <div>;
											xNext=e;
											//console.debug('++++: @' + e.parentNode.nodeName + '/' + e.nodeName + ' +' + dom.posOfNode(e) + ' nLen=' + s.length);
										}else{
											//console.debug('~~~~:' + e.parentNode.nodeName + ' len=' + s.length)
										}
									}
								}
								if(xNext){
									throw 'Got';
								}
							}
						};

						try{
							//console.debug('Seek next from: ' + rsc.nodeName + '+' + rso);
							dom.traverseDomChildren(document.body, 0, null, xActPre, xActPost);
						}catch(err){
							//console.debug('Found next one: ' + xNext + ' Err: ' + err);
						}

						return xNext;
					};

					if(bTxtNode && !bAtTail){
						r.setEnd(rsc, rso+1);
					}else{
						var e=_next_obj_or_txt(rsc, rso);
						if(e){
							if(e.nodeName.search(/^(img|br|hr)$/i)===0){

								var i=e.parentNode.childNodes.length-dom.posOfNode(e);
								r.setEnd(e.parentNode, i); //endOffset: in reverse order;
								xNodeToSel=rsc;
								//console.debug('ObjToDel: ' + e.nodeName + ' Caret: ' + (xNodeToSel ? (xNodeToSel.nodeName||'???') + '+' + i : 'N/A'));

							}else if(e.nodeType===Node.TEXT_NODE){

								var s=utils.htmlDecode(utils.trim_crlf(e.nodeValue));
								if(s){
									r.setEndBefore(e);
									xSrcToJoin=e;
									//console.debug('TxtToJoin: ' + s + '+' + r.startOffset);
								}else{
									//console.debug('Error: empty nodeValue!');
								}

							}else{
								//console.debug('Else:' + e.nodeName);
							}
						}
					}
				}

				if(xSrcToJoin){
					var xDstToJoin=rsc, xRefToIns;
					if(xDstToJoin && xDstToJoin.nodeType===Node.TEXT_NODE){
						//xDstToJoin.nodeValue=xDstToJoin.nodeValue.replace(/[\r\s\t]+$/g, ''); //get rid of all trailing \r\n\t before joining next line;
						//iPosToSel=utils.htmlDecode(utils.trim_crlf(xDstToJoin.nodeValue)).length;
						xRefToIns=xDstToJoin.nextSibling;
						xDstToJoin=xDstToJoin.parentNode;
					}
					if(xDstToJoin && xDstToJoin.nodeName==='A'){
						xRefToIns=xDstToJoin.nextSibling;
						xDstToJoin=xDstToJoin.parentNode;
					}
					var bDone=this.joinElement(xSrcToJoin, xDstToJoin, xRefToIns);
					if(bDone){
						r.setStart(xSrcToJoin, 0);
						r.collapse(true);
					}else{
						//consider of text inside the same block: <div>Front|<a>TextToJoin</a>Behind</div>
						r.setStart(xSrcToJoin, 0);
						r.setEnd(xSrcToJoin, 1);
						r.deleteContents();
						r.collapse(false);
						xNodeToSel=undefined;
						iPosToSel=-1;
					}
				}else{
					//console.debug('Del: ' + r.startContainer.nodeName + '+' + r.startOffset + '  ~  ' + r.endContainer.nodeName + '+' + r.endOffset);
					r.deleteContents();
				}

				if(xNodeToSel){
					r=document.createRange(); //r.cloneRange();
					r.selectNodeContents(xNodeToSel);
					if(iPosToSel>=0) r.setEnd(r.startContainer, iPosToSel);
					r.collapse(false);
					xSel.removeAllRanges();
					xSel.addRange(r);
					//console.debug('selNode: ' + xNodeToSel.nodeName + '+' + r.endOffset);
				}else{
					if(iPosToSel>=0){
						r.setEnd(r.startContainer, iPosToSel);
						r.collapse(false);
					}else{
						r.collapse(true);
					}
				}
			}
		}
	}

	, deleteBackwards: function(){
		//2020.9.6 Qt-5.12.8 QWebEngineView mistakenly deletes previous paragraph in whole on pressing the BackSpace key;
		var r=dom.getSelRange();
		if(r){
			var xSel=window.getSelection(), xNodeToSel=undefined, iPosToSel=-1, xDstToJoin, xRefToIns;
			var rsc=r.startContainer, rso=r.startOffset, bTxtNode=(rsc.nodeType===Node.TEXT_NODE), bAtHead=(rso===0);
			if(r.collapsed){

				//console.debug('@: ' + r.startContainer.nodeName + ' +' + r.startOffset + ' sTxt:' + (r.startContainer.innerText||r.startContainer.nodeValue));

				var _prev_obj_or_txt=function(rsc, rso){
					var vPrev=[];
					var xActPost, xActPre=function(e, iLevel, xUserData){
						//console.debug('Traverse:' + e.nodeName + ' @ <' + e.parentNode.nodeName +'>');
						var bTxtNode=(e.nodeType===Node.TEXT_NODE), bElm=(e.nodeType===Node.TEXT_NODE), bObj=(e.nodeName.search(/^(img|br|hr)$/i)===0), iPos=dom.posOfNode(e);
						if( (bTxtNode && e===rsc) || (bElm && e===rsc && rso===iPos) || (bObj && e.parentNode===rsc && rso===iPos) ) throw 'Got';
						if(bObj){
							vPrev.push(e);
							//console.debug('++++: @' + e.nodeName + ' +' + dom.posOfNode(e));
						}else if(bTxtNode){
							var s=utils.htmlDecode(utils.trim_crlf(e.nodeValue));
							if(s){
								if(s.search(/[^\r\n\t]/i)>=0){ //consider of cascaded indented nested <div>;
									vPrev.push(e);
									//console.debug('++++: @' + e.parentNode.nodeName + '/' + e.nodeName + ' +' + dom.posOfNode(e) + ' nLen=' + s.length);
								}else{
									//console.debug('~~~~:' + e.parentNode.nodeName + ' len=' + s.length)
								}
							}
						}
					};

					try{
						//console.debug('Seek previous before: ' + rsc.nodeName + '+' + rso);
						dom.traverseDomChildren(document.body, 0, null, xActPre, xActPost);
					}catch(err){
						//console.debug('Found nodes:' + vPrev.length);
					}

					return vPrev.length>0 ? vPrev[vPrev.length-1] : undefined;
				};

				if(bTxtNode && !bAtHead){
					r.setStart(rsc, rso-1);
				}else{
					var e=_prev_obj_or_txt(rsc, rso);
					if(e){
						if(e.nodeName.search(/^(img|br|hr)$/i)===0){

							var i=dom.posOfNode(e);
							if(i===0){
								r.setStart(e.parentNode, i);
								xNodeToSel=rsc;
								iPosToSel=0;
							}else{
								r.setStart(e.parentNode, i);
								xNodeToSel=_prev_obj_or_txt(e, i);
							}
							//console.debug('ObjToDel: ' + e.nodeName + ' Caret: ' + (xNodeToSel ? (xNodeToSel.nodeName||'???') + '+' + i : 'N/A'));

						}else if(e.nodeType===Node.TEXT_NODE){

							var s=utils.htmlDecode(utils.trim_crlf(e.nodeValue));
							if(s){
								xNodeToSel=e;
								xDstToJoin=e;
								//console.debug('TxtToDel: ' + s + '+' + r.startOffset);
							}else{
								//console.debug('Error: empty nodeValue!');
							}

						}else{
							//console.debug('Else:' + e.nodeName);
						}
					}
				}
			}

			if(xDstToJoin){
				if(xDstToJoin && xDstToJoin.nodeType===Node.TEXT_NODE){
					xDstToJoin.nodeValue=xDstToJoin.nodeValue.replace(/[\r\s\t]+$/g, ''); //get rid of all trailing \r\n\t before joining next line;
					xRefToIns=xDstToJoin.nextSibling;
					xDstToJoin=xDstToJoin.parentNode;
				}
				if(xDstToJoin && xDstToJoin.nodeName==='A'){
					xRefToIns=xDstToJoin.nextSibling;
					xDstToJoin=xDstToJoin.parentNode;
				}
				this.joinElement(rsc, xDstToJoin, xRefToIns);
			}else{
				//console.debug('Del: ' + r.startContainer.nodeName + '+' + r.startOffset + '  ~  ' + r.endContainer.nodeName + '+' + r.endOffset);
				r.deleteContents();
			}

			if(xNodeToSel){
				r=document.createRange(); //r.cloneRange();
				r.selectNodeContents(xNodeToSel);
				r.collapse(iPosToSel===0);
				xSel.removeAllRanges();
				xSel.addRange(r);
				//console.debug('selNode: ' + xNodeToSel.nodeName + '+' + r.endOffset);
			}else{
				//console.debug('No relocating!');
			}

			//console.debug('===> ' + r.startContainer.nodeName + '+' + r.startOffset);
		}
	}

	, deleteSelection: function(){
		//console.debug('<deleteSelection>');
		var bSucc=false;
		if(dom.isContentEditable()){
			dom.beginEdit();
			if(0){
				bSucc=dom.execCmd('Delete', null);
			}else{
				var xRng=dom.getSelRange();
				if(xRng){
					xRng.deleteContents();
					bSucc=true;
				}
			}
			dom.endEdit(100);
		}
		return bSucc;
	}

	, createLink: function(sUrl){
		var bSucc=false;
		if(dom.isContentEditable() && sUrl){
			var xRng=dom.getSelRange();
			if(xRng && xRng.collapsed){
				//2019.3.15 for empty selection, change the href if <a> exists;
				var a=dom.seekOuterElementByName(xRng.startContainer, 'a');
				if(a){
					a.setAttribute('href', sUrl);
					bSucc=true;
				}
			}else{
				bSucc=dom.execCmd('CreateLink', sUrl);
			}
		}
		return bSucc;
	}

	, removeLink: function(){
		//2014.8.5 cancel the hyperlink for the current one at the input focus;
		var bSucc=false;
		if(dom.isContentEditable()){
			//console.debug('<removeLink>');
			var xRng=dom.getSelRange();
			if(xRng){
				if(xRng.collapsed){
					//2014.8.5 The link label may be surrounded by some more tags, like this;
					//<div><a href="file:///C:/Users/wph/Documents/desktop.ini"><b>desktop.ini</b></a></div><div></div>
					var a=dom.seekOuterElementByName(xRng.startContainer, 'a');
					if(a){
						//move all its sub nodes as siblings, then remove <A> itself;
						try{
							var vSub=a.childNodes, p=a.parentNode;
							for(var i=0; i<vSub.length; ++i){
								p.insertBefore(vSub[i], a);
							}
							p.removeChild(a);
						}catch(e){  }
						bSucc=true;
					}
				}
			}
			if(!bSucc){
				bSucc=dom.execCmd('Unlink', null);
			}
		}
		return bSucc;
	}

	, threadWith: function(sThread){
		sThread=utils.trim(sThread||'').replace(/[\r\n\t\s]+/g, ' ');
		if(sThread){
			var xRng=dom.getSelRange(), e=xRng.startContainer, rso=xRng.startOffset;
			if(xRng.collapsed && e.nodeType===Node.TEXT_NODE && rso>=2){
				var s=utils.htmlDecode(e.nodeValue).substring(0, rso);
				if(s.search(/\[\[$/)>=0){
					var xSel=window.getSelection(), r=document.createRange();
					r.setStart(e, rso-2);
					r.setEnd(e, rso);
					xSel.removeAllRanges();
					xSel.addRange(r);
				}
			}
			return this.insertHtml(' [[ <span class=CLS_THREAD>%THREAD%</span> ]]&nbsp;'.replace(/%THREAD%/gi, sThread));
		}
	}

	//, insertText: function(sTxt){
	//	var bSucc=dom.execCmd('InsertText', sTxt);
	//	return bSucc;
	//}

	, insertText: function(sTxt){

		var _do_insert_text_0000=function(s){
			dom.beginEdit();
			var bOK=dom.execCmd('InsertText', sTxt); //this command runs too slow!!!
			dom.endEdit(500);
			return bOK;
		};

		var _do_insert_text=function(s){
			var vLines=(s||'').replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n'), sHtml='';
			if(vLines.length>1){
				for(var sLine of vLines){
					if(sHtml) sHtml+='\n';
					if(sLine){
						sHtml+='<div>' + utils.htmlEncode(sLine).replace(/\t/g, '&nbsp; &nbsp; &nbsp; &nbsp; ') + '</div>';
					}else{
						sHtml+='<div>&nbsp;</div>'; //preserve all blank lines;
					}
				}
				//sHtml='<div>'+sHtml+'</div>';
			}else{
				sHtml=utils.htmlEncode(s);
			}
			return dom.insertHtml(sHtml);
		};

		var bOK=dom.isContentEditable();
		if(bOK){
			if(typeof(sTxt)==='string'){
				bOK=_do_insert_text(sTxt);
			}else{
				//The sTxt is passed via ARGLIST;
				//nyf.getJsFuncArgList(function(vArgs){
				//	var sTxt='';
				//	if(vArgs && vArgs.length>0){
				//		sTxt=vArgs[0]||'';
				//	}
				//	_do_insert_text(sTxt);
				//});

				//2021.4.12 runJs may be invoked multiple times and cause arguments to be overwritten unexpectedly;
				if(typeof(__xArg_InsertText)!=='undefined'){
					sTxt=__xArg_InsertText["sText"]; //for qtwebengine
				}else{
					sTxt=nyf.arg('sText'); //for qtwebkit
				}
				_do_insert_text(sTxt);

				bOK=true;
			}
		}

		return bOK;
	}

	//, insertHtml: function(sHtml, bFixHtmlFragment, bAutoDownloadImages, bPromptBeforeDownloadImages){
	//	console.debug('<insertHtml>: ' + sHtml);
	//	var bOK=dom.execCmd('InsertHtml', sHtml);
	//	return bOK;
	//}

	, insertHtml: function(sHtml, bFixHtmlFragment, bAutoDownloadImages, bPromptBeforeDownloadImages){

		var _validate_html_fragment=function(s){
			if(s.search(/^<\!--StartFragment-->/gi)>=0 && s.search(/<\!--EndFragment-->$/gi)>=0){ //for table/cells copied from MS-Office

				s=s.replace(/^<\!--StartFragment-->/i, '');
				s=s.replace(/<\!--EndFragment-->$/i, '');

				s=utils.trim(s);

				//msexcel/msword uses leading Blankspaces for html source indentation, but Tab is supposed for this purpose in NYF7;
				//The redundant leading spaces would produce unwanted '&nbsp;' after each Table cells: <td>...</td>&nbsp;
				var _remove_leading_spaces=function(s){
					var v=s.split('\n'), r='';
					for(var i in v){
						var sLine=v[i].replace(/^\s+/, '');
						if(r) r+='\n';
						r+=sLine;
					}
					return r;
				};

				//2015.4.27 msexcel copies incomplete table structure but just <tr> or <td> without <table> tags;
				if(s.search(/^(<col>|<col\b|<tr>|<tr\b)/i)>=0 && s.search(/<\/tr>$/i)>0){ //tweaks for msexcel

					s='<table border="1" cellpadding="5" cellspacing="0">'+s+'</table>';
					s=_remove_leading_spaces(s);

				}else if(s.search(/^<td>|^<td\b/i)>=0 && s.search(/<\/td>$/i)>0){ //tweaks for msexcel

					s='<table border="1" cellpadding="5" cellspacing="0"><tr>'+s+'</tr></table>';
					s=_remove_leading_spaces(s);

				}else if(s.search(/^<table>|^<table\b/i)>=0 && s.search(/<\/table>$/i)>0){ //tweaks for msword

					sHtml=sHtml.replace(/^<table\b([\s\S]*?)>([\s\S]*?)<\/table>$>/gi, '<table border="1" cellpadding="5" cellspacing="0">$2</table>');

					//2015.4.27 This code tries to make some tweaks for msword/table clips,
					//unfortunately, it causes confusion with other web clips constrcuted with <table>;

					//var _cleanUp=function(xElm){
					//	for(var i=0; i<xElm.childNodes.length; ++i){
					
					//		var xSub=xElm.childNodes[i];
					//		if(xSub.nodeType==Node.ELEMENT_NODE){
					
					//			xSub.removeAttribute('id');
					//			xSub.removeAttribute('class');
					//			xSub.removeAttribute('style');
					
					//			if(xSub.nodeName.toLowerCase()=='table'){
					//				xSub.setAttribute('border', '1');
					//				xSub.setAttribute('cellpadding', '5');
					//				xSub.setAttribute('cellspacing', '0');
					//			}else if(xSub.nodeName.toLowerCase()=='td'){
					//				xSub.removeAttribute('valign');
					//				xSub.removeAttribute('width');
					//			}
					
					//			_cleanUp(xSub);
					//		}
					//	}
					//};
					
					//var xDiv=document.createElement('div');
					//xDiv.innerHTML=s;
					//_cleanUp(xDiv);
					
					//sHtml=xDiv.innerHTML;

				}

			}else{
				//console.debug('<0>: '+s);

				//2018.9.15 html fragments copied from in Rich editor includes the full <DOCTYPE/html/head/meta/style/body> structure;
				//In order to keep full formatting data, we just need to strip off some unwanted tags, such as <meta> <head>, and keep all others intact;
				//get rid of all <meta/style/head> tags copied from Chrome, that looks like: <meta charset='utf-8'>...
				//The <style> may contains: "p, li { white-space: pre-wrap; }" which is unwanted;
				//s=s.replace(/<meta[^>]*?>/igm, '');
				//s=s.replace(/<style[^>]*?>[\s\S]*?<\/style>/igm, '');
				//s=s.replace(/<head[^>]*?>[\s\S]*?<\/head>/igm, '');
				//s=s.replace(/<!doctype[^>]*?>/igm, '');
				//s=s.replace(/<[\/]?html[^>]*?>/igm, '');
				//s=s.replace(/<[\/]?body[^>]*?>/igm, '');

				//2020.9.30 only the <body> section needed, other tags looked no use;
				s=s.replace(/^([\s\S]*?)<body>([\s\S]*)<\/body>([\s\S]*?)$/ig, function(m0, m1, m2, m3){return m2;});
				s=s.replace(/<!--[\s\S]*?-->/ig, '');

				//console.debug('<1>: '+s);
			}

			return s;
		};

		var _insert_html_000=function(sHtml){
			//2020.9.30 with qt-5.12.8/webengine it's simply not working; Too may bugs, totally a mess!
			return dom.execCmd('InsertHtml', sHtml);
		};

		var _insert_html=function(sHtml){
			//console.debug(sHtml);
			let xRng=dom.getSelRange(), bOK=false;
			if(xRng && sHtml){
				xRng.deleteContents(); //xRng.collapse();
				let e=xRng.startContainer, p=xRng.startOffset;
				if(e && p>=0 && xRng.collapsed){
					let xDiv=document.createElement('div'); xDiv.innerHTML=sHtml;
					let xEnd=xDiv.childNodes[xDiv.childNodes.length-1];
					if(e.nodeType===Node.TEXT_NODE && xDiv.childNodes.length>0){
						let pn=e.parentNode;
						if(p===0){
							while(xDiv.childNodes.length>0){
								pn.insertBefore(xDiv.childNodes[0], e);
							}
						}else{
							var s=utils.htmlDecode(e.nodeValue), l=s.substring(0, p), r=s.substring(p);
							if(l) pn.insertBefore(document.createTextNode(l), e);

							while(xDiv.childNodes.length>0){
								pn.insertBefore(xDiv.childNodes[0], e);
							}

							if(r) pn.insertBefore(document.createTextNode(r), e);
							e.nodeValue=''; //pn.removeChild(e);
						}
						bOK=true;
					}else if(e.nodeType===Node.ELEMENT_NODE){
						let xRef;
						if(p>=0 && p<e.childNodes.length){
							xRef=e.childNodes[p];
						}
						//console.debug(xRef.nodeName);
						if(xRef){
							while(xDiv.childNodes.length>0){
								e.insertBefore(xDiv.childNodes[0], xRef);
							}
						}else{
							while(xDiv.childNodes.length>0){
								e.appendChild(xDiv.childNodes[0]);
							}
						}
						bOK=true;
					}
					if(bOK){
						let off=-1;
						if(xEnd.nodeType===Node.TEXT_NODE) off=utils.htmlDecode(xEnd.nodeValue).length;
						else if(xEnd.nodeType===Node.ELEMENT_NODE) off=xEnd.childNodes.length;
						if(off>=0){
							let xSel=window.getSelection(), r=document.createRange();
							r.setEnd(xEnd, off);
							r.collapse();
							xSel.removeAllRanges();
							xSel.addRange(r);
						}
					}
				}
			}
			return bOK;
		};

		var _do_insert_html=function(sHtml){

			if(bFixHtmlFragment) sHtml=_validate_html_fragment(sHtml);

			let tDelay=700; //2019.9.4 consider a longer delay for large html text to be processed;
			dom.beginEdit();
			let bOK=_insert_html(sHtml);
			dom.endEdit(tDelay);

			if(bOK && bAutoDownloadImages){
				if(0){
					//2019.1.22 The AJAX version;
					//This version may not work and may fail with the below error message if the CORS policy is enabled;
					//No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'nyf://' is therefore not allowed access.
					dom.traverseDomChildren(document, 0, null, function(xElm, iLvl, xUserData){
						var sTag=xElm.nodeName.toLowerCase();
						//console.debug('traverseDomChildren; Node=' + sTag);
						if(sTag==='img'){
							let sUri=xElm.getAttribute('src');
							//console.debug('traverseDomChildren; Url=' + sUri);
							if(sUri.search(/^(nyf|file|http[s]?):\/\/.+/i)===0){
								console.debug('<Download/Start> Url=' + sUri);
								let bBinary=true;
								ajax.run('get', sUri, null, {xElm: xElm, sUri: sUri}, bBinary, function(xhr, xUserData){
									let vBuf=xhr.response;
									if(vBuf){
										nyf.base64Encode(vBuf, function(sBase64){
											xUserData.xElm.setAttribute('src', 'data:image/png;base64,' + sBase64);
											console.debug('<Download/Done> Url=' + sUri);
										});
									}
								}, function(xReq, sMsg, xUserData){console.log(sMsg);});

							}
						}
					});

				}else if(1){

					//2019.1.23 The Canvas version;
					//This version may not work and may fail with the below error message if the CORS policy is enabled;
					//2019.1.25 prefer using this solution with CORS disabled, that is simply no use but technic barriers in this application.
					let vElms=[], vImgSrc=[];
					dom.traverseDomChildren(document, 0, null, function(xElm, iLvl, xUserData){
						if(xElm.nodeName.toLowerCase()==='img'){
							let sSrc=xElm.src || ''; //Use the computed value (qualified url), instead of xElm.getAttribute('src');
							if(sSrc){
								if(sSrc.search(/^(nyf|file|http[s]?):\/\/.+/i)===0){ //whitelist
									//2019.1.25 consider of '&amp;' substitute for '&' in the original sHtml;
									let sSrc0=xElm.getAttribute('src');
									if(sHtml.indexOf(sSrc0)>=0 || sHtml.indexOf(sSrc0.replace(/&/gi, '&amp;'))>=0){
										vElms.push(xElm);
										vImgSrc.push(sSrc);
									}
								}
							}
						}
					});
					if(vElms.length>0){
						let bProceed=true;
						if(bPromptBeforeDownloadImages){
							//2021.3.8 the popup window may block the process on calling from QtWebEngine bridge;
							//2021.7.19 it seemed no problems with webkit;
							bProceed=true; //confirm('Downloading the linked images; Proceed?' + '\n\n' + vImgSrc.join('\n'));
						}
						if(bProceed){
							dom.beginEdit();
							let _end_edit_on_loaded=function(){
								let nDone=0;
								for(let xImg of vElms){
									//if(!utils.isImageDataUrl(xImg.src)) return;
									if(utils.isImageDataUrl(xImg.src)) nDone++;
								}
								if(nDone===vElms.length){
									dom.endEdit(tDelay);
									console.debug('Image download: ' + nDone + ' / ' + vElms.length + ' [Done]');
								}else{
									console.debug('Image download: ' + nDone + ' / ' + vElms.length + ' [... ...]');
								}
								nyf.showTemporaryStatus('Image download: ' + nDone + ' / ' + vElms.length, 0);
							};
							//var xDiv=document.createElement('div'); document.body.appendChild(xDiv); xDiv.style.display='none';
							for(let xElm of vElms){
								let xImg=new Image(); xImg.img0=xElm; //keep it in the new <img> due to js-closure;
								xImg.onload=(e)=>{
									let xImg=e.target, cvs = document.createElement('canvas'), w=xImg.naturalWidth, h=xImg.naturalHeight;
									//To suppress the error if the CORS policy is enabled: "Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported."
									//xImg.setAttribute('CrossOrigin', 'anonymous');
									let dataUrl='';
									try{
										//2021.7.19 with qtwebkit, nyf:// links not working with cvs.toDataUrl due to CORS policy;
										//it may throw 'Error: SecurityError: DOM Exception 18'; Use file:// instead;
										cvs.width=w; cvs.height=h;
										cvs.getContext("2d").drawImage(xImg, 0, 0, w, h);
										dataURL=cvs.toDataURL('image/png');
										xImg.img0.src=dataURL;
										console.debug('Image downloaded: ' + xImg.src + ' [' + w + 'x' + h + ', +' + utils.thousandths(dataURL.length) + ' Bytes]');
										_end_edit_on_loaded(); //2019.2.1 this code may not work if failure loading any images;
									}catch(err){
										console.debug(err);
									}
								};
								xImg.onerror=(e)=>{
									let xImg=e.target;
									console.debug('Failed to download: ' + xImg.src);
								};
								xImg.onabort=(e)=>{
									let xImg=e.target;
									console.debug('Download aborted: ' + xImg.src);
								};
								//xDiv.appendChild(xImg);
								//xImg.src=xElm.src; //start re-downloading (usually from cache)
								let u=xElm.src||''; //if(u.indexOf('?')<0) u+='?'; u+=('&' + (Math.random()*10000));
								xImg.src=u; //start re-downloading (usually from cache)
								console.debug("Download image: " + xElm.src); //+ ' bComplete=' + xElm.complete
							}
						}
					}

				}else{
					//2019.1.24 The C++ version;
					//In the case that the CORS policy was enabled, neither AJAX nor canvas.toDataURL worked in the DOM space.
					//the only way to obtain image data could be using the QNetworkRequest from in C++ code to re-download them;
					let vImgSrc=[];
					dom.traverseDomChildren(document, 0, null, function(xElm, iLvl, xUserData){
						if(xElm.nodeName.toLowerCase()==='img'){
							//let sSrc=xElm.src || ''; //Use the computed value (qualified url), instead of xElm.getAttribute('src');
							let sSrc=xElm.getAttribute('src');
							if(sSrc){
								if(sSrc.search(/(http[s]?|file):\/\/.+/i)===0){ //whitelist
									//2019.1.25 consider of '&amp;' substitute for '&' in the original sHtml;
									if(sHtml.indexOf(sSrc)>=0 || sHtml.indexOf(sSrc.replace(/&/gi, '&amp;'))>=0){
										vImgSrc.push(sSrc);
									}
								}
							}
						}
					});
					if(vImgSrc.length>0){
						nyf.downloadImages(document.location.href, vImgSrc);
					}
				}
			}
			return bOK;
		};

		let bOK=dom.isContentEditable();
		if(bOK){
			if(typeof(sHtml)==='string'){
				bOK=_do_insert_html(sHtml);
			}else{
				//The sHtml is passed via secure bridge;
				//nyf.getJsFuncArgs(function(s){
				//	let sJson="var xArg=%JSON%;".replace(/%JSON%/, s);
				//	eval.call(null, sJson);
				//	let sHtml=xArg['sHtml'];
				//	_do_insert_html(sHtml);
				//});

				//2021.4.12 runJs may be invoked multiple times and cause arguments to be overwritten unexpectedly;
				if(typeof(__xArg_InsertHtml)!=='undefined'){
					sHtml=__xArg_InsertHtml["sHtml"]; //for qtwebengine
				}else{
					sHtml=nyf.arg('sHtml'); //for qtwebkit
				}

				_do_insert_html(sHtml);

				bOK=true;
			}
		}

		return bOK;
	}

};

if(dom) dom.extend(__xEdit, 'edit');

