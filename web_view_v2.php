<?php
	session_start();
	$_SESSION['fdcsl']['redirect_url'] = $_SERVER['REQUEST_URI'];
	if (!isset($_SESSION['fdcsl']['user'])) {
		header("location:login.php");
		exit;
	}
	if ($_SESSION['fdcsl']['client_id'] == -1) {
		header('location:client.php');
		exit;
	}
?>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=Edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
		<script type="text/javascript" src="js/jquery-1.11.3.min.js"></script>
		<script type="text/javascript" src="js/jscript.js"></script>
		<script type="text/javascript" src="js/jquery-ui.js"></script>
		<script type="text/javascript" src="js/config.js"></script>
		<script type="text/javascript" src="js/kickstart.min.js"></script>
		<script type="text/javascript" src="js/spectrum.js"></script>
		<link rel="stylesheet" type="text/css" href="css/kickstart.min.css" media="all" />
		<link rel="stylesheet" type="text/css" href="css/spectrum.css">
		<link rel="stylesheet" type="text/css" href="css/jquery-ui.css" media="all">
		<script type="text/javascript">
			var session_token = "<?php echo $_SESSION['fdcsl']['token']; ?>";
			var session_user = "<?php echo $_SESSION['fdcsl']['user']; ?>";
			var session_client = "<?php echo $_SESSION['fdcsl']['client_id']; ?>";
			var session_admin = "<?php echo $_SESSION['fdcsl']['admin']; ?>";
			var session_vid = "<?php echo $_REQUEST['vid']; ?>";
			$(document).ready(function() {

			});
		</script>
		<link rel="stylesheet" type="text/css" href="css/style.css" media="screen, projection" />
		<title>Fusion of Ideas | Web View</title>
	</head>
	<body>
		<div class="overlay-confirm" style="display:none"></div>
		<!-- <div class="wrapper wrapper-fluid"> -->
			<div class="row" style="background-color: red">
				<div class="col-12">
					<h1 align="center">Hello world!</h1>
				</div>
			</div>
		<!-- </div> -->

	</body>
</html>