<?php

	// PHP determine user for permissions
	if (isset($_SESSION['fdcsl']['user'])){
		$user = $_SESSION['fdcsl']['user'];	
	}
	$url = $_SERVER['PHP_SELF'];
	$url = basename($url).PHP_EOL;
	$url = explode('.', $url);
	$shortURL = $url[0];

	$users_nav = '<span class="top-nav users">Users</span>';
	$content_nav = '<span class="top-nav content">Content</span>';
	$analytic_class = '<span class="top-bar analytics">Analytics</span>';	
	$man_class = '<span class="top-bar manage">Manage Views</span>';
	$ad_class = '<span class="top-bar admin">Admin</span>';
	$push_class = '<span class="top-bar admin">Push Notifications</span>';
	if ($shortURL == 'users'){
		$users_nav = '<span class="top-nav users current">Users</span>';	
	} else if ($shortURL == 'content'){
		$content_nav = '<span class="top-nav content current">Content</span>';
	} else if ($shortURL == 'views'){
		$man_class = '<span class="top-bar manage current">Manage Views</span>';	
	} else if ($shortURL == 'admin'){
		$ad_class = '<span class="top-bar admin current">Admin</span>';
	} else if ($shortURL == 'push'){
		$push_class = '<span class="top-bar admin current">Push Notifications</span>';
	} 

?>
<div id="header" class="container upload">
	<div class="grid">
		<div class="col_12 header-container">
			<div class="header-logo-container col_12 center">
				<a href="client.php"><img src="" class="header-logo"/></a>							
			</div>						
		</div>
	</div>
</div>
<div id="nav-bar">
	<div class="grid">
		<div class="col-1-1">
			<div class="nav-text left">				
				<a href="content.php" class="top-nav-link core">
					<?php echo $content_nav; ?>
				</a>	
				<a href="views.php" class="top-nav-link core">
					<?php echo $man_class; ?>
				</a>
				<a href="users.php" class="top-nav-link core">
					<?php echo $users_nav; ?>
				</a>
				<a href="admin.php" class="top-nav-link core">
					<?php echo $ad_class; ?>
				</a>
				<a href="push.php" class="top-nav-link feature-input feature-apn hide-now">
					<?php echo $push_class; ?>
				</a>				
				<a href="" class="top-bar top-nav-link analytics hide" target="_blank" >
					<?php echo $analytic_class; ?>
				</a>
				<a href="logout.php" class="top-nav-link">
					<span class="top-nav logout">Logout</span>
				</a>				
			</div>			
		</div>
	</div>
</div>