<?php
	header('Content-Type: application/json');
	session_start();

	$response = array();
	$response['status'] = 'NO';

	if (!isset($_REQUEST['user'])|| !isset($_REQUEST['token'])){
		$response['content'] = "Username or token not sent.";
		echo json_encode($response);
		return;
	}	
	if (!isset($_REQUEST['client_id'])){
		$response['content'] = 'missing client id';
		echo json_encode($response);
		exit;
	}
	
	$response['status'] = 'OK';

	$_SESSION['fdcsl']['user'] = $_REQUEST['user'];
	$_SESSION['fdcsl']['token'] = $_REQUEST['token'];
	$_SESSION['fdcsl']['client_id'] = $_REQUEST['client_id'];
	$_SESSION['fdcsl']['admin'] = $_REQUEST['admin'];

	$response['content'] = array(
		'client_id'=>$_SESSION['fdcsl']['client_id'],
		'redirect_url'=>$_SESSION['fdcsl']['redirect_url'],
	);
	echo json_encode($response);
	return;
?>