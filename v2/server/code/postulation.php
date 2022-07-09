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
];

$validateInputs = Validator::validate($request, $typesArray);

//Validar Documento
if ($validateInputs["result"]) {

    $fileName = $request['document_type'] . "_" . $request['document_number'];
    $fileNameJson = $fileName . ".json";

    //Me fijo si ya se habia ingresado
    $typesArray = [
        'document_type' => "select|require",
        'document_number' => "text|require",
        'name' => "text|require",
        'last_name' => "text|require",
        'email' => "text|require",
        'job' => "select|require",
    ];


    //Si ya existe un registro no requiero que los archivos se suban denuevo!
    if (FileSystem::checkInFolderIfExistWithName("postulantes", $fileNameJson)) {
        $typesArray['personal_image'] = "file";
        $typesArray['personal_cv'] = "file";
    } else {
        $typesArray['personal_image'] = "select|require";
        $typesArray['personal_cv'] = "select|require";
    }

    //Valido Denuevo
    $validateInputs = Validator::validate($request, $typesArray);

    //Si salio bien
    if ($validateInputs["result"]) {

        $validateInputsImg = $validateInputs["inputs"]["personal_image"];
        $validateInputsCv = $validateInputs["inputs"]["personal_cv"];

        $error["result"] = true;


        //Si la img se valido y esta el archivo entoces
        if ($validateInputsImg == "uploaded") {
            $upload_img = FileSystem::saveFileFromTemp("fotos", "personal_image", $fileName);
            //Si la imagen tuvo un error en la subida, Entoces
            if ($upload_img["error"]) {
                $error["result"] = false;
                $error["errors"]["personal_image"] = $upload_img["errors"]["personal_image"];
            }
        }

        //Si el cv se valido y esta el archivo entoces
        if ($validateInputsCv == "uploaded") {
            $upload_cv = FileSystem::saveFileFromTemp("curriculums", "personal_cv", $fileName);
            //Si la imagen tuvo un error en la subida, Entoces
            if ($upload_cv["error"] == "uploaded") {
                $error["result"] = false;
                $error["errors"]["personal_cv"] = $upload_cv["errors"]["personal_cv"];
            }
        }

        //Si los archivos se subieron correctamente
        if ($error["result"]) {

            $validateInputs["inputs"]["personal_image"] = $upload_cv["path"];
            $validateInputs["inputs"]["personal_cv"] = $upload_cv["path"];

            FileSystem::createJsonFile("postulantes", $fileNameJson, json_encode($validateInputs["inputs"]));

            Response::response(["result" => true], 201);
        } else {
            //Si los archivos no se subieron correctamente
            Response::response($error);
        }
    } else {
        //Si algun input estan mal
        Response::response($validateInputs);
    }
} else {
    //Si document_type y document_number estan mal
    Response::response($validateInputs);
}




//TODO Si el documento ya existen no es necesario que se compruebe si hay imagen








exit();
