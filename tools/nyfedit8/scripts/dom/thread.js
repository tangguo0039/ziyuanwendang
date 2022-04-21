
/////////////////////////////////////////////////////////////////////
// Essential scripts for Mybase Desktop v8.x
// Copyright 2010-2021 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var __xThread={

	//highlightThreads: function(){

	//	console.debug('dom.highlightThreads;');

	//	let vNodes=[];
	//	dom.traverseDomChildren(document.body, 0, null, function(e){
	//		if(e.nodeType===Node.TEXT_NODE){
	//			var s=utils.htmlDecode(e.nodeValue);
	//			if(s && s.length>4){
	//				var m, re=/(?<=\[\[)([^\]]+?)(?=\]\])/i, v=[];
	//				while( (m=s.match(re)) ){
	//					var l=s.substring(0, m.index), k=m[1], k1=k.replace(/^\s+/, ''), k2=k.replace(/\s+$/, '');
	//					s=s.substring(m.index+m[0].length); //skip the leading/traling square-brackets '[[ ... ]]';
	//					//console.debug('Found at ' + m.index + ':' + m[0]+ ':' + m[1] + ', ' + m.length + ' ==>' + l + ' k=' +k);
	//					m=k.match(/^(\s*)(.+?)(\s*)$/);
	//					if(m){
	//						l+=m[1];
	//						k=m[2];
	//						s=m[3]+s;
	//					}
	//					var elm=document.createElement('span'); elm.appendChild(document.createTextNode(k)); elm.className='CLS_THREAD';
	//					v.push(document.createTextNode(l), elm);
	//				}
	//				if(v.length>0){
	//					if(s) v.push(document.createTextNode(s));
	//					vNodes.push({e: e, v: v});
	//				}
	//			}
	//		}
	//	});

	//	for(var j=0; j<vNodes.length; ++j){
	//		var d=vNodes[j], e=d.e, v=d.v;
	//		for(var i=0; i<v.length; ++i){
	//			e.parentNode.insertBefore(v[i], e);
	//		}
	//		e.parentNode.removeChild(e);
	//	}
	//}

	highlightThreads: function(){

		//console.debug('dom.highlightThreads;');

		let vNodes=[], vKeys=[];
		dom.traverseDomChildren(document.body, 0, null, function(e){
			if(e.nodeType===Node.TEXT_NODE){
				var s=utils.htmlDecode(e.nodeValue);
				if(s && s.length>4){
					//2021.7.21 it seemed that qtwebkit doesn't support regexp lookahead/lookbehind;
					//var v=[], m, re=/(?<=\[\[)([^\]]+?)(?=\]\])/;
					var v=[], m, re=/(\[\[)([^\]]+?)(\]\])/;
					while( (m=s.match(re)) ){
						var l=s.substring(0, m.index+2), k=m[2], k1=k.replace(/^\s+/, ''), k2=k.replace(/\s+$/, '');
						s=s.substring(m.index+m[0].length-2); //skip the leading/traling square-brackets '[[ ... ]]';
						//console.debug('Found at ' + m.index + ':' + m[0]+ ':' + m[2] + ', ' + m.length + ' ==>' + l + ' k=' +k + ' s=' + s);
						m=k.match(/^(\s*)(.+?)(\s*)$/);
						if(m){
							l+=(m[1]).replace(/^[\s]+/, ' ');
							k=m[2];
							s=(m[3]+s).replace(/^[\s]+/, ' ');
							//console.debug('key: ' + k)
						}
						var elm=document.createElement('span'); elm.appendChild(document.createTextNode(k)); elm.className='CLS_THREAD';
						v.push(document.createTextNode(l), elm);
						vKeys.push(k);
					}
					if(v.length>0){
						if(s) v.push(document.createTextNode(s));
						vNodes.push({e: e, v: v});
					}
				}
			}
		});

		for(var j=0; j<vNodes.length; ++j){
			var d=vNodes[j], e=d.e, v=d.v;
			for(var i=0; i<v.length; ++i){
				e.parentNode.insertBefore(v[i], e);
			}
			e.parentNode.removeChild(e);
		}

		if(vKeys.length>0){
			console.debug('highlightThreads: ' + utils.uniq(vKeys).join(', '));
		}
	}

};

if(dom) dom.extend(__xThread, 'thread');
