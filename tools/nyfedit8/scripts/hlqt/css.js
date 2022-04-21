
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var sTitle="CSS";

var sTags_Keywords='@[a-z0-9-_]{1,40}\\b';

var sTags_AttrName='(\\b[a-z\\-]{1,32})(?=\\s*:\\s*.+;)';

var sTags_AttrVal='(\\s*:\\s*)(.+)(?=\s*;)';

var vTags=[
	{pattern: sTags_Keywords, nocase: false, classname: 'tag'} //@xxxxx

	, {pattern: sTags_AttrName, nocase: false, classname: 'attrname'}
	, {pattern: sTags_AttrVal, nocase: false, classname: 'attrval'}

	//consider of multiple class names: body, p, div, li{....}
	, {pattern: '^\\s*[a-z0-9.~!*#$%^&+_,\\-\\s\\(\\):="\'\\[\\]{}<>]{1,512}(?=\\s*\\{\\s*$|\\s*$)', nocase: true, classname: 'tag2'} //class/id/tags;

	, {pattern: "\\b([0-9.]+|0x[0-9a-f]+)\\b", nocase: true, classname: 'num'}
	, {pattern: "(\"[^\"]*\"|'[^']*')", nocase: false, classname: 'string'}

];

var vComments=[
	{start: '/*', end: '*/', regexp: false, nocase: false, classname: 'rem'} //multi-line comments
];
