<?php	
	session_start();	
	$_SESSION['fdcsl']['redirect_url'] = $_SERVER['REQUEST_URI'];
	if(!isset($_SESSION['fdcsl']['user'])){
		header("location:login.php");
		exit;
	}	
	if ($_SESSION['fdcsl']['client_id'] == -1){
		header('location:client.php');
		exit;
	}
?>

<!DOCTYPE html>
<html>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
		<script type="text/javascript" src="js/jquery-1.11.3.min.js"></script>
		<script type="text/javascript" src="js/jscript.js"></script>
		<script type="text/javascript" src="js/jquery-ui.js"></script>
		<script type="text/javascript" src="js/config.js"></script>
		<script type="text/javascript" src="js/kickstart.js"></script>
		<script src="js/jquery.ui.touch-punch.min.js"></script>
		<link rel="stylesheet" href="css/kickstart.css" media="all" />
		<link rel="stylesheet" href="css/jquery-ui.css" media="all" />		
		<script type="text/javascript">
			var session_token = "<?php echo $_SESSION['fdcsl']['token']; ?>";
			var session_user = "<?php echo $_SESSION['fdcsl']['user']; ?>";
			var session_client = "<?php echo $_SESSION['fdcsl']['client_id']; ?>";
			var session_admin = "<?php echo $_SESSION['fdcsl']['admin']; ?>";
			$(document).ready(function(){				
				getBG(session_client);		
				loadPush();				
			});
		</script>		
		<link rel="stylesheet" type="text/css" media="screen, projection" href="css/style.css"/>
		<title>Fusion of Ideas | Push Notifications</title>
	</head>
	<body>

	<div class="overlay-confirm"></div>
	<div class="wrapper">
		<?php include 'header.php'; ?>
		<div class="grid tables">
			<div id="wrapper" class="container center col_12">
				<div class="top-header">
					<div class="col_4 drop-down-col empty-col"></div>
					<div class="col_4 drop-down-col">						
						<div class="radio-div">
							<div class="radio-sep-div users">
								<label for="user-sel" class="push-labels">User:</label>
								<input type="radio" name="push-radio" id="user-sel" value="user" class="user-select push-radio-notification" />							
							</div>
							<div class="radio-sep-div groups">
								<label for="view-sel" class="push-labels">View:</label>
								<input type="radio" name="push-radio" id="view-sel" value="view" class="view-select push-radio-notification" />													
							</div>
						</div>
					</div>
					<div class="col_4 drop-down-col empty-col"></div>					
				</div>
				<!-- push notification tables -->						
				<div class="push-notification-div">
					<div class="please-pick global-hide-div">Please select who to send the push notification:</div>
					<div class="view-list-div global-hide-div">
						<table class="file-assoc-table push-notif view">
							<thead class="popup-table-header">
								<tr class="table-fieldsz">								
									<th class="unbold">
										View Name
										<div class="all-chk-div">
											<label for="all-view">All</label>
											<input type="checkbox" id="all-view" name="all-view-chk" class="all-chk view" target="view" />											
										</div>
									</th>
								</tr>
							</thead>
							<tbody class="table-content-container view tbody">
								<!-- USERS FOR ASSOCIATION TO A CONTENT ITEM APPENDED HERE-->																
							</tbody>
						</table>
					</div>
					<div class="user-list-div global-hide-div">
						<table class="file-assoc-table push-notif users">
							<thead class="popup-table-header">
								<tr class="table-fieldsz">								
									<th class="unbold">
										User Name
										<div class="all-chk-div">
											<label for="all-user">All</label>
											<input type="checkbox" id="all-user" name="all-user-chk" class="all-chk user" target="user" />
										</div>										
									</th>
								</tr>
							</thead>
							<tbody class="table-content-container user tbody">
								<!-- USERS FOR ASSOCIATION TO A CONTENT ITEM APPENDED HERE-->																
							</tbody>
						</table>
					</div>
					<div class="push-text-div">
						<div class="user-selected-div">
							
						</div>
						<div class="text-area">
							<textarea id="push-text-area" class="push-text-notificaton" placeholder="Type message here.."></textarea>
						</div>						
					</div>

					<div class="add-notification-div">
						<div class="add-push-text">SEND PUSH NOTIFICATION<i class="icon-plus-sign" id="add-push-icon"></i></div>
					</div>
				</div>					
			</div>			
		</div>			
		<div class="push"></div>
	</div>	
	<?php include 'footer.php'; ?>
	</body>
</html