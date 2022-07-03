<?php
include_once('./class/FileSystem.php');
include_once('./class/Validator.php');
include_once('./class/Response.php');


$json = file_get_contents('php://input');
$data = json_decode($json);

$request = $_POST;

$validationInputs = [
    'document_type' => "select",
    'document_number' => "text",
    'personal_name' => "text",
    'personal_last_name' => "text",
    'personal_email' => "text",
];
$validationFiles = [
    'personal_image',
    'personal_cv',
];

$validateInputs = Validator::validateRequest($request, $validationInputs);
$validateFiles = Validator::validateFile($_FILES, $validationFiles);

//echo $validateFiles;
// echo "\n" . $validation["result"] ? "Y" : "N";
// echo "\n" . $validateFiles["result"] ? "Y" : "N";

if ($validation["result"] && $validateFiles["result"]) {

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
    Response::response(["errors" => $validateInputs["errors"], "errors" => $validateFiles["errors"]]);
}

exit();
