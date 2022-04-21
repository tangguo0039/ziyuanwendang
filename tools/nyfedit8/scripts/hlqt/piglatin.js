
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var sTitle="PigLatin";

var sTags_PigLatin=
		'ABS,ACOS,ARITY,ASIN,ATAN,AVG,BAGSIZE,BINSTORAGE,BLOOM,BUILDBLOOM,CBRT,CEIL'
		+ ',CONCAT,COR,COS,COSH,COUNT,COUNT_STAR,COV,CONSTANTSIZE,CUBEDIMENSIONS,DIFF,DISTINCT,DOUBLEABS'
		+ ',DOUBLEAVG,DOUBLEBASE,DOUBLEMAX,DOUBLEMIN,DOUBLEROUND,DOUBLESUM,EXP,FLOOR,FLOATABS,FLOATAVG'
		+ ',FLOATMAX,FLOATMIN,FLOATROUND,FLOATSUM,GENERICINVOKER,INDEXOF,INTABS,INTAVG,INTMAX,INTMIN'
		+ ',INTSUM,INVOKEFORDOUBLE,INVOKEFORFLOAT,INVOKEFORINT,INVOKEFORLONG,INVOKEFORSTRING,INVOKER'
		+ ',ISEMPTY,JSONLOADER,JSONMETADATA,JSONSTORAGE,LAST_INDEX_OF,LCFIRST,LOG,LOG10,LOWER,LONGABS'
		+ ',LONGAVG,LONGMAX,LONGMIN,LONGSUM,MAX,MIN,MAPSIZE,MONITOREDUDF,NONDETERMINISTIC,OUTPUTSCHEMA'
		+ ',PIGSTORAGE,PIGSTREAMING,RANDOM,REGEX_EXTRACT,REGEX_EXTRACT_ALL,REPLACE,ROUND,SIN,SINH,SIZE'
		+ ',SQRT,STRSPLIT,SUBSTRING,SUM,STRINGCONCAT,STRINGMAX,STRINGMIN,STRINGSIZE,TAN,TANH,TOBAG'
		+ ',TOKENIZE,TOMAP,TOP,TOTUPLE,TRIM,TEXTLOADER,TUPLESIZE,UCFIRST,UPPER,UTF8STORAGECONVERTER'
		;

var sTags_PigLatin2=
		'VOID,IMPORT,RETURNS,DEFINE,LOAD,FILTER,FOREACH,ORDER,CUBE,DISTINCT,COGROUP'
		+ ',JOIN,CROSS,UNION,SPLIT,INTO,IF,OTHERWISE,ALL,AS,BY,USING,INNER,OUTER,ONSCHEMA,PARALLEL'
		+ ',PARTITION,GROUP,AND,OR,NOT,GENERATE,FLATTEN,ASC,DESC,IS,STREAM,THROUGH,STORE,MAPREDUCE'
		+ ',SHIP,CACHE,INPUT,OUTPUT,STDERROR,STDIN,STDOUT,LIMIT,SAMPLE,LEFT,RIGHT,FULL,EQ,GT,LT,GTE,LTE'
		+ ',NEQ,MATCHES,TRUE,FALSE,DUMP'
		;

var vTags=[
	{tags: sTags_PigLatin, nocase: true, classname: 'tag'}
	, {tags: sTags_PigLatin2, nocase: true, classname: 'tag1'}

	, {pattern: "\\b([0-9.]+|0x[0-9a-f]+)\\b", nocase: true, classname: 'num'}
	, {pattern: "(\"[^\"]*\"|'[^']*')", nocase: false, classname: 'string'}

	, {pattern: "--.*$", nocase: false, classname: 'rem'} //single line comments
];

var vComments=[
	//{start: '/*', end: '*/', regexp: false, nocase: false, classname: 'rem'} //multi-line comments
];
