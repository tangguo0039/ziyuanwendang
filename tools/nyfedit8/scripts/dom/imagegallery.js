
/////////////////////////////////////////////////////////////////////
// Essential scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

//16:18 7/24/2015 Initial commit by yuehao wang;

//17:11 8/7/2015 revised by peihao wang;

//21:57 8/27/2015 refactor by wjj;

function CImageGallery(v)
{
	this.m_vImgEntries=v;

	this.m_iCurImg=-1;
	this.m_iStartImg=-1;
	this.m_nCurVisible=0;
	this.m_nMaxVisible=32;
	this.m_nHeightTrack=0;

	this.m_xDivNav=null;
	this.m_xDivImg=null;
	this.m_xImgBig=null;

	this.m_xArrowUp=null;
	this.m_xArrowDown=null;
	this.m_xArrowLeft=null;
	this.m_xArrowRight=null;

	this.m_xStatusBar=null;

	this.m_nTimeInitMsg=0;
	this.m_nTimeoutMsg=0;

	this.c_sBgColorNavList='skyblue'; //'RGB(214, 233, 255)';
	this.c_sBgColorCurImg='lightblue'; //'RGB(214, 233, 255)';
	this.c_sColorSelector='yellow';
	this.c_sOpacityOfArrow='0.6';

	this.c_nTimeoutImgHint=5; //5 seconds for image-hint to timeout/disappear;

	this.c_sImgDatLeftArrow = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAADLUlEQVR42u2d25WDMAxE6UAlqAT3Xx17"
		+ "tgMClixp7vwn2JqrBw4nXNds+R2g/++9UDnZfVD/18eCIRlOhcB0YKime4BwsVlfBwQyHhAwHhAwPgeCRZ8/PK0XWYeR9bUD6rSFwll/IIMM"
		+ "CA5n0GSwR7UEsRM2pxoEmN8wI1weAkrhvvYgZ/7AH1NcBQJjCg5NjLkbFDoMsZEQkPXC8eIs/LVWewgo+edaQmfz0QAIFuafT6hTldQwvxQ"
		+ "ELBIIWBwQVCz9WJkaaytFJbd6gxKOQ54ed1thcaf095kHMB8Itnpg9P1+8wDZTxW4+1J3aILuAHLqHho/xvXV/MptzNMgUHxOv8MMk+JL06"
		+ "CNNz+tNTfMfhXzU/zxZoGTMv+FRz45+xXNj/WpUfBkzX9RBR5rNcl+dfN/TVY/W1Ywv0cbwPx2sp2eeXEAMD9yZite/jE/2jfMF28DRQHA/KzZ"
		+ "rSAAmJ8FQMH+j/mZ5wGY317f7uAKAYD5J9pAEQAwXxiAkS+KyIxnZwAkzQcAcfMBQNz8SgD4ww8uzB8IwIHFYr4wAJivDACWh85UTgWgAj"
		+ "ADAMDv11wPP+hAwDkA5wAAAAQAAAQAAAQAUO15AGlNAAAIAAAIomP2+YgWCFpnv8eUECDoW/4LAwAEAAAE4f2/8BwABBuz/0kcvHh"
		+ "AgeBb5badX3YBwaD+36QNAEGCXyr/Esb9f0pPAYJIxcxszYIoC0HkPlejKqAKgYWU/6ZVQA6C8L01DZ4KBDmv8gEC0ex/eSEDglqT/4698Naw3"
		+ "tlvqRfkubw65u/0wgBAaPCjCpD9QID5WxbhWLdFq0zyUQXq38nILYjSn3wWw1M4Nc1PjTMQEF8DglLmHzmGX0BQwnxvtWAgGBZLIDjTTkvF"
		+ "8MMG1A+L1pgE4hFt4sVz+sTp+x89kfVtnroKhWDay59cLjHuDVIv9+3jcG9Sw4pgG/eu3feagWCb98v9bofgBOxtXQMV9lewE0wfPADnBC4ai"
		+ "K7rlqsGH46f18E1ab7z+Eb8KKYKAq4XaguUe0DAeFoDpV7qIOnQnQaaCsPU07vqcjIdpc0NRHdwCyGbEUIIITRdf7TRdr5t1MmaAAAAAElFTkS"
		+ "uQmCC"
		;

	return;
}

CImageGallery.prototype={

	load: function(){

		//document.body.style.boxSizing='border-box';

		this.createWidgets();
		this.createNavList();
		this.installEventListeners();

		this.selectImg(0, true);
	},

	createWidgets: function(){

		let s=this;

		s.m_xDivNav=document.createElement('div'); document.body.appendChild(s.m_xDivNav);
		if(1){
			s.m_xDivNav.style.position = 'absolute';
			s.m_xDivNav.style.float = 'left';
			s.m_xDivNav.style.overflow = 'hidden';
			s.m_xDivNav.style.backgroundColor=s.c_sBgColorNavList;
		}

		s.m_xDivImg=document.createElement('div'); document.body.appendChild(s.m_xDivImg);
		if(1){
			s.m_xDivImg.style.position = 'absolute';
			s.m_xDivImg.style.float = 'left';
			s.m_xDivImg.style.overflow = 'hidden';
			s.m_xDivImg.style.backgroundColor=s.c_sBgColorCurImg;
		}

		s.m_xImgBig=document.createElement('img'); s.m_xDivImg.appendChild(s.m_xImgBig);

		s.m_xArrowUp=document.createElement('img'); document.body.appendChild(s.m_xArrowUp);
		s.m_xArrowDown=document.createElement('img'); document.body.appendChild(s.m_xArrowDown);
		s.m_xArrowLeft=document.createElement('img'); document.body.appendChild(s.m_xArrowLeft);
		s.m_xArrowRight=document.createElement('img'); document.body.appendChild(s.m_xArrowRight);
		if(1){
			s.m_xArrowUp.style.visibility = 'hidden';
			s.m_xArrowUp.src = s.c_sImgDatLeftArrow;
			s.m_xArrowUp.style.position = 'absolute';
			s.m_xArrowUp.style.width='32px';
			s.m_xArrowUp.style.webkitTransform = 'rotate(90deg)';
			s.m_xArrowUp.style.opacity=s.c_sOpacityOfArrow;

			s.m_xArrowDown.style.visibility = 'hidden';
			s.m_xArrowDown.src = s.c_sImgDatLeftArrow;
			s.m_xArrowDown.style.position = 'absolute';
			s.m_xArrowDown.style.width='32px';
			s.m_xArrowDown.style.webkitTransform = 'rotate(-90deg)';
			s.m_xArrowDown.style.opacity=s.c_sOpacityOfArrow;

			s.m_xArrowLeft.style.visibility = 'hidden';
			s.m_xArrowLeft.src = s.c_sImgDatLeftArrow;
			s.m_xArrowLeft.style.position = 'absolute';
			s.m_xArrowLeft.style.width='48px';
			s.m_xArrowLeft.style.webkitTransform = 'rotate(0deg)';
			s.m_xArrowLeft.style.opacity=s.c_sOpacityOfArrow;

			s.m_xArrowRight.style.visibility = 'hidden';
			s.m_xArrowRight.src = s.c_sImgDatLeftArrow;
			s.m_xArrowRight.style.position = 'absolute';
			s.m_xArrowRight.style.width='48px';
			s.m_xArrowRight.style.webkitTransform = 'rotate(180deg)';
			s.m_xArrowRight.style.opacity=s.c_sOpacityOfArrow;
		}

		s.m_xStatusBar=document.createElement('div'); document.body.appendChild(s.m_xStatusBar);
		if(1){
			s.m_xStatusBar.style.visibility='hidden';
			s.m_xStatusBar.style.position='absolute';
			s.m_xStatusBar.style.textAlign='center';
			s.m_xStatusBar.style.verticalAlign='middle';
			s.m_xStatusBar.style.whiteSpace='nowrap';
			s.m_xStatusBar.style.height='14pt';
			s.m_xStatusBar.style.fontSize='11pt';
			s.m_xStatusBar.style.color='white';
			s.m_xStatusBar.style.backgroundColor='darkgrey';
		}
	},

	createNavList: function(){

		let s=this;

		s.resize(); //be sure to first resize the layout, so it can get value of width/height correctly;

		let nMargin=2, wImg=s.m_xDivNav.offsetWidth-nMargin*2;
		for(let i=0; i<s.m_vImgEntries.length; ++i){

			let d=s.m_vImgEntries[i];
			let xImg=document.createElement('img'); s.m_xDivNav.appendChild(xImg);

			//xImg.style.marginTop=nMargin-1+'px';
			//xImg.style.marginLeft=nMargin-1+'px';
			xImg.style.width=wImg+'px';
			xImg.style.border='2px solid '+this.c_sBgColorNavList;
			xImg.style.display='none';

			xImg.setAttribute('pos', i);
			xImg.setAttribute('fn', d.sFn+'?width='+wImg);

			let sInfo=d.sHint.replace(/\t]/g, ' ').replace(/[\'\"\r\n]/g, '');
			if(sInfo) sInfo+=', '; sInfo+=d.sFn;
			if(sInfo) sInfo+=', '; sInfo+='%MODIFY%, %SIZE%'.replace(/%MODIFY%/g, d.sModify).replace(/%SIZE%/g, d.sSize);
			xImg.setAttribute('title', sInfo);

			xImg.onclick=function(e){s.selectImg(parseInt(e.target.getAttribute('pos')), true);};
			xImg.onload=function(e){s.m_nHeightTrack+=e.target.offsetHeight;};
			xImg.onmouseover=function(e){s.hilite(e.target, true, 'blue');};
			xImg.onmouseout=function(e){
				if(parseInt(e.target.getAttribute('pos'))!==s.m_iCurImg){
					s.hilite(e.target, false);
				}else{
					s.hilite(e.target, true);
				}
			};
		}
	},

	resize: function(){

		let s=this;

		s.m_xDivNav.style.width = "100px";
		s.m_xDivNav.style.height = "100%";
		s.m_xDivNav.style.top = "0px";
		s.m_xDivNav.style.left="0px";

		s.m_xDivImg.style.width = (document.body.offsetWidth-s.m_xDivNav.offsetWidth)+"px";
		s.m_xDivImg.style.height = "100%";
		s.m_xDivImg.style.left = s.m_xDivNav.offsetWidth + "px";
		s.m_xDivImg.style.top = "0px";

		s.resizeBigImg(s.m_xImgBig);

		s.m_xArrowUp.style.left='30px';
		s.m_xArrowUp.style.top='2px';
		s.m_xArrowDown.style.left='30px';
		s.m_xArrowDown.style.top=(s.m_xDivNav.offsetHeight-s.m_xArrowDown.offsetWidth-2)+'px';

		let nMargin=4;
		s.m_xArrowLeft.style.left=s.m_xDivNav.offsetWidth+nMargin+'px';
		s.m_xArrowLeft.style.top=Math.floor((s.m_xDivImg.offsetHeight-s.m_xArrowLeft.offsetHeight)/2)+'px';
		s.m_xArrowRight.style.left=(s.m_xDivNav.offsetWidth-nMargin+s.m_xDivImg.offsetWidth-s.m_xArrowRight.offsetWidth)+'px';
		s.m_xArrowRight.style.top=Math.floor((s.m_xDivImg.offsetHeight-s.m_xArrowRight.offsetHeight)/2)+'px';

		s.m_xStatusBar.style.left=s.m_xDivNav.offsetWidth+'px';
		s.m_xStatusBar.style.top=(s.m_xDivImg.offsetHeight-s.m_xStatusBar.offsetHeight-1)+'px';
		s.m_xStatusBar.style.width=s.m_xDivImg.offsetWidth+'px';
	},

	showUpDownArrows: function(bShow){
		if(bShow){
			this.m_xArrowUp.style.visibility = 'visible';
			this.m_xArrowDown.style.visibility = 'visible';
		}else{
			this.m_xArrowUp.style.visibility = 'hidden';
			this.m_xArrowDown.style.visibility = 'hidden';
		}
	},

	showLeftRightArrows: function(bShow){
		if(bShow){
			this.m_xArrowLeft.style.visibility = 'visible';
			this.m_xArrowRight.style.visibility = 'visible';
		}else{
			this.m_xArrowLeft.style.visibility = 'hidden';
			this.m_xArrowRight.style.visibility = 'hidden';
		}
	},

	installEventListeners: function(){

		let s=this;

		s.m_xDivNav.onmousemove=function(e){

			s.showLeftRightArrows(false);

			let h=s.m_xDivNav.offsetHeight, nThreshold=100;
			let y=e.clientY-s.m_xDivNav.offsetTop;
			if(y<nThreshold || y>(h-nThreshold)){
				s.showUpDownArrows(true);
			}else{
				s.showUpDownArrows(false);
			}
		};

		s.m_xDivImg.onmousemove=function(e){

			s.showUpDownArrows(false);

			let w=s.m_xDivImg.offsetWidth, nThreshold=Math.floor(w/3);
			let x=e.clientX-s.m_xDivImg.offsetLeft;
			if(x<nThreshold || x>(w-nThreshold)){
				s.showLeftRightArrows(true);
			}else{
				s.showLeftRightArrows(false);
			}
		}

		s.m_xArrowUp.onclick=function(){
			let iStart=s.m_iStartImg-s.m_nCurVisible-1; if(iStart<0) iStart=0;
			if(iStart>=0 && iStart!==s.m_iStartImg){
				s.showNavList(iStart);
			}
		};

		s.m_xArrowDown.onclick=function(){
			let iStart=s.m_iStartImg+s.m_nCurVisible-1;
			if(iStart>=0 && iStart<s.countOfImgs() && iStart!==s.m_iStartImg){
				s.showNavList(iStart);
			}
		};

		s.m_xArrowLeft.onclick=function(){
			let iSel=s.m_iCurImg;
			iSel--; if(iSel<0) iSel=0;
			s.selectImg(iSel, true);
		};

		s.m_xArrowRight.onclick=function(){
			let iSel=s.m_iCurImg;
			iSel++; if(iSel>=s.countOfImgs()) iSel=s.countOfImgs()-1;
			s.selectImg(iSel, true);
		};

		s.m_xArrowUp.onmouseover=s.m_xArrowDown.onmouseover=s.m_xArrowLeft.onmouseover=s.m_xArrowRight.onmouseover=function(e){
			e.target.style.opacity='1.0';
		};

		s.m_xArrowUp.onmouseout=s.m_xArrowDown.onmouseout=s.m_xArrowLeft.onmouseout=s.m_xArrowRight.onmouseout=function(e){
			e.target.style.opacity=s.c_sOpacityOfArrow;
		};

		//window.addEventListener("resize", s.resize, false); //but not working;
		document.body.onresize=function(){s.resize();};

		setInterval(function(){

			s.updateCountOfVisibleItems();

			if(s.m_nTimeInitMsg>0 && s.m_nTimeoutMsg>0){
				if(new Date().getTime() - s.m_nTimeInitMsg>=s.m_nTimeoutMsg){
					s.m_xStatusBar.style.visibility='hidden';
				}
			}

		}, 500);
	},

	updateCountOfVisibleItems: function(){
		if(this.m_nHeightTrack>0){
			let h=0, nVisible=0;
			for(let i=0; i<this.m_xDivNav.childNodes.length; ++i){
				let xImg=this.m_xDivNav.childNodes[i];
				if(xImg.src && xImg.style.display==='block'){
					if(h>=this.m_xDivNav.offsetHeight){
						break;
					}
					h+=xImg.offsetHeight;
					nVisible++;
				}
			}
			this.m_nCurVisible=nVisible;
		}
	},

	showNavList: function(iStart){
		let nVisible=0;
		this.m_nHeightTrack=0;
		for(let i=0; i<this.m_xDivNav.childNodes.length; ++i){
			let xImg=this.m_xDivNav.childNodes[i];
			if(i<iStart){
				xImg.style.display='none';
			}else if((i-iStart)<this.m_nMaxVisible){
				if(xImg.src){
					xImg.style.display='block'; //be sure to first show it up before getting its size;
					this.m_nHeightTrack+=xImg.offsetHeight;
				}else{
					xImg.src=xImg.getAttribute('fn');
					xImg.removeAttribute('fn');
					xImg.style.display='block';
				}
				nVisible++;
			}else{
				xImg.style.display='none';
			}
		}
		this.m_iStartImg=iStart; this.m_nCurVisible=nVisible;
	},

	countOfImgs: function(){return this.m_xDivNav.childNodes.length;},

	countOfImgs2: function(){
		let c=0;
		for(let i=0; i<this.m_xDivNav.childNodes.length; ++i){
			let xImg=this.m_xDivNav.childNodes[i];
			if(xImg && xImg.nodeName.toLowerCase()==='img'){
				c++;
			}
		}
		return c;
	},

	isPartiallyVisible: function(iPos){return this.isVisible(iPos, false) && !this.isVisible(iPos, true);},

	isVisible: function(iPos, bFull){

		let bVisible=false;
		if(this.m_xDivNav.childNodes.length>0){
			let hTotal=0, xImg;
			for(let i=0; i<this.m_xDivNav.childNodes.length; ++i){
				xImg=this.m_xDivNav.childNodes[i];
				if(i<iPos){
					hTotal+=xImg.offsetHeight;
				}else{
					break;
				}
			}

			if(hTotal<this.m_xDivNav.offsetHeight){

				bVisible=true;

				if(bFull){
					if(hTotal+xImg.offsetHeight>this.m_xDivNav.offsetHeight){
						bVisible=false;
					}
				}
			}
		}
		return bVisible;
	},

	hilite: function(xImg, bHilite, clBorder){
		if(xImg){
			if(bHilite){
				xImg.style.opacity = 1.0;
				xImg.style.borderColor=clBorder||this.c_sColorSelector;
				xImg.style.backgroundColor='lightyellow';
			}else{
				xImg.style.opacity = 0.7;
				xImg.style.borderColor=this.c_sBgColorNavList;
				xImg.style.backgroundColor=this.c_sBgColorNavList;
			}
		}
	},

	selectImg: function(iSel, bTrigger){
		if(iSel!==this.m_iCurImg && iSel>=0 && this.countOfImgs()>0){

			if(this.m_iStartImg<0){
				this.showNavList(0);
			}else if(iSel<this.m_iStartImg){
				this.showNavList(iSel);
			}else if(!this.isVisible(iSel, true)){
				this.showNavList(Math.floor(iSel-this.m_nCurVisible/2));
			}

			let xCurImg;
			for(let i=0; i<this.m_xDivNav.childNodes.length; ++i){
				let xImg=this.m_xDivNav.childNodes[i];
				if(i===iSel){
					this.hilite(xImg, true);
					xCurImg=xImg;
				}else{
					this.hilite(xImg, false);
				}

			}

			this.m_iCurImg=iSel;

			if(bTrigger && xCurImg){
				this.openImg(xCurImg);
			}
		}
	},

	openImg: function(xImg){

		let s=this;

		this.m_xImgBig.style.marginLeft='';
		this.m_xImgBig.style.marginTop='';
		this.m_xImgBig.style.width='';
		this.m_xImgBig.style.height='';

		this.m_xImgBig.style.marginLeft='30000em'; //2016.3.12 First move it out of screen before loading, to prevent screen-flash;

		let sFn=xImg.src.replace(/^(.*)\?.*$/, '$1');
		this.m_xImgBig.src=sFn;

		this.m_xImgBig.onload=function(e){
			let xBig=e.target;
			s.resizeBigImg(xBig);

			let sInfo=xImg.getAttribute('title')
			    +', '+xBig.naturalWidth+'x'+xBig.naturalHeight
			    +' @'+xBig.offsetWidth+'x'+xBig.offsetHeight;

			s.showMessage(sInfo, s.c_nTimeoutImgHint);
			xBig.setAttribute('title', sInfo);
		};
	},

	resizeBigImg: function(xImg){
		if(xImg && xImg.src){
			let wImg=xImg.offsetWidth, hImg=xImg.offsetHeight;
			let wBox=xImg.parentNode.offsetWidth, hBox=xImg.parentNode.offsetHeight;
			if(wImg>0 && hImg>0 && wBox>0 && hBox>0){
				if(wImg<=wBox && hImg<=hBox){
					xImg.style.marginLeft=Math.floor((wBox-wImg)/2)+'px';
					xImg.style.marginTop=Math.floor((hBox-hImg)/2)+'px';
					xImg.style.width=wImg+'px';
					xImg.style.height=hImg+'px';
				}else{
					let rImg=wImg*1.0/hImg, rBox=wBox*1.0/hBox;
					if(rImg>=hBox){
						let w=wBox, h=Math.floor(wBox/rImg);
						xImg.style.width=w+'px';
						xImg.style.height=h+'px';
						xImg.style.marginLeft='0px';
						xImg.style.marginTop=Math.floor((hBox-h)/2)+'px';
					}else{
						let w=Math.floor(hBox*rImg), h=hBox;
						xImg.style.width=w+'px';
						xImg.style.height=h+'px';
						xImg.style.marginLeft=Math.floor((wBox-w)/2)+'px';
						xImg.style.marginTop='0px';
					}
				}
			}
		}
	},

	showMessage: function(sMsg, nSecTimeout){

		let s=this;

		s.m_xStatusBar.innerHTML=sMsg;
		s.m_xStatusBar.style.visibility='visible';

		if(typeof nSecTimeout != 'number' || nSecTimeout<0) nSecTimeout=3;

		if(nSecTimeout>0){
			s.m_nTimeInitMsg=new Date().getTime();
			s.m_nTimeoutMsg=nSecTimeout*1000;
		}else{
			s.m_nTimeInitMsg=0;
			s.m_nTimeoutMsg=0;
		}
	},

	__endTag: null
};

function loadImageGallery(vImgEntries)
{
	var xIG=new CImageGallery(vImgEntries);
	xIG.load();
}
