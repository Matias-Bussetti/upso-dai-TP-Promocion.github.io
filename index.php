<?php

$request = explode('?', $_SERVER['REQUEST_URI'], 2)[0];

//isset($_POST['celular']) && !empty($_POST['celular'])
switch ($request) {
    case '':
    case '/':
        Route::VIEW("home");
        break;
    case '/postulacion':
        Route::VIEW("postulacion");
        break;

    case '/validate/dni':
        Route::POST("ValidateController", "validateDocument");
        break;

    case '/validate/datos-presonales':
        Route::POST("ValidateController", "validatePersonalData");
        break;

    default:
        http_response_code(404);
        require __DIR__ . '/views/404.php';
        break;
}


function response($json, $customStatus = 200, $customHeader = null)
{
    if ($customHeader) {
        header($customHeader);
    } else {
        header('Content-Type: application/json; charset=utf-8');
    }

    if ($customStatus != 200) {
        http_response_code($customStatus);
    }

    echo json_encode($json);
}

class Route
{
    public static function VIEW($fileName, $customExtension = null)
    {
        require __DIR__ . '/public/pages/' . $fileName . ($customExtension ? $customExtension : ".html");
    }

    public static function POST($class, $method)
    {
        $_POST = json_decode(file_get_contents('php://input'), true);

        call_user_func($class . "::" . $method, $_POST);
    }
}

class ValidateController
{
    public static function validateDocument($request)
    {
        $validation = Validator::validateRequest($request, ['document_type' => "select", 'document_number' => "text"]);

        if ($validation["result"]) {

            $document_type = $request['document_type'];
            $document_number = $request['document_number'];

            $folderPath = "./server/postulantes";
            $validateDocument = $document_type . "_" . $document_number . ".json";

            if (FileSystem::checkIfExistWithName($validateDocument, $folderPath)) {
                $data["exist"] = true;
                $data["data"] = FileSystem::returnJsonFromFile($validateDocument, $folderPath);
            } else {
                $data["exist"] = false;
            }

            response($data);
        } else {
            response(["errors" => $validation["errors"]]);
        }
    }

    public static function validatePersonalData($request)
    {



        $validation = Validator::validateRequest($request, ['personal_data_name' => "text", 'personal_data_last_name' => "text", 'personal_data_email' => "mail"]);

        if ($validation["result"]) {
            $data["correct"] = true;
            response($data);
        } else {
            response(["errors" => $validation["errors"]]);
        }
    }
}

class Validator
{
    public static function validateRequest($requestArray, $inputNameArray)
    {
        $validation["result"] = true;

        foreach ($inputNameArray as $input => $type) {

            if (isset($requestArray[$input])) {

                if ($requestArray[$input] == "" || $requestArray[$input] == null) {
                    $validation["result"] = false;
                    switch ($type) {
                        case 'select':
                            $validation["errors"][$input] = "Elija una Opción";
                            break;

                        default:
                            $validation["errors"][$input] = "Campo Vacio";

                            break;
                    }
                }
            } else {
                $validation["result"] = false;
                $validation["errors"][$input] = "No existe datos del Campo";
            }
        }

        return $validation;
    }
}

class FileSystem
{
    public static function returnJsonFromFile($fileName, $folderPath)
    {
        return json_decode(file_get_contents($folderPath . "/" . $fileName), TRUE);
    }


    public static function checkIfExistWithName($fileName, $folderPath)
    {
        $return = [];

        $myfiles = array_diff(scandir($folderPath), array('.', '..'));

        //test
        // print_r($fileName);
        // print_r($myfiles);
        // print_r(in_array($fileName,$myfiles) ? "SI" : "NO");

        return in_array($fileName, $myfiles);
    }
}
