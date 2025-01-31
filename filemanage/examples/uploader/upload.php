<?php

function getFiles($fileArr)
{
	$fileKeys = array_keys($fileArr);
	$files    = array();

	for ($i = 0; $i < count($fileArr['name']); $i++)
	{
		foreach ($fileKeys as $key)
		{
			$files[$i][$key] = $fileArr[$key][$i];
		}
	}

	return $files;
}

function moveFiles($files)
{
	$isOk = true;

	// if (!file_exists('files/'))
	// {
	// 	if (!mkdir('files', 0777, true))
	// 	{
	// 		die('Failed to create directories...');
	// 	}
	// }

	foreach ($files as $file)
	{
		if (move_uploaded_file($file['tmp_name'], 'files/'. $file['name']))
		{
			
		}
		else
		{
			$isOk = false;
		}
	}
	return $isOk;
}

// Check if this is an AJAX request.
if (isset($_SERVER['HTTP_X_REQUESTED_WITH']))
{
	if (isset($_FILES['files']))
	{
		// Upload all files.
		$files  = getFiles($_FILES['files']);
		$status = moveFiles($files) ? 'ok' : 'failed';
	}
	else
	{
		// Upload single file.
		$fileName = $_SERVER['HTTP_X_FILE_NAME'];
		$fileSize = $_SERVER['HTTP_X_FILE_SIZE'];
		$fileType = $_SERVER['HTTP_X_FILE_TYPE'];
		$input    = fopen('php://input', 'r');
		$output   = fopen('files/' . $fileName, 'a');
 
 		while ($data = fread($input, 1024))
 		{
 			fwrite($output, $data);
 		}
 		fclose($input);
 		fclose($output);

 		if (filesize('files/' . $fileName) !== $fileSize)
 		{
 			unlink('files/' . $fileName);
 		}

 		$status = 'ok';
	}

	$response = array(
		'status' => $status
	);

	header('Content-type: application/json');
	echo json_encode($response);
}
else
{
	// Upload with iFrame for old browsers.
	echo $status;
}

?>