
function getSelRange()
{
	var xRng;
	var xSel=document.getSelection();
	if(xSel){
		xRng = xSel.getRangeAt(0);
	}
	return xRng;
}

function cloneSelection(xRng)
{
	var xDiv; xRng=xRng || getSelRange();
	if(xRng){
		var vElms=xRng.cloneContents();
		xDiv=document.createElement('div');
		xDiv.appendChild(vElms);
	}
	return xDiv;
}

function getSelectedHtml()
{
	var sSel='', xDiv=cloneSelection(null);
	if(xDiv){
		sSel=xDiv.innerHTML;
	}
	return sSel;
}

function hasSelection()
{
	//2014.8.4 test if any range is selected and is not collapsed, ie. test if the selection is not empty;
	var bSel=false, xRng=getSelRange();
	if(xRng && !xRng.collapsed){
		bSel=true;
	}
	return bSel;
}

function seekOuterElementByName(xElm, sNodeName)
{
	//2014.8.5 seek the nearest element surrounding the given element by node name;
	sNodeName=sNodeName.toLowerCase();
	var _seekOut=function(e){
		var r;
		while(e){
			var n=e.nodeName.toLowerCase();
			if(n=='body' || n=='html'){
				break;
			}else if(n==sNodeName){
				r=e;
				break;
			}
			e=e.parentNode;
		}
		return r;
	};
	return _seekOut(xElm);
}

function seekInnerElementByName(xElm, sNodeName)
{
	//2014.8.5 seek the first element inside the given element by node name;
	sNodeName=sNodeName.toLowerCase();
	var _seekIn=function(e){
		var r;
		if(e && e.nodeType == 1){
			if(e.nodeName.toLowerCase()==sNodeName){
				r=e;
			}else{
				for(var i=0; i<e.childNodes.length; ++i){
					var xSub=e.childNodes[i];
					r=_seekIn(xSub);
					if(r) break;
				}
			}
		}
		return r;
	};
	return _seekIn(xElm);
}

function getSelectedHyperlink(bExact)
{
	//2014.8.4 retrieve URL from selected range;
	var sUrl='', xRng=getSelRange();
	if(xRng){
		if(xRng.startContainer === xRng.endContainer){
			//If in the case that only link label text is selected, look at its container node <A>;
			var a=seekOuterElementByName(xRng.startContainer, 'a');
			if(a){
				sUrl=a.getAttribute('href');
			}
		}else if(!bExact){
			//Otherwise, seek the first URL in the range;
			var xDiv=cloneSelection(xRng);
			var a=seekInnerElementByName(xDiv, 'a');
			if(a){
				sUrl=a.getAttribute('href');
			}
		}
	}
	return sUrl;
}

function getCurrentHyperlink()
{
	//2014.8.4 extract current hyperlink for triggering context menu;
	//The selection should be empty(collapsed), so you can handle with the link at the input focus;
	var sUrl, xRng=getSelRange();
	if(xRng){
		if(xRng.collapsed){
			//2014.8.5 The link label may be surrounded by some more tags, like this;
			//<div><a href="file:///C:/Users/wph/Documents/desktop.ini"><b>desktop.ini</b></a></div><div></div>
			var a=seekOuterElementByName(xRng.startContainer, 'a');
			if(a){
				sUrl=a.getAttribute('href');
			}
		}
	}
	return sUrl;
}

function changeCurrentHyperlink(sUrl)
{
	//2014.8.5 change the href for the current one at the input focus;
	var bSucc=false, xRng=getSelRange();
	if(xRng){
		if(xRng.collapsed){
			//2014.8.5 The link label may be surrounded by some more tags, like this;
			//<div><a href="file:///C:/Users/wph/Documents/desktop.ini"><b>desktop.ini</b></a></div><div></div>
			var a=seekOuterElementByName(xRng.startContainer, 'a');
			if(a){
				var sTmp=a.getAttribute('href');
				if(sTmp!=sUrl){
					a.setAttribute('href', sUrl);
					bSucc=true;
				}
			}
		}
	}
	return bSucc;
}

function clearCurrentHyperlink()
{
	//2014.8.5 cancel the hyperlink for the current one at the input focus;
	var bSucc=false, xRng=getSelRange();
	if(xRng){
		if(xRng.collapsed){
			//2014.8.5 The link label may be surrounded by some more tags, like this;
			//<div><a href="file:///C:/Users/wph/Documents/desktop.ini"><b>desktop.ini</b></a></div><div></div>
			var a=seekOuterElementByName(xRng.startContainer, 'a');
			if(a){
				//move all its sub nodes as siblings, then remove <A> itself;
				var vSub=a.childNodes, p=a.parentNode;
				for(var i=0; i<vSub.length; ++i){
					p.insertBefore(vSub[i]);
				}
				p.removeChild(a);
				bSucc=true;
			}
		}
	}
	return bSucc;
}

function insertCheckbox(sName)
{
	var bSucc=false;
	var xSel= document.getSelection();
	if(xSel){
		var xRng = xSel.getRangeAt(0);
		var xCb = document.createElement('input');
		xCb.setAttribute('type', 'checkbox');
		xCb.setAttribute("name", sName||'');
		xRng.deleteContents();
		xRng.surroundContents(xCb);
		bSucc=true;
	}
	return bSucc;
}
