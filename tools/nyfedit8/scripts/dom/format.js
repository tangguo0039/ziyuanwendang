
/////////////////////////////////////////////////////////////////////
// Essential scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var __xFmt={

	removeFormat: function(){
		if(dom.isContentEditable()){
			dom.beginEdit();
			dom.execCmd('removeFormat', null);
			dom.endEdit(300);
		}
	}

	, setTextFont: function(sFamily, nSize, bBold, bItalic, bUnderline, bStrikeOut){
		//2021.11.13 sFamily: String;
		//nSize: index of Html Font Size: [1, 7];
		//bBold, bItalic, bUnderline, bStrikeOut: boolean;
		if(dom.isContentEditable()){

			console.debug('<setTextFont> family=' + sFamily + ', nSize=' + nSize + ', bBold=' + bBold + ', bItalic=' + bItalic + ', bUnderline=' + bUnderline + ', bStrikeout=' + bStrikeOut);

			let _tobool=(s)=>{
				return /(true|yes|ok|positive|1)/i.test(s ? (''+s) : '');
			};

			dom.beginEdit();
			try{
				if(dom.queryCmdValue('FontName')!==sFamily) dom.execCmd('FontName', sFamily);
				if(parseInt(dom.queryCmdValue('FontSize'))!==nSize) dom.execCmd('FontSize', nSize);
				if(_tobool(dom.queryCmdValue('Bold'))!==bBold) dom.execCmd('Bold');
				if(_tobool(dom.queryCmdValue('Italic'))!==bItalic) dom.execCmd('Italic');
				if(_tobool(dom.queryCmdValue('Underline'))!==bUnderline) dom.execCmd('Underline');
				if(_tobool(dom.queryCmdValue('StrikeThrough'))!==bStrikeOut) dom.execCmd('StrikeThrough');
			}catch(e){  }
			dom.endEdit(500);
		}
	}

	, setTextFormat: function(sCmd, xVal){
		if(dom.isContentEditable()){
			dom.beginEdit();
			dom.execCmd(sCmd, xVal);
			dom.endEdit(500);
		}
	}

	, cssUtil: function(xElm, k, v){

		if(typeof(k)==='string'){
			console.debug('<cssUtil>: style=' + k + (v!==undefined?('=' + v + ' [Modify]'):' [Query]'));
		}else if(typeof(k)==='object'){
			//2021.8.31 d=[{key: 'aaa', val: 'bbb'}, {key: 'xxx', val: 'yyy'}];
			let d=k;
			if(1){let a=[]; for(let i in d){let x=d[i]; a.push(x.key+'=' + x.val);} console.debug('<cssUtil>: style=' + a.join('; ') + ' [Modify]');}
		}

		if(xElm && xElm.getAttribute){

			var sCssOld=xElm.getAttribute('style')||''; //<span style="line-height: 18px; margin: 3px;">

			var _parse_style=function(sCss){
				var v2=sCss.split(';'), xCss={};
				for(var i in v2){
					var a=utils.trim(v2[i]||'');
					var p=a.indexOf(':');
					if(p>0){
						var key=utils.trim(a.substr(0, p)), val=utils.trim(a.substr(p+1));
						if(key){
							xCss[key]=val;
						}
					}
				}
				return xCss;
			};

			var _set_style=function(xCss){

				var sCssNew='';
				for(var i in xCss||{}){
					var key=i, val=xCss[i];
					if(key && val){
						if(sCssNew) sCssNew+='; ';
						sCssNew+=key+':'+val;
					}
				}

				if(sCssNew===sCssOld){
					console.debug('<cssUtil>: style=' + sCssNew + ' @elm=' + xElm.nodeName + ' [Unchanged]');
				}else{
					xElm.setAttribute('style', sCssNew);
					console.debug('<cssUtil>: style=' + sCssNew + ' @elm=' + xElm.nodeName + ' [Modified]');
					return true; //modified;
				}
			};

			if(k === undefined){

				console.debug('<cssUtil>: style=' + sCssOld + ' @elm=' + xElm.nodeName + ' [Got]');
				return sCssOld; //return value of the attribute 'style';

			}else if(k.constructor === Array){

				if(k.length>0){
					var xCss=_parse_style(sCssOld)||{};
					for(var i in k){
						var d=k[i];
						var sKey=d.key||'', sVal=d.val||'';
						if(sKey){
							xCss[sKey]=sVal;
						}
					}
					return _set_style(xCss);
				}

			}else if(typeof(k) === 'string'){

				if(k){
					var xCss=_parse_style(sCssOld)||{};
					if(v === undefined){
						console.debug('<cssUtil>: ' + k + '=' + (xCss[k]||'') + ' [Got]');
						return xCss[k]||'';
					}else{
						xCss[k]=v||'';
						return _set_style(xCss);
					}
				}
			}
		}
	}

	, parCssUtil: function(d){

		//2021.8.31 d=[{key: 'aaa', val: 'bbb'}, {key: 'xxx', val: 'yyy'}];
		if(d){let v=[]; for(let i in d){let e=d[i]; v.push(e.key+'=' + e.val);} console.debug('<parCssUtil>: style=' + v.join('; ') + ' [Modify]');}

		var bDirty=false;

		var s_vTagsBlock='body|address|blockquote|center|code|div|p|pre|h1|h2|h3|h4|h5|h6|hr|dl|dd|dt|table|tbody|thead|tfoot|th|tr|td|ul|ol|li|fieldset|form|meta|link|title|colgroup|col'.split('|');

		var _is_block_elm=function(e){return e && (s_vTagsBlock.indexOf(e.nodeName.toLowerCase())>=0);};

		var _act_on_elm=function(xElm, iLevel, xUserData){

			var e=xElm; //console.debug('==> '+e.nodeName);

			//2015.5.21 Do not seek parent node, but just skip TEXT_NODE;
			//It may go beyond the current selection, as blankspace/CR/LF separators
			//between HTML tags are also parsed as 'TEXT_NODE's within DOM;
			//if(e.nodeType==Node.TEXT_NODE) e=e.parentNode;

			if(e && (e.nodeType===Node.ELEMENT_NODE || e.nodeType===Node.TEXT_NODE)){

				while(e && !_is_block_elm(e)){ //2015.5.21 only apply to the block-level tags;
					e=e.parentNode;
				}

				if(e && _is_block_elm(e)){
					if(dom.cssUtil(e, d)===true){
						bDirty=true;
					}
				}
			}

		};

		if(d){
			try{dom.traverseSelection(_act_on_elm);}catch(e){}
		}

		return bDirty;
	}

	, parAttrUtil: function(k, v){

		console.debug('<parAttrUtil>: ' + k + (v!==undefined?('=' + v + ' [Modify]'):' [Query]'));

		var bDirty=false, vRes=[];

		var s_vTagsBlock='body|address|blockquote|center|code|div|p|pre|h1|h2|h3|h4|h5|h6|hr|dl|dd|dt|table|tbody|thead|tfoot|th|tr|td|ul|ol|li|fieldset|form|meta|link|title|colgroup|col'.split('|');

		var _is_block_elm=function(e){return e && (s_vTagsBlock.indexOf(e.nodeName.toLowerCase())>=0);};

		var _act_on_elm=function(xElm, iLevel, xUserData){

			var e=xElm;

			//2015.5.21 Do not seek parent node, but just skip TEXT_NODE;
			//It may go beyond the current selection, as blankspace/CR/LF separators
			//between HTML tags are also parsed as 'TEXT_NODE's within DOM;
			//if(e.nodeType==Node.TEXT_NODE) e=e.parentNode;

			if(e && (e.nodeType===Node.ELEMENT_NODE || e.nodeType===Node.TEXT_NODE)){

				while(e && !_is_block_elm(e)){ //2015.5.21 only apply to the block-level tags;
					e=e.parentNode;
				}

				if(e && _is_block_elm(e)){
					var sAttrOld = e.getAttribute(k);
					if(v===undefined){
						//2015.8.7 to retrieve the existing values;
						if(sAttrOld) vRes.push(sAttrOld);
						console.debug('<parAttrUtil>: ' + k + '=' + sAttrOld + ' @elm=' + e.nodeName + ' [Got]');
					}else{
						if(sAttrOld !== v){
							e.setAttribute(k, v);
							bDirty=true;
							console.debug('<parAttrUtil>: ' + k + '=' + v + ' @elm=' + e.nodeName + ' [Modified]');
						}
					}
				}
			}

		};

		if(k){
			try{dom.traverseSelection(_act_on_elm);}catch(e){}
		}

		if(vRes.length>0){
			return vRes;
		}else{
			return bDirty;
		}
	}

};

if(dom) dom.extend(__xFmt, 'format');

