
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var sTitle="R";

var sTags_Keywords=
		'break,else,for,function,if,TRUE,in'
		+ ',next,repeat,return,while,FALSE,switch'
		+ ',NULL,NA,NaN,NA_integer_,NA_real_,NA_complex_,NA_character_'
		;

var vTags=[
	{tags: sTags_Keywords, nocase: false, classname: 'tag'}

	, {pattern: "\\b([0-9.]+|0x[0-9a-f]+)\\b", nocase: true, classname: 'num'}
	, {pattern: "(\"[^\"]*\"|'[^']*')", nocase: false, classname: 'string'}

	, {pattern: "#.*$", nocase: false, classname: 'rem'} //single line comments
];

var vComments=[
	//{start: '/*', end: '*/', regexp: false, nocase: false, classname: 'rem'} //multi-line comments
];
