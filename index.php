<?php
	header("location:content.php");
	exit;
	session_start();
	if(!isset($_SESSION['fdcsl']['user'])){
		$_SESSION['fdcsl']['redirect_url'] = $_SERVER['REQUEST_URI'];
		header("location:content.php");
		exit;
	}	
?>
<!DOCTYPE html>
<html>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
		<script type="text/javascript">
			var session_token = "<?php echo $_SESSION['fdcsl']['token']; ?>";
			var session_user = "<?php echo $_SESSION['fdcsl']['user']; ?>";
			var session_client = "<?php echo $_SESSION['fdcsl']['client_id']; ?>";
			var session_admin = "<?php echo $_SESSION['fdcsl']['admin']; ?>";
		</script>		
		<script type="text/javascript" src="js/jquery-1.11.3.min.js"></script>
		<script type="text/javascript" src="js/jscript.js"></script>
		<script type="text/javascript" src="js/config.js"></script>
		<script type="text/javascript" src="js/plupload.full.min.js"></script>
		<script type="text/javascript" src="js/kickstart.js"></script>
		<script type="text/javascript" src="js/jquery.plupload.queue/jquery.plupload.queue.min.js"></script>
		<link type="text/css" rel="stylesheet" href="js/jquery.plupload.queue/css/jquery.plupload.queue.css" media="screen" />	
		<link rel="stylesheet" href="css/kickstart.css" media="all" />		
		<link rel="stylesheet" href="css/simplegrid.css" media="all" />
		<link rel="stylesheet" type="text/css" media="screen, projection" href="css/style.css"/>
		<title>Fusion of Ideas | Index</title>
	</head>
	<body>

	<div class="overlay-confirm" style="display: none"></div>
	<div class="wrapper">
		<?php include 'header.php'; ?>
		<div class="grid tables">
			<div id="wrapper" class="container center col_12">
									
			</div>						
		</div>			
		<div class="push"></div>
	</div>	
	<?php include 'footer.php'; ?>
	</body>
</html