<?php
include_once('./class/FileSystem.php');
include_once('./class/Validator.php');
include_once('./class/Response.php');

//Tomamos todos los datos pasados por post
$request = $_POST;

//Creamos un arreglo con los inputs que queremos validar. 
//input.name => validacion requerida
//En este caso empezaremos con los datos del documento
$typesArray = [
    'document_type' => "select|require",
    'document_number' => "text|require",
];

//Realizamos la validación de los inputs
$validateInputs = Validator::validate($request, $typesArray);

if ($validateInputs["result"]) {
    //Si se valido bien el documento
    $response["result"] = true;

    $document_type = $request['document_type'];
    $document_number = $request['document_number'];

    $fileNameJson = $document_type . "_" . $document_number . ".json";

    //Vamos a comprobar si ya existe un archivo con datos de la postulación
    if (FileSystem::checkInFolderIfExistWithName("postulantes", $fileNameJson)) {
        //Si ya existe una postulacion con el dni validado
        //Vamos a retornar al cliente, que el usuario existe con sus respectivos datos
        $response["exist"] = true;
        $response["data"] = FileSystem::returnJsonFromFile("postulantes", $fileNameJson);
        Response::response($response, 200);
    } else {
        //Si el cliente no existe
        $response["exist"] = false;

        //Validaremos todos los datos para guardalos en un archivo
        $typesArray = [
            'document_type' => "select|require",
            'document_number' => "text|require",
            'name' => "text|require",
            'last_name' => "text|require",
            'email' => "text|require",
            'job' => "select|require",
            'date' => "text|require",
        ];

        $validateInputs = Validator::validate($request, $typesArray);


        if ($validateInputs["result"]) {
            //Si se valido bien, creo el el archivo
            FileSystem::createJsonFile("postulantes", $fileNameJson, $validateInputs["inputs"]);
            Response::response($response, 201);
        } else {
            //En el caso de que no se valido bien, retornamos los errores
            Response::response($validateInputs);
        }
    }
} else {
    //En el caso de que no se valido bien, retornamos los errores
    Response::response($validateInputs);
}
