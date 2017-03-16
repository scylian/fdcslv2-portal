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
				loadAdmin();		
			});
		</script>		
		<link rel="stylesheet" type="text/css" media="screen, projection" href="css/style.css"/>
		<title>Fusion of Ideas | Admin Users</title>
	</head>
	<body>

	<div class="overlay-confirm"></div>
	<div class="wrapper">
		<?php include 'header.php'; ?>
		<div class="grid tables">
			<div id="wrapper" class="container center col_12">
				<div class="col_3 update-header-icon-col">
					<div class="update-header-icon btn"><i class="fa fa-photo" id="update-header-icon"></i> UPDATE HEADER LOGO</div>
				</div>
				<div class="col_6 drop-down-col">						
				</div>
				<div class="col_3 add-user-button">
					<div class="add-user">
						<div class="add-user-text">ADD USER<i class="icon-plus-sign" id="add-user-icon"></i></div>
					</div>
				</div>
				<!-- users tables -->						
				<div class="user-table">
						<!-- user table output	-->																				
				</div>					
			</div>
			<div class="col_12 user-edit-container">									

			</div>
			<div class="add-user-top-pop add-user-div top" id="wrapper-popup-top">
				<div class="add-user-popup-text left">Add New User: 									
					<i class="fa fa-remove close-popup" target="add-user-div"></i>
				</div>
			</div>
			<div class="add-user popup add-user-div" id="wrapper-popup-bottom">				
				<div class="add-user-inner-left add-user-inner">
					<table class="add-user-table" id="add-user-table" cellpadding="0" cellspacing="0">
						<tbody>
							<tr>
								<td class="username-label-td add-user-label-td">Username:</td>
							</tr>
							<tr>
								<td><input type="text" class="add-user-input name" tabindex="1" /></td>
							</tr>	
							<tr>
								<td class="username-label-td add-user-label-td">Email:</td>
							</tr>
							<tr>
								<td><input type="text" class="add-user-input email" tabindex="2" /></td>
							</tr>	
							<tr>
								<td class="username-label-td add-user-label-td">Default Password:</td>
							</tr>
							<tr>
								<td><input type="password" class="add-user-input password" tabindex="3" /></td>
							</tr>
							<tr>
								<td class="username-label-td add-user-label-td">Confirm Password:</td>
							</tr>
							<tr>
								<td><input type="password" class="add-user-input confirm-pass" tabindex="4" /></td>
							</tr>
						</tbody>
					</table>
				</div>						
				<div class="submit-container">
					<div class="col_3 center"></div>
					<div class="col_6 center buttons">
						<input type="submit" class="submit-new-user btn" value="SUBMIT"/>										
					</div>
					<div class="col_3 center"></div>								
				</div>				
			</div>						
			<div class="confirm-delete-container hide">
				<div class="col_3"></div>
				<div class="col_6">
					<div id="confirmDelete" class="confirm-delete hide center">
						<span class="disable-user-text confirmation-text">
							Are you sure you want to <span class="user-status">activate</span> this user?<br>							
						</span>
						<span class="delete-user-text confirmation-text">
							Are you sure you want to delete this user?<br>
						</span>
						<div class="button-container publish-user">
							<input data-role="none" type="button" class="yes confirm publish" value="Yes"/>
							<input data-role="none" type="button" value="No" class="no confirm publish" />							
						</div>
						<div class="button-container delete-user">
							<input data-role="none" type="button" class="yes confirm delete" value="Yes"/>
							<input data-role="none" type="button" value="No" class="no confirm delete" />							
						</div>
					</div>							
				</div>
				<div class="col_3"></div>									
			</div>
		</div>			
		<div class="push"></div>
	</div>	
	<div id='popup' class="users">
		<div class="popup-header">
			<div class="popup-title">Edit User: <span class="user-name-title"></span></div>
			<i class="fa fa-close close-icon"></i>
		</div>
		<div class="popup-main-container admin">	
			<div class="edit-user-name edit-admin-div">
				<div class="edit-user-name-label">Username:</div>
				<input type="text" class="edit-user-name-input edit-admin-input" id="user-name-input">
			</div>
			<div class="edit-user-email edit-admin-div">
				<div class="edit-user-name-label">Email:</div>
				<input type="text" class="edit-user-email-input edit-admin-input" id="user-email-input">
			</div>
			<div class="edit-user-email edit-admin-div">
				<div class="edit-user-name-label">Default Password:</div>
				<input type="password" class="edit-user-pass-input edit-admin-input" id="user-pass-input">
			</div>
			<div class="edit-user-email edit-admin-div">
				<div class="edit-user-name-label">Confirm Password:</div>
				<input type="password" class="edit-user-confirm-pass-input edit-admin-input" id="user-confirm-pass-input">
			</div>			
			<div class="btn-div users">				
				<div class="popup-btn save">SAVE</div>
			</div>
		</div>
	</div>
	<form id="edit-logo-form" action="" enctype="multipart/form-data" method="POST" class="hide">
		<input type="file" hidden="hidden" name="file" id="logo-file" class="edit-logo-image" accept="image/png, image/jpeg, image/jpg" />
		<input type="submit" hidden="hidden" id="submit-new-logo" class="update-logo" />
	</form>
	<?php include 'footer.php'; ?>

	</body>
</html