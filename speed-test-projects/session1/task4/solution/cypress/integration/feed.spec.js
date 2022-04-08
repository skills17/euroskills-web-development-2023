/// <reference types="Cypress" />

context('Task 4', () => {
    const gap = 24;

    [
        {viewportWidth: 1000, viewportHeight: 800},
        {viewportWidth: 700, viewportHeight: 800},
    ].forEach(({viewportWidth, viewportHeight}) => {

        describe(`Viewport ${viewportWidth}x${viewportHeight}`, () => {

            let bodyRect;
            let horizontalMargin;
            let containerWidth;

            beforeEach(() => {
                cy.viewport(viewportWidth, viewportHeight);
                cy.visit('/');
                cy.get('body').then(el => {
                    bodyRect = el.get(0).getBoundingClientRect();
                    containerWidth = Math.min(850, bodyRect.width - (2 * gap));
                    horizontalMargin = (bodyRect.width - containerWidth) / 2;
                });
            });

            it('has correctly positioned header', () => {
                cy.get('.header').then(el => {
                    const {top, right, left, width, height} = el.get(0).getBoundingClientRect();
                    expect(top).to.be.closeTo(0, 1, 'expected header to start at top');
                    expect(width).to.be.closeTo(containerWidth, 1, 'expected width of header to be 850px');
                    expect(height).to.be.closeTo(100, 1, 'expected height of header to be 100px');
                    const horizontalMargin = (bodyRect.width - width) / 2;
                    expect(left).to.be.closeTo(horizontalMargin, 1, 'expected left to be half of the body width minus header width');
                    expect(right).to.be.closeTo(bodyRect.width - horizontalMargin, 1, 'expected right to be body width minus horizontal header margin');
                });
                cy.contains('.header h1', 'EuroSkills - Feed - Task 4').should('be.visible');
                cy.get('.header h1').then(el => {
                    const {top, right, left, bottom} = el.get(0).getBoundingClientRect();
                    expect(right).to.be.closeTo(bodyRect.width - left, 1, 'expected left and right to be equally distant to outer box');
                    expect(bottom).to.be.closeTo(100 - top, 1, 'expected top and bottom to be equally distant to outer box');
                });
            });

            it('has correctly positioned Trends box', () => {
                cy.get('.left').then(el => {
                    const {top, left, width} = el.get(0).getBoundingClientRect();
                    expect(top).to.be.closeTo(100 + gap, 1, 'expected top to be the height of header (100px) plus gap (24px)');
                    expect(width).to.be.closeTo((containerWidth - gap) / 3, 1, 'expected width to be 1/3 of container (minus gap)');
                    expect(left).to.be.closeTo(horizontalMargin, 1, 'expected left to be half of the body width minus header width');
                });
            });

            it('has correctly positioned post feed', () => {
                const oneThirdsWidth = (containerWidth - gap) / 3;
                const twoThirdsWidth = 2 * oneThirdsWidth;
                let whatsHappeningHeight;
                let linusPostHeight;
                cy.get('.card:nth-child(1)').then(el => {
                    const {top, left, width, height} = el.get(0).getBoundingClientRect();
                    whatsHappeningHeight = height;
                    expect(top).to.be.closeTo(100 + gap, 1, 'expected top to be the height of header (100px) plus gap (24px)');
                    expect(width).to.be.closeTo(twoThirdsWidth, 1, 'expected width to be 2/3 of container (minus gap)');
                    expect(height).to.be.greaterThan(40, 'expected card to have a certain height');
                    expect(left).to.be.closeTo(horizontalMargin + oneThirdsWidth + gap, 1, 'expected left to be half of the body width minus header width');
                });
                cy.get('.card:nth-child(2)').then(el => {
                    const {top, width, height} = el.get(0).getBoundingClientRect();
                    linusPostHeight = height;
                    expect(top).to.be.closeTo(100 + gap + whatsHappeningHeight + gap, 1, 'expected top to be below the first card plus gap (24px)');
                    expect(width).to.be.closeTo(twoThirdsWidth, 1, 'expected width to be 2/3 of container (minus gap)');
                    expect(height).to.be.greaterThan(100, 'expected card to have a certain height');
                });
                cy.get('.card:nth-child(3)').then(el => {
                    const {top, width, height} = el.get(0).getBoundingClientRect();
                    expect(top).to.be.closeTo(100 + gap + whatsHappeningHeight + gap + linusPostHeight + gap, 1, 'expected top to be below the first card plus gap (24px)');
                    expect(width).to.be.closeTo(twoThirdsWidth, 1, 'expected width to be 2/3 of container (minus gap)');
                    expect(height).to.be.greaterThan(100, 'expected card to have a certain height');
                });
            });
        });

    });
});
