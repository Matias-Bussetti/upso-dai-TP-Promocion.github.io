<?php
class FileSystem
{

    private static $_folders =
    [
        "curriculums" => "./../../server/curriculums",
        "fotos" => "./../../server/fotos",
        "postulantes" => "./../../server/postulantes",
    ];

    private static $_errorMsg =
    [
        "move_upload_fail" => "El archivo no se guardo, error al mover el archivo del temp a la carpeta. Compruebe la configuración del servidor",
    ];



    public static function returnJsonFromFile($folderName, $fileName)
    {
        return json_decode(file_get_contents(self::$_folders[$folderName] . "/" . $fileName), TRUE);
    }


    public static function checkInFolderIfExistWithName($folderName, $fileName)
    {

        $return = [];

        $myfiles = array_diff(scandir(self::$_folders[$folderName]), array('.', '..'));
        //test
        // print_r($fileName);
        // print_r($myfiles);
        // print_r(in_array($fileName,$myfiles) ? "SI" : "NO");

        return in_array($fileName, $myfiles);
    }

    public static function createJsonFile($folderName, $fileName, $jsonData)
    {
        // creo el archivo con los datos de la persona

        $archivo = fopen(self::$_folders[$folderName] . "/" . $fileName, "w");
        fwrite($archivo, $jsonData);    // grabo los datos en el archivo
        fclose($archivo);            // cierro el archivo
    }

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
            $pathUrl = substr($_SERVER['REQUEST_URI'], 0, strripos($_SERVER['REQUEST_URI'], "code/postulation.php"));
            $path = $pathUrl . $folderName . "/" . $fileName;

            $return["path"] = $path;
            $return["error"] = false;
        } else {
            $return["errors"][$index] = self::$_errorMsg["move_upload_fail"];
        }

        return $return;
    }
}
