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
    'name' => "text",
    'last_name' => "text",
    'email' => "text",
    'job' => "select",
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

if ($validateInputs["result"] && $validateFiles["result"]) {

    $document_type = $request['document_type'];
    $document_number = $request['document_number'];


    $fileName = $document_type . "_" . $document_number . ".json";

    try {
        // call a success/error/progress handler
        FileSystem::createJsonFile($fileName, json_encode($validateInputs["inputs"]), "postulantes");
    } catch (\Throwable $e) { // For PHP 7
        print_r($e);
    }

    if (FileSystem::checkInFolderIfExistWithName("postulantes", $fileName)) {
        $data["exist"] = true;
        $data["data"] = FileSystem::returnJsonFromFile("postulantes", $fileName);

        FileSystem::saveFileFromTemp("fotos", "personal_image");

        FileSystem::saveFileFromTemp("curriculums", "personal_cv");

        $data["aaaa"] = true;
    } else {
        $data["exist"] = false;
    }

    Response::response($data);
} else {
    Response::response(["errors" => $validateInputs["errors"], "errors" => $validateFiles["errors"]]);
}

exit();
