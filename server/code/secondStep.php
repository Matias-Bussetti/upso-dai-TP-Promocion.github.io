<?php
include_once('./class/FileSystem.php');
include_once('./class/Validator.php');
include_once('./class/Response.php');

$json = file_get_contents('php://input');
$request = json_decode($json);

//Tomamos todos los datos pasados por post
// $request = $_POST;

//En este caso solo validaremos que esten los datos del documento y la imagen
$typesArray = [
    'document_type' => "select|require",
    'document_number' => "text|require",
    'personal_image' => "file|require|maxsize:512000",
];

//Realizamos la validación de los inputs
$validateInputs = Validator::validate($request, $typesArray);

if ($validateInputs["result"]) {
    //Si se valido bien el documento
    $return["result"] = true;

    //Armo el nombre del archivo Json
    $document_type = $request['document_type'];
    $document_number = $request['document_number'];
    $fileName = $document_type . "_" . $document_number;

    //Guardamos la imagen en el servidor
    $upload_img = FileSystem::saveFileFromTemp("fotos", "personal_image", $fileName);
    //Si la imagen tuvo un error en la subida, Entoces
    if ($upload_img["error"]) {
        $return["result"] = false;
        $return["errors"]["personal_image"] = $upload_img["errors"]["personal_image"];
    } else {
        //Si la imagen NO tuvo un error en la subida, entoces
        $pathImg = $upload_img["path"]; //La ruta de la imágen sera igual a la nueva subida

        $fileNameJson = $fileName . ".json";

        //Traemos el archivo ej.: dni_2.json
        $jsonFileData = FileSystem::returnJsonFromFile("postulantes", $fileNameJson);

        //Modifico o agrego el index personal image con el valio de $pathImg
        $jsonFileData["personal_image"] = $pathImg;

        //Guardo el archivo ej.: dni_2.json
        FileSystem::createJsonFile("postulantes", $fileNameJson, $jsonFileData);
    }
    Response::response($return, 201);
} else {
    //En el caso de que no se valido bien, retornamos los errores
    Response::response($validateInputs);
}
