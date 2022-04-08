<?php

namespace EuroSkills\Trade17\ImageThumbnail;

use Imagick;

class ImageThumbnail {
    /**
     * Creates a thumbnail for the given image.
     *
     * The function directly outputs the JPEG image to the browser (e.g. using echo or a dedicated image function).
     * The Content-Type header must not be set as it is already added by the server.
     *
     * The original image needs to be cropped to the specified size.
     * As the thumbnail is always a square, the size specifies both the width and height.
     * It can be assumed that the thumbnail size is always smaller than the original image.
     * Cropping is specified as follows:
     *   1. Resize the image to the thumbnail size while preserving the ratio
     *   2. Cut the thumbnail out of the center of the resized image
     *
     * Optionally, a watermark can be added.
     * If one is specified, it is added in the bottom left corner without any padding.
     * The watermark is also not resized.
     *
     * It can be assumed that the original image is always in the JPEG format while the watermark
     * is always a PNG image.
     *
     * @param   string  $imagePath      Absolute path to the original JPEG image
     * @param   int     $size           Thumbnail size (width and height)
     * @param   ?string $watermarkPath  Absolute path to a PNG watermark image or null if no watermark should be added
     */
    public function create(string $imagePath, int $size, ?string $watermarkPath): void
    {
        // solution with gd:
        /*
        $src = imagecreatefromjpeg($imagePath);
        $dest = imagecreatetruecolor($size, $size);
        $srcWidth = imagesx($src);
        $srcHeight = imagesy($src);

        if ($srcWidth > $srcHeight) {
            imagecopyresized($dest, $src, 0, 0, ($srcWidth - $srcHeight) / 2, 0, $size, $size, $srcHeight, $srcHeight);
        } else {
            imagecopyresized($dest, $src, 0, 0, 0, ($srcHeight - $srcWidth) / 2, $size, $size, $srcWidth, $srcWidth);
        }

        if ($watermarkPath) {
            $watermarkImage = imagecreatefrompng($watermarkPath);
            $watermarkWidth = imagesx($watermarkImage);
            $watermarkHeight = imagesy($watermarkImage);
            imagecopy($dest, $watermarkImage, 0, $size - $watermarkHeight, 0, 0, $watermarkWidth, $watermarkHeight);
        }

        imagejpeg($dest);
        */


        // solution with imagick:
        $image = new Imagick($imagePath);

        $image->cropThumbnailImage($size, $size);

        if ($watermarkPath) {
            $watermark = new Imagick($watermarkPath);
            $image->compositeImage($watermark, Imagick::COMPOSITE_OVER, 0, $size - $watermark->getImageHeight());
        }

        echo $image;
    }
}
