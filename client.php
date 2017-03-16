<?php
	session_start();
	if(!isset($_SESSION['fdcsl']['user'])){
		$_SESSION['fdcsl']['redirect_url'] = $_SERVER['REQUEST_URI'];
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
		<script type="text/javascript" src="js/config.js"></script>
		<script type="text/javascript" src="js/kickstart.js"></script>
		<link rel="stylesheet" href="css/kickstart.css" media="all" />
		<link rel="stylesheet" type="text/css" media="screen, projection" href="css/style.css"/>	
		<title>Fusion of Ideas | Client Select</title>
		<script type="text/javascript">
			var session_token = "<?php echo $_SESSION['fdcsl']['token']; ?>";
			var session_user = "<?php echo $_SESSION['fdcsl']['user']; ?>";
			var session_client = "<?php echo $_SESSION['fdcsl']['client_id']; ?>";
			var session_admin = "<?php echo $_SESSION['fdcsl']['admin']; ?>";
			loadClients(session_client);
		</script>	
	</head>
	<body>
		<div class="overlay"></div>
		<div class="wrapper">
			<?php include 'header.php'; ?>			
			<div class="grid">
				<div id="wrapper" class="container col_12">
					<div class="col_3"></div>
					<div class="col_6 main-login">
						<div class="client-label">Select which client to view:</div>
						<div class="client-select drop-down" page="client" target="client">
							<span class="ddl-choice client-sel client">Choose here</span>
							<div class="client-output ddl-content client hide client">
								<!-- output here -->
							</div>
						</div>				
					</div>
					<div class="col_3"></div>
				</div>
				<div class="push login"></div>
			</div>
		</div>
		<?php include 'footer.php'; ?>
	</body>	
</html>
