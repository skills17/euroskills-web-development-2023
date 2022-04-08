import {concert2, concert2Show1, concertsMockResponse, seatingMockResponse, ticketsMockResponse} from "./extraFixtures";
import {expectShow} from "../../support/util";

function stubReservationRequest(expirationSeconds: number) {
    cy.log(`💬 mock reservation response and set it to a ${expirationSeconds} second expiration`);
    cy.intercept({method: 'POST', url: /.+\/api\/v1\/concerts\/\d+\/shows\/\d+\/reservation$/}, req => {
        const now = new Date();
        now.setSeconds(now.getSeconds() + expirationSeconds)
        req.reply({
            reserved: true,
            reservation_token: 'foobar',
            reserved_until: now.toISOString(),
        });
    }).as('post-reservation');
}

context('Extra', () => {
    describe('02 Booking Page', () => {
        beforeEach(() => {
            cy.intercept({method: 'GET', url: /.+\/api\/v1\/concerts$/}, concertsMockResponse).as('get-concerts');
            cy.intercept({
                method: 'GET',
                url: /.+\/api\/v1\/concerts\/\d+\/shows\/\d+\/seating$/
            }, seatingMockResponse).as('get-seating');

            cy.visit('/');
        });

        it('Contains header', () => {
            cy.contains('EuroSkills Concerts');
            cy.contains('Already booked?');
            cy.contains('a', 'Get Tickets').should('be.visible');
        });

        it('Shows necessary texts', () => {
            cy.get('.card').eq(0).children('.artist').click();
            cy.contains('Book seats for your show').should('be.visible');
            cy.contains('Selected Seats').should('be.visible');
            cy.contains('Stage').should('be.visible');
        });

        it('Seat display', () => {
            cy.get('.card').eq(0).children('.artist').click();
            cy.log('💬 check if show is displayed');
            expectShow(0, concert2Show1, concert2);
            cy.get('.seat-selected').should('have.length', 0);
            cy.get('.seat-available').should('have.length', 44);
            cy.get('.seat-unavailable').should('have.length', 1);
            seatingMockResponse.rows.forEach(row => cy.contains(row.name).should('be.visible'));
            cy.contains('No seats selected. Click on a seat to make a reservation.').should('be.visible');
            cy.log('💬 click on unavailable seat should have no effect');
            cy.get('.seat-unavailable').click();
            cy.get('.seat-selected').should('have.length', 0);
            cy.contains('No seats selected. Click on a seat to make a reservation.').should('be.visible');
        });

        it('Seat selection', () => {
            stubReservationRequest(5);

            cy.get('.card').eq(0).children('.artist').click();

            cy.log('💬 make a reservation');
            cy.get('.seat[data-row="1"][data-seat="1"]').click();

            cy.log('💬 assert request body');
            cy.wait('@post-reservation').its('request.body').should(interception => {
                expect(interception).to.deep.eq({reservations: [{row: 1, seat: 1}]});
            });
            cy.get('.seat-selected').should('have.length', 1);
            cy.contains('No seats selected. Click on a seat to make a reservation.').should('not.exist');
            cy.log('💬 check selected seat appears in list');
            cy.contains('Row: 01, Seat: 1').should('be.visible');
            cy.get('.seat[data-row="1"][data-seat="1"]').click();

            cy.log('💬 request should now include token and seats should be empty');
            cy.wait('@post-reservation').its('request.body').should(interception => {
                expect(interception).to.deep.eq({reservation_token: 'foobar', reservations: []});
            });
            cy.get('.seat-selected').should('have.length', 0);
            cy.contains('Row: 01, Seat: 1').should('not.exist');
            cy.get('.seat[data-row="1"][data-seat="1"]').click();
            cy.get('.seat-selected').should('have.length', 1);

            cy.log('💬 select more than one seat');
            cy.get('.seat[data-row="1"][data-seat="3"]').click();
            cy.get('.seat[data-row="1"][data-seat="4"]').click();
            cy.get('.seat[data-row="2"][data-seat="1"]').click();
            cy.get('.seat-selected').should('have.length', 4);
            cy.contains('Row: 01, Seat: 1').should('be.visible');
            cy.contains('Row: 01, Seat: 3').should('be.visible');
            cy.contains('Row: 01, Seat: 4').should('be.visible');
            cy.contains('Row: 02, Seat: 1').should('be.visible');

            cy.contains('button', 'Enter Booking Details').click();
            cy.contains('button', 'Change Seats').click();
            cy.get('.seat-selected').should('have.length', 4);
        });

        it('Timer and expiration (test takes ~10s when passing)', () => {
            stubReservationRequest(5);

            cy.get('.card').eq(0).children('.artist').click();

            cy.log('💬 make a reservation');
            cy.get('.seat[data-row="1"][data-seat="1"]').click();

            cy.log('💬 assert request body');
            cy.wait('@post-reservation').its('request.body').should(interception => {
                expect(interception).to.deep.eq({reservations: [{row: 1, seat: 1}]});
            });
            cy.get('.seat-selected').should('have.length', 1);
            cy.contains('No seats selected. Click on a seat to make a reservation.').should('not.exist');
            cy.log('💬 check selected seat appears in list');
            cy.contains('Row: 01, Seat: 1').should('be.visible');
            cy.get('.seat[data-row="1"][data-seat="1"]').click();

            cy.log('💬 request should now include token and seats should be empty');
            cy.wait('@post-reservation').its('request.body').should(interception => {
                expect(interception).to.deep.eq({reservation_token: 'foobar', reservations: []});
            });
            cy.get('.seat-selected').should('have.length', 0);
            cy.contains('Row: 01, Seat: 1').should('not.exist');
            cy.get('.seat[data-row="1"][data-seat="1"]').click();
            cy.get('.seat-selected').should('have.length', 1);
            cy.contains('Your seats expire in 00:04').should('be.visible');
            cy.wait(800);
            cy.contains('Your seats expire in 00:03').should('be.visible');
            cy.log('💬 refresh timer');
            cy.get('.seat[data-row="1"][data-seat="1"]').click();
            cy.get('.seat[data-row="1"][data-seat="1"]').click();
            cy.contains('Your seats expire in 00:04').should('be.visible');
            cy.wait(800);
            cy.contains('Your seats expire in 00:03').should('be.visible');
            cy.wait(800);
            cy.contains('Your seats expire in 00:02').should('be.visible');
            cy.wait(800);
            cy.contains('Your seats expire in 00:01').should('be.visible');
            cy.wait(800);
            cy.contains('Your seat reservation expired. The reservation has been cancelled.').should('be.visible');
            cy.get('.seat-selected').should('have.length', 0);
            cy.contains('No seats selected. Click on a seat to make a reservation.').should('be.visible');

            cy.log('💬 start from expired state should also work');
            cy.get('.seat[data-row="1"][data-seat="1"]').click();
            cy.get('.seat-selected').should('have.length', 1);
            cy.contains('Your seat reservation expired. The reservation has been cancelled.').should('not.exist');
            cy.contains('Your seats expire in 00:04').should('be.visible');

            cy.log('💬 select more than one seat');
            cy.get('.seat[data-row="1"][data-seat="3"]').click();
            cy.get('.seat[data-row="1"][data-seat="4"]').click();
            cy.get('.seat[data-row="2"][data-seat="1"]').click();
            cy.get('.seat-selected').should('have.length', 4);
            cy.contains('Row: 01, Seat: 1').should('be.visible');
            cy.contains('Row: 01, Seat: 3').should('be.visible');
            cy.contains('Row: 01, Seat: 4').should('be.visible');
            cy.contains('Row: 02, Seat: 1').should('be.visible');

            cy.contains('Enter Booking Details').click();
            cy.contains('Change Seats').click();
            cy.get('.seat-selected').should('have.length', 4);
        });

        it('Booking form', () => {
            stubReservationRequest(120);

            cy.get('.card').eq(0).children('.artist').click();
            cy.get('.seat-available').eq(0).click();
            cy.contains('Enter Booking Details').click();
            cy.contains('Please enter your details').should('be.visible');
            cy.contains('Row: 01, Seat: 1').should('be.visible');
            // If, for some reason, the system executing this test is really slow, this might fail.
            cy.contains('Your seats expire in 01:59').should('be.visible');

            cy.get('.validated :invalid').should('have.length', 0);
            cy.contains(/^Book$/).click();
            cy.get('.validated :invalid').should('have.length', 5);

            cy.contains('label', 'Name').click();
            cy.focused().type('myname');
            cy.contains('label', 'Address').click();
            cy.focused().type('myaddress');
            cy.contains('label', 'ZIP Code').click();
            cy.focused().type('XZ1234');
            cy.contains('label', 'City').click();
            cy.focused().type('Graz');
            cy.contains('label', 'Country').click();
            cy.focused().select('Austria');

            cy.intercept({
                method: 'POST',
                url: /.+\/api\/v1\/concerts\/\d+\/shows\/\d+\/booking$/
            }, ticketsMockResponse).as('post-booking');

            cy.contains(/^Book$/).click();

            cy.wait('@post-booking').its('request.body').should(interception => {
                expect(interception).to.deep.eq({
                    reservation_token: 'foobar',
                    name: 'myname',
                    address: 'myaddress',
                    city: 'Graz',
                    zip: 'XZ1234',
                    country: 'Austria',
                });
            });

            cy.contains('Your Tickets are ready!').should('be.visible')
        });
    });
});
