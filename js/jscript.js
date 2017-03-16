var session_user;
var session_token;
var session_client;
var session_admin;
var session_exp = false;
var inFormOrLink = false;;
$(document).ready(function() {
	window.location.hash = '';
	winWidth = $(window).width();
	winHeight = $(window).height();

	$(window).bind('beforeunload', function(e) {
		var status = $('.save-change-btn').attr('saved');	    
    if (status == 0) {
      returnValue = "You have unsaved elements in this view.";
	    e.returnValue = returnValue;
	    return returnValue;
    }
	});
	
	$('.add-user.popup,.note-popup,#wrapper-popup,#wrapper-popup-bottom,#wrapper-popup-top').css('left',(winWidth/2)-325);	
	$('.add-user.popup,.note-popup,#wrapper-popup,#wrapper-popup-bottom,#wrapper-popup-top').css('margin-left',0);
	$('.btn-div.user.popup').css('left',(winWidth/2)-325).css('margin-left',0);
	$('.btn-div.file.popup').css('left',(winWidth/2)-325).css('margin-left',0);
	$('.user-inner-container').height((winHeight/2)-200);
	if (winHeight < 760){
		$('#popup').css('top',(winHeight/2)-240);
		if (winHeight < 530){
			$('#popup').css('top',0);
			$('#wrapper-popup-top').css('top',0);
			$('#wrapper-popup-bottom').css('top',30);
		}
	} else {
		$('#popup').css('top',138);
		$('#wrapper-popup-top').css('top',140);
		$('#wrapper-popup-bottom').css('top',170);
	}
	$('.table-wrap').css('max-height',winHeight-330);	
	var page = location.href;
	
	if (page.indexOf('#') != -1){
		page = page.split('#').slice(0)[0];
	}
		
	page = page.split("/").slice(-1)[0].slice(0,-4);
	$('#file-assoc').css("max-height",winHeight-260);	

	$(window).resize(function(){		
		winWidth = $(window).width();
		winHeight = $(window).height();	
		fn = window.location.pathname.split('/').reverse()[0];			
		$('.table-wrap').css('max-height',winHeight-350);			
		$('.add-user.popup,.note-popup,#wrapper-popup,#wrapper-popup-bottom,#wrapper-popup-top').css('left',(winWidth/2)-325);	
		$('.add-user.popup,.note-popup,#wrapper-popup,#wrapper-popup-bottom,#wrapper-popup-top').css('margin-left',0);
		$('.btn-div.user.popup').css('left',(winWidth/2)-325).css('margin-left',0);
		$('.btn-div.file.popup').css('left',(winWidth/2)-325).css('margin-left',0);
		if (winWidth<650){
			$('.btn-div.user.popup, .add-user.popup,.note-popup').css('left',0);			
			$('.popup,#wrapper-popup,#wrapper-popup-bottom,#wrapper-popup-top').css('max-width',winWidth-1);
			$('#wrapper-popup,.popup,#wrapper-popup-bottom,#wrapper-popup-top').css('left',0);
			$('.edit-lang-textarea').width(winWidth-30).css('max-width',winWidth-30);
		} else {
			$('.popup,#wrapper-popup,#wrapper-popup-bottom,#wrapper-popup-top').css('max-width',650);
		}
		$('.group-lang-video-container,.group-lang-container').height((winHeight/2)-200);
		$('.user-inner-container').height((winHeight/2)-200);
		$('.files-output').css('max-height',(winHeight/2)-100);
		if (winHeight < 760){
			$('#popup').css('top',(winHeight/2)-240);
			if (winHeight < 530){
				$('#popup').css('top',0);
				$('#wrapper-popup-top').css('top',0);
				$('#wrapper-popup-bottom').css('top',30);
			}
		} else {
			$('#popup').css('top',138);
			$('#wrapper-popup-top').css('top',140);
			$('#wrapper-popup-bottom').css('top',170);
		}		
		$('.table-wrap').css('max-height',winHeight-330);	
		$('#file-assoc').css("max-height",winHeight-260);
		$('#file-assoc.assoc-content').css("max-height",winHeight-460);		
	});

	// click push changes button
	$(document).on('click','.push-change-btn',function(){		
		if ($(this).hasClass('active')){
			return;
		}
		// ajax for running cron
		$(this).addClass('active').html('<i class="fa fa-refresh"></i> PUSHING...');
		var dataStr = "user="+session_user+"&token="+session_token+"&client="+session_client;		
		$.ajax({
			type: "POST",
			data: dataStr,
			url: baseURL+'apnCron.php',
			success: function(data){
				$('.push-change-btn').removeClass('active').html('<i class="fa fa-refresh"></i> PUSH CHANGES');
				if (data.status == 'NO'){
					alert(data.content);
					return;
				} else {
					alert("Changes pushed to devices.");					
					return;
				}
			}

		});
	});
	
	// close popup on users page
	$(document).on('click','.close-popup',function(){		
		var target = $(this).attr('target');
		$('.'+target+'.popup').hide();		
		$('#wrapper-popup,#wrapper-popup-bottom,#wrapper-popup-top, #popup, .overlay-confirm, .edit-user-div,.edit-file-div,.edit-file-container,.file-edit-container,.link-upload-container, .files-popup, div.popup').hide();
		$('.add-view-input, .add-input, .add-group-input, .add-filter-input, .add-user-input, .edit-user-name-input').val('');		
	});

 	// upload file buttons
	$(document).on('click',".btn.upload-file", function(){		
		var type = $('#file-type-selecter').val();
		if (type === 'Select a file type...' ) {
			alert("Please select a valid file type.");
			return;
		}
		var fileUploaded = $('.plupload_delete').length;	
		if (!fileUploaded) {
			alert("No file provided.  Please drag a file to the uploader before submitting.");
			return;
		}			
		$('.btn.upload-file').attr('type', type);	
		$('.plupload_button.plupload_start').trigger('click');
	});
	// drop-down //
	
	// click on files page drop down
	$(document).on('click','.drop-down',function(){
		var target = $(this).attr('target'); // target for the drop-down 
		var page = $(this).attr('page'); // which page drop-down is on
		$('.ddl-content').hide();		
		if ($(this).hasClass('active')){			
			$('.ddl-content').hide();
			$(this).removeClass('active');
			$('.drop-down').removeClass('active');
			return;
		}
		$('.drop-down').removeClass('active');
		$('.overlay').show();
		$(this).addClass('active');
		$('.ddl-content.'+page+'.'+target).show();				
	});

	// click on drop down selection -- li
	$(document).on('click','.ddl-content li',function(){		
		var target = $(this).parent().parent().attr('target');		
		var page = $(this).parent().parent().attr('page');			
		$('.ddl-content.'+target).hide();
		var choice = $(this).attr('choice');

		if (page == 'client'){ // client PAGE
			var cid = $(this).attr('id');
			// ajax to save session_client		
			$.ajax({
				type:"POST",
				url:"php/client_session.php",
				data:"client_id="+cid,
				success:function(data){
					if (data.status == 'NO'){
						alert(data.content);
						return;
					} else {						
						getBG(cid);
						var redirectURL = data.content.redirect_url;
						if (redirectURL == undefined){
							window.location.assign('content.php');
						} else {
							window.location.assign(redirectURL);
						}
					}
				}
			});
		} else { // other pages
			
		} 
		$('.overlay').hide();

		// resetTable();				
		$('.ddl-choice.'+target).html($(this).html()).attr('choice',choice);		
	});

	//--- LOGIN ---//
	$(document).on('submit','#loginForm',function(e) {
		e.preventDefault();
		var user = $('#user').val();
		var password = $('#password').val();
		if (user.length == 0) {
			alert('Please enter a username.');
			return;
		}
		if (password.length == 0) {
			alert('Please enter a password.');
			return;
		}
		$.ajax({
			type: 'POST',
			url: baseURL+"login.php",
			data: "user="+user+"&password="+password,
			success: function(data) {
				if (data.status == 'NO'){
					if(data.content == 'invalid_session'){
						if (session_exp == false){
	            session_exp = true;
							checkSession();							
						}	
					} else {
						console.log(data.content);
						alert(data.content);
						return;
					}
				} else {
					var ftl = data.content.ftl;
					var token = data.content.token;
					var client_id = data.content.client_id;					
					
					if (client_id == -1||client_id == '-1'){
						session_admin = 1;
					} else {
						session_admin = 0;
					}					
					$.ajax({
						type: "POST",
						data: "user="+user+"&token="+token+"&client_id="+client_id+"&admin="+session_admin,
						url: "php/login_session.php", //portal file
						success: function(data) {
							if (data.status == "NO") {
								alert("Failed to set session.");
								return;
							} else {
								if (ftl == 1){
									window.location.assign('updatePass.php');
									return;
								}
								var redirectURL = data.content.redirect_url;
								if (data.content.client_id == -1){
									redirectURL = 'client.php';
								}
								if (redirectURL == undefined) {
									var redirectURL = 'content.php';
								}
								window.location.assign(redirectURL);
							}
						}
					});
				}
			}
		});
	});

	// check login boxes for text to set active
	$(document).on('keyup','.text-input.login.signin',function(){								 	
		var username = $('#user').val();
		var password = $('#password').val();
		if (username.length > 0&&password.length >0){
			$('.login-submit-btn').removeClass('inactive').addClass('active');
		} else {
			$('.login-submit-btn').removeClass('active').addClass('inactive');
		}
	});

	// global functions
	$(document).on('click','.close-notice',function(){		
		$('.notice.success').hide();
	});	
	
	// check login boxes for text to set active
	$(document).on('keyup','.login-box-update',function(e){
		var old = $('#old-password').val();
		var newPass = $('#new-password').val();
		var newPassConfirm = $('#new-password-confirm').val();
		if (old.length > 0&&newPass.length >0&&newPassConfirm.length>0){
			$('#update-password-btn').removeClass('inactive').addClass('active');
		} else {
			$('#update-password-btn').removeClass('active').addClass('inactive');
		}
		var key = e.keyCode;
		if (key == 13){
			if ($('#update-password-btn').hasClass('active')){
				$('#update-password-btn').trigger('click');		
			}
		}
	});

	$(document).on('click','.update-password-submit-btn',function(){
		var old = $('#old-password').val();
		var newPass = $('#new-password').val();
		var newPassConfirm = $('#new-password-confirm').val();
		if (newPass != newPassConfirm){
			alert("New Password does not match confirmation");
			return;
		}		
		var dataStr = "oldPass="+old+"&newPass="+newPass+"&user="+session_user+"&token="+session_token;		
		$.ajax({
			type: "POST",
			url: baseURL+'updatePassword.php',
			data: dataStr,
			success: function(data){
				if (data.status == "NO"){
					alert(data.content);
					console.log(data);
					return;
				} else {
					alert("Password updated successfully");
					window.location.href="content.php";
				}
			}
		});
	});	

	//---TABLE SORT---//
	$(document).on('click','.table-fields th',function (){
		var container = $(this).parent().parent().siblings('tbody.table-content-container');
		var rows = container.children();
		var isCheckbox = $(this).hasClass('publish-field');
		if (rows.hasClass('no-content') || $(this).hasClass('no-sort') || rows.length == 0) {
			return;
		}
		// if sorted before
		if ($(this).attr('sort')) {
			if ($(this).attr('sort') == 'asc') {
				var setting = 'desc';
				var img = '<img src="css/img/up_black_arrow.png">';
			} else {
				var setting = 'asc';
				var img = '<img src="css/img/down_black_arrow.png">';
			}
			Array.prototype.reverse.call(rows);
			rows.each(function () {
				container.append($(this));
			});
			$(this).attr('sort', setting).children('img').remove();
			$(this).append(img);
			return;
		}

		$('.table-fields th[sort]').removeAttr('sort').children('img').remove();
		$(this).attr('sort', 'desc').append('<img src="css/img/up_black_arrow.png">');

		// sort
		var field = $(this).index();
		var sortedArrays = [];
		rows.each(function() {
			if (isCheckbox) {
				var value = $(this).children().eq(field).children('input.publish').prop('checked');
			} else {
				var value = $(this).children().eq(field).text().toUpperCase();
			}
			var recordId = $(this).attr('rid');
			var arr = [value, recordId];
			sortedArrays.push(arr);
		});
		sortedArrays.sort(function (a,b) {
			if (a[0] < b[0]) {
				return -1;
			}
			if (a[0] > b[0]) {
				return 1;
			}
			return 0;
		});
		var sortedJQuery = [];
		sortedArrays.forEach(function (arr, sortIndex) { //for each array of arrays
			rows.each(function () { //for each DOM row
				if (isCheckbox) {
					var rowValue = $(this).children().eq(field).children('input.publish').prop('checked');
				}	else {
					var rowValue = $(this).children().eq(field).text().toUpperCase();
				}
				var rowId = $(this).attr('rid');
				if (rowValue == arr[0] && rowId == arr[1]) { //if the values and id match
					sortedJQuery[sortIndex] = $(this); // put that row in the sorted index
				}
			})
		});

		var html = '';
		sortedJQuery.forEach(function (ele) {
			html += ele[0].outerHTML;
		})
		container.html(html);
	});	

	//--- POP-UPs ---//
	$(document).on('click','.close-icon, .cancel',function () {		
		$('.overlay-confirm').hide();
		$('#popup').hide();
		$('#popup-web').hide();
		$('#popup.content, #popup.view').hide();
		$('.table-content-container input.checkbox').prop('checked',false);		
		setTimeout(function(){
			$('div#file-assoc').scrollTop();
		},100);		
		window.location.hash = '';	
		$('ul.tabs li').removeClass('current');
		$('ul.tabs li.first').addClass('current');
		$('.popup-main-container').hide();
		$('#info.popup-main-container,#name.popup-main-container, #tabr1.popup-main-container, .popup-main-container.user-page, #link-info.popup-main-container, .popup-main-container.admin').show();
		if ($('.content-video-preview').length){
			$('.content-video-preview')[0].pause();
		}
	})

	// EDIT CONTENT
	$(document).on('click','.table-row td:not(.td-publish,.user-content-row)',function () {
		var name = $(this).parent().attr('name');		
		var rid = $(this).parent().attr('rid');
		$('.overlay-confirm').show();		
		$('.popup-btn.save, .popup-btn.remove').attr('rid',rid).attr('name',name);		
		if (page == 'content') {			
			$('.edit-link-container').hide();
			var display = $(this).parent().attr('display');
			var type = $(this).parent().attr('type');
			var icon_id = $(this).parent().attr('iid');
			var loc = $(this).parent().attr('loc');
			var ctype = $(this).parent().attr('content-type');
			var share = $(this).parent().attr('share');

			$('#share-enabled').prop('checked',false);
			if (parseInt(share) == 1){
				$('#share-enabled').prop('checked',true);
			}
			$('.icon-checkbox').prop('checked',false);
			$('.icon-checkbox.icon-chk-'+icon_id).prop('checked',true);

			$('.popup-btn.save, .popup-btn.remove').attr('loc',loc).attr('type',type);			
			$('#edit-content-name').val('').val(name);
			$('#edit-content-display-name').val('').val(display);
			$('#file-assoc').removeClass('file-link');
			if (type == 'link'){				
				$('.edit-link-container').show();
				$('#edit-content-link-location').val('').val($(this).parent().attr('loc'));
				$('#file-assoc').addClass('file-link');				
			}				

			$('.global-preview').hide();

			if (ctype == 'video'){
				$('.video-src').attr('src',loc).attr('type','video/mp4');
				$('.content-video-preview').show();				
				$('video.content-video-preview')[0].load();				
			} else if (ctype == 'image'){
				$('#image-preview').show().attr('src',loc);
			} else if (ctype == 'pdf'){
				$('#pdf-preview').show().attr('src',loc);
			} else {								
				$('.content-preview-btn').show().attr('type',ctype).attr('loc',loc);
			}			
		} else if ( page == 'users' ) { // users page
			$('.user-name-title').text('').text(name);
			$('.add-user-input, .edit-user-name-input').val('');
			$('#user-name-input').val('').val(name);
			$('.edit-user-name-input.pin').val('').val($(this).parent().attr('pin'));
			userViewAssoc(rid);
		} else if (page == 'admin'){			
			var email = $(this).parent().attr('email');			
			$('.edit-admin-input').val('');
			$('#user-name-input.edit-admin-input').val(name);
			$('#user-email-input.edit-admin-input').val(email);			
		} 
		$('#popup').show();
		$(window).trigger('resize');
	})

	$(document).on('click','.popup-btn.save',function () {
		if (page == 'content') { 					// CONTENT PAGE
			var name = $('#edit-content-name').val();
			var display = $('#edit-content-display-name').val();
			var icon_id = $('.icon-checkbox:checked').val();	
			var icon_location = $('.icon-checkbox:checked').parent().attr('loc');
			var shareChk = $('#share-enabled').prop('checked');
			var share = 0;
			if (shareChk){
				share = 1;
			}
			var id = $(this).attr('rid');
			if (icon_id == undefined || icon_id == 'undefined'){
				alert('Please select a valid icon.');
				return;
			}
				
			if (name == '' || typeof name == undefined) {
				name = $(this).attr('name');
			}
			if (display.length == 0){
				alert("Please enter a display name.");
				return;
			}		

			var cleanName = encodeURIComponent(name);
			var cleanDisplay = encodeURIComponent(display);			
			var dataStr = "user="+session_user+"&token="+session_token+"&client="+session_client+"&id="+id+"&display="+cleanDisplay+'&icon_id='+icon_id+"&name="+cleanName+"&share="+share;
			
			var type = $('.popup-btn.save').attr('type');
			if (type == 'link'){
				var location = $('#edit-content-link-location').val();
				if (location.length == 0){
					alert('Please enter a valid link address/location.');
					return;
				}
				dataStr += "&type=link&location="+encodeURIComponent(location);
			}			

			$.ajax({
				type: "POST",
				url: baseURL+'updateContent.php',
				data: dataStr,
				success: function (data) {
					if (data.status == 'NO'){
						if(data.content == 'invalid_session'){
							if (session_exp == false){
								session_exp = true;
								checkSession();							
							}
						} else {
							console.log(data.content);
							alert(data.content);
							return;
						}
					} else {			
						$('.content-video-preview')[0].pause();
						window.location.hash = '';	
						$('ul.tabs li').removeClass('current');
						$('ul.tabs li.first').addClass('current');
						$('.popup-main-container').hide();
						$('#info.popup-main-container').show();

						$('.content-name-'+id).html(name);
						$('.content-row-id-'+id).attr('name',name).attr('display',display).attr('iid',icon_id).removeClass('new-content-row').attr('share',share);
						$('.content-icon.content-id-'+id).attr('src',icon_location).attr('share',share);
						
						if (type == 'link'){
							$('.content-row-id-'+id).attr('loc',location);
						}
						$('.missing-icon-alert.missing-icon-id-'+id).remove();
						$('.content-check-'+id).prop('disabled',false);
						$('.content-display-name-'+id).html(display);
					}
				}
			});
			$('.overlay-confirm, #popup').hide();
		} else if (page == 'users'){  // USER PAGE users page
			var id = $(this).attr('rid');
			var name = $('#user-name-input').val();
			if (name.length == 0){
				alert("Please enter a valid name.");
				return;
			}			
			var cleanName = encodeURIComponent(name);
			var dataStr = "user="+session_user+"&token="+session_token+"&id="+id+"&name="+cleanName;
			var viewid = $('.table-content-container.tbody input.checkbox.content-checkbox:checked').attr('id');
			if (viewid != undefined){
				dataStr += "&view="+viewid;
			}
			// password feature
			if ($.inArray('password',features) != -1){
				var pw = $('.edit-user-name-input.password').val();
				var confirm = $('.edit-user-name-input.confirm-password').val();
				if (pw.length > 0 && confirm.length > 0){
					if (pw != confirm){
						alert("Passwords do not match.");
						return;
					}
					if (pw.length == 0){
						alert("Please enter a valid password.");
						return;
					}
					dataStr += "&password="+encodeURIComponent(pw);
				}				
			}
			var pin = -1;
			// only for pin feature
			if ($.inArray('pin',features) != -1){
				var pin = $('.edit-user-name-input.pin').val();
				if (pin.length < 4){
					alert("Pin must be 4 numbers long.");
					return;
				}
				dataStr += "&pin="+encodeURIComponent(pin);
			}

			$.ajax({
				type: "POST",
				url: baseURL+'updateUserView.php',
				data: dataStr,
				success: function (data) {
					if (data.status == 'NO'){
						if(data.content == 'invalid_session'){
							if (session_exp == false){
								session_exp = true;
								checkSession();
							}
						} else {
							alert(data.content);
							return;
						}
					} else {
						$('.user-name-td.user-name-row-'+id).text(name);
						$('.user-row-id-'+id).attr('name',name).attr('pin',pin);
					}
				}
			})
			$('.overlay-confirm, #popup').hide();
		} else if (page == 'admin'){  // ADMIN PAGE
			var id = $(this).attr('rid');
			var name = $('#user-name-input.edit-admin-input').val();
			if (name.length == 0){
				alert("Please enter a valid username");
				return;
			}
			var email = $('#user-email-input.edit-admin-input').val();
			if (email.length == 0){
				alert("Please enter a valid email");
				return;	
			}
			var pass = $('#user-pass-input.edit-admin-input').val();
			var cpass = $('#user-confirm-pass-input.edit-admin-input').val();
			if (pass.length > 0 && cpass.length == 0){
				alert("Please confirm the password.");
				return;
			}
			var cleanName = encodeURIComponent(name);
			var cleanEmail = encodeURIComponent(email);
			var dataStr = "user="+session_user+"&token="+session_token+"&client="+session_client+"&id="+id+"&name="+cleanName+"&email="+cleanEmail;
			if (pass.length > 0 && cpass.length > 0){
				if (pass != cpass){
					alert("Passwords do not match.");
					return;
				} else {
					dataStr += '&password='+encodeURIComponent(pass);
				}
			}

			$.ajax({
				type: "POST",
				url: baseURL+'updateAdmin.php',
				data: dataStr,
				success: function (data) {
					if (data.status == 'NO'){
						if(data.content == 'invalid_session'){
							if (session_exp == false){
								session_exp = true;
								checkSession();							
							}
						} else {							
							alert(data.content);
							return;
						}
					} else {						
						$('.user-name-td.user-name-row-'+id).text(name);
						$('.user-row-id-'+id).attr('name',name).attr('email',email);
						$('.overlay-confirm, #popup').hide();	
					}
				}
			});			
		} 
	});	

	$('#upload-btn').click(function(){		
		$('.file-upload-container').show();
		$('.overlay-confirm').show();
	});
}); 
// end document.ready

function loadContent() {	
	$.ajax({
		type: "POST",
		url: baseURL+'getContent.php',
		data: "user="+session_user+"&token="+session_token+"&client="+session_client,
		success: function(data) {
			if (data.status == 'NO'){
				if(data.content == 'invalid_session'){
					if (session_exp == false){
						session_exp = true;
						checkSession();							
					}					
				} else {
					console.log(data.content);
					alert(data.content);
					return;
				}
			} else {
				getBG(session_client);	
				var content = data.content;										
				var html = '<div class="user-container table-container">'
										+'<div class="user-table-container">'
											+'<table class="user-info-table users" cellspacing="0" id="user-table">'
												+'<thead class="top-info-container users">'
													+'<tr class="">'
														+'<th rel="0" class="first-table-header user-name">Name</th>'
														+'<th rel="1" class="th-user-disp-name">Display Name</th>'
														+'<th rel="2" class="th-user-type">Type</th>'
														+'<th rel="3" class="th-user-icon">Icon</th>'														
														+'</tr>'
													+'</thead>'
													+'<tbody class="main-tbody">'
													 +'<tr>'
												    +'<th colspan="4" class="inner-td">'
													   +'<div class="table-wrap">'
													    +'<table class="inner-table content" id="user-table">'
													     +'<tbody>';				
				for (var i = 0 ; i < content.length ; i++) {					
					var e = content[i];
					var icon_loc = e.icon_location;
					var iid = e.icon_id;
					var newRow = '';
					var disabled = '';
					var hide = '';
					var icon = '';

					if (iid == -1){
						newRow = 'new-content-row';
						disabled = 'disabled';
						hide = 'hide';
						icon = '<div class="missing-icon-alert missing-icon-id-'+e.id+'">Please select an icon before trying to publish</div>';
					}
					var chk = '';
					if (parseInt(e.published) == 1){
						chk = 'checked';
					}
					html += '<tr class="content-row table-row content-row-'+i+' content-row-id-'+e.id+' '+newRow+'" rid="'+e.id+'" content-type="'+e.content_type+'" iid="'+iid+'" name="'+e.name+'" loc="'+content[i].location+'" display="'+content[i].display+'" type="'+e.type+'" share="'+e.share+'">'
									+'<td class="content-name-'+e.id+'">'+content[i].name+'</td>'
									+'<td class="content-display-name-'+e.id+'">'+e.display+'</td>'
									+'<td class="content-type-'+e.id+' content-type-td">'+e.type+'</td>'
									+'<td class="content-icon-td"><div class="icon-table-div">'+icon+'<img src="'+e.icon_location+'" class="content-icon content-id-'+e.id+' '+hide+'" /></div></td>'
								 +'</tr>';
				}
				if (content.length == 0){
					html += '<tr class="no-content-row"><td colspan="5">No content found.</td></tr>';		
				}
				html += '</tbody>'
								+'</table>'
								+'</div>' // end table-wrap div
							 +'</th>' // end inner th
							+'</tr>' // end inner tr
						+'</tbody>' // end inner tbody
					 +'</table>' // end inner table
					+'</div>'
				+'</div>'
				+'<div class="bottom-info-container users left">'
					+'<span class="bottom-text">Total:</span>'
					+'<span class="bottom-text content count" count="'+content.length+'">'+content.length+'</span>'
					+'<div class="push-change-btn content"><i class="fa fa-refresh"></i> PUSH CHANGES</div>'
					+'<div class="add-new-link"><i class="fa fa-plus"></i> LINK</div>'
				+'</div>';
				$('.content-table').html(html);
				$(window).trigger('resize');
			}
		}
	});
	
	loadIcons();	
	loadContentFilters();
	
	// click preview content button
	$(document).on('click','.content-preview-btn',function(){
		var url = $(this).attr('loc');
		window.open(url,'_blank');		
	});

	$(document).on('click','ul.tabs li a',function(){		
		$('.content-video-preview')[0].pause();
	});

	$(document).on('click','.add-icon',function(){
		var type = $(this).attr('type');
		var fid = $('.save-file.save-btn').attr('fid');
		var rowid = $('.save-file.save-btn').attr('rowid');
		$('#new-icon').trigger('click');
	});

	// detect change in thumbnail
	$(function(){
		$(document).on('change','#new-icon',function(){			
			$('#message').html('');
			var file = this.files[0];
			var imagefile = file.type;
			var match= ["image/jpeg","image/png","image/jpg"];					
			if (!((imagefile==match[0]) || (imagefile==match[1]) || (imagefile==match[2]))) {								
				$('#message').html('Please Select A valid Image File');
				alert("Please select a valid image file.");				
				return false;
			} else {
				var reader = new FileReader();				
				reader.readAsDataURL(this.files[0]);
				$('#new-icon-form').trigger('submit');
			}			
		});
	});

	// submit new thumbnail to upload (not for save edit)
	$(document).on('submit','#new-icon-form',function(e){
		e.preventDefault();		
		updateIcon(this);
	});

	// update thumbnail function ajax
	function updateIcon(file){				
		var form = new FormData(file);				
		form.append('user',session_user);
		form.append('token',session_token);		
		form.append('client',session_client);				
		$.ajax({
			type:"POST",
			url: baseURL+"saveIcon.php",
			data: form,
			contentType: false,
			cache: false,
			processData: false,
			success: function(data){				
				if (data.status == 'NO'){
					alert(data.content);
					console.log(data);
					return false;
				} else {		
					$('.no-icon-div').remove();
					var dc = data.content;								
					var fname = dc.fname;					
					var newFile = dc.path;
					var fid = dc.id;
					var code = '<div rid="'+fid+'" loc="'+newFile+'" class="icon-div icon-div-'+fid+'">'
											+'<input id="icon-'+fid+'" value="'+fid+'" type="radio" name="icon-radio" class="checkbox icon-checkbox icon-chk-'+fid+'"/>'
										 +'<label for="icon-'+fid+'" class="icon-label"><img src="'+newFile+'" class="assoc-icon content"></label>'
										+'</div>';
					var xcode = '<div rid="'+fid+'" loc="'+newFile+'" class="icon-div icon-div-'+fid+'">'
											+'<input id="icon-link-'+fid+'" value="'+fid+'" type="radio" name="icon-link-radio" class="checkbox icon-link-checkbox icon-link-chk-'+fid+'"/>'
										 +'<label for="icon-link-'+fid+'" class="icon-label"><img src="'+newFile+'" class="assoc-icon link"></label>'
										+'</div>';

					// add new icon to both containers
					$('.icon-container.edit-content').append(code);
					$('.icon-container.add-link').append(xcode);
				}
			},
			error: function(data){
				console.log(data);
			}
		});
	}

	// delete content file.
	$(document).on('click','.popup-btn.remove',function(){
		var uid = $(this).attr('rid');		
		$('.overlay-confirm').addClass('active');
		$('.confirmation-text, .button-container').hide();
		$('.confirm-delete-container,.confirm-delete,.overlay-confirm, .delete-content').show();				
		$('.yes.confirm.delete, .no.confirm.delete').attr('cid',uid);
	});

	$(document).on('click','.yes.confirm.delete',function(){
		var cid = $(this).attr('cid');
		var dataStr = "user="+session_user+"&token="+session_token+"&id="+cid;
		$.ajax({
			type: "POST",
			url: baseURL+'deleteContent.php',
			data: dataStr,
			success: function(data) {
				if (data.status == 'NO'){
					if(data.content == 'invalid_session'){
						if (session_exp == false){
	            session_exp = true;
							checkSession();							
						}						
					} else {							
						alert(data.content);							
						$('#popup').hide();
						$('.overlay-confirm, #confirmDelete, .confirm-delete,.confirm-delete-container').hide();
						return;
					}
				} else {					
					$('.content-row-id-'+cid).remove();						
					$('#popup').hide();
					$('.overlay-confirm, #confirmDelete, .confirm-delete,.confirm-delete-container').hide();
					$('.overlay-confirm').removeClass('active');	
					var rowCount = $('.content-row').length;						
					if (rowCount == 0){
						$('#user-table.content.inner-table tbody').append('<tr class="no-content-row"><td colspan="5">No content found.</td></tr>');
					}		
					$('.bottom-text.content').text(rowCount);
					$(window).trigger('resize');
				}
			}
		});
	});

	$(document).on('click','.no.confirm.delete',function(){
		var status = $(this).attr('status');
		var id = $(this).attr('userid');
		$('.confirm-delete-container,.confirm-delete').hide();
		$('.overlay-confirm').removeClass('active');			
	});

	// add new link
	$(document).on('click','.add-new-link',function(){
		$("#wrapper-popup-top.add-link-div, #wrapper-popup-bottom.add-link, .overlay-confirm").show();
		$('.add-link-input').val('');
		$('.add-link-input.name').focus();
		$('.icon-link-checkbox').prop('checked',false);
		setTimeout(function(){
			$(window).trigger('resize');
		},100);
	});

	$(document).on('keyup','.add-link-input',function(e){
		var name = $('.add-link-input.name').val();
		var location = $('.add-link-input.location').val();
		if (name.length > 0 && location.length > 0){
			$('.submit-new-link').addClass('active');
		} else {
			$('.submit-new-link').removeClass('active');
		}
		var key = e.keyCode
		// if they hit enter, trigger submit
		if (key == 13){
			$('.submit-new-link.active').trigger('click');
		}
	});

	$(document).on('click','.submit-new-link.active',function(){
		var name = $('.add-link-input.name').val();
		var location = $('.add-link-input.location').val();
		var display = $('.add-link-input.display-name').val();
		var icon_id = $('.icon-link-checkbox:checked').val();
		var icon_location = $('.icon-link-checkbox:checked').parent().attr('loc');
		if (icon_id == undefined || icon_id == 'undefined'){
			alert('Please select a valid icon.');
			return;
		}
		if (name.length == 0){
			alert("Please enter a link name.");
			return;
		}
		if (display.length == 0){
			alert("Please enter a display name.");
			return;
		}
		if (location.length == 0){
			alert("Please enter a link location.");
			return;
		}
		var cleanLoc = encodeURIComponent(location);
		var cleanName = encodeURIComponent(name);
		var cleanDisplay = encodeURIComponent(display);
		var dataStr = "user="+session_user+"&token="+session_token+"&name="+cleanName+"&location="+cleanLoc+"&display="+cleanDisplay+"&icon_id="+icon_id+"&client="+session_client;		
		$.ajax({
			type: "POST",
			url: baseURL+'addLink.php',
			data: dataStr,
			success: function(data) {
				if (data.status == 'NO'){
					if(data.content == 'invalid_session'){
						if (session_exp == false){
	            session_exp = true;
							checkSession();							
						}	
					} else {							
						alert(data.content);							
						return;
					}
				} else {					
					$('.no-content-row').remove();
					var linkid = data.content;					
					var rowLen = $('.content-row').length;							
					var code = '<tr class="content-row table-row content-row-'+rowLen+' content-row-id-'+linkid+'" rid="'+linkid+'" name="'+name+'" loc="'+location+'" type="link" display="'+display+'" iid="'+icon_id+'">'
											+'<td class="content-name-'+linkid+'">'+name+'</td>'
											+'<td class="content-display-name-'+linkid+'">'+display+'</td>'
											+'<td class="content-type-'+linkid+' content-type-td">link</td>'
											+'<td class="content-icon-td"><div class="icon-table-div"><img src="'+icon_location+'" class="content-icon content-id-'+linkid+'" /></div></td>';											
					if (rowLen > 0){
						$('.content-row.content-row-'+(rowLen-1)).after(code);	
					} else if (rowLen == 0){
						$('#user-table.content.inner-table tbody').append(code);							
					}						

					$('#wrapper-popup-top.add-link-div, #wrapper-popup-bottom.add-link-div').hide();
					$('.overlay-confirm').hide();	
					$('.bottom-text.content').text($('.content-row').length);		
					$(window).trigger('resize');
				}
			}
		});
	});
}

function loadUsers() {
	$.ajax({
		type: "POST",
		url: baseURL+'getUsers.php',
		data: "user="+session_user+"&token="+session_token+"&client="+session_client,
		success: function(data) {
			if (data.status == 'NO'){
				if(data.content == 'invalid_session'){
					if (session_exp == false){
						session_exp = true;
						checkSession();							
					}					
				} else {
					console.log(data.content);
					alert(data.content);
					return false;
				}
			} else {
				getBG(session_client);
				var users = data.content;									
				var html = '<div class="user-container table-container">'
										+'<div class="user-table-container">'
											+'<table class="user-info-table users" cellspacing="0" id="user-table">'
												+'<thead class="top-info-container users">'
													+'<tr class="">'
														+'<th rel="0" class="first-table-header user-name">Name</th>'
														+'<th rel="1" class="th-user-publish">Published</th>'																													
														+'</tr>'
													+'</thead>'
													+'<tbody class="main-tbody">'
													 +'<tr>'
												    +'<th colspan="2" class="inner-td">'
													   +'<div class="table-wrap">'
													    +'<table class="inner-table" id="user-table">'
													     +'<tbody>';				
				for (var i = 0 ; i < users.length ; i++) {
					html += '<tr class="user-row table-row user-row-'+i+' user-row-id-'+users[i].id+'" rid="'+users[i].id+'" name="'+users[i].name+'" pin="'+users[i].pin+'">'
									+'<td class="user-name-td user-name-row-'+users[i].id+'">'+users[i].name+'</td>'
									+'<td class="td-publish"><label class="content-label" for="user-chk-'+users[i].id+'"><input type="checkbox" id="user-chk-'+users[i].id+'" class="publish-user user-check-'+users[i].id+'" ';
					if (users[i].published == '1') {
						html += "checked";
					}
					html += ' /></label></td>'					
					+'</tr>';
				}
				if (users.length == 0){
					html += '<tr class="no-user-row"><td colspan="2">No users found.</td></tr>';		
				}
				html += '</tbody>'
								+'</table>'
								+'</div>' // end table-wrap div
							 +'</th>' // end inner th
							+'</tr>' // end inner tr
						+'</tbody>' // end inner tbody
					 +'</table>' // end inner table
					+'</div>'
				+'</div>'
				+'<div class="bottom-info-container users left">'
					+'<span class="bottom-text">Total:</span>'
					+'<span class="bottom-text users count" count="'+users.length+'">'+users.length+'</span>'
					+'<div class="push-change-btn user"><i class="fa fa-refresh"></i> PUSH CHANGES</div>'
				+'</div>';
				$('.user-table').html(html);
				$(window).trigger('resize');
			}
		}
	});
	$.ajax({
		type: "POST",
		url: baseURL+'getViews.php',
		data: "user="+session_user+"&token="+session_token+"&client="+session_client,
		success: function(data) {
			if (data.status == 'NO'){
				if(data.content == 'invalid_session'){
					if (session_exp == false){
            session_exp = true;
						checkSession();							
					}					
				} else {
					console.log(data.content);
					alert(data.content);
					return false;
				}
			} else {
				var gr = data.content;
				var html = '';
				for (var i = 0 ; i < gr.length ; i++) {					
					html += '<tr class="user-content-row user-content-row-id-'+gr[i].id+'" rid="'+gr[i].id+'" name="'+gr[i].name+'"><td value="z" class="user-content-id-chk-status-'+gr[i].id+' user-content-chk-status"><input id="'+gr[i].id+'" type="radio" name="user-content-radio" class="checkbox content-checkbox user-content-checkbox-id-'+gr[i].id+'"/><label for="'+gr[i].id+'" >'+gr[i].name+'</label></td></tr>';
				}
				if (gr.length == 0){
					html = '<tr class="no-content-row"><td colspan="1">No Views Found.</td></tr>';	
				}
				$('.table-content-container.tbody').html(html);
			}
		}
	});

	// logic for making add user button active (red)
	$(document).on('keyup','.add-user-input',function(e){
		checkUserInputs();
		var key = e.keyCode;
		// if they hit enter, trigger submit
		if (key == 13){
			$('.submit-new-user.active').trigger('click');
		}	
	});

	// click add new user button
	$(document).on('click','.add-user-text',function(){
		$('#wrapper-popup-top.add-user-div, #wrapper-popup-bottom.add-user-div').show();
		$('.overlay-confirm').show();			
		$('.add-user-input.name').val('').focus();			
	});

	$(document).on('click','.submit-new-user.active',function(){
		var name = $('.add-user-input.name').val();
		if (name.length == 0){
			alert("Please enter a name to submit.");
			return;
		}
		var cleanName = encodeURIComponent(name);
		var dataStr = "user="+session_user+"&token="+session_token+"&name="+cleanName+"&client="+session_client;
		if ($.inArray('password',features) != -1){
			var pw = $('.add-user-input.password').val();
			if (pw != $('.add-user-input.password-confirm').val()){
				alert("Passwords do not match.");
				return;
			}
			if (pw.length == 0){
				alert("Please enter a valid password.");
				return;
			}
			dataStr += "&password="+encodeURIComponent(pw);
		}
		var pin = -1;
		// only for pin feature
		if ($.inArray('pin',features) != -1){
			var pin = $('.add-user-input.pin').val();
			if (pin.length < 4){
				alert("Pin must be 4 numbers long.");
				return;
			}
			dataStr += "&pin="+encodeURIComponent(pin);
		} 		
		$.ajax({
			type: "POST",
			url: baseURL+'addUser.php',
			data: dataStr,
			success: function(data) {
				if (data.status == 'NO'){
					if(data.content == 'invalid_session'){
						if (session_exp == false){
	            session_exp = true;
							checkSession();							
						}	
					} else {							
						alert(data.content);							
						return;
					}
				} else {									
					$('.no-user-row').remove();
					var userid = data.content;					
					var rowLen = $('.user-row').length;											
					var code = '<tr class="user-row table-row user-row-'+rowLen+' user-row-id-'+userid+'" rid="'+userid+'" name="'+name+'" pin="'+pin+'">'
											+'<td class="user-name-td user-name-row-'+userid+'">'+name+'</td>'
											+'<td class="td-publish"><label class="content-label" for="user-chk-'+userid+'"><input type="checkbox" id="user-chk-'+userid+'" class="publish-user user-check-'+userid+'" /></label></td></tr>';															
					$('#user-table.inner-table tbody').append(code);
					$('.overlay-confirm, #wrapper-popup-top.add-user-div, #wrapper-popup-bottom.add-user-div').hide();					
					$('.bottom-text.users').text($('.user-row').length);
				}
			}
		});
	});

	$(document).on('click','input.publish-user',function(e) {			
		var uid = $(this).parent().parent().parent().attr('rid');
		var name = $(this).parent().parent().parent().attr('name');
		var conf;
		if (!$(this).prop('checked')) {
			var published = 0;
			$('.user-status').text('unpublish');
		} else {
			var published = 1;
			$('.user-status').text('publish');
		}
		$('.confirmation-text, .button-container').hide();
		$('.confirm-delete-container,.confirm-delete,.disable-user-text, .overlay-confirm, .publish-user').show();			
		$('.yes.confirm.publish, .no.confirm.publish').attr('userid',uid).attr('status',published);			
	});

	$(document).on('click','.yes.confirm.publish',function(){
		var published = $(this).attr('status');
		var uid = $(this).attr('userid');
		$.ajax({
			type: "POST",
			url: baseURL+'updateUser.php',
			data: "user="+session_user+"&token="+session_token+"&published="+published+"&id="+uid,
			success: function(data) {
				if (data.status == 'NO'){
					if(data.content == 'invalid_session'){
						if (session_exp == false){
	            session_exp = true;
							checkSession();							
						}
					} else {						
						$('.confirm-delete-container,.confirm-delete,.overlay-confirm').hide();
						alert(data.content);						
						if (published == 0) {
							$('.user-check-'+uid).prop('checked',true);
						} else if (published == 1) {
							$('.user-check-'+uid).prop('checked',false);
						}
						return;
					}
				} else {					
					$('.confirm-delete-container,.confirm-delete,.overlay-confirm').hide();
					$('.publish-field').removeAttr('sort').children('img').remove();
				}
			}
		});
	});

	$(document).on('click','.no.confirm.publish',function(){
		var status = $(this).attr('status');
		var id = $(this).attr('userid');
		$('.confirm-delete-container,.confirm-delete,.overlay-confirm').hide();
		if (status == 1){
			$('.user-check-'+id).prop('checked',false);
		} else if (status == 0){
			$('.user-check-'+id).prop('checked',true);
		}
	});

	// toggle content on user popup
	$(document).on('click','.checkbox.content-checkbox',function(){
		var status = $(this).is(":checked");
		var id = $(this).attr('id');
		var parValue = $(this).parent().attr('value');					
		if (status == false){
			$('.user-content-id-chk-status-'+id).attr('value','z');
			$('.user-content-row-id-'+id).removeClass('selected');
		} else {
			var checkedBoxes = $('.checkbox.content-checkbox:checked').length;
			$('.user-content-id-chk-status-'+id).attr('value',checkedBoxes);			
			$('.user-content-row-id-'+id).addClass('selected');
		}
		$('.user-content-chk-status').attr('value','z');

		$('.content-status-chk').trigger('click');
		if ($('.file-assoc-table.users thead tr th.content-status-chk').find('span').length){
			if ($('.file-assoc-table.users thead tr th.content-status-chk span').hasClass('arrow')){
				if ($('.file-assoc-table.users thead tr th.content-status-chk span').hasClass('up')){ // arrow up -- trigger click								
					$('.file-assoc-table.users thead tr th.content-status-chk').trigger('click');
				} else { // arrow down -- trigger twice								
					$('.file-assoc-table.users thead tr th.content-status-chk').trigger('click').trigger('click');
				}
			}
		}	else {
			$('.content-status-chk').trigger('click');						
		}				
	});
	// delete user.
	$(document).on('click','.popup-btn.remove',function(){
		var uid = $(this).attr('rid');		
		$('.overlay-confirm').addClass('active');
		$('.confirmation-text, .button-container').hide();
		$('.confirm-delete-container,.confirm-delete,.overlay-confirm, .delete-user, .delete-user-text').show();				
		$('.yes.confirm.delete, .no.confirm.delete').attr('cid',uid);
	});

	$(document).on('click','.yes.confirm.delete',function(){
		var cid = $(this).attr('cid');
		var dataStr = "user="+session_user+"&token="+session_token+"&id="+cid;
		$.ajax({
			type: "POST",
			url: baseURL+'disableUser.php',
			data: dataStr,
			success: function(data) {
				if (data.status == 'NO'){
					if(data.content == 'invalid_session'){
						if (session_exp == false){
	            session_exp = true;
							checkSession();							
						}
					} else {							
						alert(data.content);							
						$('#popup').hide();
						$('.overlay-confirm, #confirmDelete, .confirm-delete,.confirm-delete-container').hide();
						return;
					}
				} else {					
					$('.user-row-id-'+cid).remove();						
					$('#popup').hide();
					$('.overlay-confirm, #confirmDelete, .confirm-delete,.confirm-delete-container').hide();
					$('.overlay-confirm').removeClass('active');	
					var rowCount = $('.user-row').length;						
					if (rowCount == 0){
						$('#user-table.inner-table tbody').append('<tr class="no-user-row"><td colspan="2">No users found.</td></tr>');
					}		
					$('.bottom-text.users').text(rowCount);
				}
			}
		});
	});

	$(document).on('click','.no.confirm.delete',function(){
		var status = $(this).attr('status');
		var id = $(this).attr('userid');
		$('.confirm-delete-container,.confirm-delete').hide();
		$('.overlay-confirm').removeClass('active');			
	});
}

function loadAdmin() {	
	var dataStr = "user="+session_user+"&token="+session_token+"&client="+session_client;

	$.ajax({
		type: "POST",
		url: baseURL+'getAdmin.php',
		data: dataStr,
		success: function(data) {
			if (data.status == 'NO'){
				if(data.content == 'invalid_session'){
					if (session_exp == false){
						session_exp = true;
						checkSession();							
					}
				} else {
					console.log(data.content);
					alert(data.content);
					return false;
				}
			} else {
				getBG(session_client);
				var users = data.content;					

				var html = '<div class="user-container table-container">'
										+'<div class="user-table-container">'
											+'<table class="user-info-table users" cellspacing="0" id="user-table">'
												+'<thead class="top-info-container users">'
													+'<tr class="">'
														+'<th rel="0" class="first-table-header user-name">Username</th>'
														+'<th rel="1" class="th-user-publish">Active</th>'																													
														+'</tr>'
													+'</thead>'
													+'<tbody class="main-tbody">'
													 +'<tr>'
												    +'<th colspan="2" class="inner-td">'
													   +'<div class="table-wrap">'
													    +'<table class="inner-table" id="user-table">'
													     +'<tbody>';				
				for (var i = 0 ; i < users.length ; i++) {
					html += '<tr class="user-row table-row user-row-'+i+' user-row-id-'+users[i].id+'" rid="'+users[i].id+'" name="'+users[i].name+'" email="'+users[i].email+'">'
									+'<td class="user-name-td user-name-row-'+users[i].id+'">'+users[i].name+'</td>'
									+'<td class="td-publish"><label class="content-label" for="user-chk-'+users[i].id+'"><input type="checkbox" id="user-chk-'+users[i].id+'" class="publish-user user-check-'+users[i].id+'" ';
					if (parseInt(users[i].active) == 1) {
						html += "checked";
					}
					html += ' /></label></td>'					
					+'</tr>';
				}
				if (users.length == 0){
					html += '<tr class="no-user-row"><td colspan="2">No users found.</td></tr>';		
				}
				html += '</tbody>'
								+'</table>'
								+'</div>' // end table-wrap div
							 +'</th>' // end inner th
							+'</tr>' // end inner tr
						+'</tbody>' // end inner tbody
					 +'</table>' // end inner table
					+'</div>'
				+'</div>'
				+'<div class="bottom-info-container users left">'
					+'<span class="bottom-text">Total:</span>'
					+'<span class="bottom-text users count" count="'+users.length+'">'+users.length+'</span>'
					+'<div class="push-change-btn admin"><i class="fa fa-refresh"></i> PUSH CHANGES</div>'
				+'</div>';
				$('.user-table').html(html);
				$(window).trigger('resize');
			}
		}
	});

	// update header logo
	$(document).on('click','.update-header-icon',function(){
		$('#logo-file').trigger('click');
	});

	// submit new thumbnail to upload (not for save edit)
	$(document).on('submit','#edit-logo-form',function(e){
		e.preventDefault();				
		updateThumb(this,'logo',-1,'main');
	});

	// detect change in logo image
	$(function(){
		$(document).on('change','#logo-file',function(){			
			$('#message').html('');
			var file = this.files[0];
			var imagefile = file.type;
			var match= ["image/jpeg","image/png","image/jpg"];					
			if (!((imagefile==match[0]) || (imagefile==match[1]) || (imagefile==match[2]))) {								
				$('#message').html('Please Select A valid Image File');
				alert("Please select a valid image file.");				
				return false;
			} else {
				var reader = new FileReader();				
				reader.readAsDataURL(this.files[0]);
				$('#edit-logo-form').trigger('submit');
			}			
		});
	});

	// logic for making add user button active (red)
	$(document).on('keyup','.add-user-input',function(e){
		checkAdminUserInputs();	
		var key = e.keyCode
		// if they hit enter, trigger submit
		if (key == 13){
			$('.submit-new-user.active').trigger('click');
		}	
	});

	// click add new user button
	$(document).on('click','.add-user-text',function(){
		$('#wrapper-popup-top.add-user-div, #wrapper-popup-bottom.add-user-div').show();
		$('.overlay-confirm').show();			
		$('.add-user-input').val('');
		$('.add-user-input.name').focus();			
	});

	$(document).on('click','.submit-new-user.active',function(){
		var name = $('.add-user-input.name').val();
		if (name.length == 0){
			alert("Please enter a name to submit.");
			return;
		}
		var email = $(".add-user-input.email").val();
		var pass = $('.add-user-input.password').val();
		if (pass.length == 0){
			alert('Please enter a valid password.');
			return;
		}
		var cpass = $('.add-user-input.confirm-pass').val();
		if (cpass.length == 0){
			alert('Please enter a valid password.');
			return;
		}
		if (pass != cpass){
			alert('Passwords do not match.');
			return;
		}
		var cleanName = encodeURIComponent(name);
		var cleanEmail = encodeURIComponent(email);
		var cleanPass = encodeURIComponent(pass);
		var dataStr = "user="+session_user+"&token="+session_token+"&name="+cleanName+"&client="+session_client+"&email="+cleanEmail+"&password="+cleanPass;			
		$.ajax({
			type: "POST",
			url: baseURL+'addAdmin.php',
			data: dataStr,
			success: function(data) {
				if (data.status == 'NO'){
					if(data.content == 'invalid_session'){
						if (session_exp == false){
	            session_exp = true;
							checkSession();							
						}
					} else {							
						alert(data.content);							
						return;
					}
				} else {					
					$('.no-user-row').remove();
					var userid = data.content;					
					var rowLen = $('.user-row').length;						
					var code = '<tr class="user-row table-row user-row-'+rowLen+' user-row-id-'+userid+'" rid="'+userid+'" name="'+name+'" email="'+email+'">'
											+'<td class="user-name-td user-name-row-'+userid+'">'+name+'</td>'
											+'<td class="td-publish"><label class="content-label" for="user-chk-'+userid+'"><input type="checkbox" id="user-chk-'+userid+'" class="publish-user user-check-'+userid+'" /></label></td>'
											+'</tr>';										
					if (rowLen > 0){
						$('.user-row.user-row-'+(rowLen-1)).after(code);							
					} else {
						$('#user-table.inner-table tbody').append(code);
					}
					$('#wrapper-popup-top.add-user-div, #wrapper-popup-bottom.add-user-div').hide();
					$('.overlay-confirm').hide();			
					$('.bottom-text.users').text($('.user-row').length);
				}
			}
		});
	});

	$(document).on('click','input.publish-user',function(e) {			
		var uid = $(this).parent().parent().parent().attr('rid');
		var name = $(this).parent().parent().parent().attr('name');
		var conf;
		if (!$(this).prop('checked')) {
			var published = 0;
			$('.user-status').text('deactivate');
		} else {
			var published = 1;
			$('.user-status').text('activate');
		}
		$('.confirmation-text, .button-container').hide();
		$('.confirm-delete-container,.confirm-delete,.disable-user-text, .overlay-confirm, .publish-user').show();			
		$('.yes.confirm.publish, .no.confirm.publish').attr('userid',uid).attr('status',published);			
	});

	$(document).on('click','.yes.confirm.publish',function(){
		var published = $(this).attr('status');
		var uid = $(this).attr('userid');
		$.ajax({
			type: "POST",
			url: baseURL+'updateAdmin.php',
			data: "user="+session_user+"&token="+session_token+"&active="+published+"&id="+uid,
			success: function(data) {
				if (data.status == 'NO'){
					if(data.content == 'invalid_session'){
						if (session_exp == false){
	            session_exp = true;
							checkSession();							
						}	
					} else {						
						$('.confirm-delete-container,.confirm-delete,.overlay-confirm').hide();
						alert(data.content);						
						if (published == 0) {
							$('.user-check-'+uid).prop('checked',true);
						} else if (published == 1) {
							$('.user-check-'+uid).prop('checked',false);
						}
						return;
					}
				} else {					
					$('.confirm-delete-container,.confirm-delete,.overlay-confirm').hide();
					$('.publish-field').removeAttr('sort').children('img').remove();
				}
			}
		});
	});

	$(document).on('click','.no.confirm.publish',function(){
		var status = $(this).attr('status');
		var id = $(this).attr('userid');
		$('.confirm-delete-container,.confirm-delete,.overlay-confirm').hide();
		if (status == 1){
			$('.user-check-'+id).prop('checked',false);
		} else if (status == 0){
			$('.user-check-'+id).prop('checked',true);
		}
	});

	// toggle content on user popup
	$(document).on('click','.checkbox.content-checkbox',function(){
		var status = $(this).is(":checked");
		var id = $(this).attr('id');
		var parValue = $(this).parent().attr('value');					
		if (status == false){
			$('.user-content-id-chk-status-'+id).attr('value','z');
			$('.user-content-row-id-'+id).removeClass('selected');
		} else {
			var checkedBoxes = $('.checkbox.content-checkbox:checked').length;
			$('.user-content-id-chk-status-'+id).attr('value',checkedBoxes);			
			$('.user-content-row-id-'+id).addClass('selected');
		}
		$('.user-content-chk-status').attr('value','z');

		$('.content-status-chk').trigger('click');
		if ($('.file-assoc-table.users thead tr th.content-status-chk').find('span').length){
			if ($('.file-assoc-table.users thead tr th.content-status-chk span').hasClass('arrow')){
				if ($('.file-assoc-table.users thead tr th.content-status-chk span').hasClass('up')){ // arrow up -- trigger click								
					$('.file-assoc-table.users thead tr th.content-status-chk').trigger('click');
				} else { // arrow down -- trigger twice								
					$('.file-assoc-table.users thead tr th.content-status-chk').trigger('click').trigger('click');
				}
			}
		}	else {
			$('.content-status-chk').trigger('click');						
		}				
	});

	// delete user.
	$(document).on('click','.popup-btn.remove',function(){
		var uid = $(this).attr('rid');		
		$('.overlay-confirm').addClass('active');
		$('.confirmation-text, .button-container').hide();
		$('.confirm-delete-container,.confirm-delete,.overlay-confirm, .delete-user, .delete-user-text').show();				
		$('.yes.confirm.delete, .no.confirm.delete').attr('cid',uid);
	});

	$(document).on('click','.yes.confirm.delete',function(){
		var cid = $(this).attr('cid');
		var dataStr = "user="+session_user+"&token="+session_token+"&id="+cid;
		$.ajax({
			type: "POST",
			url: baseURL+'disableAdmin.php',
			data: dataStr,
			success: function(data) {
				if (data.status == 'NO'){
					if(data.content == 'invalid_session'){
						if (session_exp == false){
	            session_exp = true;
							checkSession();							
						}	
					} else {							
						alert(data.content);							
						$('#popup').hide();
						$('.overlay-confirm, #confirmDelete, .confirm-delete,.confirm-delete-container').hide();
						return;
					}
				} else {					
					$('.user-row-id-'+cid).remove();						
					$('#popup').hide();
					$('.overlay-confirm, #confirmDelete, .confirm-delete,.confirm-delete-container').hide();
					$('.overlay-confirm').removeClass('active');	
					var rowCount = $('.user-row').length;						
					if (rowCount == 0){
						$('#user-table.inner-table tbody').append('<tr class="no-user-row"><td colspan="2">No users found.</td></tr>');
					}		
					$('.bottom-text.users').text(rowCount);
				}
			}
		});
	});

	$(document).on('click','.no.confirm.delete',function(){
		var status = $(this).attr('status');
		var id = $(this).attr('userid');
		$('.confirm-delete-container,.confirm-delete').hide();
		$('.overlay-confirm').removeClass('active');			
	});
}

function loadWebView(cid, vid) {
	loadIcons();
	loadViewUsers();
	//build datastring
	var dataStr = "user="+session_user+"&token="+session_token+"&client_id="+cid+"&id="+vid;
	$.ajax({
		type: "POST",
		url: baseURL+'getViewContent.php',
		data: dataStr,
		success: function(data) {
			if (data.status == "NO") {
				if (data.content == 'invalid_session') {
					if (session_exp == false) {
						session_exp = true;
						checkSession();
					}
				} else {
				console.log(data.content);
				alert(data.content);
				return;
				}
			} else {
				getWebViewInfo(vid);
			}
		}
	});

	$('.grid.tables').css('max-width','100%');

	$(document).on('click','.device-filter', function(e) {
		var target = e.target;
		var fid = $(this).attr('fid');
		if ($(this).hasClass('active')) {
			$('.filters-container').hide();
			$('.device-content-container').show();
			return;
		}
		$(this).addClass('active');
		$('.device-content-container, .portal-filter-back').show();
		$('div.content-div, .filters-container').hide();
		// get all content for this filter
		var dataStr = "user="+session_user+"&token="+session_token+"&client_id"+session_client+"&id="+fid;
		$.ajax({
			type: "POST",
			url: baseURL+'getFilterContent.php',
			data: dataStr,
			success: function(data) {
				$('.device-content-container').html('');
				if (data.status == 'NO') {
					if (data.content == 'invalid_session') {
						if (session_exp == false) {
							session_exp = true;
							checkSession();
						}
					} else {
						console.log(data.content);
						alert(data.content);
						return;
					}
				} else {
					// show the proper content
					var loop = $(this).attr('loops');
					// loop through checking
					var files = data.content;
					var ccode = '';
					for (var i = 0;i<files.length;i++) {
						var e = files[i];
						var labelClass = '';
						if (e.display.length > 15) {
							labelClass = 'overflow';
						}
						ccode += '<div class="content-div content-div-web content-div-'+e.id+'" content-type="'+e.content_type+'" cid="'+e.id+'" name="'+e.name+'" loops="'+loop+'" display="'+e.display+'" iid="'+e.icon_id+'" refresh="'+e.refresh+'" loopduration="'+e.loop+'" share="'+e.share+'" type="'+e.type+'" loc="'+e.location+'">';
						if (e.content_type == "image") {
							ccode += '<a class="fancybox-preview" href="'+e.location+'"><img src="'+e.icon_location+'" class="device-content-icon-web device-content-icon-'+e.id+' content-'+e.id+'-icon-'+e.icon_id+'" /></a><div class="content-icon-label-web '+labelClass+'">'+e.display+'</div>'+'</div>';
						} else if (e.content_type == "pdf") {
							ccode += '<a class="fancybox-preview-iframe" href="'+e.location+'"><img src="'+e.icon_location+'" class="device-content-icon-web device-content-icon-'+e.id+' content-'+e.id+'-icon-'+e.icon_id+'" /></a><div class="content-icon-label-web '+labelClass+'">'+e.display+'</div>'+'</div>';
						} else if (e.content_type == "video") {
							ccode += '<a class="popup-video" href="#" loc="'+e.location+'"><img src="'+e.icon_location+'" class="device-content-icon-web device-content-icon-'+e.id+' content-'+e.id+'-icon-'+e.icon_id+'" /></a><div class="content-icon-label-web '+labelClass+'">'+e.display+'</div>'+'</div>';
						} else {
							ccode += '<a class="fancybox-preview" href="'+e.location+'"><img src="'+e.icon_location+'" class="device-content-icon-web device-content-icon-'+e.id+' content-'+e.id+'-icon-'+e.icon_id+'" /></a><div class="content-icon-label-web '+labelClass+'">'+e.display+'</div>'+'</div>';
						}
					}
					$('.device-content-container').removeClass('empty');
					if (files.length == 0) {
						$('.device-content-container').addClass('empty');
					}
					$('.device-content-container').html(ccode);
					checkWebHeight();
					// var textColor = $('#text-color').spectrum('get').toHexString();
					$('.device-text-color, .content-icon-label-web').css('color',$('#wrapper').attr('textcolor'));
					$("a.fancybox-preview").fancybox();
					$("a.fancybox-preview-iframe").fancybox({
						width: 768,
						height: 1024,
						type: 'iframe'
					});
				}
			}
		});
	});

	// $(document).on('click','.fancybox-preview-inline', function(e) {
	// 	$('.fancybox-video-src').attr('src',$(this).attr('data'));
	// });
	$(document).on('click','.popup-video', function(e) {
		$('.overlay-confirm').show();
		$('.video-src').attr('src',$(this).attr('loc')).attr('type','video/mp4');
		$('.content-video-preview').show();
		$('video.content-video-preview')[0].load();
		$('.popup-main-container').show();
		$('#popup-web').show();
	});

	$(document).on('click','.go-back-filter', function(e) {
		goBack();
	});

	function goBack() {
		$('.filters-container').show();
		$('.device-content-container, .portal-filter-back').hide();
		$('.device-filter').removeClass('active').attr('back',-1);
		checkWebHeight();
	}
}
// load views -- manager app
function loadApp(cid){
	loadIcons();
	loadViewUsers();
	// build datastring
	var dataStr = "user="+session_user+"&token="+session_token;
	dataStr += "&client_id="+cid;	
	$.ajax({
		type: "POST",
		url: baseURL+'getClientInfo.php',
		data: dataStr,
		success: function(data) {
			if (data.status == 'NO'){
				if(data.content == 'invalid_session'){
					if (session_exp == false){
						session_exp = true;
						checkSession();							
					}	
				} else {
					console.log(data.content);
					alert(data.content);
					return;
				}
			} else {
				getBG(session_client);

				var meta = data.content;				
				var views = meta.views;
				globalViews = views;
				var code = '';
				// loop through views
				for (var i=0;i<views.length;i++){
					var ef = views[i];
					code += '<li class="each-view each-view-'+ef.view_id+' parent" viewid="'+ef.view_id+'">'
									  +'<div class="edit-view" viewid="'+ef.view_id+'">'
											+'<i class="fa fa-files-o edit-view edit-info edit-view-icon-'+ef.view_id+'" type="view" viewid="'+ef.view_id+'" name="'+ef.name+'"></i>'
									  +'</div>'
										+'<div class="remove-view" viewid="'+ef.view_id+'">'
											+'<i class="fa fa-remove" viewid="'+ef.view_id+'"></i>'
										+'</div>'										
										+'<span class="view-name-'+ef.view_id+' edit-view-span">'+ef.name+'</span>';
										var ins = ef.instances;
										code += '<div class="inner-wrapper instance-div hide instance-div-'+ef.view_id+'"><ul class="inner-ul">';
										// output instances
										for (var j=0;j<ins.length;j++){
											var e = ins[j];											
											code += '<li class="each-instance each-instance-'+j+' each-instance-view-'+e.view_id+'" viewid="'+e.view_id+'" type="'+e.view_type+'">'+e.view_type+'</li>';
										}
										code += '</ul></div>';
								 code +='</li>';
				}
				
				$('.main-ul.main-parent').html(code);

				// output files for client
				var files = data.content.files;
				var code = '<table class="content-list-table" id="content-list-table"><tbody>';
				var rcode = '';				
				for (var i =0;i<files.length;i++){
					var e = files[i];				
					code += '<tr>'
									+'<td class="info-list-td">'+e.display
									+'</td>'
									+'<td class="type-list-td">'+e.content_type
									+'</td>'
									+'<td class="icon-list-td"><div class="content-icon-list content-list-id-'+e.id+' icon-'+e.icon_id+'-content-'+e.id+'" cid="'+e.id+'" loc="'+e.location+'" display="'+e.display+'" name="'+e.name+'" icon="'+e.icon_location+'" iid="'+e.icon_id+'" type="'+e.type+'"><img src="'+e.icon_location+'" class="content-list-icon-img" /></div>'
									+'</td>'
									+'<td class="content-checkbox-td"><input id="content-'+e.id+'" value="'+e.id+'" type="checkbox" class="checkbox content-checkbox content-'+e.id+'-icon"/>'
									+'</td>'
								+'</tr>';
					rcode += '<div class="each-content each-content-'+e.id+'" cid="'+e.id+'" loc="'+e.location+'" display="'+e.display+'" name="'+e.name+'" icon="'+e.icon_location+'" iid="'+e.icon_id+'" type="'+e.type+'">'
										+'<label for="each-content-'+e.id+'" class="each-content-label">'
										+'<input id="each-content-'+e.id+'" value="'+e.id+'" type="checkbox" class="checkbox each-content-checkbox each-content-'+e.id+'-icon"/>'
										+'</label>'
										+'<img src="'+e.icon_location+'" class="each-content-list-icon-img each-content-list-icon-img-'+e.id+' draggable" />'
									+'</div>';		
				}
				code += '</tbody></table>';
				$('.files-output').html(code);
				$('.each-content-output').html(rcode);											
				checkHeight();
			}
		}
	});

	$(document).on('click','.rotate-div',function(){
		if ($(this).hasClass('active')){
			return;
		}
		$(this).addClass('active');
		var dir = $(this).attr('direction');
		if (dir == 'left'){
			rotateLeft();
		} else if (dir == 'right'){
			rotateRight();
		}
	});

	$(document).on('click','.device-content-icon',function(){
		var name = $(this).parent().attr('name');		
		var rid = $(this).parent().attr('cid');
		var display = $(this).parent().attr('display');
		var type = $(this).parent().attr('type');
		var icon_id = $(this).parent().attr('iid');
		var ctype = $(this).parent().attr('content-type');

		var share = $(this).parent().attr('share');
		var loopDuration = $(this).parent().attr('loopduration');
		var refresh = $(this).parent().attr('refresh');
		var loops = $('.save-change-btn').attr('loops');
		
		$('#share-enabled').prop('checked',false);
		if (parseInt(share) == 1){
			$('#share-enabled').prop('checked',true);
		}
		$('.refresh-time-input').val(refresh);
		$('.loop-duration-input').val(loopDuration);

		$('.hide-loop-stuff').hide();
		if (parseInt(loops) == 1){
			$('.hide-loop-stuff').show();
		}
		$('.overlay-confirm').show();				
		$('.edit-link-container').hide();
		$('.icon-checkbox').prop('checked',false);
		$('.icon-checkbox.icon-chk-'+icon_id).prop('checked',true);		
		$('#edit-content-name').val('').val(name);
		$('#edit-content-display-name').val('').val(display);
		$('#file-assoc').removeClass('file-link');
		if (type == 'link'){
			var location = $(this).parent().attr('loc');
			$('.edit-link-container').show();
			$('#edit-content-link-location').val('').val(location);
			$('#file-assoc').addClass('file-link');				
		}
		
		var loc = $(this).parent().attr('loc');
		$('.edit-content-btn').attr('loc',loc).attr('cid',rid).attr('name',name).attr('type',type).attr('ctype',ctype);
		$('.global-preview').hide();
		
		if (ctype == 'video'){
			$('.video-src').attr('src',loc).attr('type','video/mp4');
			$('.content-video-preview').show();				
			$('video.content-video-preview')[0].load();
			$('.hide-loop-stuff').hide();
		} else if (ctype == 'image'){
			$('.loop-stuff').show();
			$('.refresh-stuff').hide();
			$('#image-preview').show().attr('src',loc);
		} else if (ctype == 'pdf'){
			$('.loop-stuff').show();
			$('.refresh-stuff').hide();
			$('#pdf-preview').show().attr('src',loc);
		} else {
			$('.loop-stuff, .refresh-stuff').show();
			$('.content-preview-btn').show();
			$('.content-preview-btn').attr('type',ctype).attr('loc',loc);
		}
		$('#popup.content').show();
		$(window).trigger('resize');
	});
	
	$(document).on('mouseover','li.parent',function(e){		
		var $menuItem = $(this),
				$submenuWrapper = $('> .inner-wrapper',$menuItem);		
		var menuItemPos = $(this).offset();		
		
		var width = $('li.each-view.parent:hover').width()+37.5;
		var offsetTop = (menuItemPos.top+23) - $(window).scrollTop();
		$submenuWrapper.css({
			top:offsetTop,
			left:menuItemPos.left,
		});
		$('li.each-view.parent:hover > .inner-wrapper').width(width);		
	});

	// click a different view
	$(document).on('click','.each-view',function(e){		
		var vid = $(this).attr('viewid');		
		$('.files-view').hide();
		$('.file-view-'+vid).show();
	});	

	$(document).on('click','.edit-content-btn',function(){
		// show other alert
		$('.confirm-delete-container, .confirm-delete').show().addClass('active');
		$('.overlay-confirm').addClass('active');
		$('.confirmation-text, .button-container').hide();
		$('.confirmation-text.update-content, .button-container.update-content').show();
		var cid = $(this).attr('cid');
		$('.confirm.update-content').attr('cid',cid).attr('ctype',$(this).attr('type'));
	});
	
	$(document).on('click','.yes.confirm.update-content',function(){
		var name = $("#edit-content-display-name").val();
		if (name.length == 0){
			alert("Please enter a valid display name.");
			return;
		}
		var cid = $(this).attr('cid');
		var icon = $('.icon-checkbox:checked').val();				
		var type = $(this).attr('ctype');
		var view = $('.each-view.active').attr('viewid');
		var shareChk = $('#share-enabled').prop('checked');
		var share = 0;
		if (shareChk){
			share = 1;
		}
		var dataStr = "user="+session_user+"&token="+session_token+"&client_id="+session_client+"&id="+cid+"&icon_id="+icon+"&display="+encodeURIComponent(name)+"&share="+share+"&vid="+view;

		var loops = $('.save-change-btn').attr('loops');
		var refresh = 0;
		if (parseInt(loops) == 1){			
			var loop = $('.loop-duration-input').val();
			if (loop.length == 0){				
				alert("Please enter a valid loop duration time.");
				return;
			}
			dataStr += "&looping=1&loop="+loop;
			if (type == 'link'){
				var ref = $('.refresh-time-input').val();
				if (ref.length == 0){
					alert("Please enter a valid refresh time.");
					return;
				}
				refresh = ref;
			}				
			dataStr += "&refresh="+refresh;				
		}
		if (type == 'link'){
			var link = $('#edit-content-link-location').val();
			if (link.length == 0){
				alert("Please enter a valid link location.");
				return;
			}
			dataStr += "&location="+encodeURIComponent(link)+"&type="+type;
		}

		$.ajax({
			type: "POST",
			url: baseURL+'updateContent.php',
			data: dataStr,
			success: function (data) {
				if (data.status == 'NO'){
					if(data.content == 'invalid_session'){
						if (session_exp == false){
							session_exp = true;
							checkSession();							
						}
					} else {
						console.log(data.content);
						alert(data.content);
						return;
					}
				} else {			
					$('.content-video-preview')[0].pause();
					$('#popup, .overlay-confirm, .confirm-delete-container, .confirm-delete').hide().removeClass('active');
					var icon_loc = $('.icon-div.icon-div-'+icon).attr('loc');
					$('.content-div.content-div-'+cid).attr('display',name).attr('iid',icon);
					$('.content-div.content-div-'+cid+' .content-icon-label').text(name);
					if (name.length > 14){
						$('.content-div.content-div-'+cid+' .content-icon-label').addClass('overflow');
					}
					$('.device-content-icon.device-content-icon-'+cid).attr('src',icon_loc);
					$('.content-icon-list.content-list-id-'+cid).attr('icon',icon_loc).attr('share',share);
					$('.content-icon-list.content-list-id-'+cid+' img.content-list-icon-img').attr('src',icon_loc);
					$('.each-content-list-icon-img-'+cid).attr('src',icon_loc);
					$('.save-change-btn').attr('saved',1);
					if (parseInt(loops) == 1){
						$('.content-div.content-div-'+cid).attr('refresh',refresh).attr('loopduration',loop);						
					}
				}
			}
		});
	});

	$(document).on('click','.no.confirm.update-content',function(){
		$('.confirm-delete-container').hide().removeClass('active');
		$('.overlay-confirm').removeClass('active');
	});

	$(document).on('keyup','.edit-view-input',function(e){
		var k = e.keyCode;
		if (k == 13){
			if ($('.edit-view-input').val().length > 0){
				$('.update-view-btn').trigger('click');
			}
		}
	});

	$(document).on('keyup','.link-edit-inputs',function(e){
		var k = e.keyCode;
		if (k == 13){
			$('.edit-content-btn.edit-content-popup-btn').trigger('click');			
		}
	});

	// click instance of each view
	$(document).on('click','.each-instance',function(){		
		var type = $(this).attr('type');
		var vid = $(this).attr('viewid');
		if ($(this).hasClass('active')){
			return;
		}
		$('.go-back-filter').trigger('click');
		$('.each-view, .each-instance').removeClass('active');
		$('.no-content, div.each-content, .files-view, .right-content-container').hide();
		$('.add-item-container, .file-view-'+vid).show();
		$(this).addClass('active');
		$('.add-item-container, .each-view.each-view-'+vid).addClass('active');
		// ajax for getting content per view
		var dataStr = "user="+session_user+"&token="+session_token+"&client_id="+session_client+"&id="+vid;		
		$.ajax({
			type: "POST",
			url: baseURL+'getViewContent.php',
			data: dataStr,
			success: function(data) {
				if (data.status == 'NO'){
					if(data.content == 'invalid_session'){
						if (session_exp == false){
	            session_exp = true;
							checkSession();							
						}					
					} else {
						console.log(data.content);
						alert(data.content);
						return;
					}
				} else {
					getViewInfo(vid,type);
					// loop through checking
					var files = data.content;
					for (var i = 0;i<files.length;i++){
						var e = files[i];
						$('.each-content-'+e.id).show();
					}
					if (files.length == 0){
						$('.no-content').show();
					}
				}
			}
		});
		
	});

	$(document).on('click','.device-filter',function(e){
		var target = e.target;
		if ($(target).hasClass('remove-filter') || $(target).hasClass('edit-filter')){
			return;
		}				
		var fid = $(this).attr('fid');
		if ($(this).hasClass('active')){
			$('.filters-container').hide();
			$('.device-content-container').show().sortable();
			return;
		}
		$(this).addClass('active');		
		$('.device-content-container, .right-content-container, .portal-filter-back').show();
		$('div.content-div, .filters-container').hide();		
		// show the proper content		
		$('.each-content-checkbox').prop('checked',false);
		var loop = $(this).attr('loops');
		$('.save-change-btn').attr('loops',loop);
		// get all content for this filter
		var dataStr = "user="+session_user+"&token="+session_token+"&client_id="+session_client+"&id="+fid;		
		$.ajax({
			type: "POST",
			url: baseURL+'getFilterContent.php',
			data: dataStr,
			success: function(data) {
				$('.device-content-container').html('');
				if (data.status == 'NO'){
					if(data.content == 'invalid_session'){
						if (session_exp == false){
	            session_exp = true;
							checkSession();							
						}					
					} else {
						console.log(data.content);
						alert(data.content);
						return;
					}
				} else {
					// loop through checking
					var files = data.content;
					var ccode = '';
					for (var i = 0;i<files.length;i++){
						var e = files[i];						
						$('.each-content-'+e.id).show();
						var labelClass = '';
						if (e.display.length > 15){
							labelClass = 'overflow';
						}
						$('.each-content-checkbox.each-content-'+e.id+'-icon').prop('checked',true);							
						ccode += '<div class="content-div content-div-'+e.id+' removable" content-type="'+e.content_type+'" cid="'+e.id+'" name="'+e.name+'" loops="'+loop+'" display="'+e.display+'" iid="'+e.icon_id+'" refresh="'+e.refresh+'" loopduration="'+e.loop+'" share="'+e.share+'" type="'+e.type+'" loc="'+e.location+'"><img src="'+e.icon_location+'" class="device-content-icon device-content-icon-'+e.id+' content-'+e.id+'-icon-'+e.icon_id+'" />'
							+'<div class="content-icon-label '+labelClass+'">'+e.display+'</div>'
						+'</div>';
						$('div.content-div.content-div-'+e.id).show();
					}
					$('.device-content-container').removeClass('empty');
					if (files.length == 0){
						$('.device-content-container').addClass('empty');
					}
					$('.device-content-container').html(ccode).sortable({
						revert: false,
						start:function(e,ui){
							$('.content-div').removeClass('last-content-div').removeClass('only-three').removeClass('only-two').removeClass('only-four');
						},
						stop:function(e,ui){
							checkHeight();
							$('.save-change-btn').attr('saved',0);
						}
					});
					checkHeight();
					var textColor = $('#text-color').spectrum('get').toHexString();
					$('.device-text-color, .fa.edit-filter, .fa.remove-filter, .content-icon-label').css('color',textColor);

					$('.content-div').draggable({
						cursor:'move',											
						revert:function(e,ui){														
							if (!e){
								var cid = $(this).attr('cid');
								$('.content-div.content-div-'+cid).remove();
								$('.each-content-checkbox.each-content-'+cid+'-icon').prop('checked',false);
								if ($('.content-div').length == 0){
									$('.device-content-container').addClass('empty');
								}
								checkHeight();
								return true;
							}				
						},
						connectToSortable:".device-content-container",									
					});
				}
			}
		});
		
		$('.each-content-list-icon-img').draggable({
			cursor:'move',
			revert:'invalid',						
			helper:function(){
				var cloned = $(this).clone();				
				return cloned;
			},
			zIndex: 10000,			
		});				

		$('.device-content-container').droppable({
			hoverClass:'ui-state-active',
			tolerance:'touch',
			drop:function(e,ui){				
				var parent = $(ui.helper[0]).parent();
				var parid = parent.attr('cid');
				
				if ($(ui.helper).hasClass('draggable')){
					if ($('.content-div.content-div-'+parid).length == 0){
						$('.each-content-checkbox.each-content-'+parid+'-icon').prop('checked',true);
						var labelClass = '';
						if (parent.attr('display').length > 18){
							labelClass = 'overflow';
						}
						var code = '<div class="content-div content-div-'+parid+' removable" content-type="'+parent.attr('content_type')+'" cid="'+parid+'" name="'+parent.attr('name')+'" display="'+parent.attr('display')+'" iid="'+parent.attr('iid')+'" type="'+parent.attr('type')+'" loc="'+parent.attr('loc')+'" refresh="'+parent.attr('refresh')+'" loopduration="'+parent.attr('loopduration')+'" share="'+parent.attr('share')+'"><img src="'+parent.attr('icon')+'" class="device-content-icon device-content-icon-'+parid+' content-'+parid+'-icon-'+parent.attr('iid')+'" /><div class="content-icon-label '+labelClass+'">'+parent.attr('display')+'</div></div>';
						$('.device-content-container').append(code).sortable({
							revert: false,
							start:function(e,ui){
								$('.content-div').removeClass('last-content-div').removeClass('only-three').removeClass('only-two').removeClass('only-four');
							},
							stop:function(e,ui){
								checkHeight();
							}
						});
						$('.device-content-container').removeClass('empty');
						checkHeight();
						$('.content-div-'+parid).draggable({
							cursor:'move',						
							revert:function(e,ui){															
								if (!e){
									var cid = $(this).attr('cid');
									$('.content-div.content-div-'+cid).remove();
									$('.each-content-checkbox.each-content-'+cid+'-icon').prop('checked',false);
									if ($('.content-div').length == 0){
										$('.device-content-container').addClass('empty');
									}
									checkHeight();
									return true;
								}
							},
							connectToSortable:".device-content-container",										
						});
						var textColor = $('#text-color').spectrum('get').toHexString();
						$('.device-text-color, .fa.edit-filter, .fa.remove-filter, .content-icon-label').css('color',textColor);
					}
				}
				$('.save-change-btn').attr('saved',0);
			},
			accept:'.each-content-list-icon-img',
			over:function(e,ui){				
			},			
		}).sortable({
			revert: false,
			start:function(e,ui){
				$('.content-div').removeClass('last-content-div').removeClass('only-three').removeClass('only-two').removeClass('only-four');
				$('.save-change-btn').attr('saved',0);
			},
			stop:function(e,ui){
				checkHeight();
			}
		});		
	});

	$(document).on('change','.each-content-checkbox',function(){
		var status = $(this).is(':checked');
		var cid = $(this).val();		
		if (!status){
			$('.content-div.content-div-'+cid).remove();
			if ($('.content-div').length == 0){
				$('.device-content-container').addClass('empty');
			}
		} else {
			$('.content-div.content-div-'+cid).show();
			var parent = $(this).parent().parent();
			$('.device-content-container').removeClass('empty');
			var labelClass = '';
			if (parent.attr('display').length > 18){
				labelClass = 'overflow';
			}
			var loops = $('.save-change-btn').attr('loops');
			var code = '<div class="content-div content-div-'+cid+' removable" cid="'+cid+'" content-type="'+parent.attr('content_type')+'" name="'+parent.attr('name')+'" display="'+parent.attr('display')+'" iid="'+parent.attr('iid')+'" type="'+parent.attr('type')+'" loc="'+parent.attr('loc')+'" loops="'+loops+'" refresh="'+parent.attr('refresh')+'" loopduration="'+parent.attr('loopduration')+'" share="'+parent.attr('share')+'"><img src="'+parent.attr('icon')+'" class="device-content-icon device-content-icon-'+cid+' content-'+cid+'-icon-'+parent.attr('iid')+'" /><div class="content-icon-label '+labelClass+'">'+parent.attr('display')+'</div></div>';
			$('.device-content-container').append(code).sortable({
				revert: false,
				start:function(e,ui){
					$('.content-div').removeClass('last-content-div').removeClass('only-three').removeClass('only-two').removeClass('only-four');					
				},
				stop:function(e,ui){					
					checkHeight();
				}
			});

			$('.content-div-'+cid).draggable({
				cursor:'move',						
				revert:function(e,ui){					
					if (!e){
						var cid = $(this).attr('cid');
						$('.content-div.content-div-'+cid).remove();
						$('.each-content-checkbox.each-content-'+cid+'-icon').prop('checked',false);
						if ($('.content-div').length == 0){
							$('.device-content-container').addClass('empty');
						}
						checkHeight();
						return true;
					}
				},
				connectToSortable:".device-content-container",							
			});			
		}
		$('.save-change-btn').attr('saved',0);
		checkHeight();		
	});
	// save changes for view
	$(document).on('click','.save-change-btn',function(){
		var filterCount = $('.device-filter').length;		
		var view = $('.each-view.active').attr('viewid');
		var type = $('.each-instance.active').attr('type');
		if (view == undefined || type == undefined){
			alert("Please select a view/instance to submit");
			return;
		}
		var width = $('.device-logo').width();
		var padding = Number((+$('#width').val())*10).toFixed(2);
		// build datastr		
		var dataStr = "user="+session_user+"&token="+session_token+"&client_id="+session_client+"&id="+view+"&type="+type;		
		var bgcolor = $('#background-color').spectrum('get').toHexString();
		var textcolor = $('#text-color').spectrum('get').toHexString();
		var filtercolor = $('#filter-color').spectrum('get').toHexString();	
		var f = $('#filter-color').spectrum('get').toRgbString();	
		var opacity = f.split('rgba(');
		if(opacity[1] == undefined){
			f = f.replace('rgb(','rgba(');
			f = f.replace(')',', 1)')
			opacity = f;
			opacity = f.split('rgba(');
		}
		opacity = opacity[1].replace(')','');
		opacity= opacity.split(',');
		a = opacity[opacity.length-1];
		dataStr += "&text="+encodeURIComponent(textcolor)+"&bg="+encodeURIComponent(bgcolor);		
		dataStr += "&filter="+encodeURIComponent(filtercolor);
		dataStr += "&logo_width="+width;
		dataStr += "&padding="+padding;
		dataStr += "&opacity="+a;
		dataStr += "&filter_rgb="+f;
		// send background_img_id and background_logo_id
		dataStr += "&background_img_id="+$('.device-overlay').attr('fid');
		dataStr += "&background_logo_id="+$('.device-logo').attr('fid');

		// get filters/order
		var filters = new Array;		
		var spot = 1;
		$('.device-filter').each(function(){
			var cid = $(this).attr('fid');			
			filters.push({
				"id":cid,
				"order":spot,
				'name':$('.device-text-color-'+cid).text(),
			});
			spot++;		
		});
		filters = JSON.stringify(filters);
		dataStr += "&filters="+filters;	
		
		// get content -- only update the content if they have selected a filter
		var content = new Array;
		var spot = 1;
		$('.content-div:visible').each(function(){
			var id = $(this).attr('cid');
			content.push({
				"id":id,
				"order":spot,
			});
			spot++;
		});
				
		content = JSON.stringify(content);			
		dataStr += "&content="+encodeURIComponent(content);
		var curFilter = $('.device-filter.active').attr('fid');
		if (curFilter != undefined){
			dataStr += "&curFilter="+curFilter;
		}

		$.ajax({
			type: "POST",
			url: baseURL+'updateView.php',
			data: dataStr,
			success: function(data) {
				if (data.status == 'NO'){
					if(data.content == 'invalid_session'){
						if (session_exp == false){
	            session_exp = true;
							checkSession();							
						}	
					} else {
						console.log(data.content);
						alert(data.content);
						return;
					}
				} else {				
					alert("View saved successfully.");
					$('.save-change-btn').attr('saved',1);
					if ($('.save-change-btn').hasClass('ready')){
						window.location.assign($('.save-change-btn').attr('link'));
					}
					if ($('.save-change-btn').attr('back') == 'filter'){
						goBack();
					}
					return;
				}
			}
		});
	});	
	
	$(document).on('click','.add-item-btn',function(){
		var type = $(this).attr('type');
		if (type == 'filter'||type=='view'){
			$('.add-'+type+'-input').focus().val('');
			$('#wrapper-popup-top.add-'+type+'-div, #wrapper-popup-bottom.add-'+type+'-div').show();				
			$('.overlay-confirm').show();
			$('.'+type+'-popup-stuff').hide();
			$('.'+type+'-popup-stuff.add').show();
		}
	});

	$(document).on('keyup','.add-input',function(e){
		var target = $(this).attr('target');
		var key = e.keyCode;		
		if ($(this).val().length > 0){
			if (key == 13){
				$('.submit-new-'+target).trigger('click');
			}			
		}		
	});

	$(document).on('click','.edit-info',function(){
		var type = $(this).attr('type');
		var name = $(this).attr('name');
		$('.edit-'+type+'-input').val(name).focus();
		$('.overlay-confirm').show();
		var loops = -1;
		if (type == 'filter'){
			var id = $(this).attr('fid');
			var loop = $(this).attr('loops');			
			$('#loop-input').prop('checked',false);
			if (parseInt(loop) == 1){
				$('#loop-input').prop('checked',true);
				loops = 1;
			}
			$('.filter-popup-stuff').hide();
			$('#wrapper-popup-top.add-filter-div, #wrapper-popup-bottom.add-filter-div, .edit-filter-popup-text, .edit-filter-input, .submit-edit-filter').show();
		} else if (type == 'view'){
			$('#popup.view').show();
			var id = $(this).attr('viewid');
			$('.content-checkbox').prop('checked',false);
			$('.update-view-btn').attr('vid',id);			
			var dataStr = "user="+session_user+"&token="+session_token+"&client_id="+session_client+"&id="+id;
			// ajax for getting content per view
			$.ajax({
				type: "POST",
				url: baseURL+'getViewContent.php',
				data: dataStr,
				success: function(data) {
					if (data.status == 'NO'){
						if(data.content == 'invalid_session'){
							if (session_exp == false){
		            session_exp = true;
								checkSession();							
							}					
						} else {
							console.log(data.content);
							alert(data.content);
							return;
						}
					} else {
						// loop through checking
						var files = data.content;					
						for (var i = 0;i<files.length;i++){
							var e = files[i];						
							$('.content-'+e.id+'-icon').prop('checked',true).attr('order',e.order).attr('published',e.published);
						}
					}
				}
			});
			getViewUsers(id);
		}
		$('.submit-edit-'+type).attr('rid',id);
	});

	$(document).on('click','.go-back-filter',function(e){
		var status = $('.save-change-btn').attr('saved');
		if (status == 0){
			e.preventDefault();
			$('.confirmation-text, .button-container').hide();
			$('.confirm-delete-container,.confirm-delete,.overlay-confirm, .leave-area').show();			
		} else {
			goBack();
		}
	});

	$(document).on('click','.no.leave-area',function(){
		goBack();
	});

	$(document).on('click','.yes.leave-area',function(){
		$('.save-change-btn').attr('back','filter');
		$('.save-change-btn').trigger('click');
	});


	function goBack(){
		$('.filters-container').show();
		$('.device-content-container, .portal-filter-back, .right-content-container,.overlay-confirm, .confirm-delete-container,.confirm-delete').hide()
		$('.device-filter').removeClass('active').attr('back',-1);
		$('.save-change-btn').attr('saved',1);		
		checkHeight();
	}
	$(document).on('click','.clear-background-color',function(){
		$('.confirm-delete-container, .overlay-confirm, #confirmDelete').show();
		$('.button-container, .confirmation-text').hide();
		$('.button-container.background-clear, .confirmation-text.background-clear').show();
	});

	// add new view -- inserts ipad/iphone/appletv
	$(document).on('click','.submit-new-view',function(){
		if ($(this).hasClass('active')){
			return;
		}

		$(this).addClass('active');
		var name = $('.add-view-input').val();
		if (name.length == 0){
			alert("Please enter a valid view name.");
			return;
		}
		// ajax for saving a view name				
		var cleanName = encodeURIComponent(name);
		var dataStr = "user="+session_user+"&token="+session_token+"&name="+cleanName+"&cid="+session_client;			
		$.ajax({
			type: "POST",
			url: baseURL+'addView.php',
			data: dataStr,
			success: function(data) {
				$('.submit-new-view').removeClass('active');
				if (data.status == 'NO'){
					if(data.content == 'invalid_session'){
						if (session_exp == false){
	            session_exp = true;
							checkSession();							
						}
					} else {							
						alert(data.content);							
						return;
					}
				} else {					
					var len = $('.each-view').length;
					var vid = data.content;
					var ratio = $('.each-instance').attr('ratio');
					var maxratio = $('.each-instance').attr('max-ratio');
					var code = '<li class="each-view each-view-'+vid+' parent" viewid="'+vid+'">'
											+'<div class="edit-view" viewid="'+vid+'">'
												+'<i class="fa fa-files-o edit-view edit-info edit-view-icon-'+vid+'" type="view" viewid="'+vid+'" name="'+name+'"></i>'
											+'</div>'
											+'<div class="remove-view" viewid="'+vid+'"><i class="fa fa-remove" viewid="'+vid+'"></i></div>'											
											+'<span class="view-name-'+vid+' edit-view-span">'+name+'</span></div>';					
					code += '<div class="inner-wrapper instance-div hide instance-div-'+vid+'"><ul class="inner-ul">';
					// output instances					
					code += '<li class="each-instance each-instance-'+len+'" viewid="'+vid+'" type="ipad">ipad</li>';
					code += '<li class="each-instance each-instance-'+len+'" viewid="'+vid+'" type="iphone">iphone</li>';
					code += '<li class="each-instance each-instance-'+len+'" viewid="'+vid+'" type="appletv">appletv</li>';
					code += '</ul></div></li>';
					if (len > 0){
						$('.each-view:last').after(code);
					} else {
						$('.main-ul.main-parent').html(code);
					}
					$('#wrapper-popup-bottom.add-view-div, #wrapper-popup-top.add-view-div').hide();
					$('.overlay-confirm').hide();								
				}
			}
		});
	});
	
	// add new filter
	$(document).on('click','.submit-new-filter',function(){
		var len = $('.device-filter').length;
		if (len == 0){
			if ($('.each-content-checkbox:checked').length > 0){
				var r = confirm("Adding the first filter will wipe out the content for this view. Are you sure you want to proceed?");
				if (!r){
					return;
				}				
			}
		}
		if ($(this).hasClass('active')){
			return;
		}
		var vid = $('.each-view.active').attr('viewid');
		var name = $('.add-filter-input').val();
		if (name.length == 0){
			alert("Please enter a valid filter name.");
			return;
		}
		$(this).addClass('active');
		// ajax for saving a filter name		
		var cleanName = encodeURIComponent(name);
		var dataStr = "user="+session_user+"&token="+session_token+"&name="+cleanName+"&cid="+session_client+"&view="+vid;
		var loop = 0;
		var loopChk = $('#loop-input').prop('checked');
		if (loopChk){
			loop = 1;
		}
		dataStr += "&loop="+loop;
		if (r == true){
			dataStr += "&firstFilter=1";
		}		

		$.ajax({
			type: "POST",
			url: baseURL+'addFilter.php',
			data: dataStr,
			success: function(data) {
				$('.submit-new-filter').removeClass('active');
				if (data.status == 'NO'){
					if(data.content == 'invalid_session'){
						if (session_exp == false){
	            session_exp = true;
							checkSession();							
						}
					} else {							
						alert(data.content);							
						return;
					}
				} else {
					var len = $('.device-filter').length;

					var fid = data.content;
					var code = '<div class="device-filter device-filter-'+fid+'" order="'+len+'" published="1" fid="'+fid+'" loops="'+loop+'"><div class="device-text-color device-text-color-'+fid+' filter-name-'+fid+'">'+name+'</div><i class="fa fa-remove remove-filter"></i><div class="edit-filter" fid="'+fid+'"><i class="fa fa-edit edit-filter edit-info" type="filter" fid="'+fid+'" name="'+name+'" loops="'+loop+'"></i></div></div>';
					if ($('.device-filter').length > 0){
						$('.device-filter:last').after(code);
					} else {
						$('.filters-container').html(code);
					}
					$('.filters-container').sortable('destroy').sortable();
					$('#wrapper-popup-bottom.add-filter-div, #wrapper-popup-top.add-filter-div, .overlay-confirm').hide();

					var filterColor = $('#filter-color').spectrum('get').toRgbString();
					var textColor = $('#text-color').spectrum('get').toHexString();
					$('.device-text-color, .fa.edit-filter, .fa.remove-filter, .content-icon-label').css('color',textColor);
					$('.device-filter').css('background-color',filterColor);
					checkHeight();					
				}
			}
		});
	});

	$(document).on('click','.no.bg-clear',function(){
		$('.confirm-delete-container, #confirmDelete, .overlay-confirm').hide();
	});

	// update background color
	$(document).on('click','.yes.bg-clear',function(){
		var view = $('.each-view.active').attr('viewid');
		var type = $('.each-instance.active').attr('type');
		
		var dataStr = "user="+session_user+"&token="+session_token+"&client_id="+session_client+"&view="+view+"&type="+type;
		$.ajax({
			type: "POST",
			url: baseURL+'updateBackgroundImage.php',
			data: dataStr,
			success: function(data) {
				if (data.status == 'NO'){
					if(data.content == 'invalid_session'){
						if (session_exp == false){
	            session_exp = true;
							checkSession();							
						}	
					} else {
						console.log(data.content);
						alert(data.content);
						return;
					}
				} else {																				
					$('.clear-background-color, .overlay-confirm, .confirm-delete-container, #confirmDelete').hide();					
					$('.device-overlay').css({'background-image':'url()'}).attr('fid','');
					$('.save-change-btn').attr('saved',0);
					return;
				}
			}
		});
	});

	// update background color
	$(document).on('dragstop.spectrum, change','#background-color',function(e,color){		
		var newColor = color.toHexString();
		$('.portal-background-image, .device-overlay').css('background-color',newColor);
		$('.right-content-container').css('background-color',newColor)
		var view = $('.each-view.active').attr('viewid');
		$('.clear-background-color').show();
		$('.save-change-btn').attr('saved',0);
		setTimeout(function(){
			$("#background-color").spectrum('hide');
		},200)
	});

	// update the text color
	$(document).on('dragstop.spectrum, change','#text-color',function(e,color){			
		var view = $('.each-view.active').attr('viewid');
		var bgs = $('#text-color').spectrum('get').toHexString();		
		$('.device-text-color, .fa.edit-filter, .fa.remove-filter, .content-icon-label').css('color',bgs);
		$('.save-change-btn').attr('saved',0);
		setTimeout(function(){
			$("#text-color").spectrum('hide');
		},200)
	});	

	// update filter color
	$(document).on('dragstop.spectrum, change','#filter-color',function(e,color){			
		var view = $('.each-view.active').attr('viewid');
		var filter = $('#filter-color').spectrum('get').toRgbString();
		$('.device-filter').css('background-color',filter);
		$('.save-change-btn').attr('saved',0);
		setTimeout(function(){
			$("#filter-color").spectrum('hide');
		},200)
	});	
	//update padding
	$(document).on('change','#width',function(){
		var w = Number((+$(this).val())*10).toFixed(2);
		var min = $(this).attr('min');
		var p = +$(this).val();
		if(p < min){
			$('#width').val(min);
			alert('Filter padding is to small, must be larger than '+min+'.');
			return;
		}
		$('.device-overlay .dynamic-size').css('padding-right',w+'px').css('padding-left', w+'px')
		$('.save-change-btn').attr('saved',0);
	});

	// submit new thumbnail to upload (not for save edit)
	$(document).on('submit','#edit-background-form',function(e){
		e.preventDefault();				
		var curView = $('.each-view.active').attr('viewid');
		var type = $('.each-instance.active').attr('type');
		updateThumb(this,'bg',curView,type);
	});

	// detect change in background image
	$(function(){
		$(document).on('change','#background-file',function(){			
			$('#message').html('');
			var file = this.files[0];
			var imagefile = file.type;
			var match= ["image/jpeg","image/png","image/jpg"];					
			if (!((imagefile==match[0]) || (imagefile==match[1]) || (imagefile==match[2]))) {								
				$('#message').html('Please Select A valid Image File');
				alert("Please select a valid image file.");				
				return false;
			} else {
				$('.save-change-btn').attr('saved',0);
				var reader = new FileReader();				
				reader.readAsDataURL(this.files[0]);
				$('#edit-background-form').trigger('submit');
			}			
		});
	});

	// submit new thumbnail to upload (not for save edit)
	$(document).on('submit','#edit-logo-form',function(e){
		e.preventDefault();		
		var curView = $('.each-view.active').attr('viewid');
		var type = $('.each-instance.active').attr('type');
		updateThumb(this,'logo',curView,type);
	});

	// detect change in logo image
	$(function(){
		$(document).on('change','#logo-file',function(){			
			$('#message').html('');
			var file = this.files[0];
			var imagefile = file.type;
			var match= ["image/jpeg","image/png","image/jpg"];					
			if (!((imagefile==match[0]) || (imagefile==match[1]) || (imagefile==match[2]))) {								
				$('#message').html('Please Select A valid Image File');
				alert("Please select a valid image file.");				
				return false;
			} else {
				$('.save-change-btn').attr('saved',0);
				var reader = new FileReader();
				// reader.onload = logoImageLoaded;
				reader.readAsDataURL(this.files[0]);
				$('#edit-logo-form').trigger('submit');
			}			
		});
	});

	// click edit thumbnail text
	$(document).on('click','.add-file-btn',function(){
		var type = $(this).attr('type');
		var fid = $('.save-file.save-btn').attr('fid');
		var rowid = $('.save-file.save-btn').attr('rowid');
		$('#'+type+'-file').trigger('click');
	});

	// delete view.
	$(document).on('click','.remove-view',function(){
		var uid = $(this).attr('viewid');				
		$('.confirmation-text, .button-container').hide();
		$('.confirm-delete-container,.confirm-delete,.overlay-confirm, .delete-view').show();				
		$('.yes.confirm.delete-view-btn, .no.confirm.delete-view-btn').attr('rid',uid);
	});

	$(document).on('click','.remove-filter',function(){
		var fid = $(this).parent().attr('fid');
		$('.confirmation-text, .button-container').hide();
		$('.confirm-delete-container,.confirm-delete,.overlay-confirm, .delete-filter').show();
		$('.yes.confirm.delete-filter-btn, .no.confirm.delete-filter-btn').attr('rid',fid);
	});

	$(document).on('click','.yes.confirm.delete-view-btn',function(){
		var cid = $(this).attr('rid');
		var dataStr = "user="+session_user+"&token="+session_token+"&id="+cid+"&client_id="+session_client;
		$.ajax({
			type: "POST",
			url: baseURL+'disableView.php',
			data: dataStr,
			success: function(data) {
				$('#popup').hide();
				$('.overlay-confirm, #confirmDelete, .confirm-delete,.confirm-delete-container').hide();
				if (data.status == 'NO'){
					if(data.content == 'invalid_session'){
						if (session_exp == false){
	            session_exp = true;
							checkSession();							
						}
					} else {							
						alert(data.content);						
						return;
					}
				} else {
					var reset = false;
					if ($('.each-view.active').attr('viewid') == cid){
						reset = true;
					}
					$('.save-change-btn').attr('saved',0);
					$('.each-view-'+cid).remove();
					$('.instance-div-'+cid).remove();
					$('#popup').hide();
					$('.overlay-confirm, #confirmDelete, .confirm-delete,.confirm-delete-container').hide();
					if (reset){
						$('.device-div').removeClass('iphone').removeClass('ipad').removeClass('appletv').removeClass('loading').addClass('ipad')
						$('.portal-logo.portal-image, .device-logo, .portal-background-image, .device-overlay').attr('loc','').css({'background-image':'url()'}).attr('fname','').attr('fid','');						
						$('.portal-background-image, .device-overlay').css('background-color','black');
						$('.device-logo').removeClass('empty');
						$('.right-content-container, .changes-button-container, .portal-background-clear, .portal-filter-back, .device-background-button-div, .edit-view-button-div, .add-item-container, .dynamic-size').hide();
					}
				}
			}
		});
	});

	$(document).on('click','.no.confirm:not(.update-content)',function(){		
		$('.confirm-delete-container,.confirm-delete, .overlay-confirm').hide();		
	});

	$(document).on('click','.yes.confirm.delete-filter-btn',function(){
		// ajax to remove the filter
		var cid = $(this).attr('rid');
		var dataStr = "user="+session_user+"&token="+session_token+"&id="+cid+"&client="+session_client;
		$.ajax({
			type: "POST",
			url: baseURL+'disableFilter.php',
			data: dataStr,
			success: function(data) {
				$('.overlay-confirm, #confirmDelete, .confirm-delete,.confirm-delete-container').hide();
				$('.overlay-confirm').removeClass('active');						
				$('#popup').hide();
				if (data.status == 'NO'){
					if(data.content == 'invalid_session'){
						if (session_exp == false){
	            session_exp = true;
							checkSession();							
						}
					} else {							
						alert(data.content);							
						return;
					}
				} else {									
					$('.device-filter-'+cid).remove();											
				}
			}
		});
	});

	// submit name change for view/filter
	$(document).on('click','.edit-info-btn.btn',function(){
		var type = $(this).attr('type');
		var id = $(this).attr('rid');
		var name = $('.edit-'+type+'-input').val();
		if (name.length == 0){
			alert("Please enter a valid name.");
			return;
		}
		var dataStr = "user="+session_user+"&token="+session_token+"&client_id="+session_client+"&id="+id+"&name="+encodeURIComponent(name);
		var loop = 0;
		if (type == 'filter'){
			var url = 'updateFilter.php';
			var loopChk = $('#loop-input').prop('checked');
			if (loopChk){
				loop = 1;
			}
			dataStr += "&loop="+loop;
		} else if (type == 'view'){
			var url = 'updateView.php';
		}
		
		$.ajax({
			type: "POST",
			url: baseURL+url,
			data: dataStr,
			success: function(data) {
				if (data.status == 'NO'){
					if(data.content == 'invalid_session'){
						if (session_exp == false){
	            session_exp = true;
							checkSession();							
						}					
					} else {
						console.log(data.content);
						alert(data.content);
						return;
					}
				} else {
					$('.save-change-btn').attr('saved',0);
					// success output					
					$('.'+type+'-name-'+id).text(name);
					$('.overlay-confirm, #wrapper-popup-top, #wrapper-popup-bottom').hide();
					$('.edit-input').val('');
				}
			}
		});
	});

	// update content per view
	$(document).on('click','.update-view-btn',function(){
		var vid = $(this).attr('vid');
		var name = $('.edit-view-input').val();		
		if (name.length == 0){
			alert("Please enter a valid name.");
			return;
		}
		var dataStr = "user="+session_user+"&token="+session_token+"&client_id="+session_client+"&id="+vid+"&name="+encodeURIComponent(name);
		// loop through checked boxes building the content
		var array = [];
		var boxes = $('.content-checkbox:checked');
		boxes.each(function() {			
			var order = $(this).attr('order');
			var published = $(this).attr('published');
			if (order == undefined || published == undefined){
				if (order == undefined){
					order = -1;
				}
				if (published == undefined){
					published = 0;
				}
				array.push({
					'id':$(this).val(),
					'order':order,
					'published':published,
				});
			} else {
				array.unshift({
					'id':$(this).val(),
					'order':order,
					'published':published,
				});
			}
		});
		var loop = array;		
		array = JSON.stringify(array);
		dataStr += "&files="+encodeURIComponent(array);
		// loop through users
		var uarray = [];
		var uboxes = $('.user-view-checkbox:checked');
		uboxes.each(function(){			
			uarray.push({
				'id':$(this).val(),				
			});
		});		
		uarray = JSON.stringify(uarray);
		dataStr += "&users="+encodeURIComponent(uarray);		
		$('.update-view-btn').attr('name',name);
		// ajax for setting content per view
		$.ajax({
			type: "POST",
			url: baseURL+'updateViewContent.php',
			data: dataStr,
			success: function(data) {
				window.location.hash = '';	
				$('ul.tabs li').removeClass('current');
				$('ul.tabs li.first').addClass('current');
				$('.popup-main-container').hide();
				$('#name.popup-main-container').show();
				$('#popup, .overlay-confirm').hide();
				if (data.status == 'NO'){
					if(data.content == 'invalid_session'){
						if (session_exp == false){
	            session_exp = true;
							checkSession();							
						}					
					} else {						
						alert(data.content);
						return;
					}
				} else {
					$('.save-change-btn').attr('saved',0);
					$('.view-name-'+vid).text($('.update-view-btn').attr('name'));
					$('.edit-view-icon-'+vid).attr('name',$('.update-view-btn').attr('name'));
					$('.update-view-btn').removeAttr('name');
					// loop through checking					
					if (vid == $('.each-view.active').attr('viewid')){
						$('.each-content').remove();
						$('.content-div').hide();
						// loop through the files adding any new ones to the bottom // each-content-output
						for (var i =0;i<loop.length;i++){
							var e = loop[i];							
							var item = $('.content-icon-list.content-list-id-'+e.id);

							var loc = item.attr('loc');
							var display = item.attr('display');
							var iid = item.attr('iid');
							var name = item.attr('name');
							var icon_location = item.attr('icon');
							var type = item.attr('type');
							var chk = '';
							if ($('.content-div.content-div-'+e.id).length > 0){
								chk = 'checked';
							}
							$('.content-div.content-div-'+e.id).show();
							var code = '<div class="each-content each-content-'+e.id+'" cid="'+e.id+'" loc="'+loc+'" display="'+display+'" name="'+name+'" icon="'+icon_location+'" iid="'+iid+'" type="'+type+'">'
										+'<label for="each-content-'+e.id+'" class="each-content-label">'
										+'<input id="each-content-'+e.id+'" value="'+e.id+'" type="checkbox" '+chk+' class="checkbox each-content-checkbox each-content-'+e.id+'-icon"/>'
										+'</label>'
										+'<img src="'+icon_location+'" class="each-content-list-icon-img each-content-list-icon-img-'+e.id+' draggable" />'
									+'</div>';	
							$('.each-content-output').append(code);							
						}						
					}
					$('.content-div:hidden').remove(); 					
					
					if (boxes.length > 0){
						$('.no-content').hide();						
					}
				}
			}
		});
	});

	$(document).on('click','.device-background-button-div',function(e){
		e.preventDefault();
		var chk = $('.each-instance.active').length;
		if (chk == 0){
			return;
		}		
		$('#background-file').trigger('click');
	});

	$(document).on('click','.edit-logo-button-div',function(e){
		e.preventDefault();
		var chk = $('.each-instance.active').length;
		if (chk == 0){
			return;
		}		
		$('#logo-file').trigger('click');
	});

	$(document).on('click','.edit-view-button-div',function(e){
		e.preventDefault();
		var chk = $('.each-instance.active').length;
		if (chk == 0){
			return;
		}		
		$('.edit-main-view-popup.popup, .overlay-confirm').show();
	});

	// click preview content button
	$(document).on('click','.content-preview-btn',function(){
		var url = $(this).attr('loc');
		window.open(url,'_blank');
		// window.open(url,'_blank','location=yes,height=500,width=600,scrollbars=no,status=yes');
	});

	$(document).on('click','ul.tabs li a',function(){		
		$('.content-video-preview')[0].pause();
	});

	$(document).on('click','.add-icon',function(){
		var type = $(this).attr('type');
		var fid = $('.save-file.save-btn').attr('fid');
		var rowid = $('.save-file.save-btn').attr('rowid');
		$('#new-icon').trigger('click');
	});

	// detect change in thumbnail
	$(function(){
		$(document).on('change','#new-icon',function(){			
			$('#message').html('');
			var file = this.files[0];
			var imagefile = file.type;
			var match= ["image/jpeg","image/png","image/jpg"];					
			if (!((imagefile==match[0]) || (imagefile==match[1]) || (imagefile==match[2]))) {								
				$('#message').html('Please Select A valid Image File');
				alert("Please select a valid image file.");				
				return false;
			} else {
				var reader = new FileReader();				
				reader.readAsDataURL(this.files[0]);
				$('#new-icon-form').trigger('submit');
			}			
		});
	});

	// submit new thumbnail to upload (not for save edit)
	$(document).on('submit','#new-icon-form',function(e){
		e.preventDefault();		
		updateIcon(this);
	});

	// update thumbnail function ajax
	function updateIcon(file){				
		var form = new FormData(file);				
		form.append('user',session_user);
		form.append('token',session_token);		
		form.append('client',session_client);				
		$.ajax({
			type:"POST",
			url: baseURL+"saveIcon.php",
			data: form,
			contentType: false,
			cache: false,
			processData: false,
			success: function(data){				
				if (data.status == 'NO'){
					alert(data.content);
					console.log(data);
					return false;
				} else {		
					$('.no-icon-div').remove();
					var dc = data.content;								
					var fname = dc.fname;					
					var newFile = dc.path;
					var fid = dc.id;
					var code = '<div rid="'+fid+'" loc="'+newFile+'" class="icon-div icon-div-'+fid+'">'
											+'<input id="icon-'+fid+'" value="'+fid+'" type="radio" name="icon-radio" class="checkbox icon-checkbox icon-chk-'+fid+'"/>'
										 +'<label for="icon-'+fid+'" class="icon-label"><img src="'+newFile+'" class="assoc-icon content"></label>'
										+'</div>';
					var xcode = '<div rid="'+fid+'" loc="'+newFile+'" class="icon-div icon-div-'+fid+'">'
											+'<input id="icon-link-'+fid+'" value="'+fid+'" type="radio" name="icon-link-radio" class="checkbox icon-link-checkbox icon-link-chk-'+fid+'"/>'
										 +'<label for="icon-link-'+fid+'" class="icon-label"><img src="'+newFile+'" class="assoc-icon link"></label>'
										+'</div>';

					// add new icon to both containers
					$('.icon-container.edit-content').append(code);
					$('.icon-container.add-link').append(xcode);
				}
			},
			error: function(data){
				console.log(data);
			}
		});
	}

	$(document).on('click','.top-nav-link',function(e){
		var status = $('.save-change-btn').attr('saved');
		if (status == 0){
			e.preventDefault();
			$('.confirmation-text, .button-container').hide();
			$('.confirm-delete-container,.confirm-delete,.overlay-confirm, .leave-page').show();
			$('.yes.leave-page, .no.leave-page').attr('link',$(this).attr('href'));
		}
		return;
	});

	$(document).on('click','.no.leave-page',function(){
		window.location.assign($(this).attr('link'));
	});

	$(document).on('click','.yes.leave-page',function(){
		$('.save-change-btn').addClass('ready').attr('link',$(this).attr('link'));
		$('.save-change-btn').trigger('click');
	});
}

function getWebViewInfo(vid) {
	// get all instance info ajax
	var dataStr = "user="+session_user+"&token="+session_token;
	dataStr += "&client_id="+session_client+"&view_id="+vid+"&type=web";
	$.ajax({
		type: "POST",
		url: baseURL+'getViewInfo.php',
		data: dataStr,
		success: function(data) {
			if (data.status == 'NO') {
				if (data.content == 'invalid_session') {
					if (session_exp == false) {
						session_exp = true;
						checkSession();
					}
				} else {
					console.log(data.content);
					alert(data.content);
					return;
				}
			} else {
				var maxW = 300;
				var dc = data.content;
				var info = dc.info;

				var bgcolor = info.bg_color;
				var textcolor = info.text_color;
				var filtercolor = info.filter_rgb;
				var logo_width = info.logo_size*4;

				$('.device-div').addClass('web');
				$('.device-div').addClass('webview');
				$('#wrapper').attr('textcolor',textcolor).attr('bgcolor',bgcolor).attr('filtercolor',filtercolor);

				// output filters
				var fil = dc.filters;
				var code = '';
				for (var i=0;i<fil.length;i++) {
					var e = fil[i];
					code += '<div class="device-filter device-filter-web device-filter-'+e.id+'" order="'+e.order+'" published="'+e.published+'" fid="'+e.id+'" loops="'+e.loop+'"><div class="device-text-color device-text-color-web device-text-color-'+e.id+' filter-name-'+e.id+'">'+e.name+'</div></div>';
				}
				$('.filters-container').html(code);
				if (fil.length == 0) {
					getViewContent(vid);
				}

				if (logo_width != 0) {
					var ratio = info.ratio;
					var height = parseFloat(logo_width)/parseFloat(ratio);
					$('.device-logo').width(logo_width).height(height);
				}
				if (bgcolor != -1 && bgcolor != '-1') {
					$('.portal-background-image, body').css('background-color',bgcolor);
				}
				if (filtercolor != -1) {
					$('.device-filter').css('background-color',filtercolor);
				}
				if (textcolor != -1) {
					$('.device-text-color, .content-icon-label').css('color',textcolor);
				}
				padding_min = 30.5;
				$('.device-overlay .dynamic-size').css('padding-left',info.padding+'px').css('padding-right',info.padding+'px');
				$('#width').val(info.padding/10).attr('min',padding_min/10);

				// background info
				var bg = info.background;
				var logo = info.logo;
				var logo_fname = logo.split('/');
				logo_fname = logo_fname[logo_fname.length-1];
				var bg_id = info.background_img_id;
				var logo_id = info.background_logo_id;
				var bg_fname = bg.split('/');
				bg_fname = bg_fname[bg_fname.length-1];
				// output background/logo image
				if (bg != '') {
					$('.portal-background-image, body').attr('loc',bg).css({'background-image':'url('+bg+')'}).attr('fname',bg_fname).attr('fid',bg_id);
				}
				if (logo != '') {
					$('.portal-logo.portal-image, .device-logo').attr('loc',logo).css({'background-image':'url('+logo+')'}).attr('fname',logo_fname).attr('fid',logo_id);
				}
				checkWebHeight();
			}
		}
	});
}

function getViewInfo(vid,type){
	// get all instance info ajax
	var dataStr = "user="+session_user+"&token="+session_token;
	dataStr += "&client_id="+session_client+"&view_id="+vid+"&type="+type;
	// reset the view 
	resetView();
	$.ajax({
		type: "POST",
		url: baseURL+'getViewInfo.php',
		data: dataStr,
		success: function(data) {
			if (data.status == 'NO'){
				if(data.content == 'invalid_session'){
					if (session_exp == false){
            session_exp = true;
						checkSession();							
					}	
				} else {
					console.log(data.content);
					alert(data.content);
					return;
				}
			} else {
				if (type == 'iphone'){
					var maxW = 233;
				}else if (type == 'ipad'){
					var maxW = 322;
				} else if (type == 'appletv'){
					var maxW = 300;
				} else if (type == 'web'){
					var maxW = 300;
				}
				var dc = data.content;
				var info = dc.info;
				
				var bgcolor = info.bg_color;
				var textcolor = info.text_color;
				var filtercolor = info.filter_rgb;
				var logo_width = info.logo_size;
				
				$('.device-div').addClass(type);

				// output filters
				var fil = dc.filters;
				var code = '';
				for (var i=0;i<fil.length;i++){
					var e = fil[i];					
					code += '<div class="device-filter device-filter-'+e.id+'" order="'+e.order+'" published="'+e.published+'" fid="'+e.id+'" loops="'+e.loop+'"><div class="device-text-color device-text-color-'+e.id+' filter-name-'+e.id+'">'+e.name+'</div><i class="fa fa-remove remove-filter"></i><div class="edit-filter" fid="'+e.id+'"><i class="fa fa-edit edit-filter edit-info" fid="'+e.id+'" name="'+e.name+'" type="filter" loops="'+e.loop+'"></i></div></div>';
				}
				$('.filters-container').html(code);
				$('.right-content-container').hide();
				if (fil.length == 0){					
					$('.right-content-container').show();
					$('.save-change-btn').attr('loops',0);
					getViewContent(vid);					
				}
				
				if (logo_width != 0){					
					var ratio = info.ratio
					var height = parseFloat(logo_width)/parseFloat(ratio);				
					$('.device-logo').width(logo_width).height(height);
				}
				if (bgcolor != -1 && bgcolor != '-1'){
					$('.portal-background-image, .device-overlay').css('background-color',bgcolor);
					$('#background-color').spectrum('set',bgcolor);
					$('.right-content-container').css('background-color',bgcolor)
				}
				if (filtercolor != -1){
					$('#filter-color').spectrum('set',filtercolor).spectrum({showAlpha:true});
					$('.device-filter').css('background-color',filtercolor);
				}

				if (textcolor != -1){
					$('#text-color').spectrum('set',textcolor);
					$('.device-text-color, .fa.edit-filter, .fa.remove-filter, .content-icon-label').css('color',textcolor);
				}
				$('.rotate-div').hide();
				if (type != 'appletv' && type != 'web'){
					$('.rotate-div').show();
				}
				if(type == 'appletv'){
					padding_min = 30.5;
				}
				if(type == 'iphone'){
					padding_min = 7.5;
				}
				if(type == 'ipad'){
					padding_min = 19;
				}
				if(type == 'web'){
					padding_min = 30.5;
				}
				$('.changes-button-container.manage-view, .color-container, .dynamic-size').show();				
				$('.device-overlay .dynamic-size').css('padding-left',info.padding+'px').css('padding-right',info.padding+'px');
				$('#width').val(info.padding/10).attr('min',padding_min/10);
				$('.filters-container').sortable();

				// background info
				var bg = info.background;
				var logo = info.logo;
				var logo_fname = logo.split('/');
				logo_fname = logo_fname[logo_fname.length-1];
				var bg_id = info.background_img_id;
				var logo_id = info.background_logo_id;
				var bg_fname = bg.split('/');
				bg_fname = bg_fname[bg_fname.length-1];								
				// output background/logo image
				if (bg != ''){
					$('.clear-background-color').show();
					$('.portal-background-image, .device-overlay').attr('loc',bg).css({'background-image':'url('+bg+')'}).attr('fname',bg_fname).attr('fid',bg_id);
				}	
				if (logo != ''){
					$('.portal-logo.portal-image, .device-logo').attr('loc',logo).css({'background-image':'url('+logo+')'}).attr('fname',logo_fname).attr('fid',logo_id);
					// make logo resizable
					$('.device-logo').resizable({
						opacity:0.35,
						maxWidth:maxW,
						aspectRatio: info.width/info.height,
						containment:'.dynamic-size',											
						stop:function(e,ui){						
							checkHeight();
							$('.save-change-btn').attr('saved',0);
						},
					}).removeClass('empty');
				}
				$('.device-background-button-div, .edit-view-button-div, .portal-background-clear').show();
				checkHeight();					
			}
		}
	});
}

function loadClients(client_id){

	$(document).on('click','.overlay',function(){
		$(this).hide();
		$('.ddl-content').hide();
		$('.drop-down').removeClass('active');
	});
	// check the user, make sure the user is apart of the client
	$.ajax({
		type: "POST",
		url: baseURL+'getClients.php',
		data: "user="+session_user+"&token="+session_token,
		success: function(data) {
			if (data.status == 'NO'){
				if(data.content == 'invalid_session'){
					if (session_exp == false){
						session_exp = true;
						checkSession();							
					}
				} else {
					console.log(data.content);
					alert(data.content);
					return;
				}
			} else {
				getBG(session_client);
				var clients = data.content;									
				var html = '';			
				for (var i = 0 ; i < clients.length ; i++) {										
					var cl = '';
					var e = clients[i];					
					if (client_id == e.id){
						cl = 'selected';
					} 					
					html += '<li class="client-li '+cl+'" choice="'+e.name+'" id="'+e.id+'">'+e.name+'</li>';
				}
				if (clients.length == 0){
					html += '<li choice="no-clients" class="no-client-li"></li>';		
				}				
				$('.client-output').html(html);				
			}
		}
	});
}

function loadPush(){
	var dataStr = "user="+session_user+"&token="+session_token+"&client="+session_client;
	$.ajax({
		type: "POST",
		url: baseURL+'getViews.php',
		data: dataStr,
		success: function(data) {
			if (data.status == 'NO'){
				if(data.content == 'invalid_session'){
					if (session_exp == false){
            session_exp = true;
						checkSession();							
					}					
				} else {
					console.log(data.content);
					alert(data.content);
					return;
				}
			} else {
				var groups = data.content;								
				var html = '';				
				for (var i = 0 ; i < groups.length ; i++) {
					var e = groups[i];					
					html += '<tr rid="'+e.id+'" name="'+e.name+'"><td><input id="group-'+e.id+'" value="'+e.id+'" type="checkbox" class="checkbox group-checkbox"/><label for="group-'+e.id+'" >'+e.name+'</label></td></tr>';
				}
				if (groups.length == 0){
					html = '<tr class="no-user-row"><td colspan="1" class="center">No Groups found.</td></tr>';	
				}
				$('.table-content-container.tbody.view').html(html);
			}
		}
	});

	// get usres
	$.ajax({
		type: "POST",
		url: baseURL+'getUsers.php',
		data: "user="+session_user+"&token="+session_token+"&client="+session_client,
		success: function(data) {
			if (data.status == 'NO'){
				if(data.content == 'invalid_session'){
					if (session_exp == false){
            session_exp = true;
						checkSession();							
					}					
				} else {
					console.log(data.content);
					alert(data.content);
					return;
				}
			} else {
				var gr = data.content;
				var html = '';				
				for (var i = 0 ; i < gr.length ; i++) {
					if (parseInt(gr[i].published) == 0){
						continue;
					}
					html += '<tr class="user-content-row user-content-row-id-'+gr[i].id+' group-user-row group-user-row-id-'+gr[i].id+'" rid="'+gr[i].id+'" name="'+gr[i].name+'">'
									+'<td value="z" class="user-content-id-chk-status-'+gr[i].id+' user-content-chk-status">'
										+'<input id="group-user-'+gr[i].id+'" value="'+gr[i].id+'" type="checkbox" class="checkbox user-content-checkbox content-checkbox user-content-checkbox-id-'+gr[i].id+'"/>'										
										+'<label for="group-user-'+gr[i].id+'" >'+gr[i].name+'</label>'
									+'</td></tr>';
				}
				if (gr.length == 0){
					html = '<tr class="no-user-row no-assoc-row user"><td colspan="1">No users found.</td></tr>';	
				}
				
				$('.table-content-container.tbody.user').html(html);
			}
		}
	});

	$(document).on('change','.all-chk',function(){				
		var status = $(this).is(':checked');
		var which = $(this).attr('target');				
		$('.table-content-container.tbody.'+which+' input.checkbox').prop('checked',status);		
	});
	
	$(document).on('change','.checkbox', function(){
		var which = $('.push-radio-notification:checked').val();
		var boxes = $('.table-content-container.tbody.'+which+' input.checkbox');
		var chk = true;
		boxes.each(function(){
			if (!$(this).prop('checked')){
				chk = false;
			}
		});
		$('.all-chk.'+which).prop('checked',chk);		
	});

	$(document).on('change','.push-radio-notification',function(){
		$('.global-hide-div').hide();
		var val = $(this).val();		
		$('.'+val+'-list-div').show();
		$('.add-notification-div, .push-text-div').show();
		$('.table-content-container.tbody input.checkbox, .all-chk').prop('checked',false);
	});

	$(document).on('click','.add-push-text',function(){
		if ($(this).hasClass('active')){
			return;
		}
		var which = $('.push-radio-notification:checked').val();		
		var array = [];
		var boxes = $('.table-content-container.tbody.'+which+' input.checkbox:checked');
		boxes.each(function() {
			array.push($(this).val());			
		})
		
		if (array.length == 0){
			alert("Please select valid "+which+"s");
			return;
		}
		array = JSON.stringify(array);
		var message = $('#push-text-area').val();
		if (message.length == 0){
			alert("Please enter a valid message.");
			return;
		}
		$(this).addClass('active');
		$('.add-push-text').text('SENDING...');
		var dataStr = "user="+session_user+"&token="+session_token+"&client="+session_client+"&object="+array+"&message="+encodeURIComponent(message)+"&type="+encodeURIComponent(which);		
		// ajax for sending push
		$.ajax({
			type: "POST",
			url: baseURL+'sendPush.php',
			data: dataStr,
			success: function(data) {
				$('.add-push-text').text('SEND PUSH NOTIFICATION').removeClass('active');
				if (data.status == 'NO'){
					if(data.content == 'invalid_session'){
						if (session_exp == false){
	            session_exp = true;
							checkSession();							
						}					
					} else {
						console.log(data.content);
						alert(data.content);
						return;
					}
				} else {
					// successfully sent APN push notification
					alert("Push notification sent successfully.");
					$('#push-text-area').val('');
					$('.table-content-container.tbody input.checkbox, .all-chk').prop('checked',false);					
				}
			}
		});
	});
}

// get client info/background/logo
function getBG(cid){	
	$.ajax({
		type: "POST",
		url: baseURL+'getBG.php',
		data: "user="+session_user+"&token="+session_token+"&id="+cid,
		success: function(data) {
			if (data.status == 'NO'){
				if(data.content == 'invalid_session'){
					if (session_exp == false){
            session_exp = true;
						checkSession();
					}
				} else {
					alert(data.content);
					return false;
				}
			} else {
				var dc = data.content;
				features = dc.features;								
				var newBG = dc.path;
				var page = location.href;
				if (page.indexOf('#') != -1){
					page = page.split('#').slice(0)[0];
				}
				page = page.split("/").slice(-1)[0].slice(0,-4);				
								
				if (newBG == -1||newBG == '-1'){					
					$('.header-logo').attr('src','img/foi_logo.png');						
				} else {					
					$('.header-logo').attr('src',newBG);						
				}
				var anaLink = dc.link;
				if (anaLink.length == 0 || anaLink == ''){
					$('.top-bar.analytics').hide();
				} else {
					$('.top-bar.analytics').show();
					$('.top-bar.analytics').attr('href',anaLink);
				}
				$('.feature-input').addClass('hide-now');

				for (var i =0;i<features.length;i++){
					var e = features[i];					
					$('.feature-'+e).show();					
					$('.feature-'+e).removeClass('hide-now').removeClass('last');					
				}
			}
		}
	});
}

function loadIcons(){
	$.ajax({
		type: "POST",
		url: baseURL+'getIcons.php',
		data: "user="+session_user+"&token="+session_token+"&client="+session_client,
		success: function(data) {
			if (data.status == 'NO'){
				if(data.content == 'invalid_session'){
					if (session_exp == false){
            session_exp = true;
						checkSession();							
					}						
				} else {
					console.log(data.content);
					alert(data.content);
					return;
				}
			} else {
				var icons = data.content;		
				globalIcons = icons;		

				var html = '';
				var xhtml = '';
				for (var i = 0 ; i < icons.length ; i++) {
					var e = icons[i];										
					html += '<div rid="'+e.id+'" fileid="'+e.file_id+'" loc="'+e.location+'" class="icon-div icon-div-'+e.id+' icon-file-id-'+e.file_id+'">'
										+'<input id="icon-'+e.id+'" value="'+e.id+'" type="radio" name="icon-radio" class="checkbox icon-checkbox icon-chk-'+e.id+'"/>'
									 +'<label for="icon-'+e.id+'" class="icon-label"><img src="'+e.location+'" class="assoc-icon content"></label>'
									+'</div>';
					xhtml += '<div rid="'+e.id+'" fileid="'+e.file_id+'" loc="'+e.location+'" class="icon-div icon-div-'+e.id+' icon-file-id-'+e.file_id+'">'
										+'<input id="icon-link-'+e.id+'" value="'+e.id+'" type="radio" name="icon-link-radio" class="checkbox icon-link-checkbox icon-link-chk-'+e.id+'"/>'
									 +'<label class="icon-label" for="icon-link-'+e.id+'"><img src="'+e.location+'" class="assoc-icon link"></label>'
									+'</div>';
				}									

				if (icons.length == 0){
					html = '<div class="center icon-div no-icon-div">No icons found.</div>';	
					xhtml = '<div class="center icon-div no-icon-div">No icons found.</div>';	
				}
				$('.icon-container.edit-content').html(html);
				$('.icon-container.add-link').html(xhtml);
			}
		}
	});
}

function loadContentFilters(){
	$.ajax({
		type: "POST",
		url: baseURL+'getFilters.php',
		data: "user="+session_user+"&token="+session_token+"&client="+session_client,
		success: function(data) {
			if (data.status == 'NO'){
				if(data.content == 'invalid_session'){
					if (session_exp == false){
            session_exp = true;
						checkSession();							
					}
				} else {
					console.log(data.content);
					alert(data.content);
					return;
				}
			} else {
				var filters = data.content;
				var html = '';
				for (var i = 0 ; i < filters.length ; i++) {
					var e = filters[i];
					html += '<tr rid="'+e.id+'" name="'+e.name+'"><td value="z" class="filter-content-checkbox-id-'+e.id+'"><input id="filter-'+e.id+'" value="'+e.id+'" type="checkbox" class="checkbox filter-checkbox filter-checkbox-id-'+e.id+'"/><label for="filter-'+e.id+'" >'+e.name+'</label></td></tr>';
				}
				if (filters.length == 0){
					html = '<tr class="no-user-row"><td colspan="1" class="center">No Filters found.</td></tr>';	
				}
				$('.table-content-container.tbody.filter').html(html);
			}
		}
	});
}

function getFileIcon(fileId){
	$.ajax({
		type: "POST",
		url: baseURL+'getFileIcon.php',
		data: "user="+session_user+"&token="+session_token+"&id="+fileId,
		success: function(data) {
			if (data.status == 'NO'){
				if(data.content == 'invalid_session'){
					if (session_exp == false){
            session_exp = true;
						checkSession();							
					}	
				} else {					
					alert(data.content);
					return false;
				}
			} else {
				var dc = data.content;								
				return dc;
			}
		}
	});
}

// checks
function checkHeight(){
	var wideCheck = $('.dynamic-size.wide').length;
	$('.dynamic-size').css('margin-top',0).removeClass('overflow').removeClass('fix');	
	var device = $('.each-instance.active').attr('type');
	var contentCheck = $('.content-div:visible').length;

	$('.content-div').removeClass('last-content-div').removeClass('only-three').removeClass('only-two').removeClass('only-four');

	var row = 3;
	if (wideCheck == 0){ // straight up no change
		if (device == 'iphone'){
			var chk = 467;
			row = 2;
		} else if (device == 'ipad'){
			var chk = 488;
		} else if (device == 'appletv'){
			var chk = 343;			
		} else if (device == 'web'){
			var chk = 331;
		}
	} else { // wide screen, must change the height/width overflow		
		if (device == 'iphone'){
			row = 4;
			var chk = 262;			
		} else if (device == 'ipad'){
			var chk = 364;
			row = 5;
		} else if (device == 'appletv'){
			var chk = 611;
		}	else if (device == 'web'){
			var chk = 529;
		}
	}
	var devHeight = $('.dynamic-size').height();
	if (devHeight >= chk){
		$('.dynamic-size').addClass('overflow');
	} else {
		var diff = chk-devHeight;			
		$('.dynamic-size').css('margin-top',diff/2);
	}

	var textColor = $('#text-color').spectrum('get').toHexString();
	$('.device-text-color, .fa.edit-filter, .fa.remove-filter, .content-icon-label').css('color',textColor);

	var mod = contentCheck%row;	
	if (mod == 1){
		$(".dynamic-size").addClass('fix');
		$('.content-div:last-child').addClass('last-content-div');
	} else if (mod == 2){
		$('.content-div:eq(-2)').addClass('only-two');
	} else if (mod == 3){
		$('.content-div:eq(-3)').addClass('only-three');
	}	else if (mod == 4){ 
		$('.content-div:eq(-4)').addClass('only-four');
	}
	checkLabel();
}

function checkWebHeight() {
	var wideCheck = $('.dynamic-size.wide').length;
	$('.dynamic-size').css('margin-top',0).removeClass('overflow').removeClass('fix');
	var contentCheck = $('.content-div:visible').length;

	$('.content-div').removeClass('last-content-div').removeClass('only-three').removeClass('only-two').removeClass('only-four');

	var row = 3;
	if (wideCheck == 0) { // straight up no change
		var chk = 1080;
	} else {
		var chk = 1920;
	}

	var devHeight = $('.dynamic-size').height();
	if (devHeight >= chk) {
		// $('.dynamic-size').addClass('overflow');
	} else {
		var diff = chk-devHeight;
		$('.dynamic-size').css('margin-top', diff/2);
	}

	var mod = contentCheck%row;
	if (mod == 1) {
		$('.dynamic-size').addClass('fix');
		$('.content-div:last-child').addClass('last-content-div');
	} else if (mod == 2) {
		$('content-div:eq(-2)').addClass('only-two');
	} else if (mod == 3) {
		$('content-div:eq(-3)').addClass('only-three');
	} else if (mod == 4) {
		$('content-div:eq(-4)').addClass('only-four');
	}
	checkLabel();
}

function checkSession(){
	if (session_exp == true){
		alert("Session expired, please log in again.");
		window.location.href = 'logout.php';	
		// session_exp = false;		
	} else {
		return true;
	}
}

function checkUserInputs(){
	var check = true;
	if ($.inArray('password',features) != -1){
		$('input.add-user-input').each(function(){		
			if ($(this).val().length == 0){
				check = false;
			}
		});
	} else {
		if ($('.add-user-input.name').length == 0){
			check = false;
		}
	}
	if (check){
		$(".submit-new-user.btn").addClass('active');
	} else {
		$(".submit-new-user.btn").removeClass('active');
	}
}

function checkAdminUserInputs(){
	var check = true;
	$('.add-user-input').each(function(){				
		if ($(this).val().length == 0){
			check = false;
		}
	});			
	if (check){
		$(".submit-new-user.btn").addClass('active');
	} else {
		$(".submit-new-user.btn").removeClass('active');
	}
}

var fixHelper = function(e, tr) {
  var $originals = tr.children();
  var $helper = tr.clone();
  $helper.children().each(function(index)
  {
    $(this).width($originals.eq(index).width())
  });
  return $helper;
};

function resetView(){
	// reset view
	$('.device-div').removeClass('iphone').removeClass('ipad').removeClass('appletv').removeClass('web').removeClass('loading');
	$('.portal-logo.portal-image, .device-logo, .portal-background-image, .device-overlay').attr('loc','').css({'background-image':'url()'}).attr('fname','').attr('fid','');
	$('.portal-background-image, .device-overlay').css('background-color','white');
	$('#background-color').spectrum('set','white');	
	$('#filter-color').spectrum('set','white');
	$('.device-filter').css('background-color','white');
	$('#text-color').spectrum('set','black');
	$('.device-text-color').css('color','black');
	$('.clear-background-color').hide();
	$('.device-logo').addClass('empty');
	$('.content-div').remove();
}

function rotateRight(){
	var mat = $('.device-view').css('transform');
	if (mat != 'none'){
		var vals = mat.split('(')[1].split(')')[0].split(',');
		var a = vals[0];
		var b = vals[1];
		var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
	} else {
		var angle = 0;
	}
	
	if (angle == 90){
		angle = 270;
	} else if (angle == 270){
		angle = 0;
	} else {
		angle = angle+90;
	}
	$('.dynamic-size, .device-container').removeClass('wide');
	if (angle != 0){
		$('.dynamic-size, .device-container').addClass('wide');
	}
	
	$('.device-view').css('transform','rotate('+angle+'deg)');
	$('.dynamic-size').css('transform','rotate(0deg)');
	$(".rotate-div").removeClass('active');
	checkHeight();
}

function rotateLeft(){
	var mat = $('.device-view').css('transform');
	if (mat != 'none'){
		var vals = mat.split('(')[1].split(')')[0].split(',');
		var a = vals[0];
		var b = vals[1];
		var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
	} else {
		var angle = 0;
	}

	if (angle == -90){
		angle = 90;
		var mainAngle = -90;
	} else {
		angle = angle-90;
		var mainAngle = -angle;
	}
	
	$('.dynamic-size, .device-container').removeClass('wide');
	if (angle != 0){
		$('.dynamic-size ,.device-container').addClass('wide');
	}
	$('.device-view').css('transform','rotate('+angle+'deg)');
	$('.dynamic-size').css('transform','rotate(0deg)');
	$(".rotate-div").removeClass('active');
	checkHeight();
}

//--- TABLE LOADERS ---//	
function userViewAssoc(uid){
	$('.content-checkbox').prop('checked',false);
	$('.user-content-chk-status').attr('value','z');
	$('.user-content-row').removeClass('selected');
	var id = uid;
	$.ajax({
		type: "POST",
		url: baseURL+'getUserView.php',
		data: "user="+session_user+"&token="+session_token+"&id="+id,
		success: function (data) {
			if (data.status == 'NO'){
				if(data.content == 'invalid_session'){
					if (session_exp == false){
            session_exp = true;
						checkSession();							
					}	
				} else {
					console.log(data.content);
					alert(data.content);
					return;
				}
			} else {
				var content = data.content;															
				var boxes = $('.table-content-container input.checkbox');					
				for (var i = 0 ; i < content.length ; i++) {
					var e = content[i];
					$('.user-content-checkbox-id-'+e).prop('checked', true);
					$('.user-content-id-chk-status-'+e);		
					$('.user-content-row-id-'+e).addClass('selected');				
				}											
			}
		}
	});
}

function getViewUsers(uid){
	$('.user-view-checkbox').prop('checked',false);	
	var id = uid;
	$.ajax({
		type: "POST",
		url: baseURL+'getViewUsers.php',
		data: "user="+session_user+"&token="+session_token+"&id="+id,
		success: function (data) {
			if (data.status == 'NO'){
				if(data.content == 'invalid_session'){
					if (session_exp == false){
            session_exp = true;
						checkSession();							
					}	
				} else {
					console.log(data.content);
					alert(data.content);
					return;
				}
			} else {
				var content = data.content;								
				for (var i = 0 ; i < content.length ; i++) {
					var e = content[i];
					$('.user-view-checkbox-id-'+e).prop('checked', true);
				}
			}
		}
	});
}

function getWebViewContent(vid) {
	var dataStr = "user="+session_user+"&token="+session_token+"&client_id="+session_client+"&id="+vid;
	// ajax for getting content per view
	$.ajax({
		type: "POST",
		url: baseURL+'getViewContent.php',
		data: dataStr,
		success: function(data) {
			if (data.status = 'NO') {
				if (data.content == 'invalid_session') {
					if (session_exp == false) {
						session_exp = true;
						checkSession();
					}
				} else {
					console.log(data.content);
					alert(data.content);
					return;
				}
			} else {
				// loop through checking
				var files = data.content;
				var ccode = '';
				for (var i = 0;i<files.length;i++) {
					var e = files[i];
					$('.each-content-'+e.id).show();
					$('div.content-div.content-div-'+e.id).show();
					var labelClass = '';
					if (e.display.length > 15) {
						labelClass = 'overflow';
					}
					ccode += '<div class="content-div content-div-web content-div-'+e.id+' removable" cid="'+e.id+'" content-type="'+e.content_type+'" name="'+e.name+'" display="'+e.display+'" iid="'+e.icon_id+'" type="'+e.type+'" loc="'+e.location+'" loops="0"><img src="'+e.icon_locaion+'" class="device-content-icon-web device-content-icon-'+e.id+' content-'+e.id+'-icon-'+e.icon_id+'" />'+'<div class="content-icon-label-web '+labelClass+'">'+e.display+'</div>'+'</div>';
				}
				$('.device-content-container').html(ccode);
			}

			// var textColor = $('#text-color').spectrum('get').toHexString();
			$('.device-text-color, .content-icon-label-web').css('color',$('#wrapper').attr('textcolor'));

			checkWebHeight();
		}
	});
}

function getViewContent(vid){
	var dataStr = "user="+session_user+"&token="+session_token+"&client_id="+session_client+"&id="+vid;
	// ajax for getting content per view	
	$.ajax({
		type: "POST",
		url: baseURL+'getViewContent.php',
		data: dataStr,
		success: function(data) {
			if (data.status == 'NO'){
				if(data.content == 'invalid_session'){
					if (session_exp == false){
            session_exp = true;
						checkSession();							
					}					
				} else {
					console.log(data.content);
					alert(data.content);
					return;
				}
			} else {
				// loop through checking
				var files = data.content;
				var ccode = '';
				for (var i = 0;i<files.length;i++){
					var e = files[i];					
					$('.each-content-'+e.id).show();
					if (e.published == 1){
						$('.each-content-checkbox.each-content-'+e.id+'-icon').prop('checked',true);						
						$('div.content-div.content-div-'+e.id).show();
						var labelClass = '';						
						if (e.display.length > 15){
							labelClass = 'overflow';
						}
						ccode += '<div class="content-div content-div-'+e.id+' removable" cid="'+e.id+'" content-type="'+e.content_type+'" name="'+e.name+'" display="'+e.display+'" iid="'+e.icon_id+'" type="'+e.type+'" loc="'+e.location+'" loops="0"><img src="'+e.icon_location+'" class="device-content-icon device-content-icon-'+e.id+' content-'+e.id+'-icon-'+e.icon_id+'" />'
							+'<div class="content-icon-label '+labelClass+'">'+e.display+'</div>'
						+'</div>';
					}
				}
				$('.device-content-container').html(ccode).sortable({
					revert: false,
					start:function(e,ui){
						$('.content-div').removeClass('last-content-div').removeClass('only-three').removeClass('only-two').removeClass('only-four');
					},
					stop:function(e,ui){
						checkHeight();
					}
				});
				
				var textColor = $('#text-color').spectrum('get').toHexString();
				$('.device-text-color, .fa.edit-filter, .fa.remove-filter, .content-icon-label').css('color',textColor);

				$('.device-content-container, .right-content-container').show();

				$('.content-div').draggable({
					cursor:'move',						
					revert:function(e,ui){															
						if (!e){
							var cid = $(this).attr('cid');
							$('.content-div.content-div-'+cid).remove();
							$('.each-content-checkbox.each-content-'+cid+'-icon').prop('checked',false);
							if ($('.content-div').length == 0){
								$('.device-content-container').addClass('empty');
							}
							checkHeight();
							return true;
						}
					},
					connectToSortable:".device-content-container",									
				});

				$('.each-content-list-icon-img').draggable({
					cursor:'move',
					revert:'invalid',						
					helper:function(){
						var cloned = $(this).clone();				
						return cloned;
					},
					zIndex: 10000,			
				});				

				$('.device-content-container').droppable({
					hoverClass:'ui-state-active',
					tolerance:'touch',
					drop:function(e,ui){				
						var parent = $(ui.helper[0]).parent();
						var parid = parent.attr('cid');
						
						if ($(ui.helper).hasClass('draggable')){
							if ($('.content-div.content-div-'+parid).length == 0){
								$('.each-content-checkbox.each-content-'+parid+'-icon').prop('checked',true);
								var labelClass = '';
								if (parent.attr('display').length > 18){
									labelClass = 'overflow';
								}
								var code = '<div class="content-div content-div-'+parid+' removable" cid="'+parid+'" content-type="'+parent.attr('content_type')+'" name="'+parent.attr('name')+'" display="'+parent.attr('display')+'" iid="'+parent.attr('iid')+'" type="'+parent.attr('type')+'" loc="'+parent.attr('loc')+'"><img src="'+parent.attr('icon')+'" class="device-content-icon device-content-icon-'+parid+' content-'+parid+'-icon-'+parent.attr('iid')+'" /><div class="content-icon-label '+labelClass+'">'+parent.attr('display')+'</div></div>';
								$('.device-content-container').append(code).sortable({
									revert: false,
									start:function(e,ui){
										$('.content-div').removeClass('last-content-div').removeClass('only-three').removeClass('only-two').removeClass('only-four');
									},
									stop:function(e,ui){
										checkHeight();
									}
								});
								$('.content-div-'+parid).draggable({
									cursor:'move',						
									revert:function(e,ui){															
										if (!e){
											var cid = $(this).attr('cid');
											$('.content-div.content-div-'+cid).remove();
											$('.each-content-checkbox.each-content-'+cid+'-icon').prop('checked',false);
											if ($('.content-div').length == 0){
												$('.device-content-container').addClass('empty');
											}
											checkHeight();
											return true;
										}
									},
									connectToSortable:".device-content-container",										
								});
								var textColor = $('#text-color').spectrum('get').toHexString();
								$('.device-text-color, .fa.edit-filter, .fa.remove-filter, .content-icon-label').css('color',textColor);
							}
						}							
					},
					accept:'.each-content-list-icon-img',
					over:function(e,ui){				
					},			
				}).sortable({
					revert: false,
					start:function(e,ui){
						$('.content-div').removeClass('last-content-div').removeClass('only-three').removeClass('only-two').removeClass('only-four');
					},
					stop:function(e,ui){
						checkHeight();
					}
				});

				checkHeight();
			}
		}
	});
}

// update thumbnail function ajax
function updateThumb(file,type,view,viewType){
	var form = new FormData(file);
	form.append('id',session_client);
	form.append('user',session_user);
	form.append('token',session_token);				
	form.append('client',session_client);
	if (viewType != 'main'){	// update other images - device background/logo
		form.append('type',type);	
		form.append('viewType',viewType);
		form.append('view',view);
		
		$.ajax({
			type:"POST",
			url: baseURL+"saveImage.php",
			data: form,
			contentType: false,
			cache: false,
			processData: false,
			success: function(data){						
				if (data.status == 'NO'){
					alert(data.content);
					console.log(data);
					return;
				} else {
					if (viewType == 'iphone'){
						var maxW = 233;
					}else if (viewType == 'ipad'){
						var maxW = 322;
					} else if (viewType == 'appletv'){
						var maxW = 300;
					}		
					var dc = data.content;					
					var newFile = dc.path;
					var fname = dc.fname;					
					var fid = dc.id;					
					if (type == 'logo'){
						var logo_width = dc.logo_width;
						var ratio = dc.ratio;
						var height = parseFloat(logo_width)/parseFloat(ratio);
						$('.device-logo').attr('loc',newFile).css({'background-image':'url('+newFile+')'}).attr('fname',fname).attr('fid',fid);
						$('.device-logo').width(logo_width).height(height);
						// make logo resizable
						$('.device-logo').resizable({
							aspectRatio: dc.width/dc.height,
							maxWidth:maxW,					
							containment:'.dynamic-size',											
							stop:function(e,ui){						
								checkHeight();
							},
						}).removeClass('empty');
						checkHeight();
					} else {
						$('.clear-background-color').show();
						$('.portal-background-image, .device-overlay').attr('loc',newFile).css({'background-image':'url('+newFile+')'}).attr('fname',fname).attr('fid',fid);						
					}																				
				}
			},
			error: function(data){
				console.log(data);
			}
		});
	} else {			
	 	// save main header logo/image				
		$.ajax({
			type:"POST",
			url: baseURL+"saveHeaderImage.php",
			data: form,
			contentType: false,
			cache: false,
			processData: false,
			success: function(data){
				if (data.status == 'NO'){
					alert(data.content);
					console.log(data);
					return;
				} else {
					var dc = data.content;
					var newFile = dc.path;
					var fname = dc.fname;
					var fid = dc.id;
					$('.header-logo').attr('src',newFile);						
				}
			},
			error: function(data){
				console.log(data);
			}
		});
	}
}

function loadViewUsers(){
	$.ajax({
		type: "POST",
		url: baseURL+'getUsers.php',
		data: "user="+session_user+"&token="+session_token+"&client="+session_client,
		success: function(data) {
			if (data.status == 'NO'){
				if(data.content == 'invalid_session'){
					if (session_exp == false){
						session_exp = true;
						checkSession();							
					}					
				} else {
					console.log(data.content);
					alert(data.content);
					return false;
				}
			} else {				
				var users = data.content;									
				var html = '';				
				for (var i = 0 ; i < users.length ; i++) {
					html += '<tr class="user-row table-row user-row-'+i+' user-row-id-'+users[i].id+'" rid="'+users[i].id+'" name="'+users[i].name+'">'
									+'<td class="user-content-row user-name-row-'+users[i].id+'">'
										+'<input type="checkbox" name="view-content-user-group" id="user-view-check-'+users[i].id+'" class="user-view-checkbox user-view-checkbox-id-'+users[i].id+'" value="'+users[i].id+'"/>'
										+'<label class="content-label" for="user-view-check-'+users[i].id+'">'+users[i].name+'</label>'
									+'</td>'
								+'</tr>';
				}
				if (users.length == 0){
					html += '<tr class="no-user-row"><td colspan="2">No users found.</td></tr>';		
				}
				html += '';
				$('.table-content-container.tbody').html(html);
				$(window).trigger('resize');
			}
		}
	});
}

function checkLabel(){
	$('.content-icon-label').each(function(){
		var len = $(this).html().length;
		if (len > 15){
			$(this).addClass('overflow');
		} else {
			$(this).removeClass('overflow');
		}
	});
}