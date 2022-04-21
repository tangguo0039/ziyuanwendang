
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2021 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

//var sTitle="URL"; //Comment out to delist from UI menus;

var vTags=[
		//website urls containing protocol scheme, 2 or more parts required in hostnames;
		//https://stackoverflow.com/questions/1547899/which-characters-make-a-url-invalid
		//Now we consider these allowed characters: [a-z0-9-._~:/?#[]@!$&'(){}*+,;=%|]
		//https://abc.com/
		//https://www.abc.com/dir/file.html
		//https://www.abc.com/dir/file.html?q1=v1&q2=v2#fragment
		//, {pattern: "\\b((http|https|ftp|ftps|sftp|gopher)://)[a-z0-9-]{1,63}(\\.[a-z0-9-]{1,63}){0,3}\\.([a-z]{2,6})(/[a-z0-9~@#$%&*?\\(\\)-=_+]+)?\\b", nocase: true, classname: 'url'}
		//{pattern: "\\b((http|https|ftp|ftps|sftp|gopher)://)[a-z0-9-]{1,63}(\\.[a-z0-9-]{1,63}){0,3}\\.([a-z]{2,6})(/[a-z0-9-._~:/?#\\[\\]@!$&(){}*+,=%|\u0100-\uffff]+)?\\b", nocase: true, classname: 'url'}

		////website urls with/without protocol schemes but having at least 3 parts required in hostnames;
		////www.abc.com
		//, {pattern: "\\b((http|https|ftp|ftps|sftp|gopher)://)?[a-z0-9-]{1,63}(\\.[a-z0-9-]{1,63}){1,3}\\.([a-z]{2,6})(/[a-z0-9-._~:/?#\\[\\]@!$&(){}*+,=%|\u0100-\uffff]+)?\\b", nocase: true, classname: 'url'}

		////website urls under common domains: https://data.iana.org/TLD/tlds-alpha-by-domain.txt
		////abc.com, abc.com.hk
		//, {pattern: "\\b((http|https|ftp|ftps|sftp|gopher)://)?[a-z0-9-]{1,63}(\\.[a-z0-9-]{1,63}){0,3}\\.(com|net|org|info|biz|xyz|co|tv|tel|ai|us|cn|sg|hk|de|tw|jp|au|nz|nl|no|ru|my|be|br)(/[a-z0-9-._~:/?#\\[\\]@!$&(){}*+,=%|\u0100-\uffff]+)?\\b", nocase: true, classname: 'url'}

		////website urls using IPs
		////https://127.0.0.1/sub/dir/file.html
		//, {pattern: "\\b((http|https|ftp|ftps|sftp|gopher)://)?[0-9]{1,3}(\\.[0-9]{1,3}){3}(/[a-z0-9-._~:/?#\\[\\]@!$&(){}*+,=%|\u0100-\uffff]+)?\\b", nocase: true, classname: 'url'}

		////nyf://entry?...
		//, {pattern: "\\b(nyf://entry\\?)([a-z0-9-._~:/#\\[\\]@!$&(){}+,=%|\u0100-\uffff]+)\\b", nocase: true, classname: 'url'} //no ? *;

		//2021.6.12 urls with limited protocol schemes, top-level domains unlimited;
		{pattern: "\\b(file|https?|s?ftp|ftps|mailto|gopher|ed2k|flashget|thunder|news|tel|sms|nyf)(://)([a-z0-9+-]{1,63}?(\\.[a-z0-9+-]{1,63}){0,3}\\.[a-z]{2,6}|[a-z0-9+-]{1,16})[/]?([a-z0-9-._~:/?#\\[\\]@!$&(){}*+,=%|\u0100-\uffff]+)?\\b", nocase: true, classname: 'url'}

		//2021.6.12 urls with or without protocol schemes, but top-level domain names limited;
		//https://www.namecheap.com/blog/most-popular-domain-extensions/
		//https://www.thoughtco.com/most-common-tlds-internet-domain-extensions-817511
		, {pattern: "\\b([a-z][a-z0-9+-]{0,16}://)?([a-z0-9+-]{1,63})(\\.[a-z0-9+-]{1,63}){0,3}\\.(com|net|org|edu|mil|info|biz|tel|mobi|name|club|shop|wang|online|xyz|ai|io|me|ca|cn|co|tv|us|uk|sg|hk|de|ch|fr|tw|jp|au|nz|nl|no|be|br|se|es|ru|mx|in)\\b([a-z0-9-._~:/?#\\[\\]@!$&(){}*+,=%|\u0100-\uffff]+)?\\b", nocase: true, classname: 'url'}

		//email addresses;
		, {pattern: "\\b(mailto:)?[a-z0-9_+.-]{1,32}@([a-z0-9_-]+\\.){1,5}([a-z]{2,6})\\b", nocase: true, classname: 'email'}

		//file:///sub/dir/file.html
		//file://localhost/sub/dir/file.html
		, {pattern: "\\b(file://)(localhost)?/([a-z0-9-._~:/#\\[\\]@!$&(){}+,=%|\u0100-\uffff]+)\\b", nocase: true, classname: 'url'} //no ? *;

		];

var vComments=[
];
