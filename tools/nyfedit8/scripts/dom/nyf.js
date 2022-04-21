
/////////////////////////////////////////////////////////////////////
// Essential scripts for Mybase Desktop v8.x
// Copyright 2010-2021 Wjj Software. All rights Reserved.
// Website: www.wjjsoft.com  Contact: info@wjjsoft.com
/////////////////////////////////////////////////////////////////////
// This code is property of Wjj Software (WJJSOFT). You may not use it
// for any commercial purpose without preceding consent from authors.
/////////////////////////////////////////////////////////////////////

//console.debug("<webchannel.js started> qt=" + typeof(qt) + ' QWebChannel=' + typeof(QWebChannel) + ' g_xWebChannel=' + typeof(g_xWebChannel));

if(typeof(g_xWebChannel)==='undefined'){

	let _log=(f, v0)=>{
		let v=[];
		for(let x of v0){
			if(typeof(x)!=='undefined'){
				v.push((''+x).replace(/[\r\n]+/g, '\\n'));
			}
		}
		if(v.length>0) f('dom: '+v.join(''));
	};

	let _init_console=()=>{
		//2020.7.19 redirect all console messages to nyf events log viewer;
		//2021.6.18 katex may call console.error with multiple arguments;
		console.debug=(a, b, c, d, e, f, g)=>{_log(nyf.logd, [a, b, c, d, e, f, g]);};
		console.warn=(a, b, c, d, e, f, g)=>{_log(nyf.logw, [a, b, c, d, e, f, g]);};
		console.error=(a, b, c, d, e, f, g)=>{_log(nyf.logc, [a, b, c, d, e, f, g]);};
		console.log=(a, b, c, d, e, f, g)=>{_log(nyf.logi, [a, b, c, d, e, f, g]);};
		console.info=(a, b, c, d, e, f, g)=>{_log(nyf.logi, [a, b, c, d, e, f, g]);};
	};

	if(typeof(QWebChannel)!='undefined' && typeof(qt)!='undefined' && typeof(qt.webChannelTransport)!='undefined'){

		//console.debug("<new QWebChannel>: " + typeof(qt.webChannelTransport));

		var g_xWebChannel=new QWebChannel(qt.webChannelTransport, function(channel){

			//console.debug("<Bridge/nyf>");
			nyf = channel.objects.nyf;
			//console.debug('<Bridge/nyf/Done> nyf=' + typeof(nyf));

			_init_console();
		});

	}else{

		_init_console();
		//console.debug("Use QtWebKit with QtWebEngine stripped off.");
	}
}else{
	console.debug("<g_xWebChannel exists>: " + typeof(g_xWebChannel));
}

