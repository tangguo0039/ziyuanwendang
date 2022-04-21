
/////////////////////////////////////////////////////////////////////
// Essential scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var __xTweak={

	//tweaksForMermaid: function(){
	//	dom.traverseDomChildren(document.body, 0, null, function(e){
	//		//2019.9.11 marked.js generates code like this: <pre><code class="lang-mermaid">...</code></pre>
	//		//that needs to be replaced with <div class='mermaid'> ... </div> for auto-detection by mermaid.js
	//		if(e.nodeName.search(/^code$/i)===0){
	//			if((e.className||'').search(/mermaid/i)>=0){
	//				//console.debug(e.nodeName);
	//				var s=e.innerHTML;
	//				if(s){
	//					if(e.parentNode.nodeName.search(/^pre$/i)===0){
	//						e=e.parentNode;
	//					}
	//					var xDiv=document.createElement('div');
	//					xDiv.className='mermaid';
	//					xDiv.style.margin='1em 1em';
	//					xDiv.style.padding='1em 1em';
	//					xDiv.style.border='2px dotted black';
	//					xDiv.style.borderRadius='1em';
	//					xDiv.innerHTML=s;
	//					e.parentNode.replaceChild(xDiv, e);
	//				}
	//			}
	//		}
	//	});
	//}

	tweaksForInlineCode: function(){
		var _pre=function(e){
			while(e){
				var p=e.parentNode;
				if(p && p.nodeName.toLowerCase()==='pre'){
					return p;
				}
				e=p;
			}
		};
		dom.traverseDomChildren(document.body, 0, null, function(e){
			//2020.5.29 set class for inline code blocks with no <pre> surrounded;
			//By default, only stylesheets for <pre> are pre-defined;
			//2021.5.3 consider of liter dollars: <code class="CLS_LiteralDollars">$</code>
			if(e && e.nodeName && e.nodeName.search(/^code$/i)===0 && !e.className){
				if(!_pre(e)){
					e.className='CLS_InlineCode';
				}
			}
		});
	}

};

if(dom) dom.extend(__xTweak, 'tweak');
