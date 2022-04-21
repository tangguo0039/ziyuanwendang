
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2021 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

//https://www.w3cschool.cn/markdownyfsm/markdownyfsm-odm6256r.html
//http://wowubuntu.com/markdown/

var sTitle="Markdown";

var vTags=[
			//Numbers;
			//{pattern: "\\b([0-9.]+|0x[0-9a-f]+)\\b", nocase: true, classname: 'num'}

			//Heading (1-6);
			{pattern: "^#{1}\\s+(.+)$", nocase: false, classname: 'heading1'}
			, {pattern: "^#{2}\\s+(.+)$", nocase: false, classname: 'heading2'}
			, {pattern: "^#{3}\\s+(.+)$", nocase: false, classname: 'heading3'}
			, {pattern: "^#{4}\\s+(.+)$", nocase: false, classname: 'heading4'}
			, {pattern: "^#{5}\\s+(.+)$", nocase: false, classname: 'heading5'}
			, {pattern: "^#{6}\\s+(.+)$", nocase: false, classname: 'heading6'}

			//emphasis;
			//In case of: "image_file.jpg and vidio_file.avi", use inline code block quatation marks;
			, {pattern: "\\*([^*]+)\\*", nocase: false, classname: 'emphasis'}
			, {pattern: "_([^_]+)_", nocase: false, classname: 'emphasis'}

			//strong;
			, {pattern: "(\\*\\*)([^*]+)\\1", nocase: false, classname: 'strong'}
			, {pattern: "(__)([^_]+)\\1", nocase: false, classname: 'strong'}

			//Bullets;
			, {pattern: "^(\\s*[*+-])(\\s+)(.+)$", nocase: false, classname: 'bullet'}

			//Numbering;
			, {pattern: "^(\\s*\\d+\\.)(\\s+)(.+)$", nocase: false, classname: 'numbering'}

			//Images;
			//Usage 1: ![alt text](/path/to/img.jpg)
			//, {pattern: "[!]\\[[^\\[\\]]*\\]\\([^()\\s]+\\)", nocase: false, classname: 'image'}
			//Usage 2: ![alt text](/path/to/img.jpg "Title")
			//, {pattern: "[!]\\[[^\\[\\]]*\\]\\([^()\\s]+(\\s+\"[^\"]+\")?\\)", nocase: false, classname: 'image'}
			, {pattern: "([!])(\\[[^\\[\\]]*\\])(?=\\([^()]+\\))", nocase: false, classname: 'image'} //only leading ![xxxx] highlighted, urls are handled within url.js

			//Hyperlinks;
			//Usage 1: [example link](http://example.com/)
			//The negated lookbehind pattern (?!\\!) differentiates Links from Images;
			//JSEngine doesn't support negated lookbehind operator (?<!xxx), but (?!xxx) works well as tested;
			//, {pattern: "(?!\\!)\\[[^\\[\\]]+\\]\\([^()\\s]+\\)", nocase: false, classname: 'link'}
			//Usage 2: [example link](http://example.com/ "Title")
			//, {pattern: "(?!\\!)\\[[^\\[\\]]+\\]\\([^()\\s]+(\\s+\"[^\"]+\")?\\)", nocase: false, classname: 'link'} //not working;
			//, {pattern: "(?!\\!)(\\[[^\\[\\]]+\\])\\([^()]+\\)", nocase: false, classname: 'link'} //for whole url to be highlighted;
			, {pattern: "(?<![!])(\\[[^\\[\\]]*\\])(?=\\([^()]+\\))", nocase: false, classname: 'link'} //only leading [xxxx] highlighted, urls are handled within url.js

			//Usage 2:
			//traffic from [Google][1] than from [Yahoo][2] or [MSN][3].
			//[1]: http://google.com/        "Google"
			//[2]: http://search.yahoo.com/  "Yahoo Search"
			//[3]: http://search.msn.com/    "MSN Search"
			, {pattern: "^\\[\\d+\\]:\\s[^()\\s]+(\\s.*)?$", nocase: false, classname: 'ref'}
			, {pattern: "\\[[^\\[\\]]+\\]\\[\\d+\\]", nocase: false, classname: 'link'}

			//Images with HTML code
			, {pattern: "(<!?[a-zA-Z:]+\\b|<\\?[a-zA-Z:]+\\b|\\?>|(?<![>]|^)>|/>|</[a-zA-Z:]+>)", nocase: true, classname: 'tag'}
			, {pattern: "[a-zA-Z:]+=", nocase: true, classname: 'attrname'}
			, {pattern: "(\"[^\"]*\"|'[^']*')", nocase: true, classname: 'attrval'}

			//code with indentation;
			, {pattern: "^(    |\\t)(.+)$", nocase: false, classname: 'code'}

			//inline code blocks;
			, {pattern: "`[^`]+`", nocase: false, classname: 'code'}

			//inline math code;
			, {pattern: "\\$[^$]+?\\$", nocase: false, classname: 'math'}

			//email addresses; //moved into url.js
			//, {pattern: "[a-z0-9_+.-]{1,32}@([a-z0-9-_]+\\.){1,5}([a-z]{2,6})", nocase: false, classname: 'email'}

		];

var vComments=[
	{start: "^(\\s*)```(.*)?$", end: "^(\\s*)```(\\s*)$", regexp: true, nocase: false, classname: 'code'} //code blocks
	, {start: "^(\\s*)\\$\\$(.*)?$", end: "^(\\s*)\\$\\$(\\s*)$", regexp: true, nocase: false, classname: 'maths'} //maths code blocks
];
