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
				loadUsers();		
			});
		</script>		
		<link rel="stylesheet" type="text/css" media="screen, projection" href="css/style.css"/>
		<title>Fusion of Ideas | Users</title>
	</head>
	<body>

	<div class="overlay-confirm"></div>
	<div class="wrapper">
		<?php include 'header.php'; ?>
		<div class="grid tables">
			<div id="wrapper" class="container center col_12">
				<div class="col_4 drop-down-col">
					
				</div>
				<div class="col_5 drop-down-col">						
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
								<td class="username-label-td add-user-label-td">Name</td>												
							</tr>
							<tr>
								<td><input type="text" class="add-user-input name" tabindex="1" /></td>
							</tr>
							<tr class="feature-input feature-password">
								<td class="username-label-td add-user-label-td feature-input hide-now feature-password">Password</td>												
							</tr>
							<tr class="feature-input feature-password">
								<td><input type="password" class="add-user-input password feature-input hide-now feature-password" tabindex="1" /></td>
							</tr>
							<tr class="feature-input feature-password">
								<td class="username-label-td add-user-label-td feature-input hide-now feature-password">Confirm Password</td>										
							</tr>
							<tr class="feature-input feature-password">
								<td><input type="password" class="add-user-input password-confirm feature-input hide-now feature-password" tabindex="1" /></td>
							</tr>
							<tr class="feature-input feature-pin">
								<td class="username-label-td add-user-label-td feature-input hide-now feature-pin">Pin</td>										
							</tr>
							<tr class="feature-input feature-pin">
								<td><input type="text" class="add-user-input pin feature-input hide-now feature-pin" tabindex="1" maxlength="4" /></td>
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
							Are you sure you want to <span class="user-status">publish</span> this user?<br>							
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
		<div class="popup-main-container user-page">	
			<div class="edit-user-name">
				<div class="edit-user-name-label">Name</div>
				<input type="text" class="edit-user-name-input name" id="user-name-input">
			</div>
			<div class="edit-user-password feature-input feature-password">
				<div class="edit-user-name-label">Password</div>
				<input type="password" class="edit-user-name-input password" id="user-password-input">
			</div>
			<div class="edit-user-password feature-input feature-password">
				<div class="edit-user-name-label">Confirm Password</div>
				<input type="password" class="edit-user-name-input confirm-password" id="confirm-user-password-input">
			</div>
			<div class="edit-user-pin feature-input feature-pin">
				<div class="edit-user-name-label">Pin</div>
				<input type="text" class="edit-user-name-input pin" id="user-pin-input" maxlength="4">
			</div>
			<div class="popup-table-label">Associate View:</div>
			<div id="file-assoc" class="table-container tbody assoc-content assoc-group-user">
				<table class="file-assoc-table users sortable">
					<thead class="popup-table-header">
						<tr class="table-field">							
							<th class="unbold no-sort">View Name</th>							
						</tr>
					</thead>
					<tbody class="table-content-container tbody">																								
					</tbody>
				</table>
			</div>
			<div class="btn-div users">
				<div class="popup-btn save">SAVE</div>
				<div class="popup-btn remove">REMOVE</div>								
			</div>
		</div>
	</div>

	<?php include 'footer.php'; ?>

	</body>
</html