<?php
header('Content-Type: application/json');
$data = array(
    array(
        "data" => array(
            "title" => "Archives",
            "attr"  => array(
                "href" => "#"
            )
        ),
        "attr" => array(
            "data-name"  => "@km",
            "data-gid"   => "14",
            "data-path"  => "\/@km",
            "data-size"  => 4096,
            "data-crumb" => "f519fc5b76163d4c05bc1d1bc48f2c16",
            "class"      => "folder",
            "rel"        => "user-folder"
        ),
        "state" => "closed"
    ),
    array(
        "data" => array(
            "title" => "USA Trip",
            "attr"  => array(
                "href" => "#"
            )
        ),
        "attr" => array(
            "data-name"  => "USA Trip",
            "data-gid"   => "14",
            "data-path"  => "\/USA Trip",
            "data-size"  => 4096,
            "data-crumb" => "f519fc5b76163d4c05bc1d1bc48f2c16",
            "class"      => "folder",
            "rel"        => "user-folder"
        ),
        "state" => "closed"
    ),
    array(
        "data" => array(
            "title" => "Web Tutorials",
            "attr"  => array(
                "href" => "#"
            )
        ),
        "attr" => array(
            "data-name"  => "Web Tutorials",
            "data-gid"   => "2",
            "data-path"  => "",
            "data-size"  => 0,
            "data-crumb" => "d3678e423493725a80167833290eea40",
            "class"      => "folder",
            "rel"        => "folder"
        ),
        "state" => "closed"
    ),
    array(
        "data" => array(
            "title" => "Dinner_At_Grand_Hotel_Palazzo_della_Fonte_In_Fiuggi_004.JPG",
            "attr"  => array(
                "href" => "#"
            )
        ),
        "attr" => array(
            "data-name"  => "Dinner_At_Grand_Hotel_Palazzo_della_Fonte_In_Fiuggi_004.JPG",
            "data-gid"   => "14",
            "data-path"  => "",
            "data-size"  => 498513,
            "data-crumb" => "",
            "class"      => "file",
            "rel"        => "user-folder"
        ),
        "state" => ""
    )
);

echo json_encode($data);
?>