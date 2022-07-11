<?php
include_once('./class/FileSystem.php');
include_once('./class/Validator.php');
include_once('./class/Response.php');


$json = file_get_contents('php://input');
$data = json_decode($json);

$request = $_POST;

$typesArray =  ['document_type' => "select|require", 'document_number' => "text|require"];

$validation = Validator::validate($request, $typesArray);

if ($validation["result"]) {
    $data["result"] = $validation["result"];

    $document_type = $request['document_type'];
    $document_number = $request['document_number'];


    $fileName = $document_type . "_" . $document_number . ".json";


    if (FileSystem::checkInFolderIfExistWithName("postulantes", $fileName)) {
        $data["exist"] = true;
        $data["data"] = FileSystem::returnJsonFromFile("postulantes", $fileName);
    } else {
        $data["exist"] = false;
    }

    Response::response($data);
} else {
    Response::response($validation);
}

exit();
