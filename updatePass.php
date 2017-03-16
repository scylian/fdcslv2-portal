<?php
	session_start();	
	$_SESSION['fdcsl']['redirect_url'] = $_SERVER['REQUEST_URI'];
	if(!isset($_SESSION['fdcsl']['user'])){
		header("location:login.php");
		exit;
	}

?>
<!DOCTYPE html>
<html>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
		<script type="text/javascript" src="js/jquery-1.11.3.min.js"></script>
		<script type="text/javascript" src="js/jscript.js"></script>
		<script type="text/javascript" src="js/kickstart.js"></script>
		<script type="text/javascript" src="js/config.js"></script>
		<script type="text/javascript">
			var session_token = "<?php echo $_SESSION['fdcsl']['token']; ?>";
			var session_user = "<?php echo $_SESSION['fdcsl']['user']; ?>";
			var session_client = "<?php echo $_SESSION['fdcsl']['client_id']; ?>";
			var session_admin = "<?php echo $_SESSION['fdcsl']['admin']; ?>";
			$(document).ready(function(){
				setTimeout(function(){
					$('#old-password').focus();												
				},500);
			});
		</script>
		<link rel="stylesheet" type="text/css" media="screen, projection" href="css/style.css"/>
		<link rel="stylesheet" href="css/kickstart.css" media="all" />
		<title>Fusion of Ideas | Update Password</title>
	</head>
	<body>
	<div class="wrapper">
		<div id="header" class="container upload">
			<div class="grid">
				<div class="col_12 header-container">
					<div class="header-logo-container col_12 center">
						<a href="."><img src="img/foi_logo.png" alt="Fusion of Ideas" class="header-logo"/></a>			
					</div>			
				</div>
			</div>
		</div>
		<div class="grid">
			<div id="wrapper" class="container col_12">
				<div class="col_3"></div>
				<div class="col_6 main-login">
					<!-- <form action="" id="updatePassForm"> -->
						<span class="login-text pass">OLD PASSWORD</span>
						<br>
						<input type="password" class="login-box-update" id="old-password" placeholder="" name="old-password"/>						
						<br>
						<span class="login-text pass">NEW PASSWORD</span>
						<br>
						<input type="password" class="login-box-update" id="new-password" placeholder="" name="new-password"/>
						<br>
						<span class="login-text pass">NEW PASSWORD CONFIRMATION</span>
						<br>
						<input type="password" class="login-box-update" id="new-password-confirm" placeholder="" name="new-password-confirm"/>
						<br>
						<input type="submit" value="SUBMIT" id="update-password-btn" class="update-password-submit-btn inactive"/>						
					<!-- </form>					 -->
				</div>
				<div class="col_3"></div>
			</div>
			<div class="push login"></div>
		</div>
	</div>
		<?php include 'footer.php'; ?>
	</body>
</html>
