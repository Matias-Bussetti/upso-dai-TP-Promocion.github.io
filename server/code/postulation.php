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
        $prevPostulation = FileSystem::returnJsonFromFile("postulantes", $fileNameJson); //Postulacion Previa

        $typesArray['personal_image'] = "file";
        $typesArray['personal_cv'] = "file";
    } else {
        $typesArray['personal_image'] = "file|require";
        $typesArray['personal_cv'] = "file|require";
    }

    //Valido Denuevo
    $validateInputs = Validator::validate($request, $typesArray);

    //Si salio bien
    if ($validateInputs["result"]) {

        $validateInputsImg = $validateInputs["inputs"]["personal_image"];
        $validateInputsCv = $validateInputs["inputs"]["personal_cv"];

        $validateUpload["result"] = true;

        $pathImg = ""; //Variable que Guarda la ruta a la imágen
        $pathCv = ""; //Variable que Guarda la ruta al cv

        //Si la img se valido y esta el archivo entoces
        if ($validateInputsImg == "uploaded") {
            $upload_img = FileSystem::saveFileFromTemp("fotos", "personal_image", $fileName);
            //Si la imagen tuvo un error en la subida, Entoces
            if ($upload_img["error"]) {
                $validateUpload["result"] = false;
                $validateUpload["errors"]["personal_image"] = $upload_img["errors"]["personal_image"];
            } else {
                //Si la imagen NO tuvo un error en la subida, entoces
                $pathImg = $upload_img["path"]; //La ruta de la imágen sera igual a la nueva subida
            }
        } else {
            //Si la img se valido y no se subio ningun archivo entoces
            $pathImg = $prevPostulation["personal_image"]; //La ruta de la imágen sera igual a la previamente subida
        }

        //Si el cv se valido y esta el archivo entoces
        if ($validateInputsCv == "uploaded") {
            $upload_cv = FileSystem::saveFileFromTemp("curriculums", "personal_cv", $fileName);
            //Si el cv tuvo un error en la subida, Entoces
            if ($upload_cv["error"] == "uploaded") {
                $validateUpload["result"] = false;
                $validateUpload["errors"]["personal_cv"] = $upload_cv["errors"]["personal_cv"];
            } else {
                //Si el cv NO tuvo un error en la subida, entoces
                $pathCv = $upload_cv["path"]; //La ruta del cv sera igual a la nueva subida
            }
        } else {
            //Si el cv se valido y no se subio ningun archivo entoces
            $pathCv = $prevPostulation["personal_cv"]; //a ruta del cv sera igual a la previamente subida
        }

        //Si los archivos se subieron correctamente
        if ($validateUpload["result"]) {

            $validateInputs["inputs"]["personal_image"] = $pathImg;
            $validateInputs["inputs"]["personal_cv"] = $pathCv;

            FileSystem::createJsonFile("postulantes", $fileNameJson, json_encode($validateInputs["inputs"]));
            //!BORRAR
            Response::response(["result" => true], 201);
        } else {
            //Si los archivos no se subieron correctamente
            Response::response($validateUpload);
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
