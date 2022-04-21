
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2021 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

//var sTitle="Number"; //Comment out to delist from UI menus;

var vTags=[

	//Digits/Floats/Integers(Dec, Hex);
	//{pattern: "\\b([0-9.]+|0x[0-9a-f]+)\\b", nocase: true, classname: 'num'}
	//{pattern: "((?=[^\\d])|\\b|^)([0-9.]+|0x[0-9a-f]+)((?=[^\\d])|\\b|$)", nocase: true, classname: 'num'}
	{pattern: "((0|\\\\)x[0-9a-f]+|[0-9]+\\.[0-9]+|[0-9]+)", nocase: true, classname: 'num'}

	//consider of numbers followed with common units;
	//, {pattern: "\\b([0-9]+)(\.[0-9]+)?(km|cm|kg|ml||g|h|k|L|m{1,2}|s|t|v|w|y|bytes?|ki?b|mi?b|gi?b|ti?b)?\\b", nocase: true, classname: 'num'}
	//, {pattern: "\\b([0-9.]+)(km|cm|kg|ml||g|h|k|L|m{1,2}|s|t|v|w|y|bytes?|ki?b|mi?b|gi?b|ti?b)?\\b", nocase: true, classname: 'num'}

];

var vComments=[
];
