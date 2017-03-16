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
		<script type="text/javascript" src="js/kickstart.js"></script>
		<script type="text/javascript" src="js/spectrum.js"></script>
		<link rel="stylesheet" href="css/kickstart.css" media="all" />
		<link rel="stylesheet" type="text/css" href="css/spectrum.css">
		<link rel="stylesheet" href="css/jquery-ui.css" media="all" />
		<link rel="stylesheet" href="css/jquery.fancybox-1.3.4.css" media="screen" />
		<script type="text/javascript">
			var session_token = "<?php echo $_SESSION['fdcsl']['token']; ?>";
			var session_user = "<?php echo $_SESSION['fdcsl']['user']; ?>";
			var session_client = "<?php echo $_SESSION['fdcsl']['client_id']; ?>";
			var session_admin = "<?php echo $_SESSION['fdcsl']['admin']; ?>";
			var session_vid = "<?php echo $_REQUEST['vid']; ?>";
			$(document).ready(function() {
				loadWebView(session_client, session_vid);
			});
		</script>
		<link rel="stylesheet" type="text/css" media="screen, projection" href="css/style.css"/>
		<title>Fusion of Ideas | Web View</title>
	</head>
	<body>
		<div class="overlay-confirm" style="display:none"></div>
		<div class="wrapper">
			<div class="grid tables">
				<div id="wrapper" class="container center col_12">
					<div class="views-main-container">
						<div class="device-container device-div">
							<div class="portal-filter-back portal-filter-back-web hide">
								<i class="fa fa-arrow-left go-back-filter"></i>
							</div>
							<!-- <div class="device-view device-div"></div> -->
							<div class="device-overlay device-div">
								<div class="dynamic-size">
									<div class="device-logo-container">
										<div class="device-logo device-logo-web">
										</div>
									</div>
									<div class="filters-container">
										<!-- filter output -->
									</div>
									<div class="device-content-container hide">
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- image preview lightbox -->
		<div id='popup-web' class="content">
			<div class="popup-header">
				<div class="popup-title">Video</div>
				<i class="fa fa-close close-icon"></i>
			</div>
			<div class="popup-main-container inner-tab assoc-content tab-content" id="preview">
				<div class="content-preview">
					<video class="content-video-preview hide global-preview" width="100%" height="720" controls>
						<source src="" type="" class="video-src">
						Your browser does not support the video tag
					</video>
				</div>
			</div>
		</div>
	</body>
</html>