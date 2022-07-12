<?php
class Validator
{
    private static $_errorMsg =
    [
        "file_upload_error" => "El archivo no se subio correctamente, pruebe denuevo",
        "file_maxsize_error" => "El archivo no es permintido, supera los ",
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

                //Si esta en la carpeta temp
                if (is_uploaded_file($file["tmp_name"])) {

                    $validation["inputs"][$input] = "uploaded";

                    if (str_contains($type, "maxsize")) {
                        $bitsCap = intval(substr($type, strpos($type, "maxsize:") + strlen("maxsize:")));

                        if (filesize($file["tmp_name"]) > $bitsCap) {
                            $validation["result"] = false;

                            // Codigo utilizado de https://subinsb.com/convert-bytes-kb-mb-gb-php/
                            $base = log($bitsCap) / log(1024);
                            $suffix = array("", "KB", "MB", "GB", "TB");
                            $f_base = floor($base);

                            $validation["errors"][$input] = self::$_errorMsg["file_maxsize_error"] . round(pow(1024, $base - floor($base)), 1) . $suffix[$f_base];
                        }
                    }
                } else {
                    //Si no esta en la carpeta temp
                    //Si es requerido
                    if (str_contains($type, "require")) {
                        //Retornar error "file_upload_error"
                        $validation["result"] = false;
                        $validation["errors"][$input] = self::$_errorMsg["file_upload_error"];
                    } else {
                        //Retornar null
                        $validation["inputs"][$input] = null;
                    }
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
