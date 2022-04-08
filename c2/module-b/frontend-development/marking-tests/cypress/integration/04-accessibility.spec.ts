import {concertsMockResponse, seatingMockResponse, ticketsMockResponse} from "../support/fixtures";
import {nextTabbable, simulateTabPress} from "../support/tab";

function checkAxe() {
    cy.checkA11y(undefined, undefined, violations => {
        console.log('Axe Violations:', violations);
        cy.log('Check the console log in dev tools to see violation details');
    });
}

describe('04 Accessibility', () => {
    beforeEach(() => {
        cy.intercept({method: 'GET', url: /.+\/api\/v1\/concerts$/}, concertsMockResponse).as('get-concerts');
        cy.intercept({
            method: 'GET',
            url: /.+\/api\/v1\/concerts\/\d+\/shows\/\d+\/seating$/
        }, seatingMockResponse).as('get-seating');
        cy.intercept({method: 'POST', url: /.+\/api\/v1\/tickets$/}, ticketsMockResponse);
        let notSoon = new Date();
        notSoon.setSeconds(notSoon.getSeconds() + (60 * 5));
        cy.intercept({method: 'POST', url: /.+\/api\/v1\/concerts\/\d+\/shows\/\d+\/reservation$/}, {
            reserved: true,
            reservation_token: 'foobar',
            reserved_until: notSoon.toISOString(),
        });

        cy.visit('/');
        cy.injectAxe();
    });

    describe('axe', () => {
        it('Landing Page', () => {
            cy.contains('Bilderbuch').should('be.visible');
            checkAxe();
        });

        it('Seat Selection', () => {
            cy.get('.card').eq(0).children('.artist').click();
            cy.contains('Book seats for your show').should('be.visible');
            checkAxe();
        });

        it('Booking Form', () => {
            cy.get('.card').eq(0).children('.artist').click();
            cy.get('.seat-available').eq(0).click();
            cy.contains('Enter Booking Details').click();
            cy.contains('Please enter your details').should('be.visible');
            checkAxe();
        });

        it('Ticket Form', () => {
            cy.contains('Get Tickets').click();
            cy.contains('Retrieve your tickets.').should('be.visible');
            checkAxe();
        });

        it('Ticket Page', () => {
            cy.contains('Get Tickets').click();
            cy.contains('Retrieve your tickets.').should('be.visible');

            cy.contains('label', 'Name').click();
            cy.focused().type('myname');
            cy.contains('label', 'Code').click();
            cy.focused().type('mycode');

            cy.get('button[type=submit]').click();

            checkAxe();
        });
    });

    describe('Tab-able', () => {
        it('Logo', () => {
            cy.get('.card').eq(0).children('.artist').click();
            cy.contains('EuroSkills Concerts').type('{enter}');
            // should be back on landing page
            cy.contains('Checkout these amazing concerts in Graz.').should('be.visible');
        });

        it('Get Tickets', () => {
            cy.contains('Get Tickets').type('{enter}');
            cy.contains('Retrieve your tickets.').should('be.visible');
        });

        it('Show', () => {
            cy.log('⬇️ From the first card, find the next tabbable element, click it. ⬇️');
            cy.get('.card').eq(0)
                .then(el => nextTabbable(el))
                .click();
            cy.log('⬇️ Check if show was opened ⬇️');
            cy.contains(':visible', 'Book seats for your show').should('be.visible');
        });

        it('Seats', () => {
            cy.get('.card').eq(0).children('.artist').click();
            cy.get('.seat[data-row="2"][data-seat="1"]').focus();
            simulateTabPress();
            simulateTabPress();
            cy.focused().type('{enter}');
            cy.contains('Row: 02, Seat: 3').should('be.visible');
        });
    });
});
