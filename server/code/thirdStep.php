<?php
include_once('./class/FileSystem.php');
include_once('./class/Validator.php');
include_once('./class/Response.php');

$json = file_get_contents('php://input');
$request = json_decode($json);

//Tomamos todos los datos pasados por post
//$request = $_POST;

//En este caso solo validaremos que esten los datos del documento y el cv
$typesArray = [
    'document_type' => "select|require",
    'document_number' => "text|require",
    'personal_cv' => "file|require",
];

//Realizamos la validación de los inputs
$validateInputs = Validator::validate($request, $typesArray);

if ($validateInputs["result"]) {
    $return["result"] = true;

    //Armo el nombre del archivo sin extención
    $document_type = $request['document_type'];
    $document_number = $request['document_number'];
    $fileName = $document_type . "_" . $document_number;

    //Como se valido Bien
    $upload_cv = FileSystem::saveFileFromTemp("curriculums", "personal_cv", $fileName);
    //Si el cv tuvo un error en la subida, Entoces
    if ($upload_cv["error"]) {
        $return["result"] = false;
        $return["errors"]["personal_cv"] = $upload_cv["errors"]["personal_cv"];
    } else {
        //Si el cv NO tuvo un error en la subida, entoces
        $pathCv = $upload_cv["path"]; //La ruta del cv sera igual a la nueva subida

        $fileNameJson = $fileName . ".json";

        //Traemos el archivo ej.: dni_2.json
        $jsonFileData = FileSystem::returnJsonFromFile("postulantes", $fileNameJson);

        //Modifico o agrego el index personal image con el valio de $pathImg
        $jsonFileData["personal_cv"] = $pathCv;

        //Guardo el archivo ej.: dni_2.json
        FileSystem::createJsonFile("postulantes", $fileNameJson, $jsonFileData);
    }
    Response::response($return, 201);
} else {
    //En el caso de que no se valido bien, retornamos los errores
    Response::response($validateInputs);
}
