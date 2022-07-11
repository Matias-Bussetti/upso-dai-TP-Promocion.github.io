<?php
include_once('./class/FileSystem.php');
include_once('./class/Validator.php');
include_once('./class/Response.php');

$request = $_POST;

$typesArray = [
    'document_type' => "select|require",
    'document_number' => "text|require",
    'personal_image' => "file|require",
];

$validateInputs = Validator::validate($request, $typesArray);

//Validar Documento
if ($validateInputs["result"]) {
    $return["result"] = $validateInputs["result"];

    //TODO: Armo el nombre del archivo Json
    $document_type = $request['document_type'];
    $document_number = $request['document_number'];
    $fileName = $document_type . "_" . $document_number;

    //Como se valido Bien
    $upload_img = FileSystem::saveFileFromTemp("fotos", "personal_image", $fileName);
    //Si la imagen tuvo un error en la subida, Entoces
    if ($upload_img["error"]) {
        $return["result"] = false;
        $return["errors"]["personal_image"] = $upload_img["errors"]["personal_image"];
    } else {
        //Si la imagen NO tuvo un error en la subida, entoces

        $pathImg = $upload_img["path"]; //La ruta de la imágen sera igual a la nueva subida


        $fileNameJson = $fileName . ".json";

        //TODO: traer el archivo dni_2.json
        $jsonFileData = FileSystem::returnJsonFromFile("postulantes", $fileNameJson);

        //TODO: Modifico o agrego el index personal image con el valio de $pathImg
        $jsonFileData["personal_image"] = $pathImg;

        //TODO: guardo el archivo
        FileSystem::createJsonFile("postulantes", $fileNameJson, $jsonFileData);
    }
    Response::response($return, 201);

    //TODO: retornar result = true
} else {
    //Si document_type y document_number estan mal
    Response::response($validateInputs);
}
