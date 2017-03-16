<?php
	session_start();
	if (!isset($_SESSION['fdcsl']['user'])){
		if(!isset($_SESSION['fdcsl']['redirect_url'])){
			$_SESSION['fdcsl']['redirect_url'] = 'content.php';
		}
	} else {
		header('Location:'.$_SESSION['fdcsl']['redirect_url']);
	}
?>
<!DOCTYPE html>
<html>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
		<script type="text/javascript" src="js/jquery-1.11.3.min.js"></script>
		<script type="text/javascript" src="js/jscript.js"></script>
		<script type="text/javascript" src="js/config.js"></script>
		<script type="text/javascript" src="js/kickstart.js"></script>
		<link rel="stylesheet" href="css/kickstart.css" media="all" />
		<link rel="stylesheet" type="text/css" media="screen, projection" href="css/style.css"/>
		<title>Portal | Login</title>
	</head>
	<body>
		<div class="wrapper">
			<div id="header" class="container upload">
				<div class="grid">
					<div class="col_12 header-container">
						<div class="header-logo-container col_12 center">
							<a href="."><img src="img/foi_logo.png" alt="FDCSL" class="header-logo"/></a>			
						</div>			
					</div>
				</div>
			</div>
			<div class="grid">
				<div id="wrapper" class="container col_12">
					<div class="col_3"></div>
					<div class="col_6 main-login">
						<form action="" id="loginForm">
							<span class="form-input-label user">USERNAME</span>
							<br>
							<input type="text" class="text-input login signin" id="user" placeholder="" name="user"/>
							<br>
							<span class="form-input-label user">PASSWORD</span>
							<br>
							<input type="password" class="text-input login signin" id="password" placeholder="" name="password"/>
							<br>
							<input type="submit" id="login-btn" class="login-submit-btn inactive" value="LOGIN"/>						
							
							<!-- <div class="forgot-login">FORGET USERNAME OR PASSWORD? <a href="resetPass.php" class="forgot-link">CLICK HERE</a></div> -->
						</form>					
					</div>
					<div class="col_3"></div>
				</div>
				<div class="push login"></div>
			</div>
		</div>
		<?php include 'footer.php'; ?>
	</body>
	<script type="text/javascript">
		$(document).ready(function() {
			$("#user").focus();
			setTimeout(function(){
				var username = $('#user').val();
				var password = $('#password').val();				
				if (username.length > 0&&password.length >0){
					$('.login-submit-btn').removeClass('inactive').addClass('active');
				} else {
					$('.login-submit-btn').removeClass('active').addClass('inactive');
				}
			},300);
		});		
	</script>
</html>