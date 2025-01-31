<?php

include_once("JSON.php");

$json = new Services_JSON();

$response = array(
	"title" => "JSON Query",
	"user" => array(
		array("label" => "Name", "value" => "Vivian"),
		array("label" => "Cell Phone", "value" => "415.260.4610"),
		array("label" => "Address", "value" => "825 Post Street APT 411, San Francisco CA 94109")
	)
);

$response = $json->encode($response);

?>
