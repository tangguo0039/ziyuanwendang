
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2021 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

//var sTitle="Thread"; //Comment out to delist from UI menus;

var vTags=[

		//patterns for thread/keywords to highlight;

		//2021.6.12 this is a shared pattern for both highlighter and context-based actions;
		//so make sure that keywords are embraced so they can be captured;
		//{pattern: "\\[\\[[^\\]]+\\]\\]", nocase: false, classname: 'thread'}
		//{pattern: "(?<=\\[\\[\\s*)([^\\[\\]]+)(?=\\s*\\]\\])", nocase: false, classname: 'thread'}
		{pattern: "(?<=\\[\\[)([^\\[\\]]+)(?=\\]\\])", nocase: false, classname: 'thread'}

	];

var vComments=[
];
