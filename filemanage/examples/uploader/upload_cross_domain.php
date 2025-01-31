<?php
$timestamp = $_GET['timestamp'];
$key       = 'file_' . $timestamp;

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
	$name = $_FILES['file']['name'];
	$size = $_FILES['file']['size'];
	$type = $_FILES['file']['type'];
	$tmp_name = $_FILES['file']['tmp_name'];

	$_SESSION[$key] = array(
		'name'    => $name,
		'size'    => $size,
		'type'    => $type,
		'message' => ''
	);

	if (move_uploaded_file($tmp_name, 'files/' . $name))
	{ 
		$_SESSION[$key]['message'] = $name . ' has been uploaded.';
	}
	else
	{
		$_SESSION[$key]['message'] = 'move_uploaded_file function failed.';
	}
}
else
{
	$callback = $_GET['callback'];

	if ($_SESSION[$key])
	{
		$response = array(
			'status'  => 'ok',
			'file'    => $_SESSION[$key]
		);
	}
	else {
		$response = array( 
			'status'  => 'failed',
			'file'    => array()
		);
	}
	unset($_SESSION[$key]);

	if ($callback)
	{
		header('Content-type: application/javascript');
		echo $callback . '(' . json_encode($response) . ')';
	}
	else
	{
		header('Content-type: application/json');
		echo json_encode($response);
	}
}

?>