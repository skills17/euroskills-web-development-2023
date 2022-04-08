/// <reference types="Cypress" />

describe('Accessibility', () => {
    let violations = [];

    before(() => {
        cy.visit('');
        cy.injectAxe();
        cy.checkA11y(undefined, undefined, vio => {
            violations = vio;
            if (vio.length > 0) {
                cy.log(`⚠️⚠️ There are ${vio.length} accessibility violations found. Check the console log in the browser Dev Tools. ⚠️⚠️`);
                console.log('Accessibility violations:', vio);
            } else {
                cy.log(`No accessibility violations found. Good job!`);
            }
        }, true);
    });

    for (let i = 3; i >= 1; i--) {
        it(`has less than ${i} violation${i !== 1 ? 's' : ''}`, () => {
            expect(violations.length).to.be.lessThan(i, `Too many violations found. Check the Dev Tools console (F12) to see more details.`);
        });
    }
});

describe('HTML & CSS Validation', () => {
    let violations = [];

    before(() => {
        cy.visit('');
        violations = [];
        let validationUrls = [{ url: Cypress.config().baseUrl, type: 'html' }];

        cy.document().then(doc => {
            doc.querySelectorAll('link[rel="stylesheet"],link[type$="css"]').forEach(el => {
                if (el.sheet) {
                    validationUrls.push({ url: el.sheet.href, type: 'css' });
                    cy.log(`Validation URLs1:\n${validationUrls.join('\n')}`);
                }
            });
        }).then(() => {
            validationUrls.forEach(url => {
                cy.task('validateFile', url).then(vio => {
                    if (vio === null) {
                        cy.log(`⚠️⚠️ HTML & CSS Validation cannot run for ${url.url}! Please check the terminal output for more information.`);
                    } else if (vio.length > 0) {
                        violations = [...violations, ...vio];
                        cy.log(`⚠️⚠️ There are ${vio.length} HTML & CSS violations found for ${url.url}. Check the console log in the browser Dev Tools. ⚠️⚠️`);
                        console.log(`HTML & CSS violations for ${url.url}:`, vio);
                    }
                });
            });
        });
    });


    for (let i = 3; i >= 1; i--) {
        it(`has less than ${i} violation${i !== 1 ? 's' : ''}`, () => {
            if (violations === null) {
                expect(true).to.equal(false, '⚠️⚠️ HTML & CSS Validation cannot run! Please check the terminal output for more information');
            } else {
                expect(violations.length).to.be.lessThan(i, `Too many violations found. Check the Dev Tools console (F12) to see more details.`);
            }
        });
    }
});
