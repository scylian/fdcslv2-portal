<?php
	header('Content-Type: application/json');
	session_start();

	$response = array();
	$response['status'] = 'NO';
	
	if (!isset($_REQUEST['client_id'])){
		$response['content'] = 'missing client id';
		echo json_encode($response);
		exit;
	}
	
	$response['status'] = 'OK';
	
	$_SESSION['fdcsl']['client_id'] = $_REQUEST['client_id'];

	$response['content'] = array(
		'client_id'=>$_SESSION['fdcsl']['client_id'],
		'redirect_url'=>$_SESSION['fdcsl']['redirect_url'],
	);
	echo json_encode($response);
	return;
?>