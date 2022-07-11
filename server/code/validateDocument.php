<?php
include_once('./class/FileSystem.php');
include_once('./class/Validator.php');
include_once('./class/Response.php');


$json = file_get_contents('php://input');
$data = json_decode($json);

$request = $_POST;

$typesArray = [
    'document_type' => "select|require",
    'document_number' => "text|require",
    'name' => "text|require",
    'last_name' => "text|require",
    'email' => "text|require",
    'job' => "select|require",
];

$validateInputs = Validator::validate($request, $typesArray);

if ($validateInputs["result"]) {
    $data["result"] = $validateInputs["result"];

    $document_type = $request['document_type'];
    $document_number = $request['document_number'];


    $fileNameJson = $document_type . "_" . $document_number . ".json";


    if (FileSystem::checkInFolderIfExistWithName("postulantes", $fileNameJson)) {
        $data["exist"] = true;
        $data["data"] = FileSystem::returnJsonFromFile("postulantes", $fileNameJson);
    } else {
        FileSystem::createJsonFile("postulantes", $fileNameJson, json_encode($validateInputs["inputs"]));
        $data["exist"] = false;
    }

    Response::response($data);
} else {
    Response::response($validateInputs);
}

exit();
