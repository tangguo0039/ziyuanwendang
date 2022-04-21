
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2021 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

//var sTitle="Date";

var vTags=[
		//patterns for date-like strings to highlight;

		//date: yyyy-mm-dd, mm-dd-yyyy, dd-mm-yyyy, 2021-05-21, 05-21-2021, 21/5/2021
		{pattern: "\\b([1-2][\\d]{3}([/\\-\\.])[\\d]{1,2}\\2[\\d]{1,2}|[\\d]{1,2}([/\\-])[\\d]{1,2}\\3[\\d]{4})\\b", nocase: false, classname: 'date'}

		//date/uk: dd/MM/yyyy, 12/Mar/2021
		, {pattern: "\\b[\\d]{1,2}([/\\-\\.])(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)([a-z]{0,5})?\\1[1-2][\\d]{3}\\b", nocase: true, classname: 'date'}

		//date/us: MM/dd/yyyy, MM-dd-yyyy, Mar/12/2021
		, {pattern: "\\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)([a-z]{0,5})?([/\\-\\.])[\\d]{1,2}\\3[1-2][\\d]{3}\\b", nocase: true, classname: 'date'}

	];

var vComments=[
];
