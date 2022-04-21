
/////////////////////////////////////////////////////////////////////
// Essential scripts for Mybase Desktop v8.x
// Copyright 2010-2021 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

if(typeof(String.prototype.trimRight)!=='function'){

	//2021.8.30 The latest marked.js requires String.trimRight that was somehow not yet implemented by QJSEngine in Qt-5.15.2;
	//this code will run in an internal JS Engine, rather than the webkit DOM space.

	//Note that arrow-functions don't work with prototypes; Use the keyword 'function' instead in order to redefine the prototype;

	String.prototype.trimRight=function(){ return this.replace(/[\s]+$/, ''); };

}

var _renderMarkdownSafely=(sMd)=>{

	//2020.3.7 math tags may conflict with markdown-formatting directives, e.g. underscores;
	//workaround:
	//change the default maths tags to html-like tags, like this: <math1>...</math1>
	//that prevents math blocks from accidentally being moved by marked.js;

	let sHtml='';

	if(typeof(marked)==='function'){ //&& sMd

		let mSubst={}, _get_unique_tag=function(){
			let tag;
			do{
				tag=Math.floor(Math.random()*0xffff).toString();
			}while(typeof(mSubst[tag])!=='undefined');
			return tag;
		};

		//firstly protect multi-line code blocks: ```...```
		if(sMd){
			//for multiple-line code blocks started with ```;
			//https://markdown.com.cn/extended-syntax/fenced-code-blocks.html
			sMd=sMd.replace(/(```|~~~)([\s\S]+?)\1/ig, function(m0, m1, m2){
				let tag=_get_unique_tag();
				mSubst[tag]={inline: false, code: m2};
				return '<codeblock>' + tag + '</codeblock>';
			});
		}

		//protect inline code snippets: `...`;
		if(sMd){
			//for inline code block started with `;
			sMd=sMd.replace(/(`)([\s\S]+?)\1/igm, function(m0, m1, m2){
				let tag=_get_unique_tag();
				mSubst[tag]={inline: true, code: m2};
				return '<inlinecode>' + tag + '</inlinecode>';
			});
		}

		//then protect the $$...$$ math blocks
		if(sMd){
			//let re=/((?<!\\)\$\$)([^$]+?)((?<!\\)\$\$)/; //Not supported in QScriptEngine;
			let re=/^[ \t]*(\$\$)([^$]+?)(\$\$)[ \t]*$/igm; //Leading/trailing spaces allowed, but CR/LF must be preserved;
			sMd=sMd.replace(re, function(m0, m1, m2, m3){
				//2020.3.11 for back-compatibility with nyf7, try first to unescape control tags;
				m2=m2.replace(/\\\\{$/igm, '\\{');
				m2=m2.replace(/\\\\\\\\$/igm, '\\\\');
				//return '<math2>' + m2 + '</math2>';
				let tag=_get_unique_tag();
				mSubst[tag]={inline: false, code: m2};
				return '<math2>' + tag + '</math2>';
			});
		}

		//protect relative path variables, like ${HOME} ${DB} etc.;
		if(sMd){
			let re=/\$\{[\w]{1,64}\}/igm;
			sMd=sMd.replace(re, function(m0){
				let tag=_get_unique_tag();
				mSubst[tag]={inline: true, code: m0};
				return '<relativepathvar>' + tag + '</relativepathvar>';
			});
		}

		//protect the inline $...$ maths;
		if(sMd){
			let v=sMd.split('\n');
			for(var i=0; i<v.length; ++i){

				let s=v[i];

				//2021.5.3 consider of '\$' input for literal $ characters in md;

				//Both '$' and '&dollar;' are recgonized as math tags by katex/mathjax;
				//so using the $dollar is infeasible; Use <dollarsymbol> instead;
				//s=s.replace(/(^|[^\\])(\\\$)/g, function(m0, m1, m2){
				//	return m1+'&dollar;';
				//});

				//protect the (escaped $) '\$' from being moved;
				s=s.replace(/(^|[^\\])((\\\$)+)/g, function(m0, m1, m2, m3){
					return m1+'<dollarsymbol>'+m2.replace(/[^$]/g, '').length+'</dollarsymbol>';
				});

				//consider unpaired '$' as the $ literal character,
				if( (s.replace(/[^$]/g, '').length % 2) !== 0 ){
					s=s.replace(/([$]+)/g, function(m0, m1){
						return '<dollarsymbol>'+m1.replace(/[^$]/g, '').length+'</dollarsymbol>';
					});
				}

				//protect the inline $...$ maths;
				s=s.replace(/(\$)([^$]+?)(\$)/g, function(m0, m1, m2, m3){
					//return '<math1>' + m2 + '</math1>';
					let tag=_get_unique_tag();
					mSubst[tag]={inline: true, code: m2};
					return '<math1>' + tag + '</math1>';
				});

				if(v[i]!==s) v[i]=s;
			}
			sMd=v.join('\n');
		}

		//and then protect multiple-line code blocks started with 4 blankspaces or '\t';
		//2021.3.25 indented code blocks may cause conflicts with indented data within $$...$$;
		//therefore, it's not recommended to use this syntax for code blocks;
		if(0 && sMd){
			let vTmp=[], vLines=sMd.split('\n'), _commit=function(i){
				if(vTmp.length>0){
					let tag=_get_unique_tag();
					mSubst[tag]={inline: false, code: '\n' + vTmp.join('\n') + '\n'};
					vLines[i]='<codeblock>' + tag + '</codeblock>';
					vTmp=[];
				}
			};
			for(let i=0; i<vLines.length; ++i){
				let s=vLines[i], m=s.match(/^([ ]{4,}|\t)(.+)$/);
				if(m && m.length>=2){
					vTmp.push(m[2]);
					vLines[i]='';
				}else{
					if(vTmp.length>0){
						_commit(i);
					}
				}
			}
			_commit(vLines.length-1);
			sMd=vLines.join('\n');
		}

		//all math blocks have been invisible to marked, it's safe to put back original code blocks before calling to marked();
		if(sMd){
			sMd=sMd.replace(/<(codeblock)>(\d+?)<\/\1>/ig, function(m0, m1, m2){
				let d=mSubst[m2];
				if(d && d.code){
					return '```' + d.code + '```';
				}else{
					return m0;
				}
			});

			sMd=sMd.replace(/<(inlinecode)>(\d+?)<\/\1>/ig, function(m0, m1, m2){
				let d=mSubst[m2];
				if(d && d.code){
					return '`' + d.code + '`';
				}else{
					return m0;
				}
			});
		}

		//2021.9.1 The marked() may percent-encode the special characters: '<' and '>' for relative filepath variables referred by <img> <a>;
		//so relative path variables should be put back before calling marked();
		if(sMd){
			sMd=sMd.replace(/<(relativepathvar)>(\d+?)<\/\1>/ig, function(m0, m1, m2){
				let d=mSubst[m2];
				if(d && d.code){
					return d.code;
				}else{
					return m0;
				}
			});
		}

		if(sMd){

			sHtml=marked(sMd);

			//put back inline math equations after calling marked();
			sHtml=sHtml.replace(/<(math1)>(\d+?)<\/\1>/ig, function(m0, m1, m2){
				let d=mSubst[m2];
				if(d && d.code){
					return '$' + d.code + '$';
				}else{
					return m0;
				}
			});

			//put back multi-line math blocks after calling marked();
			sHtml=sHtml.replace(/<(math2)>(\d+?)<\/\1>/ig, function(m0, m1, m2){
				let d=mSubst[m2];
				if(d && d.code){
					return '$$' + d.code + '$$';
				}else{
					return m0;
				}
			});

			//put back special characters after calling marked();
			sHtml=sHtml.replace(/<(dollarsymbol)>(\d+?)<\/\1>/ig, function(m0, m1, m2){
				let n=parseInt(m2), s=''; while(n-- > 0) s+='&dollar;';
				return '<code class=CLS_LiteralDollars>'+s+'</code>';
			});

		}
	}else{
		logd('Marked.js not installed properly.');
	}

	return sHtml;
};
