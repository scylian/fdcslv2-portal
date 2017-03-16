<?php
	session_start();
	unset($_SESSION['fdcsl']);
	header('Location: login.php');
?>