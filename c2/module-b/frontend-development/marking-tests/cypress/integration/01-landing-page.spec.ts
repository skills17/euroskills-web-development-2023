import {
    concert1,
    concert1Show1,
    concert1Show2,
    concert2,
    concert2Show1,
    concert2Show2,
    concert3,
    concert3Show1,
    concert4,
    concert4Show1,
    concertsMockResponse,
    seatingMockResponse
} from "../support/fixtures";
import {expectShow} from "../support/util";

describe('01 Landing Page', () => {
    let callCount = 0;
    beforeEach(() => {
        callCount = 0;
        cy.intercept({method: 'GET', url: /.+\/api\/v1\/concerts$/}, req => {
            callCount++;
            req.reply(concertsMockResponse);
        });
        cy.intercept({method: 'GET', url: /.+\/api\/v1\/concerts\/\d+\/shows\/\d+\/seating$/}, seatingMockResponse);
        cy.visit('/');
    });

    it('Contains header', () => {
        cy.contains('EuroSkills Concerts').should('be.visible');
        cy.contains('Already booked?').should('be.visible');
        cy.contains('Get Tickets').should('be.visible');
    });

    it('Shows page title', () => {
        cy.contains('Checkout these amazing concerts in Graz.').should('be.visible');
    });

    function expectAllShows() {
        cy.log('💬 expecting all shows to be present');
        cy.get('.card').should('have.length', 6, 'There should be 6 .card elements');
        expectShow(0, concert2Show1, concert2);
        expectShow(1, concert1Show1, concert1);
        expectShow(2, concert1Show2, concert1);
        expectShow(3, concert2Show2, concert2);
        expectShow(4, concert4Show1, concert4);
        expectShow(5, concert3Show1, concert3);
    }

    it('Contains all shows sorted by start time', () => {
        expectAllShows();
    });

    it('Navigate to show: Only makes one request to fetch concerts', () => {
        cy.get('.card').eq(0).children('.artist').click();
        expectShow(0, concert2Show1, concert2);
        cy.go('back');
        expectAllShows();
        cy.wrap(callCount).then(() => {
            expect(callCount).to.be.eq(1, 'The calls to the /api/v1/concerts endpoint should be exactly 1');
        });
    });

    describe('Filters', () => {
        describe('Artists', () => {
            it('Basic', () => {
                cy.contains('select', concert1.artist).should('have.length', 1);
                cy.contains('select', concert2.artist).should('have.length', 1);
                cy.contains('select', concert3.artist).should('have.length', 1);
                cy.contains('select', concert4.artist).should('have.length', 1);
            });

            it('Select artist', () => {
                [...new Set(concertsMockResponse.concerts.map(c => c.artist)).values()].forEach(artistName => {
                    cy.log(`Selecting "${artistName}"`);
                    // select artist
                    cy.contains('All Artists').parent().select(artistName)
                    // expect correct shows
                    concertsMockResponse.concerts
                        .filter(c => c.artist === artistName)
                        .flatMap(c => c.shows.map(show => ({concert: c, show: show})))
                        .sort((a, b) => a.show.start.localeCompare(b.show.start))
                        .forEach(({show, concert}, index) => {
                            expectShow(index, show, concert);
                        });
                    // expect not matching shows to be hidden
                    concertsMockResponse.concerts
                        .filter(c => c.artist !== artistName)
                        .forEach(otherConcerts => {
                            cy.contains('.card:visible', otherConcerts.artist).should('not.exist');
                        });
                    // clear filter
                    cy.contains('Clear').click();
                    // expect all shows
                    expectAllShows();
                });
            });
        });

        describe('Locations', () => {
            it('Basic', () => {
                cy.contains('select', concert1.location.name).should('have.length', 1);
                cy.contains('select', concert2.location.name).should('have.length', 1);
                cy.contains('select', concert3.location.name).should('have.length', 1);
                cy.contains('select', concert4.location.name).should('have.length', 1);
            });

            it('Select location', () => {
                [...new Set(concertsMockResponse.concerts.map(c => c.location.name)).values()].forEach(locationName => {
                    cy.log(`Selecting "${locationName}"`);
                    // select location
                    cy.contains('All Locations').parent().select(locationName)
                    // expect correct shows
                    concertsMockResponse.concerts
                        .filter(c => c.location.name === locationName)
                        .flatMap(c => c.shows.map(show => ({concert: c, show: show})))
                        .sort((a, b) => a.show.start.localeCompare(b.show.start))
                        .forEach(({show, concert}, index) => {
                            expectShow(index, show, concert);
                        });
                    // expect not matching shows to be hidden
                    concertsMockResponse.concerts
                        .filter(c => c.location.name !== locationName)
                        .forEach(otherConcerts => {
                            cy.contains('.card:visible', otherConcerts.location.name).should('not.exist');
                        });
                    // clear filter
                    cy.contains('Clear').click();
                    // expect all shows
                    expectAllShows();
                });
            });
        });

        it('Date', () => {
            // select date
            cy.get('input[type=date]').type('2021-10-20');
            cy.contains('No shows are matching the current filter criteria.').should('be.visible');

            cy.get('input[type=date]').type(concert3Show1.start.substring(0, 10));
            expectShow(0, concert3Show1, concert3);
            cy.contains('.card:visible', concert2Show2.start.substring(11, 16)).should('not.exist');
            concertsMockResponse.concerts
                .filter(concert => concert.location.name !== concert3.location.name)
                .forEach(concert => cy.contains('.card:visible', concert.location.name).should('not.exist'));
            concertsMockResponse.concerts
                .filter(concert => concert.artist !== concert3.artist)
                .forEach(concert => cy.contains('.card:visible', concert.artist).should('not.exist'));

            // clear filter
            cy.contains('Clear').click();
            // expect all shows
            expectAllShows();
        });
    })
});
