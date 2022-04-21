
//sValidation=nyfjs
//sCaption=View file in hexadecimal ...
//sHint=View content of a given file in hexadecimal format
//sCategory=MainMenu.Tools
//sID=p.HexFileViewer
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

//try{

	var sCfgKey1='HexFileViewer.sFn', sCfgKey2='HexFileViewer.sRange';

	var sFn=platform.getOpenFileName({
					sTitle: plugin.getScriptTitle()
					, sInitDir: localStorage.getItem(sCfgKey1)||''
					, sFilter: 'All files (*)'
				});
	if(sFn){

		var xFn=new CLocalFile(sFn);
		localStorage.setItem(sCfgKey1, xFn.getDirectory()||'');

		var nBlockSize=1024*32, vBlocks=[], nFileSize=xFn.getFileSize();
		if(nFileSize>0){
			var iFrom=0;
			while(iFrom<nFileSize){
				var iTo=iFrom+nBlockSize; if(iTo>nFileSize) iTo=nFileSize;
				vBlocks.push('[ ' + iFrom + ' - ' + iTo + ' )');
				iFrom+=nBlockSize;
			}
		}else{
			vBlocks.push('[No data available]');
		}

		var vFields = [
					{sField: "comboedit", sLabel: _lc2('Range', 'Choose one of data blocks of the file')+' ['+sFn+']', vItems: vBlocks, sInit: localStorage.getItem(sCfgKey2)||vBlocks[0], bReq: true}
				];

		var vRes = input(plugin.getScriptTitle(), vFields, {nMinSize: 500, bVert: true});
		if(vRes && vRes.length>0){

			var sRange=vRes[0];

			localStorage.setItem(sCfgKey2, sRange);

			sRange=sRange.replace(/[-|,~;:\/\\]+/g, '-').replace(/[\[\]\(\)\s]/g, '');

			var v=sRange.split('-'), c=v.length;

			if(c>0){
				var sFrom=v[0], sTo='';
				if(c>1){
					sTo=v[1];
				}

				var iFrom=parseInt(sFrom), iTo=parseInt(sTo);
				if(iFrom<0 || iFrom>=nFileSize) iFrom=0;
				if(iTo<=0) iTo=iFrom+nBlockSize;
				if(iTo<iFrom){var x=iFrom; iFrom=iTo; iTo=x;}

				if(iFrom>=0 && iTo>0 && iFrom<iTo){

					var _toHex=function(ba, nCol){
						var sRes='', nLen=ba.size(), nRow=Math.floor(nLen/nCol); if((nLen%nCol)!=0) nRow++;
						for(var j=0; j<nRow; ++j){
							var sHex='', sAsc='', sAddr=(j*nCol+iFrom).toString(16); while(sAddr.length<16) sAddr='0'+sAddr;
							for(var i=0; i<nCol; ++i){

								var p=j*nCol+i, n=ba.at(p, 0) & 0xff;

								var hx;
								if(n===0 && p>=ba.size()){
									hx='  ';
								}else{
									hx=n.toString(16);
									if(n<16) hx='0'+hx;
								}

								if(sHex) sHex+=' ';
								sHex+=hx;

								if(n>=0x20 && n<0x7f){
									sAsc+=String.fromCharCode(n);
								}else if(n===0 && p>=ba.size()){
									sAsc+=' ';
								}else{
									sAsc+='.';
								}
							}

							if(sRes) sRes+='\n';
							sRes+=sAddr+'  '+sHex+'  '+sAsc;
						}
						return sRes;
					};

					var nLen=iTo-iFrom, bProceed=true;
					if(nLen>nFileSize) nLen=nFileSize;
					if(nLen>=1024*512){
						var sMsg=_lc2('TooLarge', 'It may take a while and consume much memory to format so many bytes in hexadecimal format; Proceed?');
						bProceed=confirm(sMsg + '\n\n(' + nLen + ' bytes)');
					}

					if(bProceed){
						var ba=xFn.readBytes(iFrom, nLen);
						if(ba){
							textbox(
								{
									sTitle: plugin.getScriptTitle()
									, sDescr: _lc2('HexData', 'Hex data of the file') + ': '+ sFn
									, sDefTxt: _toHex(ba, 16)
									, bReadonly: true
									, bWordwrap: false
									, bFixedPitch: true
									, nWidth: 60
									, nHeight: 90
								}
							);
						}
					}
				}
			}
		}

	}

//}catch(e){
//	alert(e);
//}
