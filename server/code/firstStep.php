<?php
include_once('./class/FileSystem.php');
include_once('./class/Validator.php');
include_once('./class/Response.php');

$request = $_POST;

$typesArray = [
    'document_type' => "select|require",
    'document_number' => "text|require",
];

$validateInputs = Validator::validate($request, $typesArray);

if ($validateInputs["result"]) {
    //Si se valido bien el documento
    $response["result"] = true;

    $document_type = $request['document_type'];
    $document_number = $request['document_number'];

    $fileNameJson = $document_type . "_" . $document_number . ".json";

    if (FileSystem::checkInFolderIfExistWithName("postulantes", $fileNameJson)) {
        //Si ya existe una postulacion con el dni validado
        $response["exist"] = true;
        $response["data"] = FileSystem::returnJsonFromFile("postulantes", $fileNameJson);
        Response::response($response, 200);
    } else {
        //Si no existia
        $response["exist"] = false;

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
            //Si se valido bien creo el el archivo
            FileSystem::createJsonFile("postulantes", $fileNameJson, $validateInputs["inputs"]);
            Response::response($response, 201);
        } else {
            Response::response($validateInputs);
        }
    }
} else {
    Response::response($validateInputs);
}


/*
$typesArray = [
    'document_type' => "select|require",
    'document_number' => "text|require",
    'name' => "text|require",
    'last_name' => "text|require",
    'email' => "text|require",
    'job' => "select|require",
];



$response["result"] = $validateInputs["result"];

    $document_type = $request['document_type'];
    $document_number = $request['document_number'];


    $fileNameJson = $document_type . "_" . $document_number . ".json";

    FileSystem::createJsonFile("postulantes", $fileNameJson, $validateInputs["inputs"]);

    if (FileSystem::checkInFolderIfExistWithName("postulantes", $fileNameJson)) {
        $response["exist"] = true;
        $response["data"] = FileSystem::returnJsonFromFile("postulantes", $fileNameJson);
    } else {
        FileSystem::createJsonFile("postulantes", $fileNameJson, $validateInputs["inputs"]);
        $response["exist"] = false;
    }

*/