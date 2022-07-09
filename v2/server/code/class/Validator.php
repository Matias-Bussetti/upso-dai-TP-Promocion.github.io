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
            if (str_contains($type, "file")) {

                $file = $_FILES[$input];

                if (!is_uploaded_file($file["tmp_name"])) {
                    if (str_contains($type, "require")) {
                        $validation["result"] = false;
                        $validation["errors"][$input] = self::$_errorMsg["file_upload_error"];
                    } else {
                        $validation["inputs"][$input] = null;
                    }
                } else {
                    $validation["inputs"][$input] = "uploaded";
                }
            } elseif (isset($validateArray[$input])) {

                if ($validateArray[$input] == "" || $validateArray[$input] == null) {

                    if (str_contains($type, "require")) {

                        $validation["result"] = false;

                        if (str_contains($type, 'select')) {
                            $validation["errors"][$input] = self::$_errorMsg["select_error"];
                        } else {
                            //Type = text
                            $validation["errors"][$input] = self::$_errorMsg["input_empty_error"];
                        }
                    } else {
                        $validation["inputs"][$input] = null;
                    }
                } else {
                    $validation["inputs"][$input] = $validateArray[$input];
                }
            } else {

                $validation["result"] = false;
                $validation["errors"][$input] = "No existe datos del Campo";
            }
        }

        if (!$validation["result"]) {
            unset($validation["inputs"]);
        }
        return $validation;
    }
}
