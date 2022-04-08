import {ConcertResponse, ShowResponse} from "../dto";

/**
 * Checks the following is visible at the show with the given index
 * - start date as "dd/mm/yyyy"
 * - artist name
 * - location name
 * - time as "hh:mm - hh:mm"
 */
export function expectShow(index: number, show: ShowResponse, concert: Omit<ConcertResponse, 'shows'>) {
    // this is not how date manipulation should be done, but doesn't give off too many hints ;)

    // extracts the date and transforms "yyyy-mm-dd" into "dd/mm/yyyy"
    const startDate = show.start.substring(0, 10).split('-').reverse().join('/');
    // extracts the time
    const startTime = show.start.substring(11, 16);
    const endTime = show.end.substring(11, 16);

    cy.log(`💬 expecting show with index=${index} {date: "${startDate}", artist: "${concert.artist}", location: "${concert.location.name}", time: "${startTime} - ${endTime}"}`);
    cy.get('.card:visible').eq(index).contains(startDate).should('be.visible', `The .card element with index ${index} should be containing start date`);
    cy.get('.card:visible').eq(index).contains(concert.artist).should('be.visible', `The .card element with index ${index} should be containing artist name`);
    cy.get('.card:visible').eq(index).contains(concert.location.name).should('be.visible', `The .card element with index ${index} should be containing location name`);
    cy.get('.card:visible').eq(index).contains(`${startTime} - ${endTime}`).should('be.visible', `The .card element with index ${index} should be containing start and end time`);
}
