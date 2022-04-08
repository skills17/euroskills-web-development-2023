/// <reference types="Cypress" />

context('Task 4', () => {
    describe('Accessibility', () => {

        let violations = [];

        before(() => {
            cy.visit('/');
            cy.injectAxe();
            cy.checkA11y(undefined, undefined, vio => {
                violations = vio;
                if (vio.length > 0) {
                    cy.log(`⚠️⚠️ There are ${vio.length} violations to be fixed. Check the console log in the browser Dev Tools. ⚠️⚠️`);
                    console.log('Accessibility violations to be fixed:', vio);
                } else {
                    cy.log(`No violations remaining. Good job!`);
                }
            }, true);
        });

        const violationsToBeFixed = [
            'button-name',
            'color-contrast',
            'label',
            'html-lang-valid',
            'page-has-heading-one',
            'heading-order',
            'document-title',
            'image-alt',
        ];

        violationsToBeFixed.forEach(violation => {
            it(`Violation ID: ${violation}`, () => {
                const matchingViolations = violations.filter(vio => vio.id === violation)
                const help = matchingViolations.length > 0 ? matchingViolations[0].help : ''
                const description = matchingViolations.length > 0 ? matchingViolations[0].description : ''

                expect(matchingViolations.length).to.equal(0, `${help}. ${description}. Violation "${violation}" should not be found. Check the Dev Tools console (F12) to see more details.`);
            });
        });

        it('Check no new violations occur', () => {
            const remainingViolations = violations.filter(vio => !violationsToBeFixed.includes(vio.id));
            if (remainingViolations.length > 0) {
                console.log('Newly introduced Axe Violations which were not there before:', remainingViolations);
            }
            expect(remainingViolations.length).to.equal(0);
        });
    });

    describe('Regression Testing', () => {
        // These test cases ensure the page is as functional as before and still looks the same.
        // I.e. the competitor could theoretically just remove the markup, or replace it with an image.

        beforeEach(() => {
            cy.visit('/');
        });

        it('Check the same elements are still there', () => {
            cy.get('*').then(el => {
                expect(el.length).to.be.greaterThan(71);
            });
            cy.contains('EuroSkills - Accessibility - Task 4').should('be.visible');
            cy.contains('Trends').should('be.visible');
            cy.contains('Hashtags').should('be.visible');
            cy.contains('People').should('be.visible');
            cy.contains('Linus Torvalds').should('be.visible');
            cy.contains('Tim Berners Lee').should('be.visible');
            cy.get('input').type('My post');
        });

        it('Visual regression', () => {
            cy.matchImageSnapshot({
                failureThresholdType: 'percent',
                failureThreshold: 0.01, // threshold for entire image (do not allow moved or resized elements)
                customDiffConfig: {threshold: 0.1} // threshold for each pixel (allow small color differences)
            });
        });
    });
});
