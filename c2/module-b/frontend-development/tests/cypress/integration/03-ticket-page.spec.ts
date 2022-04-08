import {concertsMockResponse, ticketsMockResponse} from "../support/fixtures";
import {expectShow} from "../support/util";

describe('03 Ticket Page', () => {
    beforeEach(() => {
        cy.intercept({method: 'GET', url: /.+\/api\/v1\/concerts$/}, concertsMockResponse);
        cy.intercept({method: 'POST', url: /.+\/api\/v1\/tickets$/}, ticketsMockResponse);
        cy.intercept({method: 'POST', url: /.+\/api\/v1\/tickets\/1\/cancel$/}, {}).as('post-cancel-1');
        cy.intercept({method: 'POST', url: /.+\/api\/v1\/tickets\/2\/cancel$/}, {}).as('post-cancel-2');
        cy.visit('/');
    });

    it('Ticket Form', () => {
        cy.contains('Get Tickets').click();
        cy.contains('Retrieve your tickets.').should('be.visible');

        cy.get('.validated :invalid').should('have.length', 0);
        cy.get('button[type=submit]').click();
        cy.get('.validated :invalid').should('have.length', 2);

        cy.contains('label', 'Name').click();
        cy.focused().type('myname');
        cy.contains('label', 'Code').click();
        cy.focused().type('mycode');

        cy.get('button[type=submit]').click();

        cy.contains('Your Tickets are ready!').should('be.visible');
        cy.contains('Your Details').should('be.visible');
        cy.contains('Name').should('be.visible');
        cy.contains('Booked on').should('be.visible');

        cy.contains(ticketsMockResponse.tickets[0].name).should('be.visible');
        cy.contains(ticketsMockResponse.tickets[0].created_at.substring(0, 10).split('-').reverse().join('/')).should('be.visible');

        expectShow(0, ticketsMockResponse.tickets[0].show, ticketsMockResponse.tickets[0].show.concert!);
        expectShow(1, ticketsMockResponse.tickets[0].show, ticketsMockResponse.tickets[0].show.concert!);

        ticketsMockResponse.tickets.forEach((ticket, index) => {
            cy.get('.ticket').eq(index).contains(ticket.code).should('be.visible');
            cy.get('.ticket').eq(index).contains(`Row: ${ticket.row.name}`).should('be.visible');
            cy.get('.ticket').eq(index).contains(`Seat: ${ticket.seat}`).should('be.visible');
            cy.get('.ticket').eq(index).contains('button', 'Cancel Ticket').should('be.visible');
        });
    });

    it('Cancel Ticket', () => {
        cy.contains('Get Tickets').click();

        cy.contains('label', 'Name').click();
        cy.focused().type('myname');
        cy.contains('label', 'Code').click();
        cy.focused().type('mycode');

        cy.get('button[type=submit]').click();

        cy.contains(ticketsMockResponse.tickets[0].code).should('be.visible');
        cy.get('.ticket').eq(0).contains('button', 'Cancel Ticket').click();
        cy.on('window:confirm', () => true);

        cy.wait('@post-cancel-1').its('request.body').should(interception => {
            expect(interception).to.deep.eq({name: 'myname', code: 'stubbed_code1'});
        });

        cy.contains(ticketsMockResponse.tickets[0].code).should('not.exist');
        cy.get('.ticket').eq(0).contains('button', 'Cancel Ticket').click();

        cy.wait('@post-cancel-2').its('request.body').should(interception => {
            expect(interception).to.deep.eq({name: 'myname', code: 'stubbed_code2'});
        });

        // once the last ticket is cancelled, should be routed to landing page
        cy.contains('Checkout these amazing concerts in Graz.').should('be.visible');
    });
});
