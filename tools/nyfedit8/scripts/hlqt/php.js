
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var sTitle="PHP";

var sTags_Keywords=
		'and,or,xor,__FILE__,exception'
		+ ',__LINE__,array,as,break,case'
		+ ',class,const,continue,declare,default'
		+ ',die,do,echo,else,elseif'
		+ ',empty,enddeclar,endfor,endforeach,endif'
		+ ',endswitch,endwhile,eval,exit,extends'
		+ ',for,foreach,function,global,if'
		+ ',include,include_once,isset,list,new'
		+ ',print,require,require_once,return,static'
		+ ',switch,unset,use,var,while'
		+ ',__FUNCTION__,__CLASS__,__METHOD__,final,php_user_filter'
		+ ',interface,implements,extends,public,private'
		+ ',protected,abstract,clone,try,catch'
		+ ',throw,cfunction,this'
		;

var vTags=[
	{tags: sTags_Keywords, nocase: false, classname: 'tag'}

	, {pattern: "\\b([0-9.]+|0x[0-9a-f]+)\\b", nocase: true, classname: 'num'}
	, {pattern: "(\"[^\"]*\"|'[^']*')", nocase: false, classname: 'string'}

	, {pattern: "//.*$", nocase: false, classname: 'rem'} //single line comments
];

var vComments=[
	{start: '/*', end: '*/', regexp: false, nocase: false, classname: 'rem'} //multi-line comments
];
