<?php

$type = "";

if (isset($_REQUEST["type"])) {
	$type = $_REQUEST["type"];
}

$response = "";
switch ($type) {
	case "html":
		include_once("data/myHtml.php");
		break;
	case "text":
		include_once("data/myText.php");
		break;
	case "xml":
		include_once("data/myXml.php");
		break;
	case "json":
		include_once("data/myJson.php");
		break;
	default:
		include_once("data/myText.php");
}

echo $response;

?>