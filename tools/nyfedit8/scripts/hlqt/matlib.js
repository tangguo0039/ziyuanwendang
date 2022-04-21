
/////////////////////////////////////////////////////////////////////
// Extension scripts for Mybase Desktop v8.x
// Copyright 2010-2020 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

var sTitle="MatLib";

var sTags_MatLib_DT=
		'int8,uint8,int16,uint16,int32,uint32,int64,uint64,single,double,logical,char'
		;

var sTags_MatLib_KW=
		'break,case,catch,classdef,continue,else,elseif,end,enumerated,events'
		+ ',for,function,global,if,methods,otherwise,parfor,persistent,properties'
		+ ',return,spmd,switch,try,while'
		;

var sTags_MatLib_Const=
		'ans,eps,pi,inf,NaN,nan,i,j,nargin,nargout,realmax,realmin,Flops,bitmax,varargin,varargout'
		;

var sTags_MatLib_Builtin=
		'sin,sind,sinh,asin,asind,asinh,cos,cosd,cosh,acos,acosd,acosh,tan,tand,tanh,atan'
		+ ',atand,atan2,atanh,sec,secd,sech,asec,asecd,asech,csc,cscd,csch,acsc,acscd,acsch,cot'
		+ ',cotd,coth,acot,acotd,acoth,hypot,exp,expm1,log,log1p,log10,log2,pow2,realpow,reallog'
		+ ',realsqrt,sqrt,nthroot,nextpow2,abs,angle,complex,conj,imag,real,unwrap,isreal'
		+ ',cplxpair,fix,floor,ceil,round,mod,rem,sign,airy,besselj,bessely,besselh,besseli'
		+ ',besselk,beta,betainc,betaln,ellipj,ellipke,erf,erfc,erfcx,erfinv,expint,gamma'
		+ ',gammainc,gammaln,psi,legendre,cross,dot,factor,isprime,primes,gcd,lcm,rat,rats,perms'
		+ ',nchoosek,factorial,cart2sph,cart2pol,pol2cart,sph2cart,hsv2rgb,rgb2hsv,zeros,ones'
		+ ',eye,repmat,rand,randn,linspace,logspace,freqspace,meshgrid,accumarray,size,length'
		+ ',ndims,numel,disp,isempty,isequal,isequalwithequalnans,cat,reshape,diag,blkdiag,tril'
		+ ',triu,fliplr,flipud,flipdim,rot90,find,sub2ind,ind2sub,bsxfun,ndgrid,permute,ipermute'
		+ ',shiftdim,circshift,squeeze,isscalar,isvector,ans,eps,realmax,realmin,pi,i,inf,nan'
		+ ',isnan,isinf,isfinite,j,why,compan,gallery,hadamard,hankel,hilb,invhilb,magic,pascal'
		+ ',rosser,toeplitz,vander,wilkinson'
		;

var sTags_MatLib_Func=
		//'\\b\\w+?(?=\\()'  //2018.1.5 the '+?' non-greedy mode seemed redundant and actually not to work!
		'\\b\\w+(?=\\()'
		;

var vTags=[
	{tags: sTags_MatLib_DT, nocase: false, classname: 'tag'}
	, {tags: sTags_MatLib_KW, nocase: false, classname: 'tag1'}
	, {tags: sTags_MatLib_Const, nocase: false, classname: 'tag2'}
	, {tags: sTags_MatLib_Builtin, nocase: false, classname: 'tag3'}
	, {pattern: sTags_MatLib_Func, nocase: true, classname: 'tag3'}

	, {pattern: "\\b([0-9.]+|0x[0-9a-f]+)\\b", nocase: true, classname: 'num'}
	, {pattern: "(\"[^\"]*\"|'[^']*')", nocase: false, classname: 'string'}

	, {pattern: "%.*$", nocase: false, classname: 'rem'} //single line comments
];

var vComments=[
	{start: '%{', end: '}%', regexp: false, nocase: false, classname: 'rem'} //multi-line comments
];
