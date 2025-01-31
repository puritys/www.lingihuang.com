<?php

$data = [
	'LA' => [
		'name' 	=> 'Los Angeles',
		'state' => 'California'
	],
	'NY' => [
		'name' 	=> 'New York City',
		'state' => 'New York'
	],
	'SD' => [
		'name' 	=> 'San Diego',
		'state' => 'California'
	],
	'SF' => [
		'name' 	=> 'San Francisco',
		'state' => 'California'
	]
];

$cityCode = $_GET['cityCode'];

$response = [
	'status' => 'ok',
	'data' 	 => []
];

if (!empty($cityCode))
{
	$response['data'] = $data[$cityCode];
}

header("Content-type: application/json");
echo json_encode($response);

?>