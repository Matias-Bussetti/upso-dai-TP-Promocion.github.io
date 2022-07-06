<?php
class FileSystem
{

    private static $_folders =
    [
        "curriculums" => "./../../server/curriculums",
        "fotos" => "./../../server/fotos",
        "postulantes" => "./../../server/postulantes",
        //"postulantes" => "./../server/postulantes",
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

    public static function createJsonFile($fileName, $jsonData, $folderName)
    {
        // creo el archivo con los datos de la persona

        $archivo = fopen(self::$_folders[$folderName] . "/" . $fileName, "w");
        fwrite($archivo, $jsonData);    // grabo los datos en el archivo
        fclose($archivo);            // cierro el archivo
    }

    public static function saveFileFromTemp($folderName, $index, $newName = "")
    {

        /*
        foreach ($_FILES["pictures"]["error"] as $key => $error) {
            if ($_FILES[$index]["error"] == UPLOAD_ERR_OK) {
                $tmp_name = $_FILES["pictures"]["tmp_name"][$key];
                // basename() may prevent filesystem traversal attacks;
                // further validation/sanitation of the filename may be appropriate
                $name = basename($_FILES["pictures"]["name"][$key]);
                move_uploaded_file($tmp_name, "$uploads_dir/$name");
            }
        */

        //print_r($_FILES[$index]);

        echo is_uploaded_file($_FILES[$index]["tmp_name"]) ? "S" : "N";

        echo "\n " . basename($_FILES[$index]["tmp_name"]);

        echo "\n " . move_uploaded_file($_FILES[$index]["tmp_name"], "/" . $_FILES[$index]["name"]) ? "\nY" : "\nN";
        exit;
        //move_uploaded_file($_FILES[$index]["tmp_name"], self::$_folders[$folderName]);
        //print_r($_FILES[$index]["tmp_name"] . "\n");
        //print_r(self::$_folders[$folderName] . "\n");
    }
}
