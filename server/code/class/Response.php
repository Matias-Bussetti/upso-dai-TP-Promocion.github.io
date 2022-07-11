<?php
class Response
{
    public static function response($data, $customStatus = 200, $customHeader = null)
    {
        if ($customHeader) {
            header($customHeader);
        } else {
            header('Content-Type: application/json; charset=utf-8');
        }

        if ($customStatus != 200) {
            http_response_code($customStatus);
        }

        echo json_encode($data);
        exit;
    }
}
