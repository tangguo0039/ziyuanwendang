
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var sTitle="ActionScript";

//http://help.adobe.com/zh_CN/ActionScript/3.0_ProgrammingAS3/WS5b3ccc516d4fbf351e63e3d118a9b90204-7f9b.html
var sTags_Keywords=
		'as,break,case,catch,class,const,default,delete,do,else,extends,finally'
		+ ',for,function,if,implements,import,in,instanceof,interface,internal,is'
		+ ',native,new,null,package,private,protected,public,return,super,switch,this'
		+ ',throw,try,typeof,use,var,void,while,with,dynamic,each,final,get,include'
		+ ',namespace,native,override,set,static'
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
