describe('convolution', () => {

    it('1d identity kernel, 2d image', () => {
        const image = [1, 1, 1, 1];
        const kernel = [[1]];
        const convolutedImage = convolution(
            image,
            2,
            2,
            kernel
        );
        expect(convolutedImage).to.not.equal(image);
        expect(convolutedImage).to.eql([1, 1, 1, 1]);
    });

    it('1d identity kernel, non symmetric image', () => {
        const image = [1, 2, 3, 4, 5, 6];
        const kernel = [[1]];
        const convolutedImage = convolution(
            image,
            2,
            3,
            kernel
        );
        expect(convolutedImage).to.not.equal(image);
        expect(convolutedImage).to.eql([1, 2, 3, 4, 5, 6]);
    });

    it('1d manipulation kernels', () => {
        const image = [1, 1, 1];
        const kernel = [[2]];
        const convolutedImage = convolution(
            image,
            3,
            1,
            kernel
        );
        expect(convolutedImage).to.not.equal(image);
        expect(convolutedImage).to.eql([2, 2, 2]);
    });

    it('1d clamping 0-255', () => {
        const image1 = [100, 200, 100, 100];
        const kernel1 = [[2]];
        const convolutedImage1 = convolution(
            image1,
            2,
            2,
            kernel1
        );
        expect(convolutedImage1).to.not.equal(image1);
        expect(convolutedImage1).to.eql([200, 255, 200, 200]);

        const image2 = [100, 200, 100, 100];
        const kernel2 = [[-1]];
        const convolutedImage2 = convolution(
            image2,
            2,
            2,
            kernel2
        );
        expect(convolutedImage2).to.not.equal(image2);
        expect(convolutedImage2).to.eql([0, 0, 0, 0]);
    });

    it('3d 2x kernel', () => {
        const image = [1, 2, 3, 4, 5, 6];
        const kernel = [
            [0, 0, 0],
            [0, 2, 0],
            [0, 0, 0],
        ];
        const convolutedImage = convolution(
            image,
            2,
            3,
            kernel
        );
        expect(convolutedImage).to.not.equal(image);
        expect(convolutedImage).to.eql([2, 4, 6, 8, 10, 12]);
    });

    it('3d manipulation kernels', () => {
        const image = ('' +
            '#     #                            ' +
            '#     # ###### #      #       #### ' +
            '#     # #      #      #      #    #' +
            '####### #####  #      #      #    #' +
            '#     # #      #      #      #    #' +
            '#     # #      #      #      #    #' +
            '#     # ###### ###### ######  #### ').split('').map(c => c === '#' ? 100 : 0)

        const height = 7;
        const width = image.length / height;

        const kernel = [
            [1, 0, -1],
            [2, 0, -2],
            [1, 0, -1],
        ];
        const convolutedImage = convolution(
            image,
            width,
            height,
            kernel
        );
        expect(convolutedImage).to.eql([
            0, 255, 0, 0, 0, 0,   0, 200, 0,   0, 0, 0,   0, 100, 0, 0, 100, 0, 0, 0,   0, 0, 0, 100, 0, 0, 0,   0,   0, 0,   0, 0, 0, 100, 100,
            0, 255, 0, 0, 0, 0,   0, 100, 0, 100, 0, 0,   0, 200, 0, 0, 255, 0, 0, 0,   0, 0, 0, 255, 0, 0, 0,   0,   0, 0,   0, 0, 0, 100, 200,
            0, 255, 0, 0, 0, 0, 100,   0, 0, 200, 0, 0, 100, 200, 0, 0, 255, 0, 0, 0,   0, 0, 0, 255, 0, 0, 0,   0,   0, 0, 200, 0, 0,   0, 100,
            0, 200, 0, 0, 0, 0, 200,   0, 0, 200, 0, 0, 200, 200, 0, 0, 255, 0, 0, 0,   0, 0, 0, 255, 0, 0, 0,   0,   0, 0, 255, 0, 0,   0,   0,
            0, 255, 0, 0, 0, 0, 100,   0, 0, 255, 0, 0, 100, 100, 0, 0, 255, 0, 0, 0,   0, 0, 0, 255, 0, 0, 0,   0,   0, 0, 255, 0, 0,   0,   0,
            0, 255, 0, 0, 0, 0,   0,   0, 0, 255, 0, 0,   0, 100, 0, 0, 255, 0, 0, 0, 100, 0, 0, 255, 0, 0, 0, 100,   0, 0, 200, 0, 0,   0, 100,
            0, 255, 0, 0, 0, 0,   0,   0, 0, 100, 0, 0,   0, 200, 0, 0, 100, 0, 0, 0, 200, 0, 0, 100, 0, 0, 0, 200, 100, 0,   0, 0, 0, 100, 200
        ]);
    });
});
