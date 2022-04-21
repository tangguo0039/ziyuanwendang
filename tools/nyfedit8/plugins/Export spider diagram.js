
//sValidation=nyfjs
//sCaption=Export spider diagram ...
//sHint=Export outline items as a spider diagram
//sCategory=MainMenu.Share
//sCondition=CURDB; CURINFOITEM; OUTLINE
//sID=p.ExportSpider
//sAppVerMin=8.0
//sAuthor=wjjsoft

/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var _lc=function(sTag, sDef){return plugin.getLocaleMsg(sTag, sDef);};
var _lc2=function(sTag, sDef){return _lc(plugin.getLocaleID()+'.'+sTag, sDef);};

var _trim=function(s){return (s||'').replace(/^\s+|\s+$/g, '');};
var _trim_cr=function(s){return (s||'').replace(/\r+$/g, '');};

var _validate_filename=function(s){
	s=s||'';
	s=s.replace(/[\*\?\.\(\)\[\]\{\}\<\>\\\/\!\$\^\&\+\|,;:\"\'`~@]/g, ' ');
	s=s.replace(/\s{2,}/g, ' ');
	s=_trim(s);
	if(s.length>64) s=s.substr(0, 64);
	s=_trim(s);
	s=s.replace(/\s/g, '_');
	return s;
};

var _Bgr2Rgb=function(n){return ((n&0xff)<<16) | (n&0xff00) | ((n&0xff0000)>>16);};
var _Rgb2Bgr=function(n){return ((n&0xff)<<16) | (n&0xff00) | ((n&0xff0000)>>16);};
//var _toColorRef=function(s){var n=parseInt(s.replace(/^#/i, ''), 16); return _Rgb2Bgr(n);};
var _toColorRef=function(s){var n=parseInt(s.replace(/^#/i, ''), 16); return n;};

{
	var clAqua		=_toColorRef('#00ffff');
	var clBlack		=_toColorRef('#000000');
	var clBlue		=_toColorRef('#0000ff');
	var clBlue2		=_toColorRef('#1c8bb9');
	var clDkGray		=_toColorRef('#808080');
	var clDkGray2		=_toColorRef('#3d4148');
	var clFuchsia		=_toColorRef('#ff00ff');
	var clGray		=_toColorRef('#c0c0c0');
	var clGreen		=_toColorRef('#008000');
	var clLime		=_toColorRef('#00ff00');
	var clLtGray		=_toColorRef('#f0f0f0');
	var clMaroon		=_toColorRef('#800000');
	var clMaroon2		=_toColorRef('#ce1820');
	var clNavy		=_toColorRef('#000080');
	var clNavy2		=_toColorRef('#3f5898');
	var clOlive		=_toColorRef('#808000');
	var clPurple		=_toColorRef('#800080');
	var clPurple2		=_toColorRef('#833b7a');
	var clRed		=_toColorRef('#ff0000');
	var clRed2		=_toColorRef('#e51b24');
	var clSilver		=_toColorRef('#c0c0c0');
	var clTeal		=_toColorRef('#008080');
	var clTeal2		=_toColorRef('#4397b1');
	var clWhite		=_toColorRef('#ffffff');
	var clYellow		=_toColorRef('#ffff00');
}

{
	//custom font settings;
	var sFontFamily0='Tahoma';
	var nFontSize0=12; //pt;
	var bBold0=false;
	var bItalic0=false;
	var bUnderline0=false;
	var bStrikeOut0=false;

	var nJointSize=2+2; //var nFontHeight=9; //9pt;

	//colors that will be used to draw items in turn for each branches;
	//var vColorTable=[clRed2, clNavy2, clGreen, clPurple2, clMaroon2, clTeal2, clFuchsia, clDkGray, clBlue2, clOlive, clDkGray2];

	var nFgColorLines=clBlack, nWidthLines=2; //for lines connecting items;
	var nFgColorFrames=clBlack, nWidthFrames=2; //for frames of item titles;
	//var nBkColorRoot=clWhite, nFgColorRoot=clBlack; //for root item;
	var nBkColorItem0=clWhite, nFgColorItem0=clBlack; //for regular items;
	var nBkColorJoint0=clBlue; //for joint between items and child items;
	var nAlpha=50;

	var nMaxTitleLen=128;
	var nPaddingCanvas=20; //for canvas;
	var nMarginLeft=70, nMarginRight=0, nMarginTop=0, nMarginBottom=10; //for info items;
	var nPaddingLeft=5, nPaddingRight=4, nPaddingTop=8, nPaddingBottom=8; //for info items;
	var nIconWidth=16, nIconHeight=16, nIconMargin=4; //for icons;
}

try{

	var xNyf=new CNyfDb(-1);
	if(xNyf.isOpen()){

		var sCfgKey1 = 'ExportSpider.sDstFn';
		var sCfgKey2 = 'ExportSpider.iDirection';
		var sCfgKey3 = 'ExportSpider.iLineStyle';
		var sCfgKey4 = 'ExportSpider.iRange';

		var xInitFn=new CLocalFile(localStorage.getItem(sCfgKey1)||platform.getHomePath()||'', _validate_filename(xNyf.getFolderHint(plugin.getCurInfoItem(-1)))||'untitled');

		var vDirections=[
			  _lc2('ExtendRightLeft', 'Extend to both left & right sides')
			, _lc2('ExtendRight', 'Extend to the right')
			, _lc2('ExtendLeft', 'Extend to the left')
			, _lc2('ExtendUpDown', 'Extend to both upper & lower sides')
			, _lc2('ExtendDown', 'Extend to the lower')
			, _lc2('ExtendUp', 'Extend to the upper')
		];

		var vLineStyles=[
			  _lc2('Elliptic', 'Elliptic')
			, _lc2('Horizontal', 'Horizontal')
			, _lc2('Oblique', 'Oblique')
		];

		var vRange=[
			  _lc('p.Common.CurBranch', 'Current branch')
			, _lc('p.Common.CurDB', 'Current database')
		];

		var vFields = [
			{sField: 'savefile', sLabel: _lc2('DstFn', 'Save as image file'), sFilter: 'PNG images (*.png);;JPEG images (*.jpg);;Bitmap (*.bmp);;All files (*.*)', sTitle: plugin.getScriptTitle(), sInit: xInitFn.toStr(), bReq: true}
			, {sField: 'combolist', sLabel: _lc2('Direction', 'Direction for the diagram to extend'), vItems: vDirections, sInit: localStorage.getItem(sCfgKey2)||'', bReq: true}
			, {sField: 'combolist', sLabel: _lc2('LineStyle', 'Line style'), vItems: vLineStyles, sInit: localStorage.getItem(sCfgKey3)||'', bReq: true}
			, {sField: 'combolist', sLabel: _lc('p.Common.Range', 'Range'), vItems: vRange, sInit: localStorage.getItem(sCfgKey4)||'', bReq: true}
		];

		var vRes=input(plugin.getScriptTitle(), vFields, {nMinSize: 560, vMargins: [6, 0, 30, 0], bVert: true});
		if(vRes && vRes.length>=4){

			var sFnDst = vRes[0];
			var iDirection = vRes[1];
			var iLineStyle = vRes[2];
			var iRange = vRes[3];

			if(sFnDst && iDirection>=0 && iLineStyle>=0){

				localStorage.setItem(sCfgKey1, new CLocalFile(sFnDst).getParent());
				localStorage.setItem(sCfgKey2, iDirection);
				localStorage.setItem(sCfgKey3, iLineStyle);
				localStorage.setItem(sCfgKey4, iRange);

				var sCurItem = (iRange === 0) ? plugin.getCurInfoItem(-1) : plugin.getDefRootContainer();
				//var sItemTitle=xNyf.getFolderHint(sCurItem); if(!sItemTitle) sItemTitle = 'Untitled';

				var bRotate = false;
				if(iDirection > 2){
					bRotate = true;
					iDirection -= 3;
				}

				var nFolders=0;

				//To estimate the progress range;
				//xNyf.traverseOutline(sCurItem, true, function(){
				//	nFolders++;
				//});

				plugin.initProgressRange(plugin.getScriptTitle(), nFolders);

				var _traverseBranch=function(sSsgPath, iLevel, _actPre, _actPost){
					if(xNyf.folderExists(sSsgPath)){
						if(_actPre) _actPre(sSsgPath, iLevel);
						_traverseChildren(sSsgPath, iLevel+1, _actPre, _actPost);
						if(_actPost) _actPost(sSsgPath, iLevel);
					}
				};

				var _traverseChildren=function(sSsgPath, iLevel, _actPre, _actPost){
					var v=xNyf.listFolders(sSsgPath);
					for(var i in v){
						var sName=v[i];
						if(sName){
							var xSub=new CLocalFile(sSsgPath); xSub.append(sName); xSub.append('/');
							_traverseBranch(xSub.toStr(), iLevel, _actPre, _actPost);
						}
					}
				};

				var _isLeaf=function(sSsgPath){
					//return xNyf.getFolderCount(sSsgPath)==0;
					return !xNyf.hasChild(sSsgPath);
				};

				var _isLastChild=function(sSsgPath){
					var sOwner=new CLocalFile(sSsgPath).getParent();
					var v=xNyf.listFolders(sOwner);
					if(v){
						var sName=v[v.length-1];
						var xTmp=new CLocalFile(sOwner, sName); xTmp.append('/');
						return xTmp.equals(sSsgPath);
					}
					return false;
				};

				var xFnDst=new CLocalFile(sFnDst);
				var cvs=new CCanvas();

				var vItems=[];
				var nCanvasWidthLeft=0, nCanvasHeightLeft=0;
				var nCanvasWidthRight=0, nCanvasHeightRight=0;

				//make sure that all SSG paths contain a trailing slash,
				//so they can be saved in a dictionary/map as IDs to identify info items exactly;
				{
					var xTmp=new CLocalFile(sCurItem); xTmp.append('/');
					sCurItem=xTmp.toStr();
				}

				var _rect_for_root = function(rect){
					if(rect && rect.length === 4){
						var x1 = rect[0], y1 = rect[1], x2 = rect[2], y2 = rect[3];
						var w = Math.abs(x2 - x1), h = Math.abs(y2 - y1);
						var r = Math.tan(Math.PI / 18);
						var vNew = [];
						vNew.push(parseInt(x1 - h/2/r));
						vNew.push(parseInt(y1 - w/2*r));
						vNew.push(parseInt(x2 + h/2/r));
						vNew.push(parseInt(y2 + w/2*r));
						return vNew;
					}
				};

				var _size_for_root = function(size){
					if(size && size.length === 2){
						var w = size[0], h = size[1];
						var vRect = [0, 0, w, h];
						vRect = _rect_for_root(vRect);
						var vSize = [];
						vSize.push(Math.abs(vRect[2] - vRect[0]));
						vSize.push(Math.abs(vRect[3] - vRect[1]));
						return vSize;
					}
				};

				var _init_items=function(sSsgPath, iLevel){

					var sTitle=xNyf.getFolderHint(sSsgPath); if(!sTitle) sTitle='Untitled';
					//2015.8.19 the root item shows the database name
					if((new CLocalFile(sSsgPath)).equals(plugin.getDefRootContainer())) sTitle = xNyf.getDbTitle(); //(new CLocalFile(xNyf.toStr())).getTitle();
					if(sTitle.length>nMaxTitleLen) sTitle=sTitle.substr(0, nMaxTitleLen);

					//var iIcon=plugin.getInfoItemIcon(-1, sSsgPath);
					var iIcon=xNyf.getInfoItemIcon(sSsgPath);

					var sFontFamily = sFontFamily0;
					var nFontSize = nFontSize0;
					var bBold = bBold0;
					var bItalic = bItalic0;
					var bUnderline = bUnderline0;
					var bStrikeOut = bStrikeOut0;

					var xStyle = xNyf.getInfoItemTextStyle(sSsgPath);
					if(xStyle){
						sFontFamily = xStyle.sFontFamily;
						nFontSize = xStyle.nFontSize || nFontSize0;
						bBold = xStyle.bBold;
						bItalic = xStyle.bItalic;
						bUnderline = xStyle.bUnderline;
						bStrikeOut = xStyle.bStrikeOut;
					}
					cvs.setFont({sFontFamily: sFontFamily
						, nFontSize: nFontSize
						, bBold: bBold
						, bItalic: bItalic
						, bUnderline: bUnderline
						, bStrikeOut: bStrikeOut
					});

					//2015.8.19 considering the shape of root item is rhombus, so it will calc a new rect to make a better look
					var v=cvs.drawText(sTitle, 0, 0, 0, 0, 'SINGLELINE|CALCRECT'); //CALC-RECT; Be sure to exclude VCENTER;
					if(iLevel === 0){
						v = _size_for_root(v);
					}

					var xItem={
						  sTitle: sTitle
						, nWidth: v[0]+nPaddingLeft+nPaddingRight
						, nHeight: v[1]+nPaddingTop+nPaddingBottom
						, xStart: 0
						, yStart: 0
						, iIcon: iIcon
						, nHeightBranch: 0
					};

					if(xItem.iIcon>=0){
						xItem.nWidth+=(nIconWidth+nIconMargin*2);
						xItem.nHeight=(v[1]>nIconHeight?v[1]:nIconHeight)+nPaddingTop+nPaddingBottom;
					}

					vItems[sSsgPath]=xItem;
				};

				_traverseBranch(sCurItem, 0, _init_items, null);

				var vLeft=[], vRight=[];
				{
					var v=xNyf.listFolders(sCurItem), nRight=0;
					switch(iDirection){
						case 0:
							//extend to both sides;
							nRight=Math.floor(v.length/2); if(v.length%2>0) nRight++;
							break;
						case 1:
							//extend to the right;
							nRight=v.length;
							break;
						case 2:
							//extend to the left;
							nRight=0;
							break;
					}
					for(var i in v){
						var xSsgPath=new CLocalFile(sCurItem, v[i]); xSsgPath.append('/');
						if(i<nRight) vRight[vRight.length]=xSsgPath.toStr();
						else vLeft[vLeft.length]=xSsgPath.toStr();
					}
				}

				//Right side: calculate dimision for leaf items, and width for each items;
				var _pre_calc_dim_right=function(sSsgPath, iLevel){
					var xItem=vItems[sSsgPath];
					if(xItem){
						var sOwner=new CLocalFile(sSsgPath).getParent();
						var xOwner=vItems[sOwner];
						if(xOwner){
							xItem.xStart=xOwner.xStart+xOwner.nWidth+nMarginLeft;
						}

						//for leaf nodes;
						if(_isLeaf(sSsgPath)){
							xItem.yStart=nCanvasHeightRight;

							nCanvasHeightRight+=(xItem.nHeight+nPaddingTop+nPaddingBottom);

							if(_isLastChild(sSsgPath)){
								nCanvasHeightRight+=nMarginBottom;
							}

							var nMax=xItem.xStart+xItem.nWidth;
							if(nMax>nCanvasWidthRight){
								nCanvasWidthRight=nMax;
							}
						}
					}
				};

				for(var i in vRight){
					var sSsgPath=vRight[i];
					_traverseBranch(sSsgPath, 0, _pre_calc_dim_right, null);
				}

				if(vRight.length===0){
					//2012.7.5 consider that the root item is by default located at (0, 0) and extends to the right;
					//so, when the diagram extends to the left, the root item would be out of sight unless it moves to the left for its text width;
					//this offset must be prior to calculating dimensions for the left side, so all the xStart can be adjusted accordingly;
					var xRoot=vItems[sCurItem];
					if(xRoot) xRoot.xStart-=xRoot.nWidth;
				}

				//Left side: calculate dimision for leaf items, and width for each items;
				var _pre_calc_dim_left=function(sSsgPath, iLevel){
					var xItem=vItems[sSsgPath];
					if(xItem){

						var sOwner=new CLocalFile(sSsgPath).getParent();
						var xOwner=vItems[sOwner];
						if(xOwner){
							xItem.xStart=xOwner.xStart-xItem.nWidth-nMarginLeft;
						}

						//for leaf nodes;
						if(_isLeaf(sSsgPath)){
							xItem.yStart=nCanvasHeightLeft;

							nCanvasHeightLeft+=(xItem.nHeight+nPaddingTop+nPaddingBottom);

							if(_isLastChild(sSsgPath)){
								nCanvasHeightLeft+=nMarginBottom;
							}

							var nMax=xItem.xStart;
							if(nMax<nCanvasWidthLeft){
								nCanvasWidthLeft=nMax;
							}
						}
					}
				};

				for(var i in vLeft){
					var sSsgPath=vLeft[i];
					_traverseBranch(sSsgPath, 0, _pre_calc_dim_left, null);
				}

				//2015.8.18 consider that it only draws a leaf item;
				{
					var xRoot = vItems[sCurItem];
					if(xRoot){
						if(-nCanvasWidthLeft < xRoot.nWidth) nCanvasWidthLeft = -xRoot.nWidth;
						var nRootHeight = xRoot.nHeight + nPaddingTop + nPaddingBottom;
						if(nCanvasHeightLeft < nRootHeight) nCanvasHeightLeft = nRootHeight;
					}
				}

				var nCanvasWidth=nCanvasWidthRight-nCanvasWidthLeft;
				var nCanvasHeight=nCanvasHeightLeft>nCanvasHeightRight ? nCanvasHeightLeft : nCanvasHeightRight;

				var nHeightDiff=Math.abs(nCanvasHeightLeft-nCanvasHeightRight);
				var nHeightOffsetLeft=0, nHeightOffsetRight=0;
				if(nCanvasHeightLeft>nCanvasHeightRight){
					nHeightOffsetRight=nHeightDiff/2;
				}else{
					nHeightOffsetLeft=nHeightDiff/2;
				}

				//Vertical dimension: calculate the vertical coordinates for each non-leaf items;
				var _post_calc_dim=function(sSsgPath, iLevel){
					var xItem=vItems[sSsgPath];
					if(xItem){

						//adjust the top margin space for the small tree block;
						var bLeftSide=(xItem.xStart<0);
						xItem.yStart+=(bLeftSide ? nHeightOffsetLeft : nHeightOffsetRight);

						if(iLevel===0){
							//for root item to center vertically;
							xItem.yStart=(nCanvasHeight-xItem.nHeight)/2;
						}else if(!_isLeaf(sSsgPath)){
							var v=xNyf.listFolders(sSsgPath);
							if(v && v.length>0){
								var y1=0;
								{
									var xSub=new CLocalFile(sSsgPath, v[0]); xSub.append('/');
									var xTmp=vItems[xSub.toStr()];
									if(xTmp) y1=xTmp.yStart;
								}
								if(v.length>1){
									var y2=0;
									{
										var xSub=new CLocalFile(sSsgPath, v[v.length-1]); xSub.append('/');
										var xTmp=vItems[xSub.toStr()];
										if(xTmp) y2=xTmp.yStart;
									}
									xItem.yStart=(y1+y2)/2;
								}else{
									xItem.yStart=y1;
								}
							}
						}
					}
				};

				_traverseBranch(sCurItem, 0, null, _post_calc_dim);

				nCanvasWidth+=nPaddingCanvas*2;
				nCanvasHeight+=nPaddingCanvas*2-nMarginBottom;

				cvs.setCanvasSize(nCanvasWidth, nCanvasHeight);
				cvs.setViewportOrg(-nCanvasWidthLeft+nPaddingCanvas, nPaddingCanvas+nMarginBottom/2);

				var nBranches=0;
				var _draw_line=function(sSsgPath, iLevel){

					if(xNyf.folderExists(sSsgPath)){

						var xItem=vItems[sSsgPath];
						if(xItem){
							var bContinue=plugin.ctrlProgressBar(xItem.sTitle, 1, true);
							if(!bContinue) return true;

							var nBkColorItem=nBkColorItem0;

							var xStyle = xNyf.getInfoItemTextStyle(sSsgPath);
							if(xStyle){
							       nBkColorItem = xStyle.nBackColor;
							}

							var bLeftSide=(xItem.xStart<0);
							var nFixHori=bLeftSide ? 1 : 0;

							cvs.setPen('SOLID', nWidthFrames, nFgColorFrames); cvs.setPenColor(nFgColorFrames, nAlpha);
							cvs.setBrushColor(nBkColorItem, nAlpha);
							if(iLevel === 0){
								//var vRect = [xItem.xStart+nFixHori, xItem.yStart, xItem.xStart+xItem.nWidth+nFixHori, xItem.yStart+xItem.nHeight];
								//vRect = _rect_for_root(vRect);
								//cvs.drawRoundedRect(xItem.xStart+nFixHori, xItem.yStart, xItem.xStart+xItem.nWidth+nFixHori, xItem.yStart+xItem.nHeight, 8, 8);
								cvs.drawRhombus(xItem.xStart+nFixHori, xItem.yStart, xItem.xStart+xItem.nWidth+nFixHori, xItem.yStart+xItem.nHeight);
							}else{
								cvs.drawRoundedRect(xItem.xStart+nFixHori, xItem.yStart, xItem.xStart+xItem.nWidth+nFixHori, xItem.yStart+xItem.nHeight, 8, 8);
							}

							var sOwner=new CLocalFile(sSsgPath).getParent();
							var xOwner=vItems[sOwner];
							if(xOwner){

								cvs.setPen('SOLID', nWidthLines, nFgColorLines); cvs.setPenColor(nFgColorLines, nAlpha);

								switch(iLineStyle){
									case 0:
										//elliptic lines
										var xFrom, yFrom, xTo, yTo;
										var dx=Math.floor(nMarginLeft/7), dx2=Math.floor(nMarginLeft/7);
										//var r=Math.floor(nFontHeight/5); r=(r<2)?2:r; //r=Math.floor(nMarginLeft/16);
										var r=nJointSize/2;
										if(bLeftSide){
											xFrom=xOwner.xStart-1; yFrom=xOwner.yStart+Math.floor(xOwner.nHeight/2);
											xTo=xItem.xStart+xItem.nWidth+3; yTo=xItem.yStart+Math.floor(xItem.nHeight/2);

											cvs.moveTo(xFrom, yFrom);
											xFrom-=dx;
											cvs.lineTo(xFrom, yFrom);

											xTo+=dx2;

											var x1=xTo-(xFrom-xTo), y1=yTo;
											var x2=xFrom, y2=(yFrom-yTo)*2+yTo;
											if(yTo>yFrom){
												//cvs.arc(x1, y1, x2, y2, xTo, yTo, xFrom, yFrom);
												cvs.arc(x1, y1, x2, y2, 270, 90);
											}else if(yTo<yFrom){
												//cvs.arc(x1, y1, x2, y2, xFrom, yFrom, xTo, yTo);
												cvs.arc(x1, y1, x2, y2, 0, 90);
											}else{
												cvs.moveTo(xFrom, yFrom);
												cvs.lineTo(xTo, yTo);
											}

											xTo-=2; dx2--;
											cvs.moveTo(xTo, yTo);
											cvs.lineTo(xTo-dx2, yTo);

											var x=xFrom, y=yFrom;
											cvs.setBrushColor(nBkColorJoint0);
											cvs.drawRect(x-r, y-r, x+r, y+r);
										}else{
											xFrom=xOwner.xStart+xOwner.nWidth+1; yFrom=xOwner.yStart+Math.floor(xOwner.nHeight/2);
											xTo=xItem.xStart; yTo=xItem.yStart+Math.floor(xItem.nHeight/2);

											cvs.moveTo(xFrom, yFrom);
											xFrom+=dx;
											cvs.lineTo(xFrom, yFrom);

											xTo-=dx2;

											var x1=xTo-(xFrom-xTo), y1=yTo;
											var x2=xFrom, y2=(yFrom-yTo)*2+yTo;
											if(yTo>yFrom){
												//yTo--;
												//cvs.arc(x1, y1, x2, y2, xFrom, yFrom, xTo, yTo);
												cvs.arc(x1, y1, x2, y2, 180, 90);
											}else if(yTo<yFrom){
												//cvs.arc(x1, y1, x2, y2, xTo, yTo, xFrom, yFrom);
												cvs.arc(x1, y1, x2, y2, 90, 90);
											}else{
												cvs.moveTo(xFrom, yFrom);
												cvs.lineTo(xTo, yTo);
											}

											xTo+=2; dx2-=2;
											cvs.moveTo(xTo, yTo);
											cvs.lineTo(xTo+dx2, yTo);

											var x=xFrom, y=yFrom;
											cvs.setBrushColor(nBkColorJoint0);
											cvs.drawRect(x-r, y-r, x+r, y+r);
										}
										break;
									case 1:
										//horizontal lines
										var xFrom, yFrom, xTo, yTo;
										var dx=Math.floor(nMarginLeft/5);
										//var r=Math.floor(nFontHeight/5); r=(r<2)?2:r; //r=Math.floor(nMarginLeft/16);
										var r=nJointSize/2;
										if(bLeftSide){
											//xFrom=xOwner.xStart, yFrom=xOwner.yStart+Math.floor(xOwner.nHeight/((iLevel==1)?2:1));
											//xTo=xItem.xStart+xItem.nWidth, yTo=xItem.yStart+xItem.nHeight;
											xFrom=xOwner.xStart; yFrom=xOwner.yStart+Math.floor(xOwner.nHeight/2);
											xTo=xItem.xStart+xItem.nWidth+3; yTo=xItem.yStart+Math.floor(xItem.nHeight/2);
											cvs.moveTo(xFrom, yFrom);
											cvs.lineTo(xTo+dx, yFrom);
											cvs.lineTo(xTo+dx, yTo);
											cvs.lineTo(xTo, yTo);

											var x=xTo+dx, y=yFrom;
											cvs.setBrushColor(nBkColorJoint0);
											cvs.drawRect(x-r, y-r, x+r, y+r);
										}else{
											//xFrom=xOwner.xStart+xOwner.nWidth, yFrom=xOwner.yStart+Math.floor(xOwner.nHeight/((iLevel==1)?2:1));
											//xTo=xItem.xStart+xOwner.nWidth, yTo=xItem.yStart+xItem.nHeight;
											xFrom=xOwner.xStart+xOwner.nWidth+1; yFrom=xOwner.yStart+Math.floor(xOwner.nHeight/2);
											xTo=xItem.xStart; yTo=xItem.yStart+Math.floor(xItem.nHeight/2);
											cvs.moveTo(xFrom, yFrom);
											cvs.lineTo(xTo-dx, yFrom);
											cvs.lineTo(xTo-dx, yTo);
											cvs.lineTo(xTo, yTo);

											var x=xTo-dx, y=yFrom;
											cvs.setBrushColor(nBkColorJoint0);
											cvs.drawRect(x-r, y-r, x+r, y+r);
										}
										break;
									case 2:
										//oblique lines
										var xFrom, yFrom, xTo, yTo;
										if(bLeftSide){
											xFrom=xOwner.xStart; yFrom=xOwner.yStart+Math.floor(xOwner.nHeight/2);
											xTo=xItem.xStart+xItem.nWidth+3; yTo=xItem.yStart+Math.floor(xItem.nHeight/2);
											if(iLevel===1 && iDirection===0){
												if(yTo<xOwner.yStart){
													//above the owner;
													yFrom=xOwner.yStart;
													xFrom=xOwner.xStart+Math.floor(xOwner.nWidth/2);
												}else if(yTo>xOwner.yStart+xOwner.nHeight){
													yFrom=xOwner.yStart+xOwner.nHeight;
													xFrom=xOwner.xStart+Math.floor(xOwner.nWidth/2);
												}
											}
										}else{
											xFrom=xOwner.xStart+xOwner.nWidth+1; yFrom=xOwner.yStart+Math.floor(xOwner.nHeight/2);
											xTo=xItem.xStart; yTo=xItem.yStart+Math.floor(xItem.nHeight/2);
											if(iLevel===1 && iDirection===0){
												if(yTo<xOwner.yStart){
													//above the owner;
													yFrom=xOwner.yStart;
													xFrom=xOwner.xStart+Math.floor(xOwner.nWidth/2);//Math.floor(xOwner.nWidth/3)*2;
												}else if(yTo>xOwner.yStart+xOwner.nHeight){
													yFrom=xOwner.yStart+xOwner.nHeight;
													xFrom=xOwner.xStart+Math.floor(xOwner.nWidth/2);//Math.floor(xOwner.nWidth/3)*2;
												}
											}
										}
										cvs.moveTo(xFrom, yFrom);
										cvs.lineTo(xTo, yTo);
										break;
									case -1:
										break;
								}
							}
						}

					}
				};

				_traverseBranch(sCurItem, 0, _draw_line, null);

				var xIconFiles={}, nBranches=0;
				var _draw_item=function(sSsgPath, iLevel){

					if(xNyf.folderExists(sSsgPath)){

						var xItem=vItems[sSsgPath];
						if(xItem){

							var bContinue=plugin.ctrlProgressBar(xItem.sTitle, 1, true);
							if(!bContinue) return true;

							var sFontFamily = sFontFamily0;
							var nFontSize = nFontSize0;
							var bBold = bBold0;
							var bItalic = bItalic0;
							var bUnderline = bUnderline0;
							var bStrikeOut = bStrikeOut0;
							var nFgColorItem = nFgColorItem0;

							var xStyle = xNyf.getInfoItemTextStyle(sSsgPath);
							if(xStyle){
								sFontFamily = xStyle.sFontFamily;
								nFontSize = xStyle.nFontSize || nFontSize0;
								bBold = xStyle.bBold;
								bItalic = xStyle.bItalic;
								bUnderline = xStyle.bUnderline;
								bStrikeOut = xStyle.bStrikeOut;
								nFgColorItem = xStyle.nForeColor;
							}

							var bLeftSide=(xItem.xStart<0);
							var nFixHori=bLeftSide ? 1 : 0;

							var x=xItem.xStart+nFixHori;
							var y=xItem.yStart;

							if(xItem.iIcon>=0){
								x+=(nIconWidth+nIconMargin*2);
							}

							cvs.setTextColor(nFgColorItem);
							cvs.setFont({sFontFamily: sFontFamily
								, nFontSize: nFontSize
								, bBold: bBold
								, bItalic: bItalic
								, bUnderline: bUnderline
								, bStrikeOut: bStrikeOut
							});

							var nLeft = 0;
							if(iLevel === 0){
								var v = cvs.drawText(xItem.sTitle, 0, 0, 0, 0, 'SINGLELINE|CALCRECT');
								if(xItem.iIcon>=0) nLeft = (xItem.nWidth - v[0] - nIconWidth - nIconMargin*2) / 2;
								else nLeft = (xItem.nWidth - v[0]) / 2;
							}
							x+=nLeft;

							cvs.drawText(xItem.sTitle, x+nPaddingLeft, y, xItem.nWidth, xItem.nHeight, 'LEFT|VCENTER|SINGLELINE');

							//draw icons;
							if(xItem.iIcon>=0){
								var sIconFn=xIconFiles[xItem.iIcon];
								if(!sIconFn){
									var xSsgFn=new CLocalFile(plugin.getDefRootContainer()); xSsgFn.append(xItem.iIcon.toString(16)+'.bmp');
									var xTmpFn=new CLocalFile(platform.getTempFile()); plugin.deferDeleteFile(xTmpFn.toStr());
									if(xNyf.exportFile(xSsgFn.toStr(), xTmpFn.toStr())>0){
										sIconFn=xTmpFn.toStr();
										xIconFiles[xItem.iIcon]=sIconFn;
									}
								}
								if(sIconFn){
									x=xItem.xStart+nIconMargin+nFixHori+nLeft;
									y=xItem.yStart+(xItem.nHeight-nIconHeight)/2;
									cvs.drawImage(sIconFn, x, y, nIconWidth, nIconHeight, true);
								}
							}

						}

					}
				};

				_traverseBranch(sCurItem, 0, _draw_item, null);

				if(bRotate){
					plugin.ctrlProgressBar('Rotating image', 1, false);
					cvs.rotateCanvas(90);
				}

				plugin.ctrlProgressBar('Saving image', 1, false);

				var sExt=xFnDst.getExtension(false).replace(/\./ig, '').toUpperCase();
				if(!sExt){
					//2021.9.30 on linux, the File-dialog may not supply the default extension name;
					sExt='png';
					xFnDst.changeExtension(sExt);
				}

				var nJpegQuality=90;
				if(cvs.saveAs(xFnDst.toStr(), sExt, nJpegQuality)){
					var sMsg=_lc2('Done', 'Successfully generated the spider diagram. View it now?');
					if(confirm(sMsg+'\n\n'+xFnDst.toStr())){
						xFnDst.launch('open');
					}
				}else{
					alert(_lc2('Fail.Save', 'Failed to save the spider diagram.') + '\n\n' + xFnDst.toStr());
				}

			}
		}

	}else{
		alert(_lc('Prompt.Warn.NoDbOpened', 'No database is currently opened.'));
	}

}catch(e){
	alert(e);
}
