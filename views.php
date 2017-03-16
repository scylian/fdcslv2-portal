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
		<script type="text/javascript" src="js/spectrum.js"></script>
		<link rel="stylesheet" href="css/kickstart.css" media="all" />
		<link rel="stylesheet" type="text/css" href="css/spectrum.css">
		<link rel="stylesheet" href="css/jquery-ui.css" media="all" />
		<script type="text/javascript">
			var session_token = "<?php echo $_SESSION['fdcsl']['token']; ?>";
			var session_user = "<?php echo $_SESSION['fdcsl']['user']; ?>";
			var session_client = "<?php echo $_SESSION['fdcsl']['client_id']; ?>";								
			var session_admin = "<?php echo $_SESSION['fdcsl']['admin']; ?>";
			$(document).ready(function(){
				loadApp(session_client);
			});
		</script>		
		<link rel="stylesheet" type="text/css" media="screen, projection" href="css/style.css"/>
		<title>Fusion of Ideas | Manage App</title>
	</head>
	<body>
	<div class="overlay-confirm" style="display: none"></div>
	<div class="wrapper">
		<?php include 'header.php'; ?>
		<div class="grid tables">
			<div id="wrapper" class="container center col_12">
				<div class="portal-push-btn-container hide">
					<div class="push-change-btn manage"><i class="fa fa-refresh"></i> PUSH CHANGES</div>					
				</div>
				<!-- add/edit filter/views -->
					<div class="add-filter-top-pop add-filter-div top" id="wrapper-popup-top">
						<div class="add-filter-popup-text left filter-popup-stuff add">Add New Filter: 									
							<i class="fa fa-remove close-popup" target="add-filter-div"></i>
						</div>
						<div class="edit-filter-popup-text left filter-popup-stuff edit">Edit Filter: 									
							<i class="fa fa-remove close-popup" target="edit-filter-div"></i>
						</div>
					</div>
					<div class="add-filter popup add-filter-div" id="wrapper-popup-bottom">				
						<div class="add-filter-inner-left add-filter-inner">
							<table class="add-filter-table" id="add-filter-table" cellpadding="0" cellspacing="0">
								<tbody>
									<tr>
										<td class="username-label-td add-filter-label-td">Filter Name</td>												
									</tr>
									<tr>
										<td>
											<input type="text" class="add-filter-input name add-input filter-popup-stuff add" target="filter" tabindex="1" />
											<input type="text" class="edit-filter-input name edit-input filter-popup-stuff edit" target="filter" tabindex="1" />
										</td>
									</tr>
									<tr>
										<td class="username-label-td add-loop-label-td">
											<label for="loop-input">Looping:</label><input type="checkbox" id="loop-input" name="loop-input" class="loop-input-check"></input>
										</td>
									</tr>																	
								</tbody>
							</table>
						</div>						
						<div class="submit-container">
							<div class="col_3 center"></div>
							<div class="col_6 center buttons">
								<div class="submit-new-filter add filter-popup-stuff btn">SUBMIT</div>
								<div class="submit-edit-filter edit filter-popup-stuff btn edit-info-btn" type="filter">SUBMIT</div>
							</div>
							<div class="col_3 center"></div>								
						</div>				
					</div>
					<div class="add-view-top-pop add-view-div top" id="wrapper-popup-top">
						<div class="add-view-popup-text left add-popup-text view-popup-stuff add">Add New View: 									
							<i class="fa fa-remove close-popup" target="add-view-div"></i>
						</div>					
					</div>
					<div class="add-view popup add-view-div" id="wrapper-popup-bottom">				
						<div class="add-view-inner-left add-view-inner">
							<table class="add-view-table add-table" id="add-table" cellpadding="0" cellspacing="0">
								<tbody>
									<tr>
										<td class="username-label-td add-view-label-td add-label-td">View Name</td>												
									</tr>
									<tr>
										<td>
											<input type="text" class="add-view-input name add-input view-popup-stuff add" target="view" tabindex="1" />
										</td>
									</tr>																	
								</tbody>
							</table>
						</div>						
						<div class="submit-container">
							<div class="col_3 center"></div>
							<div class="col_6 center buttons">
								<div class="submit-new-view btn view-popup-stuff add">SUBMIT</div>								
							</div>
							<div class="col_3 center"></div>								
						</div>				
					</div>
				<!-- end  add/edit filter/views -->

				<!-- content output -->					
					<div class="edit-main-view-popup popup hide">
						<div class="update-content-popup-text add-popup-text">Update View Settings: 									
							<i class="fa fa-close close-popup" target="add-content-div"></i>
						</div>
						<div class="color-container pop-container">										
							<!-- background color -->																													
							<div class="bg-color-div">
								<div class="bg-label color">BACKGROUND COLOR:</div><input type='text' id="background-color" />								
							</div>
							<!-- text color -->
							<div class="text-color-div">
								<div class="bg-label color">TEXT COLOR:</div><input type='text' id="text-color" />								
							</div>
							<!-- filter color -->
							<div class="filter-color-container">							
								<div class="filter-color-div">
									<div class="bg-label filter color">FILTER COLOR:</div><input type='text' id="filter-color" />									
								</div>
							</div>							
							<div class="text-color-div">
								<div class="bg-label width">FILTER PADDING:</div><input type='number' step=".01" id="width" />								
							</div>
							<!-- <div class="submit-view-settings btn" id="submit-view-changes">SUBMIT</div>	 -->
						</div>
					</div>
				<!-- end content output -->
				<div id='popup' class="view">
					<div class="popup-header">
						<div class="popup-title">Edit View:</div>
						<i class="fa fa-close close-icon"></i>
					</div>
					<ul class="tabs left">
						<li><a href="#name" class="first-li">Name</a></li>			
						<li><a href="#content">Content</a></li>			
						<li><a href="#users">Users</a></li>
					</ul>
					<div class="popup-main-container inner-tab assoc-content tab-content" id="name">
						<div class="popup-table-label">Update View Name:</div>						
						<div class="content-container">
							<table class="add-view-table add-table" id="add-table" cellpadding="0" cellspacing="0">
								<tbody>									
									<tr>
										<td>											
											<input type="text" class="edit-view-input name edit-input edit" target="view" tabindex="1" />
										</td>
									</tr>																	
								</tbody>
							</table>				
						</div>
					</div>
					<div class="popup-main-container inner-tab assoc-content tab-content" id="content">
						<div class="popup-table-label">Associate Content:</div>						
						<div class="files-output content-container">							
						</div>						
					</div>
					<div class="popup-main-container inner-tab assoc-content tab-content" id="users">
						<div class="popup-table-label">Associate Users: <span class="warning-text">warning: users can only be associated to only 1 view. Adding a user will remove that user from any other views.</span></div>
						<div class="view-users-output content-container">
							<table class="file-assoc-table users sortable">
								<thead class="popup-table-header">
									<tr class="table-field">							
										<th class="unbold no-sort">User Name</th>							
									</tr>
								</thead>
								<tbody class="table-content-container tbody">																								
								</tbody>
							</table>
						</div>			
					</div>
					<div class="btn-div content">
						<div class="popup-btn save update-view-btn">SAVE</div>																			
					</div>
				</div>
				<div id='popup' class="content">
					<div class="popup-header">
						<div class="popup-title">Edit Content:</div>
						<i class="fa fa-close close-icon"></i>
					</div>
					<ul class="tabs left">
						<li><a href="#info">Info</a></li>						
						<li><a href="#icon">Icons</a></li>						
						<li><a href="#preview">Preview</a></li>
					</ul>
					<div class="popup-main-container inner-tab assoc-content tab-content" id="info">
						<form id="new-icon-form" action="" enctype="multipart/form-data" method="POST" class="hide">
							<input type="file" hidden="hidden" name="file" id="new-icon" class="new-icon" accept="image/png, image/jpeg, image/jpg" />
							<input type="submit" hidden="hidden" id="submit-new-icon" class="submit-icon" />
						</form>			
						<div class="content-container">							
							<label for="edit-content-display-name">Display Name:</label>
							<div>
								<input type="text" id="edit-content-display-name" class="link-edit-inputs text-input popup" />
							</div>
							<div class="edit-link-container hide">
								<label for="edit-content-link-location">Link Location:</label>
								<div>
									<input type="text" id="edit-content-link-location" class="link-edit-inputs text-input popup" />
								</div>
							</div>
							<div class="main-loop-stuff-div hide-loop-stuff hide">
								<div class="edit-loop-container loop-stuff hide-loop-stuff">
									<label for="edit-content-loop-duration">Loop Duration:</label>
									<div>
										<input type="number" id="edit-content-loop-duration" class="loop-duration-input text-input popup" />
									</div>
								</div>
								<div class="edit-refresh-container refresh-stuff hide-loop-stuff">
									<label for="edit-content-refresh-time">Refresh time:</label>
									<div>
										<input type="number" id="edit-content-refresh-time" class="refresh-time-input text-input popup" />
									</div>
								</div>								
							</div>
							<div class="filter-color-container share-sheet">							
								<div class="share-color-div">
									<div class="bg-label share"><label for="share-enabled">SHARE ENABLED:</label></div>
									<div class="share-enabled-div">
										<input type='checkbox' id="share-enabled" />
									</div>									
								</div>
							</div>
						</div>
					</div>					
					<div class="popup-main-container inner-tab assoc-content tab-content" id="icon">
						<div class="add-icon">ADD NEW</div>
						<div class="icon-container edit-content"></div>
					</div>
					<div class="popup-main-container inner-tab assoc-content tab-content" id="preview">
						<div class="content-preview">
							<div class="content-preview-btn btn global-preview">Open Link</div>
							<video class="content-video-preview hide global-preview" width="100%" height="240" controls>
								<source src="" type="" class="video-src">
								Your browser does not support the video tag
							</video>
							<iframe src="" height="372" width="100%" id="pdf-preview" class="pdf-preview hide global-preview"></iframe>
							<img src="" id="image-preview" width="100%" height="240" class="img-preview hide global-preview" />
						</div>
					</div>
					<div class="btn-div content">
						<div class="edit-content-btn edit-content-popup-btn save">SAVE</div>						
					</div>
				</div>
			</div>
			<!-- ipad view -->
			<div class="views-main-container">
				<div class="confirm-delete-container hide">
					<div class="col_3"></div>
					<div class="col_6">
						<div id="confirmDelete" class="confirm-delete hide center">							
							<span class="delete-content confirmation-text">
								Are you sure you want to delete/disable this content?<br>
							</span>
							<span class="confirmation-text background-clear">
								Are you sure you want to clear the background image?<br>
							</span>
							<span class="confirmation-text delete-view">
								Are you sure you want to delete this view?<br>
							</span>
							<span class="confirmation-text delete-filter">
								Are you sure you want to delete this filter?<br>
							</span>
							<span class="confirmation-text update-content">
								Warning: Submitting will update this content across all views.<br>
								Are you sure you want to save?<br>
							</span>
							<span class="confirmation-text leave-page">
								Warning: You currently have unsaved elements in the current view.<br>
								Would you like to save before moving on?<br>
							</span>
							<span class="confirmation-text leave-area">
								Warning: You currently have unsaved elements in the current area.<br>
								Would you like to save before moving on?<br>
							</span>
							<span class="button-container delete-content">
								<input data-role="none" type="button" value="No" class="no confirm delete" />							
								<input data-role="none" type="button" class="yes confirm delete" value="Yes"/>
							</span>
							<span class="button-container update-content">
								<input data-role="none" type="button" value="No" class="no confirm update-content" />							
								<input data-role="none" type="button" class="yes confirm update-content" value="Yes"/>
							</span>							
							<span class="button-container background-clear">
								<input data-role="none" type="button" value="No" class="no confirm bg-clear" />							
								<input data-role="none" type="button" class="yes confirm bg-clear" value="Yes"/>
							</span>
							<span class="button-container delete-view">
								<input data-role="none" type="button" value="No" class="no confirm delete-view-btn" />							
								<input data-role="none" type="button" class="yes confirm delete-view-btn" value="Yes"/>
							</span>
							<span class="button-container delete-filter">
								<input data-role="none" type="button" value="No" class="no confirm delete-filter-btn" />							
								<input data-role="none" type="button" class="yes confirm delete-filter-btn" value="Yes"/>
							</span>
							<span class="button-container leave-page">
								<input data-role="none" type="button" value="No" class="no confirm leave-page" />							
								<input data-role="none" type="button" class="yes confirm leave-page" value="Yes"/>
							</span>
							<span class="button-container leave-area">
								<input data-role="none" type="button" value="No" class="no confirm leave-area" />							
								<input data-role="none" type="button" class="yes confirm leave-area" value="Yes"/>
							</span>
						</div>							
					</div>
					<div class="col_3"></div>									
				</div>
				<div class="left-div device-div">					
					<div class="views-div">
						<div class="inner-views-div inner-wrapper">
							<ul class="main-ul main-parent">
								
							</ul>
						</div>						
					</div>					
				</div>											
				<div class="device-container device-div">
					<div class="add-item-btn btn add-view-btn" type="view"><i class="fa fa-plus-circle"></i> VIEW</div>
					<div class="add-item-container hide">						
						<div class="add-item-btn btn add-filter-btn add-filter-btn-web" type="filter"><i class="fa fa-plus-circle"></i> FILTER</div>						
					</div>
					<div class="portal-filter-back hide">
						<i class="fa fa-arrow-left go-back-filter"></i>				
					</div>
					<div class="portal-background-clear hide">
						<i class="fa fa-close clear-background-color"></i>				
					</div>
					<div class="device-view ipad device-div"></div>
					<div class="device-overlay ipad loading device-div">
						<div class="device-background-button-div hide">
							<i class="fa fa-edit"></i>
						</div>
						<div class="edit-view-button-div hide">
							<i class="fa fa-list-alt"></i>
						</div>
						<div class="dynamic-size hide">
							<div class="device-logo-container">
								<div class="device-logo">
									<div class="edit-logo-button-div">
										<i class="fa fa-file-picture-o"></i>
									</div>
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
				<div class="right-div device-div">					
					<div class="right-content-container hide">
						<div class="no-content hide">No content associated to this view</div>
						<div class="each-content-output">
							
						</div>
					</div>
				</div>
				<div class="changes-button-container manage-view hide">
					<div class="save-change-btn manage" saved='1'><i class="fa fa-save"></i> SAVE CHANGES</div>
					<div class="controls-div">
						<div class="rotate-div left" direction="left">
							<i class="fa fa-rotate-left rotate-left"></i>
						</div>
						<div class="rotate-div right" direction="right">
							<i class="fa fa-rotate-right rotate-right"></i>
						</div>
					</div>
				</div>				
			</div>
			<!-- forms -->
			<form id="edit-background-form" action="" enctype="multipart/form-data" method="POST" class="hide">
				<input type="file" hidden="hidden" name="file" id="background-file" class="edit-background-image" accept="image/png, image/jpeg, image/jpg" />
				<input type="submit" hidden="hidden" id="submit-new-background" class="update-background" />
			</form>
			<form id="edit-logo-form" action="" enctype="multipart/form-data" method="POST" class="hide">
				<input type="file" hidden="hidden" name="file" id="logo-file" class="edit-logo-image" accept="image/png, image/jpeg, image/jpg" />
				<input type="submit" hidden="hidden" id="submit-new-logo" class="update-logo" />
			</form>
			<!-- end forms -->			
		</div>			
		<div class="push"></div>
	</div>
	<div class="popoup image-preview hide">
		<img src="" class="image-preview">
	</div>	
	<?php include 'footer.php'; ?>
	<script type="text/javascript">
		$('#background-color').spectrum({
			color:"#fff",			
		});
		$('#text-color').spectrum({
			color:"#fff",			
		});
		$('#filter-color').spectrum({
			color:'#fff',
		});		
	</script>
	</body>
</html