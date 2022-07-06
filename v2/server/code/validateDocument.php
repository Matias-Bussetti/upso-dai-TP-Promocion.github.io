<?php
include_once('./class/FileSystem.php');
include_once('./class/Validator.php');
include_once('./class/Response.php');


$json = file_get_contents('php://input');
$data = json_decode($json);

$request = $_POST;
$validation = Validator::validateRequest($request, ['document_type' => "select", 'document_number' => "text"]);

if ($validation["result"]) {

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
    Response::response(["errors" => $validation["errors"]]);
}

exit();
