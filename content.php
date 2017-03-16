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
		<script type="text/javascript" src="js/config.js"></script>
		<script type="text/javascript" src="js/plupload.full.min.js"></script>
		<script type="text/javascript" src="js/kickstart.js"></script>
		<script type="text/javascript" src="js/jquery.plupload.queue/jquery.plupload.queue.min.js"></script>
		<link type="text/css" rel="stylesheet" href="js/jquery.plupload.queue/css/jquery.plupload.queue.css" media="screen" />	
		<link rel="stylesheet" href="css/kickstart.css" media="all" />
		<script type="text/javascript">
			window.location.hash = ''
			var session_token = "<?php echo $_SESSION['fdcsl']['token']; ?>";
			var session_user = "<?php echo $_SESSION['fdcsl']['user']; ?>";
			var session_client = "<?php echo $_SESSION['fdcsl']['client_id']; ?>";
			var session_admin = "<?php echo $_SESSION['fdcsl']['admin']; ?>";
		</script>		
		<script type="text/javascript">
			globalFiles = {};		
			globalIds = [];
			var fileType;

			var initUploader = function() {
				$("#uploader").pluploadQueue({
					// general settings
					runtimes : 'html5, html4, flash, silverlight',
					url : baseURL+"addContent.php",
					chunk_size: '1mb',  
					dragdrop : true,
					multipart: true,
					filters : {
						mime_types: [
							{title: "Zip files", extensions: "m4v,mov,mp4,pdf"},
							{title: "Image files", extensions: "pdf,jpeg,jpg,png"}
						],
						prevent_duplicates: true,
					},				
					init: {
						PostInit: function(up){							
							$('.close-button-file').on('click',function(){																
								$('.overlay-confirm').hide();
								$('.file-upload-container').hide();
								$('.btn-div.file').hide();
								$('.containers-files').show();	
								up.splice();
								up.refresh();							
							});
							if(globalFiles.length>0){
								up.addFile(globalFiles);								
								up.refresh();								
							}
						},
						BeforeUpload:function(up,files){														
							up.settings.url = baseURL+'addContent.php?user='+session_user+'&token='+session_token+"&client="+session_client;		
							globalFiles = [];
							for(var i=0;i<up.files.length;i++){
								globalFiles.push(up.files[i].getNative());
							}
						},
						QueueChanged:function(up){		
							
						},
						FileUploaded: function(up,files,data){													 	
							response = jQuery.parseJSON(data.response);																				
							// error checking
							if (response.status == 'NO'){								
								up.splice();
								up.stop();
								initUploader();
								alert(response.content);								
								return false;
							} 
							var fileid = response.content.id;
							var display = response.content.display;
							var location = response.content.location;
							var icon_location = response.content.icon_location;
							var icon_id = response.content.icon_id;
							globalIds.push({
								"id":fileid,
								"display":display,
								'location':location,
								'icon_location':icon_location,
								'icon_id':icon_id,
							});							
						},
						UploadComplete: function(up, files){
							// destroy the uploadr and init a new one																					
							var fs = up.files;							
							up.splice();
							up.refresh();
							$('.file-upload-container,.btn-div.file,.overlay-confirm').hide();
							$('.upload-file.btn').removeAttr('type');

							var rowLen = $('.content-row').length;
							var pencil = '<img class="pencil" src="css/img/pencil.png"/>';
							for (var i=0;i<globalIds.length;i++){
								var e = globalIds[i];
								html = '<tr class="content-row table-row content-row-'+rowLen+' content-row-id-'+e.id+'" rid="'+e.id+'" iid="'+e.icon_id+'" name="'+e.display+'" loc="'+e.location+'" display="'+e.display+'" type="file">'
									+'<td class="content-name-'+e.id+'">'+e.display+'</td>'
									+'<td class="content-display-name-'+e.id+'">'+e.display+'</td>'
									+'<td class="content-type-'+e.id+' content-type-td">file</td>'
									+'<td class="content-icon-td"><div class="icon-table-div"><img src="'+e.icon_location+'" class="content-icon content-id-'+e.id+'" /></div></td>'
									+'<td class="td-publish"><label for="content-chk-'+e.id+'" class="content-label"><input type="checkbox" id="content-chk-'+e.id+'" class="publish-content content-check-'+e.id+'"/> </label></td>'									
								 +'</tr>';
								 $('.inner-table.content').append(html);
							}
							$(".no-content-row").remove();
							// reload new icons
							loadIcons();
							up.destroy();
							globalFiles = {};		
							globalIds = [];
							initUploader();							
						},
						Error: function(up,e){
							console.log(e);							
							return;					
						}
					}					
				});
			};			
			$(document).ready(function(){
				initUploader();
				loadContent();		
			});
		</script>		
		<link rel="stylesheet" type="text/css" media="screen, projection" href="css/style.css"/>
		<title>Fusion of Ideas | Content</title>
	</head>
	<body>

	<div class="overlay-confirm" style="display: none"></div>
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
						<div id="upload-btn">UPLOAD</div>
					</div>
				</div>
				<!-- content tables -->						
				<div class="content-table">
						<!-- content table output	-->																				
				</div>					
			</div>
			<div class="col_12 user-edit-container">									

			</div>				
			<div class="add-link-top-pop add-link-div top" id="wrapper-popup-top">
				<div class="add-user-popup-text left">Add New Link: 									
					<i class="fa fa-remove close-popup" target="add-link-div"></i>
				</div>
			</div>
			<div class="add-link popup add-link-div" id="wrapper-popup-bottom">			
				<ul class="tabs left">
					<li><a href="#link-info">Info</a></li>				
					<li><a href="#link-icon">Icons</a></li> 			
				</ul>	
				<div class="popup-main-container inner-tab assoc-content tab-content" id="link-info">
					<table class="add-link-table" id="add-link-table" cellpadding="0" cellspacing="0">
						<tbody>
							<tr>
								<td class="username-label-td add-link-label-td">Name</td>												
							</tr>
							<tr>
								<td><input type="text" class="add-link-input name" tabindex="1" /></td>
							</tr>
							<tr>
								<td class="username-label-td add-link-label-td">Display Name</td>												
							</tr>
							<tr>
								<td><input type="text" class="add-link-input display-name" tabindex="2" /></td>
							</tr>
							<tr>
								<td class="username-label-td add-link-label-td">Location</td>												
							</tr>
							<tr>
								<td><input type="text" class="add-link-input location" tabindex="3" /></td>
							</tr>																	
						</tbody>
					</table>					
				</div>
				<div class="popup-main-container inner-tab assoc-content tab-content" id="link-icon">
					<div class="add-link-inner-left add-link-inner">
						<div class="add-icon add-link">ADD NEW</div>
						<div class="icon-container add-link"></div>
					</div>
				</div>
				<div class="submit-container">
					<input type="submit" class="submit-new-link btn" value="SUBMIT"/>					
				</div>				
			</div>						
			<div class="confirm-delete-container hide">
				<div class="col_3"></div>
				<div class="col_6">
					<div id="confirmDelete" class="confirm-delete hide center">
						<span class="disable-content-text confirmation-text">
							Are you sure you want to <span class="content-status">publish</span> this content?<br>							
						</span>
						<span class="delete-content confirmation-text">
							Are you sure you want to delete/disable this content?<br>
						</span>
						<span class="button-container delete-content">
							<input data-role="none" type="button" class="yes confirm delete" value="Yes"/>
							<input data-role="none" type="button" value="No" class="no confirm delete" />							
						</span>
						<span class="button-container publish-content">
							<input data-role="none" type="button" class="yes confirm publish" value="Yes"/>
							<input data-role="none" type="button" value="No" class="no confirm publish" />							
						</span>
					</div>							
				</div>
				<div class="col_3"></div>									
			</div>
		</div>			
		<div class="push"></div>
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
				<label for="edit-content-name">Name:</label>
				<div>
					<input type="text" id="edit-content-name" class="text-input popup" />
				</div>
				<label for="edit-content-display-name">Display Name:</label>
				<div>
					<input type="text" id="edit-content-display-name" class="text-input popup" />
				</div>
				<div class="edit-link-container hide">
					<label for="edit-content-link-location">Link Location:</label>
					<div>
						<input type="text" id="edit-content-link-location" class="text-input popup" />
					</div>
				</div>
				<!-- share sheet -->
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
		<div class="popup-main-container inner-tab assoc-content tab-content" id="group">
			<div class="popup-table-label">Associate Groups:</div>
			<div id="file-assoc" class="table-container popup content-group-assoc">
				<table class="file-assoc-table">
					<thead class="popup-table-header">
						<tr class="table-field">								
							<th rel="0" class="unbold">Group Name</th>
						</tr>
					</thead>
					<tbody class="table-content-container tbody groups">
						<!-- USERS FOR ASSOCIATION TO A CONTENT ITEM APPENDED HERE-->																
					</tbody>
				</table>
			</div>			
		</div>
		<div class="popup-main-container inner-tab assoc-content tab-content" id="filter">
			<div class="popup-table-label">Filter Content:</div>
			<div id="file-assoc" class="table-container popup content-group-assoc">
				<table class="file-assoc-table">
					<thead class="popup-table-header">
						<tr class="table-field">								
							<th class="unbold" rel="0">Filter Name</th>
						</tr>
					</thead>
					<tbody class="table-content-container tbody filter">
						<!-- filters for specific client here-->																
					</tbody>
				</table>
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
			<div class="popup-btn save">SAVE</div>
			<div class="popup-btn remove">REMOVE</div>														
		</div>
	</div>
	<!-- file upload container -->
	<div class="file-upload-container hide">
		<div class="col_12 uploader center">
			<div id="uploader">
				<p>Your browse doesn't have flash, silverlight or HTML5 support. </p>
			</div>			
		</div>														
	</div>
	<!-- end file upload container -->
	<?php include 'footer.php'; ?>
	</body>
</html