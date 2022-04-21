
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

//
//Map of Language ID and suffix name for Syntax highlighting
//

var syntaxFor = function(sExt, xOpt){
	let vRes=[];
	sExt=(''+sExt).toLowerCase().replace(/^\s+|\s+$/g, '');
	if(sExt){
		//map of (patterns: filetypes)
		let m = {
			//2021.6.11 avoid too many patterns that may significantly slow down response;
			'html': 'html;htm;xml;qrich'
			, 'txt': 'txt'
			, 'md': 'md;mark;markdown'

			//, 'html,url,num,time,thread': 'html;htm;xml;qrich'
			//, 'txt,url,num,time,thread': 'txt'
			//, 'md,url,num,time,thread': 'md;mark;markdown'

			//, 'url': '' //per user preferences
			//, 'num': ''
			//, 'thread': ''

			, 'cpp': 'c;cc;cpp;cxx;c++;h;hpp;hxx'
			, 'java': 'java'
			, 'csharp': 'cs'
			, 'js': 'js;json'
			, 'sql': 'sql'
			, 'php': 'php'
			, 'go': 'go'
			, 'vb': 'vb'
			, 'python': 'py'
			, 'pl': 'pl;cgi'
			, 'actionscript': 'as'
			, 'ruby': 'rb;rbw'
			, 'delphi': 'pas'
			, 'bash': 'sh'
			, 'objc': 'm;mm' //2016.4.20 'm' conflicts with 'matlib'
			, 'swift': 'swift'
			, 'css': 'css;qss'
			, 'rust': 'rs'
			, 'r': 'r'
			, 'ini': 'ini'
			, 'nyfjs': 'nyfjs'
			, 'nyflog': 'nyflog'
		};
		for(let s in m){
			let vExts = m[s].toLowerCase().split(/[;,\s]+/);
			if(vExts.indexOf(sExt) >= 0){
				vRes = s.split(/[\s,;+:/\\]+/);
			}
		}

		if(sExt==='m'){
			let sSrc=''; if(xOpt) sSrc=xOpt['sCode'] || xOpt['sSourceCode'] || '';
			//2016.4.20 to resolve conflicts of .m suffix between Objective-C and MatLib;
			if(sSrc.search(/\n\s*%.+/)>=0 || sSrc.search(/\n*\s*#import\s*<.*?>/)<0 || sSrc.search(/\bNS\w{2,64}\b/)<0 || sSrc.search(/\bmatlib\b/i)>0){
				vRes=['matlib'];
			}
		}

		if(xOpt){
			if(xOpt.thread) vRes.push('thread');
			if(xOpt.url) vRes.push('url');
			if(xOpt.num) vRes.push('num');
			if(xOpt.date) vRes.push('date');
			if(xOpt.time) vRes.push('time');
		}
	}
	return vRes;
};
