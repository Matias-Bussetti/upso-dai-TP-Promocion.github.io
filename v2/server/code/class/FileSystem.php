<?php
class FileSystem
{

    private static $_folders =
    [
        "curriculums" => "./../../server/curriculums",
        "fotos" => "./../../server/fotos",
        "postulantes" => "./../../server/postulantes",
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

    public static function createJsonFile($json)
    {
    }

    public static function uploadFile($type, $json)
    {
    }
}
