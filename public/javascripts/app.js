$(function() {

	$('.hidden').removeClass('hidden').hide();

	$('#username').ForceNumericAndEnglishOnly();

	if ($('#btn-login').length > 0) {
		if ($('#username').val() == '') $('#username').focus();
		else $('#password').focus();
	}
	
	$(document).on('keydown', '#username, #password', function(e){
		var key = e.charCode || e.keyCode || 0;
		if (key == 13) {
			if ($('#btn-login').length > 0)
				$('#btn-login').click();
		}
	});

	$(document).on('click', '#btn-login', function(){
		var isSuccess = true;
		var $objErrr = $('#dv-error');
		var $objInfo = $('#dv-info');	

		$('input[type=text], input[type=password]').each(function(){
			$(this).val( $.trim($(this).val()) );
			if ( $(this).val() == '' ) {
				showRegisterError($('#msg-pleaseFillAll').val());
				isSuccess = false;
				$(this).focus();
				return false;
			}
		});

		if (isSuccess) {
			showRegisterInfo($('#msg-checkingData').val());
			$.post($('#apiUrl').val()+'/member/login', {
				username: $('#username').val(),
				password: $('#password').val(),
				remember: $('#remember').is(':checked') ? 1 : 0,
			}, function(data){
				if (data.success) {
					if (data.correct) {
						window.location = '/auth/'+data.authKey+'/'+$('#username').val()+'/'+($('#remember').is(':checked') ? 1 : 0)+'/'+data.name;
					}
					else {
						showRegisterError($('#msg-usernameOrPasswordIncorrect').val());
						$('#username').focus();
					}
				}
				else {
					showRegisterError(JSON.stringify(data.error));
				}
			});
		}

	});

	$(document).on('click', '#btn-register', function(){
		var isSuccess = true;
		var $objErrr = $('#dv-error');
		var $objInfo = $('#dv-info');	

		$('input').each(function(){
			$(this).val( $.trim($(this).val()) );
			if ( $(this).val() == '' ) {
				showRegisterError($('#msg-pleaseFillAll').val());
				isSuccess = false;
				$(this).focus();
				return false;
			}
		});

		if (isSuccess) {
			if ( $('#password').val() != $('#password2').val() ) {
				showRegisterError($('#msg-passwordDifferent').val());
				$('#password').focus();
			}
			else if ( !validateEmail($('#email').val()) ) {
				showRegisterError($('#msg-invalidEmail').val());
				$('#email').focus();
			}
			else {
				showRegisterInfo($('#msg-checkingUsername').val());

				$.post($('#apiUrl').val()+'/member/exist/username', {
					username: $('#username').val(),
				}, function(data){
						if (data.success) {
							if (data.exist) {
								showRegisterError($('#msg-usernameExist').val());
								$('#username').focus();
							}
							else {


								showRegisterInfo($('#msg-checkingEmail').val())
								$.post($('#apiUrl').val()+'/member/exist/email', {
									email: $('#email').val(),
								}, function(data){
										if (data.success) {
											if (data.exist) {
												showRegisterError($('#msg-emailExist').val());
												$('#email').focus();
											}
											else {
												


												showRegisterInfo($('#msg-loading').val())
												$.post($('#apiUrl').val()+'/member/register', {
													email: $('#email').val(),
													username: $('#username').val(),
													password: $('#password').val(),
												}, function(data){
														if (data.success) {



															showRegisterInfo($('#msg-loading').val())
															$.post($('#apiUrl').val()+'/member/login', {
																username: $('#username').val(),
																password: $('#password').val(),
																remember: 0,
															}, function(data){
																	if (data.success) {
																		window.location = window.location.href.replace('register', 'auth')+'/'+data.authKey+'/'+$('#username').val()+'/0/'+data.name;
																	}
																	else {
																		showRegisterError(JSON.stringify(data.error));
																	}
															}, 'json');



														}
														else {
															showRegisterError(JSON.stringify(data.error));
														}
												}, 'json');



											}
										}
										else {
											showRegisterError(JSON.stringify(data.error));
										}
								}, 'json');


							}
						}
						else {
							showRegisterError(JSON.stringify(data.error));
						}


				}, 'json');

			}
		}
	});

});

function showRegisterError(error) {
	var $objErrr = $('#dv-error');
	var $objInfo = $('#dv-info');	
	$('.for-hide').show();
	$objInfo.hide();
	$objErrr.show();
	$objErrr.find('.msg-detail').html( ' '+error ).show();
}

function showRegisterInfo(message) {
	var $objErrr = $('#dv-error');
	var $objInfo = $('#dv-info');	
	$('.for-hide').hide();
	$objErrr.hide();
	$objInfo.show();
	$objInfo.find('.msg-detail').html( ' '+message ).show();
}

jQuery.fn.ForceNumericAndEnglishOnly = function() {
	return this.each(function() {
		$(this).keydown(function(e) {
			if (/^[a-zA-Z0-9\s\_\-]+$/.test($(this).val()) == false) {
				var text = $(this).val();
				$(this).val( text.substr(0, text.length-1) );
			}
			var key = e.charCode || e.keyCode || 0;
			return (
				(
					key == 13 || // Enter
					key == 8 || // Back Space
					key == 9 || // Tab
					key == 109 || key == 173 || // Dash
					(key >= 65 && key <= 90) || // a-z
					(key >= 48 && key <= 57 && e.shiftKey== false) || // 0-9
					(key >= 96 && key <= 105) // 0-9 (Numpad)
				) && ( $(this).val().length == 0 || (/^[a-zA-Z0-9\s\_\-]+$/.test($(this).val())) )
			);
		}),
		$(this).keyup(function(e) {
			if (/^[a-zA-Z0-9\s\_\-]+$/.test($(this).val()) == false) {
				var text = $(this).val();
				$(this).val( text.substr(0, text.length-1) );
			}
		});
	});
};

jQuery.fn.ForceNumericOnly = function() {
	return this.each(function() {
		$(this).keydown(function(e) {
			if (/^[a-zA-Z0-9\s\_\-]+$/.test($(this).val()) == false) {
				var text = $(this).val();
				$(this).val( text.substr(0, text.length-1) );
			}
			var key = e.charCode || e.keyCode || 0;
			return (
				(
					key == 8 || // Back Space
					key == 9 || // Tab
					(key >= 48 && key <= 57 && e.shiftKey== false) || // 0-9
					(key >= 96 && key <= 105) // 0-9 (Numpad)
				) && ( $(this).val().length == 0 || (/^[0-9\s]+$/.test($(this).val())) )
			);
		}),
		$(this).keyup(function(e) {
			if (/^[0-9\s]+$/.test($(this).val()) == false) {
				var text = $(this).val();
				$(this).val( text.substr(0, text.length-1) );
			}
		});
	});
};

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}