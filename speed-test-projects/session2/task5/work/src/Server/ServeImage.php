<?php

namespace EuroSkills\Trade17\ImageThumbnail\Server;

require_once(__DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php');

use EuroSkills\Trade17\ImageThumbnail\ImageThumbnail;

$imagePath = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'images' . DIRECTORY_SEPARATOR;

// validate input params
if (!isset($_GET['file']) || !isset($_GET['size']) || str_contains($_GET['file'], '/') || str_contains($_GET['file'], '\\') || !is_numeric($_GET['size'])) {
    throw new \Exception('Invalid GET parameters specified');
}

// buffer output so we avoid sending the content-type header in case of an exception
ob_start();

try {
    $imageThumbnail = new ImageThumbnail();
    $imageThumbnail->create($imagePath . $_GET['file'], (int) $_GET['size'], isset($_GET['watermark']) ? $imagePath . 'watermark.png' : null);
    header('Content-Type: image/jpeg');
    ob_end_flush();
} catch (Exception $e) {
    throw $e;
}
