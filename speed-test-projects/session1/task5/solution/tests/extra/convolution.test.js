describe('Extra', () => {
    describe('convolution', () => {

        it('1d identity kernel, 2d image', () => {
            const image = [25, 25, 25, 25, 25, 25, 25, 25, 28];
            const convolutedImage = convolution(
                image,
                3,
                3,
                [[1]]
            );
            expect(convolutedImage).to.not.equal(image);
            expect(convolutedImage).to.eql([25, 25, 25, 25, 25, 25, 25, 25, 28]);
        });

        it('1d identity kernel, non symmetric image', () => {
            const image = [1, 2, 3, 4, 5, 6];
            const convolutedImage = convolution(
                image,
                3,
                2,
                [[1]]
            );
            expect(convolutedImage).to.not.equal(image);
            expect(convolutedImage).to.eql([1, 2, 3, 4, 5, 6]);
        });

        it('1d manipulation kernels', () => {
            const image = [3, 3, 3, 3];
            const convolutedImage = convolution(
                image,
                4,
                1,
                [[3]]
            );
            expect(convolutedImage).to.not.equal(image);
            expect(convolutedImage).to.eql([9, 9, 9, 9]);
        });

        it('1d clamping 0-255', () => {
            const image1 = [125, 240, 100, 100];
            const convolutedImage1 = convolution(
                image1,
                2,
                2,
                [[2]]
            );
            expect(convolutedImage1).to.not.equal(image1);
            expect(convolutedImage1).to.eql([250, 255, 200, 200]);
            const image2 = [250, 0, 50, 25];
            const convolutedImage2 = convolution(
                image2,
                2,
                2,
                [[-1]]
            );
            expect(convolutedImage2).to.not.equal(image2);
            expect(convolutedImage2).to.eql([0, 0, 0, 0]);
        });

        it('3d 2x kernel', () => {
            const image = [6, 5, 4, 3, 2, 1];
            const convolutedImage = convolution(
                image,
                3,
                2,
                [
                    [0, 0, 0],
                    [0, 1, 0],
                    [0, 0, 0],
                ]
            );
            expect(convolutedImage).to.not.equal(image);
            expect(convolutedImage).to.eql([6, 5, 4, 3, 2, 1]);
        });

        it('3d manipulation kernels', () => {
            const image = ('' +
                '                                           ' +
                '#######                                    ' +
                '#        ####   ####  #####    ##   #####  ' +
                '#       #    # #    # #    #  #  #  #    # ' +
                '#####   #    # #    # #####  #    # #    # ' +
                '#       #    # #    # #    # ###### #####  ' +
                '#       #    # #    # #    # #    # #   #  ' +
                '#        ####   ####  #####  #    # #    # ').split('').map(c => c === '#' ? 100 : 0)

            const height = 8;
            const width = image.length / height;

            expect(convolution(
                image,
                width,
                height,
                [
                    [1, 0, -1],
                    [2, 0, -2],
                    [1, 0, -1],
                ]
            )).to.eql([
                0, 0, 0, 0, 0, 0, 100, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 100, 0, 0, 0, 0, 200, 200, 0, 0, 0, 0, 100, 100, 0, 0, 0, 0, 0, 100, 100, 0, 0, 0, 0, 0, 100, 100, 0, 0, 0, 0, 100, 100, 0, 0, 0, 0, 0, 0, 100, 100, 0,
                0, 255, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 100, 200, 0, 0, 0, 0, 0, 100, 200, 0, 0, 100, 0, 0, 100, 200, 100, 0, 0, 0, 100, 200, 100, 0, 0, 100, 0, 0, 100, 200, 100,
                0, 255, 0, 0, 100, 100, 0, 0, 0, 200, 0, 0, 0, 100, 0, 0, 200, 0, 0, 0, 100, 0, 0, 200, 0, 0, 0, 200, 100, 0, 0, 100, 0, 0, 200, 0, 0, 255, 0, 0, 0, 100, 255,
                0, 200, 0, 0, 200, 200, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 200, 0, 0, 0, 200, 0, 0, 200, 100, 0, 0, 200, 0, 0, 255, 0, 0, 0, 100, 255,
                0, 255, 0, 0, 100, 100, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 100, 0, 0, 200, 0, 0, 0, 200, 0, 0, 200, 0, 0, 100, 255, 100,
                0, 255, 0, 0, 0, 0, 0, 0, 0, 200, 0, 0, 0, 100, 0, 0, 200, 0, 0, 0, 100, 0, 0, 255, 0, 0, 0, 100, 0, 0, 255, 0, 0, 0, 100, 0, 0, 255, 0, 0, 0, 255, 100,
                0, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 200, 0, 0, 0, 0, 0, 100, 200, 0, 0, 100, 0, 0, 100, 200, 0, 0, 255, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 100, 200
            ]);
        });
    })
});
