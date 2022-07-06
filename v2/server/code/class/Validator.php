<?php
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
                } else {
                    $validation["inputs"][$input] = $requestArray[$input];
                }
            } else {

                $validation["result"] = false;
                $validation["errors"][$input] = "No existe datos del Campo";
            }
        }

        return $validation;
    }

    public static function validateFile($fileArray, $fileNameArray)
    {
        $validation["result"] = true;

        print_r($fileArray);

        //print_r($fileArray);
        //echo "\n";
        foreach ($fileNameArray as $file) {
            //print_r($file);
            //echo "\n";

            if (isset($fileArray[$file]["name"])) {
                //$fileArray[$file]["name"] = "asdasd.asdasdas";



            } else {

                $validation["result"] = false;
                $validation["errors"][$file] = "Elija un Archivo";
                /*
                */
            }
        }

        //echo $validation["result"] ? "S" : "N";
        //echo "\n";

        return $validation;
    }
}
