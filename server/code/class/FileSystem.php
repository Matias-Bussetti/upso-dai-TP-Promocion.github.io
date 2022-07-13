<?php

/**
 * Clase que tendra la responsabilidad de administrar y gestionar archivos
 */
class FileSystem
{
    /**
     * Variable en la que se guardan las ubicaciones de las carpetas desde este archivo
     */
    private static $_folders =
    [
        "curriculums" => "./../../server/curriculums",
        "fotos" => "./../../server/fotos",
        "postulantes" => "./../../server/postulantes",
    ];

    /**
     * Variable en la que se guardan los mensajes de error
     */
    private static $_errorMsg =
    [
        "move_upload_fail" => "El archivo no se guardo, error al mover el archivo del temp a la carpeta. Compruebe la configuración del servidor",
    ];


    /**
     * Esta función sirve para retornar el contenido dentro de un archivo json
     */
    public static function returnJsonFromFile($folderName, $fileName)
    {
        return json_decode(file_get_contents(self::$_folders[$folderName] . "/" . $fileName), TRUE);
    }

    /**
     * Esta funcion sirve para retornar si un archivo existe en una carpeta
     */
    public static function checkInFolderIfExistWithName($folderName, $fileName)
    {
        $myfiles = array_diff(scandir(self::$_folders[$folderName]), array('.', '..'));

        return in_array($fileName, $myfiles);
    }

    /**
     * Esta funcion sirve para crear un archivo json
     */
    public static function createJsonFile($folderName, $fileName, $jsonData)
    {
        // creo el archivo con los datos de la persona

        $archivo = fopen(self::$_folders[$folderName] . "/" . $fileName, "w");
        fwrite($archivo, json_encode($jsonData));    // grabo los datos en el archivo
        fclose($archivo);            // cierro el archivo
    }

    /**
     * Esta función sirve para mover un archivo en la carpeta temp a una carpeta del servidor
     */
    public static function saveFileFromTemp($folderName, $index, $newName)
    {
        $return["error"] = true;

        $file = $_FILES[$index];

        $extencion = substr($file["name"], strripos($file["name"], "."));

        $fileName = $newName . $extencion;

        $uploadFilePath = realpath(self::$_folders[$folderName]) . "/" . $fileName;

        //Probar que falle la subida del archivo
        //if (false) {
        if (move_uploaded_file($file["tmp_name"], $uploadFilePath)) {
            $pathUrl = substr($_SERVER['REQUEST_URI'], 0, strripos($_SERVER['REQUEST_URI'], "code/"));
            $path = $pathUrl . $folderName . "/" . $fileName;
            $return["path"] = $path;
            $return["error"] = false;
        } else {
            $return["errors"][$index] = self::$_errorMsg["move_upload_fail"];
        }

        return $return;
    }
}
