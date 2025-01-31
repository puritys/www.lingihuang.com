<?php

header("Content-type: text/xml");

$response = '<?xml version="1.0" encoding="UTF-8"?>';
$response .= '<data>';
$response .= '<title>XML Query</title>';
$response .= '<user>';
$response .= '<name label="Name">Vivian</name>';
$response .= '<cell label="Cell Phone">415.260.4610</cell>';
$response .= '<address label="Address">825 Post Street APT 411, San Francisco CA 94109</address>';
$response .= '</user>';
$response .= '</data>';

?>
