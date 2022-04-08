/// <reference types="cypress" />

context('Task 7', () => {
    const viewportWidth = 1300;
    const viewportHeight = 900;

    beforeEach(() => {
        cy.visit('/');
        cy.viewport(viewportWidth, viewportHeight);
    });

    it('header vertical alignment', () => {
        cy.get('header').top().should('be.closeTo', 0, 1, 'expected header to start at top');
        cy.get('header').left().should('be.closeTo', 0, 1, 'expected header to start at left');
        cy.get('header').width().should('be.closeTo', viewportWidth, 20, 'expected header to have the full window width');
        cy.get('header h1').top().should('be.closeTo', 12, 1, 'expected header logo to have a margin of 12px');
        cy.get('header h1').left().should('be.closeTo', 12, 1, 'expected header logo to have a margin of 12px');
        cy.get('header h1').height().should('be.closeTo', 75, 5, 'expected header logo to have a height of 75px');

        cy.get('header h1').then(el => {
            const { top, height } = el.get(0).getBoundingClientRect();
            const expectedMiddle = top + height / 2;

            cy.get('header nav').contains('News').then(news => {
                const { top: newsTop, height: newsHeight } = news.get(0).getBoundingClientRect();
                expect(newsTop + newsHeight / 2).to.be.closeTo(expectedMiddle, 1, 'expected news menu item to be vertically aligned');
            });

            cy.get('header nav').contains('People').then(people => {
                const { top: peopleTop, height: peopleHeight } = people.get(0).getBoundingClientRect();
                expect(peopleTop + peopleHeight / 2).to.be.closeTo(expectedMiddle, 1, 'expected people menu item to be vertically aligned');
            });

            cy.get('header nav').contains('Gadgets').then(gadgets => {
                const { top: gadgetsTop, height: gadgetsHeight } = gadgets.get(0).getBoundingClientRect();
                expect(gadgetsTop + gadgetsHeight / 2).to.be.closeTo(expectedMiddle, 1, 'expected gadgets menu item to be vertically aligned');
            });

            cy.get('header nav').contains('World').then(world => {
                const { top: worldTop, height: worldHeight } = world.get(0).getBoundingClientRect();
                expect(worldTop + worldHeight / 2).to.be.closeTo(expectedMiddle, 1, 'expected world menu item to be vertically aligned');
            });
        });
    });

    it('header horizontal spacing', () => {
        cy.get('header h1').left().should('be.closeTo', 12, 1, 'expected header logo to have a margin of 12px');
        cy.get('header nav').contains('World').right().should('be.closeTo', viewportWidth - 12, 1, 'expected world menu item to be at the right with a margin of 12px');

        cy.get('header nav').contains('World').then(world => {
            const { left: worldLeft, right: worldRight } = world.get(0).getBoundingClientRect();
            expect(worldRight).to.be.closeTo(viewportWidth - 12, 1, 'expected world menu item to be at the right with a margin of 12px');

            cy.get('header nav').contains('Gadgets').then(gadgets => {
                const { left: gadgetsLeft, right: gadgetsRight } = gadgets.get(0).getBoundingClientRect();
                expect(gadgetsRight).to.be.closeTo(worldLeft - 12, 1, 'expect menu items to have a spacing of 12px');

                cy.get('header nav').contains('People').then(people => {
                    const { left: peopleLeft, right: peopleRight } = people.get(0).getBoundingClientRect();
                    expect(peopleRight).to.be.closeTo(gadgetsLeft - 12, 1, 'expect menu items to have a spacing of 12px');

                    cy.get('header nav').contains('News').then(news => {
                        const { left: newsLeft, right: newsRight } = news.get(0).getBoundingClientRect();
                        expect(newsRight).to.be.closeTo(peopleLeft - 12, 1, 'expect menu items to have a spacing of 12px');

                        expect(newsLeft).to.be.closeTo(908, 25, 'expect space between logo and news menu item');
                    });
                });
            });
        });
    });

    it('body has full height', () => {
        cy.get('body').then(el => {
            expect(el.get(0).scrollHeight).to.be.closeTo(viewportHeight, 1, 'expect website to have the same height as the window');
        });
    });

    it('news card positioning', () => {
        cy.get('.news .card').then(news => {
            const { left: mainLeft, top: mainTop, right: mainRight, bottom: mainBottom, width: mainWidth, height: mainHeight } = news.get(0).getBoundingClientRect();
            const { left: sideLeft, top: sideTop, right: sideRight, bottom: sideBottom, width: sideWidth, height: sideHeight } = news.get(1).getBoundingClientRect();
            const { left: small1Left, top: small1Top, right: small1Right, bottom: small1Bottom, width: small1Width, height: small1Height } = news.get(2).getBoundingClientRect();
            const { left: small2Left, top: small2Top, right: small2Right, bottom: small2Bottom, width: small2Width, height: small2Height } = news.get(3).getBoundingClientRect();

            // sizes relative to others
            expect(sideWidth).to.be.closeTo(mainWidth, 13, 'expect both columns to have the same width');
            expect(small1Width).to.be.closeTo(sideWidth / 2, 13, 'expect small news to have half width of the big news');
            expect(small2Width).to.be.closeTo(sideWidth / 2, 13, 'expect small news to have half width of the big news');
            expect(small1Height).to.be.closeTo(mainHeight / 3, 13, 'expect small news to have 1/3 height of big news');
            expect(small2Height).to.be.closeTo(mainHeight / 3, 13, 'expect small news to have 1/3 height of big news');
            expect(sideHeight).to.be.closeTo(mainHeight / 3 * 2, 13, 'expect side news to have 2/3 height of big news');

            // main news positioning
            expect(mainLeft).to.be.closeTo(12, 1, 'expect main news to be at the left');
            expect(mainRight).to.be.closeTo(viewportWidth / 2, 13, 'expect main news to use half of the screen width');
            expect(mainTop).to.be.closeTo(99, 13, 'expect main news to start below header');
            expect(mainBottom).to.be.closeTo(viewportHeight - 12, 1, 'expect main news to use full height');

            // side news positioning
            expect(sideLeft).to.be.closeTo(viewportWidth / 2, 13, 'expect side news to start from the middle');
            expect(sideRight).to.be.closeTo(viewportWidth - 12, 1, 'expect side news to use half of the screen width');
            expect(sideTop).to.be.closeTo(99, 13, 'expect main news to start below header');
            expect(sideBottom).to.be.closeTo((viewportHeight - 99) / 3 * 2 + 99, 25, 'expect main news to use 2/3 of the screen height');

            // small news 1 positioning
            expect(small1Left).to.be.closeTo(viewportWidth / 2, 13, 'expect left small news to start from the middle');
            expect(small1Right).to.be.closeTo(viewportWidth / 4 * 3, 13, 'expect left small news to use 1/4 of the screen width');
            expect(small1Top).to.be.closeTo((viewportHeight - 99) / 3 * 2 + 99, 25, 'expect left small news to start below side news');
            expect(small1Bottom).to.be.closeTo(viewportHeight - 12, 1, 'expect left small news to use 1/3 of the screen height');

            // small news 2 positioning
            expect(small2Left).to.be.closeTo(viewportWidth / 4 * 3, 13, 'expect right small news to start right of the left small news');
            expect(small2Right).to.be.closeTo(viewportWidth - 12, 1, 'expect right small news to use 1/4 of the screen width');
            expect(small2Top).to.be.closeTo((viewportHeight - 99) / 3 * 2 + 99, 25, 'expect right small news to start below side news');
            expect(small2Bottom).to.be.closeTo(viewportHeight - 12, 1, 'expect right small news to use 1/3 of the screen height');
        });
    });

    it('news info text positioning', () => {
        cy.get('.news .card').then(el => {
            for (let i = 0; i < 4; i++) {
                const { bottom: cardBottom, width: cardWidth } = el.get(i).getBoundingClientRect();
                const { bottom: infoBottom, width: infoWidth } = el.get(i).querySelector('.info').getBoundingClientRect();
                const { top: dateTop, bottom: dateBottom, height: dateHeight } = el.get(i).querySelector('.info .date').getBoundingClientRect();
                const { top: titleTop, bottom: titleBottom, height: titleHeight } = el.get(i).querySelector('.info h2').getBoundingClientRect();
                const { bottom: tagBottom, height: tagHeight } = el.get(i).querySelector('.info .tag').getBoundingClientRect();

                expect(cardWidth).to.be.lessThan(viewportWidth / 2);
                expect(infoWidth).to.be.closeTo(cardWidth, 1, 'expect info overlay to have the same width as the card');
                expect(infoBottom).to.be.closeTo(cardBottom, 1, 'expect info text to be at the bottom of the card');
                expect(dateBottom).to.be.closeTo(infoBottom - 12, 1, 'expect date to be at the bottom of the card');
                expect(titleBottom).to.be.closeTo(dateTop - 12, 1, 'expect title to be above the date');
                expect(tagBottom).to.be.closeTo(titleTop - 12, 1, 'expect tag to be above the title');
                expect(tagHeight).to.be.closeTo(39, 5, 'expect tag to have a height of 39px');
                expect(titleHeight).to.be.greaterThan(20, 'expect title to have a certain height');
                expect(titleHeight).to.be.lessThan(100, 'expect title height to be dynamic');
                expect(dateHeight).to.be.closeTo(27, 5, 'expect date to have a height of 27px');
            }
        });
    });
});
