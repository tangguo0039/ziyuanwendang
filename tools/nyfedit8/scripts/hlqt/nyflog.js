
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

//var sTitle="Mybase Event Logs"; //Comment out to delist from UI menus;

var vTags=[
	{pattern: "^\\!\\s+.*$", nocase: true, classname: 'critical'}
	, {pattern: "^\\?\\s+.*$", nocase: true, classname: 'warning'}
	, {pattern: "^\\*\\s+.*$", nocase: true, classname: 'fatal'}
	, {pattern: "^\\$\\s+.*$", nocase: true, classname: 'urgent'}
	, {pattern: "^>\\s+.*$", nocase: true, classname: 'info'}
	, {pattern: "^\\.\\s+.*$", nocase: true, classname: 'debug'}
	, {pattern: "^>\\s+Prompt\/.*$", nocase: true, classname: 'prompt'}
	, {pattern: "^@\\s+.*$", nocase: true, classname: 'timestamp'}
];

var vComments=[
];
