//�������ݵ�������


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

//����ҳ��С��ʾ
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

//ѡ������
function showCircuit(num) {
	$('.circuitDiv .side li').removeClass('cur');
	$('.circuitDiv .side li[data-num=' + num + ']').addClass('cur');
	$('.circuitDiv .blocks .item').hide();
	$('.circuitDiv .blocks .item[data-num=' + num + ']').show();
}

//ѡ��Ϊʲô��
function showWhy(num) {
	$('.whyDiv .buts li').removeClass('cur');
	$('.whyDiv .buts li[data-num=' + num + ']').addClass('cur');
	$('.whyDiv .blocks .item').removeClass('cur');
	$('.whyDiv .blocks .item[data-num=' + num + ']').addClass('cur');
	var ageWidth = parseInt($('.whyDiv .blocks .item').width() + 2);
	$('.whyDiv .blocks').css('margin-left', (ageWidth * (num - 1) * -1) + 'px');
}

//��ʾ����
function showWin(divName) {
	$('.winDiv .item').hide();
	$('.winDiv .' + divName).show();
	$('.winDiv').fadeIn(200);
	$('.winMask').fadeIn(200);
}

//���������������õ�����͸����
$(window).scroll(function () {
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	if (scrollTop > 18) {
		$('.headNav').addClass('in');
	} else {
		$('.headNav').removeClass('in');
	}
})

//��������������¼�
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

//�����̰�ť
$('.circuitDiv .side li').click(function (event) {
	showCircuit($(this).data('num'));
});

//��"Ϊʲô"��ť
$('.whyDiv .buts li').click(function (event) {
	showWhy($(this).data('num'));
});

//�󶨸����رհ�ť
$('.winDiv .colse').click(function (event) {
	$('.winDiv').fadeOut(200);
	$('.winMask').fadeOut(200);
});
$('.winMask').click(function (event) {
	$('.winDiv').fadeOut(200);
	$('.winMask').fadeOut(200);
});

//�󶨱�����ť
$('.sideDiv ul li').click(function (event) {
	showWin($(this).data('type'));
});

//��������չ����ť
$('.faqDiv .list ul li button').click(function (event) {
	if ($(this).text() == 'չ��') {
		$(this).parent().find('div').css({
			height: 'auto',
			overflow: 'scroll'
		});
		$(this).html('����');
	} else {
		$(this).parent().find('div').css({
			height: '12vw',
			overflow: 'hidden'
		});
		$(this).html('չ��');
	}
});

//��ʾĬ�����̺͡�Ϊʲô��
showCircuit(1);
showWhy(1);

// showWin('yy');

//������ʾ�㣺��CSS��д display:none; ��Ӱ�춯��Ч�������ڴ�ִ�г�ʼ������
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
// ��½�¼�
$("input[name='Login_btn']").on('click', function () {

	var account = document.getElementsByName('account')[0].value;

	var password = document.getElementsByName('password')[0].value;

	if (account == null || account == undefined || account == '' || account.length < 0) {
		cocoMessage.error('��ַΪ�գ���������');
		return;
	}

	if (password == null || password == undefined || password == '' || password.length < 0) {
		cocoMessage.error('����Ϊ�գ���������');
		return;
	}

	if (password.length < 6) {
		cocoMessage.error('����������Ҫ6λ����������');
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
			cocoMessage.info('���ڵ�½,��ȴ�', 800);
			$("input[name='Login_btn']").attr({
				disabled: "disabled"
			});
		},
		success: function (result) {
			if (result.code == 20000) {
				cocoMessage.success('��½�ɹ�');
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

// ��½�¼�
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



// ע���¼�

$("input[name='Ret_Login_Btn']").on('click', function () {

	var address = document.getElementsByName('reg_address')[0].value;
	var password = document.getElementsByName('reg_password')[0].value;
	// var token = document.getElementsByName('__token__')[0].value;
	var inviteCode = document.getElementsByName('inviteCode')[0].value;


	if (address == null || address == undefined || address == '' || address.length < 0) {
		cocoMessage.info('��ַΪ�գ���������');
		return;
	}

	if (password == null || password == undefined || password == '' || password.length < 0) {
		cocoMessage.info('����Ϊ�գ���������');
		return;
	}

	if (password.length < 6) {
		cocoMessage.info('����������Ҫ6λ����������');
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
			cocoMessage.info('����ע��,��ȴ�', 1000);
			$("input[name='Ret_Login_Btn']").attr({
				disabled: "disabled"
			});
		},
		success: function (result) {
			if (result.code == 20000) {
				cocoMessage.success('ע��ɹ�',1000);
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


// ע���¼�

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