<?php

namespace EuroSkills\Trade17\ImageThumbnail\Tests\Extra;

use EuroSkills\Trade17\ImageThumbnail\ImageThumbnail;
use Skills17\PHPUnit\BaseTest;

class ImageThumbnailTest extends BaseTest
{
    protected function getImage(string $imagePath, int $size, ?string $watermarkPath, string $testName)
    {
        $basePath = __DIR__ . DIRECTORY_SEPARATOR . 'images' . DIRECTORY_SEPARATOR;
        $imageThumbnail = new ImageThumbnail();

        ob_start();
        try {
            $imageThumbnail->create($basePath . $imagePath, $size, $watermarkPath ? $basePath . $watermarkPath : null);
            $image = ob_get_clean();

            // save image to file system
            $resultPath = $basePath . 'test-results' . DIRECTORY_SEPARATOR;
            $resultImagePath = $resultPath . $testName . '.jpg';
            @mkdir($resultPath, 0777, true);
            file_put_contents($resultImagePath, $image);

            return $image;
        } catch (Exception $e) {
            ob_end_clean();
            throw $e;
        }
    }

    protected function getRgbColorAt($image, int $x, int $y)
    {
        $rgb = imagecolorat($image, $x, $y);
        $r = ($rgb >> 16) & 0xFF;
        $g = ($rgb >> 8) & 0xFF;
        $b = $rgb & 0xFF;

        return [$r, $g, $b];
    }

    /**
     * @medium
     */
    public function testImageThumbnailSquare()
    {
        $rawImage = $this->getImage('borderless.jpg', 50, null, 'testImageThumbnailSquare');
        $image = imagecreatefromstring($rawImage);

        $this->assertEquals(50, imagesx($image), 'Thumbnail should have a width of 50 pixels');
        $this->assertEquals(50, imagesx($image), 'Thumbnail should have a height of 50 pixels');
    }

    /**
     * @medium
     */
    public function testImageThumbnailLandscapeCropMiddle()
    {
        $rawImage = $this->getImage('borderless.jpg', 50, null, 'testImageThumbnailLandscapeCropMiddle');
        $image = imagecreatefromstring($rawImage);

        $this->assertEquals(50, imagesx($image), 'Thumbnail should have a width of 50 pixels');
        $this->assertEquals(50, imagesx($image), 'Thumbnail should have a height of 50 pixels');

        for ($x = 0; $x < 50; $x++) {
            for ($y = 0; $y < 50; $y++) {
                list($r, $g, $b) = $this->getRgbColorAt($image, $x, $y);

                // upper left corner -> should be yellow
                if ($x < 23 && $y < 23) {
                    $this->assertGreaterThan(200, $r, 'Pixel at x=' . $x . ';y=' . $y . ' should be yellow.');
                    $this->assertGreaterThan(200, $g, 'Pixel at x=' . $x . ';y=' . $y . ' should be yellow.');
                    $this->assertLessThan(100, $b, 'Pixel at x=' . $x . ';y=' . $y . ' should be yellow.');

                // upper right corner -> should be blue
                } else if ($x > 27 && $y < 23) {
                    $this->assertLessThan(100, $r, 'Pixel at x=' . $x . ';y=' . $y . ' should be blue.');
                    $this->assertLessThan(100, $g, 'Pixel at x=' . $x . ';y=' . $y . ' should be blue.');
                    $this->assertGreaterThan(200, $b, 'Pixel at x=' . $x . ';y=' . $y . ' should be blue.');

                // bottom left corner -> should be green
                } else if ($x < 23 && $y > 27) {
                    $this->assertLessThan(100, $r, 'Pixel at x=' . $x . ';y=' . $y . ' should be green.');
                    $this->assertGreaterThan(200, $g, 'Pixel at x=' . $x . ';y=' . $y . ' should be green.');
                    $this->assertLessThan(100, $b, 'Pixel at x=' . $x . ';y=' . $y . ' should be green.');

                // bottom right corner -> should be red
                } else if ($x > 27 && $y > 27) {
                    $this->assertGreaterThan(200, $r, 'Pixel at x=' . $x . ';y=' . $y . ' should be red.');
                    $this->assertLessThan(100, $g, 'Pixel at x=' . $x . ';y=' . $y . ' should be red.');
                    $this->assertLessThan(100, $b, 'Pixel at x=' . $x . ';y=' . $y . ' should be red.');
                }
            }
        }
    }

    /**
     * @medium
     */
    public function testImageThumbnailLandscapeResizeAndCropMiddle()
    {
        $rawImage = $this->getImage('with-border.jpg', 50, null, 'testImageThumbnailLandscapeResizeAndCropMiddle');
        $image = imagecreatefromstring($rawImage);

        $this->assertEquals(50, imagesx($image), 'Thumbnail should have a width of 50 pixels');
        $this->assertEquals(50, imagesx($image), 'Thumbnail should have a height of 50 pixels');

        for ($x = 0; $x < 50; $x++) {
            for ($y = 0; $y < 50; $y++) {
                list($r, $g, $b) = $this->getRgbColorAt($image, $x, $y);

                // upper/bottom border -> should be black
                if (($y > 0 && $y < 3) || ($y < 49 && $y > 46)) {
                    $this->assertLessThan(100, $r, 'Pixel at x=' . $x . ';y=' . $y . ' should be black.');
                    $this->assertLessThan(100, $g, 'Pixel at x=' . $x . ';y=' . $y . ' should be black.');
                    $this->assertLessThan(100, $b, 'Pixel at x=' . $x . ';y=' . $y . ' should be black.');

                // between border & image -> skip to allow some error margin
                } else if ($y < 8 || $y > 40) {
                    continue;

                // upper left corner -> should be yellow
                } else if ($x < 23 && $y < 23) {
                    $this->assertGreaterThan(200, $r, 'Pixel at x=' . $x . ';y=' . $y . ' should be yellow.');
                    $this->assertGreaterThan(200, $g, 'Pixel at x=' . $x . ';y=' . $y . ' should be yellow.');
                    $this->assertLessThan(100, $b, 'Pixel at x=' . $x . ';y=' . $y . ' should be yellow.');

                // upper right corner -> should be blue
                } else if ($x > 27 && $y < 23) {
                    $this->assertLessThan(100, $r, 'Pixel at x=' . $x . ';y=' . $y . ' should be blue.');
                    $this->assertLessThan(100, $g, 'Pixel at x=' . $x . ';y=' . $y . ' should be blue.');
                    $this->assertGreaterThan(200, $b, 'Pixel at x=' . $x . ';y=' . $y . ' should be blue.');

                // bottom left corner -> should be green
                } else if ($x < 23 && $y > 27) {
                    $this->assertLessThan(100, $r, 'Pixel at x=' . $x . ';y=' . $y . ' should be green.');
                    $this->assertGreaterThan(200, $g, 'Pixel at x=' . $x . ';y=' . $y . ' should be green.');
                    $this->assertLessThan(100, $b, 'Pixel at x=' . $x . ';y=' . $y . ' should be green.');

                // bottom right corner -> should be red
                } else if ($x > 27 && $y > 27) {
                    $this->assertGreaterThan(200, $r, 'Pixel at x=' . $x . ';y=' . $y . ' should be red.');
                    $this->assertLessThan(100, $g, 'Pixel at x=' . $x . ';y=' . $y . ' should be red.');
                    $this->assertLessThan(100, $b, 'Pixel at x=' . $x . ';y=' . $y . ' should be red.');
                }
            }
        }
    }

    /**
     * @medium
     */
    public function testImageThumbnailLandscapeWatermark()
    {
        $rawImage = $this->getImage('borderless.jpg', 50, 'watermark.png', 'testImageThumbnailLandscapeWatermark');
        $image = imagecreatefromstring($rawImage);

        $this->assertEquals(50, imagesx($image), 'Thumbnail should have a width of 50 pixels');
        $this->assertEquals(50, imagesx($image), 'Thumbnail should have a height of 50 pixels');

        for ($x = 0; $x < 50; $x++) {
            for ($y = 0; $y < 50; $y++) {
                list($r, $g, $b) = $this->getRgbColorAt($image, $x, $y);

                // watermark -> should be pink
                if ($x > 0 && $x < 28 && $y < 49 && $y > 38) {
                    $this->assertGreaterThan(200, $r, 'Pixel at x=' . $x . ';y=' . $y . ' should be pink.');
                    $this->assertLessThan(100, $g, 'Pixel at x=' . $x . ';y=' . $y . ' should be pink.');
                    $this->assertGreaterThan(200, $b, 'Pixel at x=' . $x . ';y=' . $y . ' should be pink.');

                // between watermark & image -> skip to allow some error margin
                } else if ($x < 33 || $y > 32) {
                    continue;

                // upper left corner -> should be yellow
                } else if ($x < 23 && $y < 23) {
                    $this->assertGreaterThan(200, $r, 'Pixel at x=' . $x . ';y=' . $y . ' should be yellow.');
                    $this->assertGreaterThan(200, $g, 'Pixel at x=' . $x . ';y=' . $y . ' should be yellow.');
                    $this->assertLessThan(100, $b, 'Pixel at x=' . $x . ';y=' . $y . ' should be yellow.');

                // upper right corner -> should be blue
                } else if ($x > 27 && $y < 23) {
                    $this->assertLessThan(100, $r, 'Pixel at x=' . $x . ';y=' . $y . ' should be blue.');
                    $this->assertLessThan(100, $g, 'Pixel at x=' . $x . ';y=' . $y . ' should be blue.');
                    $this->assertGreaterThan(200, $b, 'Pixel at x=' . $x . ';y=' . $y . ' should be blue.');

                // bottom left corner -> should be green
                } else if ($x < 23 && $y > 27) {
                    $this->assertLessThan(100, $r, 'Pixel at x=' . $x . ';y=' . $y . ' should be green.');
                    $this->assertGreaterThan(200, $g, 'Pixel at x=' . $x . ';y=' . $y . ' should be green.');
                    $this->assertLessThan(100, $b, 'Pixel at x=' . $x . ';y=' . $y . ' should be green.');

                // bottom right corner -> should be red
                } else if ($x > 27 && $y > 27) {
                    $this->assertGreaterThan(200, $r, 'Pixel at x=' . $x . ';y=' . $y . ' should be red.');
                    $this->assertLessThan(100, $g, 'Pixel at x=' . $x . ';y=' . $y . ' should be red.');
                    $this->assertLessThan(100, $b, 'Pixel at x=' . $x . ';y=' . $y . ' should be red.');
                }
            }
        }
    }

    /**
     * @medium
     */
    public function testImageThumbnailPortraitResizeAndCropMiddle()
    {
        $rawImage = $this->getImage('with-border-portrait.jpg', 50, null, 'testImageThumbnailPortraitResizeAndCropMiddle');
        $image = imagecreatefromstring($rawImage);

        $this->assertEquals(50, imagesx($image), 'Thumbnail should have a width of 50 pixels');
        $this->assertEquals(50, imagesx($image), 'Thumbnail should have a height of 50 pixels');

        for ($x = 0; $x < 50; $x++) {
            for ($y = 0; $y < 50; $y++) {
                list($r, $g, $b) = $this->getRgbColorAt($image, $x, $y);

                // left/right border -> should be black
                if (($x > 0 && $x < 3) || ($x < 49 && $x > 46)) {
                    $this->assertLessThan(100, $r, 'Pixel at x=' . $x . ';y=' . $y . ' should be black.');
                    $this->assertLessThan(100, $g, 'Pixel at x=' . $x . ';y=' . $y . ' should be black.');
                    $this->assertLessThan(100, $b, 'Pixel at x=' . $x . ';y=' . $y . ' should be black.');

                // between border & image -> skip to allow some error margin
                } else if ($x < 8 || $x > 40) {
                    continue;

                // upper left corner -> should be green
                } else if ($x < 23 && $y < 23) {
                    $this->assertLessThan(100, $r, 'Pixel at x=' . $x . ';y=' . $y . ' should be green.');
                    $this->assertGreaterThan(200, $g, 'Pixel at x=' . $x . ';y=' . $y . ' should be green.');
                    $this->assertLessThan(100, $b, 'Pixel at x=' . $x . ';y=' . $y . ' should be green.');

                // upper right corner -> should be yellow
                } else if ($x > 27 && $y < 23) {
                    $this->assertGreaterThan(200, $r, 'Pixel at x=' . $x . ';y=' . $y . ' should be yellow.');
                    $this->assertGreaterThan(200, $g, 'Pixel at x=' . $x . ';y=' . $y . ' should be yellow.');
                    $this->assertLessThan(100, $b, 'Pixel at x=' . $x . ';y=' . $y . ' should be yellow.');

                // bottom left corner -> should be red
                } else if ($x < 23 && $y > 27) {
                    $this->assertGreaterThan(200, $r, 'Pixel at x=' . $x . ';y=' . $y . ' should be red.');
                    $this->assertLessThan(100, $g, 'Pixel at x=' . $x . ';y=' . $y . ' should be red.');
                    $this->assertLessThan(100, $b, 'Pixel at x=' . $x . ';y=' . $y . ' should be red.');

                // bottom right corner -> should be blue
                } else if ($x > 27 && $y > 27) {
                    $this->assertLessThan(100, $r, 'Pixel at x=' . $x . ';y=' . $y . ' should be blue.');
                    $this->assertLessThan(100, $g, 'Pixel at x=' . $x . ';y=' . $y . ' should be blue.');
                    $this->assertGreaterThan(200, $b, 'Pixel at x=' . $x . ';y=' . $y . ' should be blue.');
                }
            }
        }
    }
}
