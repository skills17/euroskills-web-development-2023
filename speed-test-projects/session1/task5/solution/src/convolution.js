/**
 * Task 5 — Image Convolution
 */

/**
 * Your task is to implement image convolution. You are given a byte array (as numbers 0-255) that contains all
 * pixel values of an image.
 *
 * Because the array is flat, you are given width and height of the image. Using this you can determine the pixel value
 * at a x/y coordinate. The first element in the array is the top left pixel. Then it continues along the row (y remains)
 * until it reaches the given width, then it continues on the left on row 2, and so forth.
 *
 * The kernel is a 2d array. Iterate over each pixel in the image. Then lay the kernel centered over that pixel and
 * multiply each kernel element with the matching pixel under it.
 * The sum of the multiplications is then set to the current pixel. The new pixel value must be clamped at 0-255.
 *
 * For the border region, the kernel will be not be fully overlapping the image, and your indexes will go out of bounds.
 * You can ignore pixels that are out of image bounds in those cases. This means, the edges of the convoluted image will
 * not be perfect and lose pixel intensity (but we don't care about this).
 *
 * @param {number[]} im Flat image data. The array length is width * height.
 * @param {number} width width of the image
 * @param {number} height height of the image
 * @param {number[][]} kernel 2d array with uneven size (e.g. 1x1, 3x3, 5x5, ...)
 * @return {number[]} a new array containing the convolution result (do not modify the input image)
 */
function convolution(im, width, height, kernel) {
    const kernelSize = (kernel.length - 1) / 2;
    const result = [];

    // iterate over each image pixel
    for (let row = 0; row < height; row++) {
        for (let column = 0; column < width; column++) {

            let accumulator = 0;

            // iterate over each kernel element
            for (let kernelRow = -kernelSize; kernelRow <= kernelSize; kernelRow++) {
                for (let kernelCol = -kernelSize; kernelCol <= kernelSize; kernelCol++) {
                    const kernelIndex = ((row + kernelRow) * width + (column + kernelCol));

                    // check if we are within bounds
                    if (row + kernelRow >= 0 && row + kernelRow < height && column + kernelCol >= 0 && column + kernelCol < width) {
                        // do the multiplication
                        accumulator += im[kernelIndex] * kernel[kernelRow + kernelSize][kernelCol + kernelSize];
                    }
                }
            }

            // set new pixel value
            const index = (row * width + column);
            result[index] = Math.max(0, Math.min(accumulator, 255));
        }
    }
    return result;
}
