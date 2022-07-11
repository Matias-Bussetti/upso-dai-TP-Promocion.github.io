<?php
class Validator
{
    private static $_errorMsg =
    [
        "file_upload_error" => "El archivo no se subio correctamente, pruebe denuevo",
        "select_error" => "Elija una Opción",
        "input_empty_error" => "Campo Vacio",
    ];

    public static function validate($validateArray, $typesArray)
    {
        $validation["result"] = true;

        foreach ($typesArray as $input => $type) {
            //Si el tipo es archivo
            if (str_contains($type, "file")) {

                $file = $_FILES[$input];

                //Si no esta en la carpeta temp
                if (!is_uploaded_file($file["tmp_name"])) {
                    //Si es requerido
                    if (str_contains($type, "require")) {
                        //Retornar error "file_upload_error"
                        $validation["result"] = false;
                        $validation["errors"][$input] = self::$_errorMsg["file_upload_error"];
                    } else {
                        //Retornar null
                        $validation["inputs"][$input] = null;
                    }
                } else {
                    //Si esta en la carpeta temp, retornar uploaded
                    $validation["inputs"][$input] = "uploaded";
                }
            } else {
                //Si no es de tipo archivo

                //Si esta en el arreglo de inputs
                if (isset($validateArray[$input])) {

                    //Si es requerido
                    if (str_contains($type, "require")) {

                        //Si no es null o vacio
                        if ($validateArray[$input] == "" || $validateArray[$input] == null) {


                            $validation["result"] = false;

                            if (str_contains($type, 'select')) {
                                $validation["errors"][$input] = self::$_errorMsg["select_error"];
                            } else {
                                //Type = text
                                $validation["errors"][$input] = self::$_errorMsg["input_empty_error"];
                            }
                        } else {
                            $validation["inputs"][$input] = $validateArray[$input];
                        }
                    } else {
                        $validation["inputs"][$input] = null;
                    }
                } else {
                    if (str_contains($type, "require")) {
                        $validation["result"] = false;

                        if (str_contains($type, 'select')) {
                            $validation["errors"][$input] = self::$_errorMsg["select_error"];
                        } else {
                            $validation["errors"][$input] = self::$_errorMsg["input_empty_error"];
                        }
                    } else {
                        $validation["inputs"][$input] = $validateArray[$input];
                    }
                }
            }
        }

        if (!$validation["result"]) {
            unset($validation["inputs"]);
        }
        return $validation;
    }
}
