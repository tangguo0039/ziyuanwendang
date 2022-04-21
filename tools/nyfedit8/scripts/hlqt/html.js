
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var sTitle="HTML";

var vTags=[
	{pattern: "(<!?[a-zA-Z:0-9]+\\b|<\\?[a-zA-Z:0-9]+\\b|\\?>|>|/>|</[a-zA-Z:0-9]+>)", nocase: true, classname: 'tag'}
	, {pattern: "[a-zA-Z:0-9]+=", nocase: true, classname: 'attrname'}
	, {pattern: "(\"[^\"]*\"|'[^']*')", nocase: true, classname: 'attrval'}
];

var vComments=[
	{tags: ["<!--", "-->"], nocase: false, classname: 'rem'}
];


