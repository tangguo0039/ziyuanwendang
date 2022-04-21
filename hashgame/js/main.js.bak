//拷贝内容到剪贴板


function copy(textDiv, btn) {
	let text = $(textDiv).text();
	var clipboard = new Clipboard(btn, {
		text: function () {
			return text;
		}
	});
	clipboard.on('success', function (e) {
		msg('copy success');
	});
	clipboard.on('error', function (e) {
		msg(e);
	});
}

//弹出页面小提示
function msg(str, time) {
	if (!time) {
		time = 3000;
	}
	$('#tipDiv').html(str).show().css({
		'opacity': 1,
		'top': '30%'
	});
	setTimeout(function () {
		$('#tipDiv').css({
			'opacity': 0,
			'top': '35%'
		});
		setTimeout(function () {
			$('#tipDiv').css({
				'top': '25%'
			}).hide();
		}, 1000);
	}, time);
}

//选择流程
function showCircuit(num) {
	$('.circuitDiv .side li').removeClass('cur');
	$('.circuitDiv .side li[data-num=' + num + ']').addClass('cur');
	$('.circuitDiv .blocks .item').hide();
	$('.circuitDiv .blocks .item[data-num=' + num + ']').show();
}

//选择“为什么”
function showWhy(num) {
	$('.whyDiv .buts li').removeClass('cur');
	$('.whyDiv .buts li[data-num=' + num + ']').addClass('cur');
	$('.whyDiv .blocks .item').removeClass('cur');
	$('.whyDiv .blocks .item[data-num=' + num + ']').addClass('cur');
	var ageWidth = parseInt($('.whyDiv .blocks .item').width() + 2);
	$('.whyDiv .blocks').css('margin-left', (ageWidth * (num - 1) * -1) + 'px');
}

//显示浮窗
function showWin(divName) {
	$('.winDiv .item').hide();
	$('.winDiv .' + divName).show();
	$('.winDiv').fadeIn(200);
	$('.winMask').fadeIn(200);
}

//监听滚动条，设置导航条透明度
$(window).scroll(function () {
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	if (scrollTop > 18) {
		$('.headNav').addClass('in');
	} else {
		$('.headNav').removeClass('in');
	}
})

//顶部导航栏点击事件
$('.headNav a').click(function () {
	var href = $(this).data('href');
	if (href.indexOf("#") != -1) {
		var headNavHeight = $('.headNav').height();
		$('html, body').animate({
			scrollTop: $(href).offset().top - headNavHeight
		}, 500);
	} else {
		showWin(href);
	}
	return false;
});

//绑定流程按钮
$('.circuitDiv .side li').click(function (event) {
	showCircuit($(this).data('num'));
});

//绑定"为什么"按钮
$('.whyDiv .buts li').click(function (event) {
	showWhy($(this).data('num'));
});

//绑定浮窗关闭按钮
$('.winDiv .colse').click(function (event) {
	$('.winDiv').fadeOut(200);
	$('.winMask').fadeOut(200);
});





$('.winMask').click(function (event) {
	$('.winDiv').fadeOut(200);
	$('.winMask').fadeOut(200);
});

//绑定边栏按钮
$('.sideDiv ul li').click(function (event) {
	showWin($(this).data('type'));
});

//常见问题展开按钮
$('.faqDiv .list ul li button').click(function (event) {
	if ($(this).text() == '展开') {
		$(this).parent().find('div').css({
			height: 'auto',
			overflow: 'scroll'
		});
		$(this).html('收起');
	} else {
		$(this).parent().find('div').css({
			height: '12vw',
			overflow: 'hidden'
		});
		$(this).html('展开');
	}
});

//显示默认流程和“为什么”
showCircuit(1);
showWhy(1);

// showWin('yy');

//隐藏提示层：在CSS中写 display:none; 会影响动画效果，故在此执行初始化隐藏
$('#tipDiv').hide();
console.log(999)
$.ajax({
	type: "POST",
	url: "/member/index",
	success: function (result) {
		const {
			code,
			data: {
				telegramUrl,
				transAddress,
				transQrBase64,
				whatsapp
			}
		} = result;
		if (result.code == 20000) {
			$('.whatsapp').attr('href', whatsapp)
			$('.telegram').attr('href', telegramUrl)
			$('.hashAddress').html(transAddress)
		/*	$('.transQr').append(`<img src='/assets/index/image/qrcode.png' />`)*/
		} else {
			cocoMessage.info(result.msg);
		}
	},
	complete: function () {
		setTimeout(function () {
			$("input[name='Login_btn']").removeAttr("disabled");
		}, 2000);
	},
});
// 登陆事件
$("input[name='Login_btn']").on('click', function () {

	var account = document.getElementsByName('account')[0].value;

	var password = document.getElementsByName('password')[0].value;

	if (account == null || account == undefined || account == '' || account.length < 0) {
		cocoMessage.error('地址为空，请检查输入');
		return;
	}

	if (password == null || password == undefined || password == '' || password.length < 0) {
		cocoMessage.error('密码为空，请检查输入');
		return;
	}

	if (password.length < 6) {
		cocoMessage.error('密码最少需要6位，请检查输入');
		return;
	}


	$.ajax({
		type: "POST",
		url: "member/login",
		data: {
			walletAddress: account,
			password: password
		},
		beforeSend: function () {
			cocoMessage.info('正在登陆,请等待', 800);
			$("input[name='Login_btn']").attr({
				disabled: "disabled"
			});
		},
		success: function (result) {
			if (result.code == 20000) {
				cocoMessage.success('登陆成功');
				localStorage.setItem("token", result.data.token);
				localStorage.setItem("account", result.data.account);
				window.location.href = '/index/user/index.html';
			} else {
				cocoMessage.info(result.msg);
			}
		},
		complete: function () {
			setTimeout(function () {
				$("input[name='Login_btn']").removeAttr("disabled");
			}, 2000);
		},
	});
});

// 登陆事件
$("input[name='Login_btn_en']").on('click', function () {

	var account = document.getElementsByName('account')[0].value;

	var password = document.getElementsByName('password')[0].value;

	if (account == null || account == undefined || account == '' || account.length < 0) {
		cocoMessage.error('address is empty');
		return;
	}

	if (password == null || password == undefined || password == '' || password.length < 0) {
		cocoMessage.error('password is empty');
		return;
	}

	if (password.length < 6) {
		cocoMessage.error('The password must be at least six characters');
		return;
	}


	$.ajax({
		type: "POST",
		url: "member/login",
		data: {
			walletAddress: account,
			password: password
		},
		beforeSend: function () {
			cocoMessage.info('Logging in, please wait', 800);
			$("input[name='Login_btn']").attr({
				disabled: "disabled"
			});
		},
		success: function (result) {
			if (result.code == 20000) {
				cocoMessage.success('Log in successfully');
				localStorage.setItem("token", result.data.token);
				localStorage.setItem("account", result.data.account);
				window.location.href = '/index/user/index_en.html';
			} else {
				cocoMessage.info(result.msg);
			}
		},
		complete: function () {
			setTimeout(function () {
				$("input[name='Login_btn']").removeAttr("disabled");
			}, 2000);
		},
	});
});



// 注册事件

$("input[name='Ret_Login_Btn']").on('click', function () {

	var address = document.getElementsByName('reg_address')[0].value;
	var password = document.getElementsByName('reg_password')[0].value;
	// var token = document.getElementsByName('__token__')[0].value;
	var inviteCode = document.getElementsByName('inviteCode')[0].value;


	if (address == null || address == undefined || address == '' || address.length < 0) {
		cocoMessage.info('地址为空，请检查输入');
		return;
	}

	if (password == null || password == undefined || password == '' || password.length < 0) {
		cocoMessage.info('密码为空，请检查输入');
		return;
	}

	if (password.length < 6) {
		cocoMessage.info('密码最少需要6位，请检查输入');
		return;
	}


	$.ajax({
		type: "POST",
		url: "/member/register",
		data: {
			walletAddress: address,
			password: password,
			inviteCode: inviteCode
		},
		beforeSend: function () {
			cocoMessage.info('正在注册,请等待', 1000);
			$("input[name='Ret_Login_Btn']").attr({
				disabled: "disabled"
			});
		},
		success: function (result) {
			if (result.code == 20000) {
				cocoMessage.success('注册成功',1000);
				localStorage.setItem("token", result.data.token);
				localStorage.setItem("account", result.data.account);
				window.location.href = '/index.html';
			} else {
				cocoMessage.info(result.msg);
			}
		},
		complete: function () {
			setTimeout(function () {
				$("input[name='Ret_Login_Btn']").removeAttr("disabled");
			}, 2000);
		},
	});

});



// 注册事件

$("input[name='Ret_Login_Btn_en']").on('click', function () {

	var address = document.getElementsByName('reg_address')[0].value;
	var password = document.getElementsByName('reg_password')[0].value;
	// var token = document.getElementsByName('__token__')[0].value;
	var inviteCode = document.getElementsByName('inviteCode')[0].value;


	if (address == null || address == undefined || address == '' || address.length < 0) {
		cocoMessage.info('address is empty');
		return;
	}

	if (password == null || password == undefined || password == '' || password.length < 0) {
		cocoMessage.info('password is empty');
		return;
	}

	if (password.length < 6) {
		cocoMessage.info('The password must be at least six characters');
		return;
	}


	$.ajax({
		type: "POST",
		url: "/member/register",
		data: {
			walletAddress: address,
			password: password,
			inviteCode: inviteCode
		},
		beforeSend: function () {
			cocoMessage.info('Registration in progress, please wait', 1000);
			$("input[name='Ret_Login_Btn']").attr({
				disabled: "disabled"
			});
		},
		success: function (result) {
			if (result.code == 20000) {
				cocoMessage.success('Log in successfully',1000);
				localStorage.setItem("token", result.data.token);
				localStorage.setItem("account", result.data.account);
				window.location.href = '/index_en.html';
			} else {
				cocoMessage.info(result.msg);
			}
		},
		complete: function () {
			setTimeout(function () {
				$("input[name='Ret_Login_Btn']").removeAttr("disabled");
			}, 2000);
		},
	});

});