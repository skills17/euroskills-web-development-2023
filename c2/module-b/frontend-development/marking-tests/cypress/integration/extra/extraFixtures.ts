import {BookingResponse, ConcertResponse, ShowResponse, ShowSeatingResponse, TicketResponse} from '../../dto';
import {ConcertsResponse} from '../../../../solution/src/app/dto';

export const concert1Show1: ShowResponse = {start: '2021-09-23T20:00:00Z', end: '2021-09-23T23:00:00Z', id: 1};
export const concert1Show2: ShowResponse = {start: '2021-09-24T20:00:00Z', end: '2021-09-23T23:00:00Z', id: 2};
export const concert1: ConcertResponse = {
    id: 1,
    artist: 'Artist1',
    location: {id: 1, name: 'Location1'},
    shows: [concert1Show1, concert1Show2],
};

export const concert2Show1: ShowResponse = {start: '2021-09-20T20:00:00Z', end: '2021-09-23T23:00:00Z', id: 3};
export const concert2Show2: ShowResponse = {start: '2021-09-24T19:00:00Z', end: '2021-09-25T03:00:00Z', id: 4};
export const concert2: ConcertResponse = {
    id: 2,
    artist: 'Artist2',
    location: {id: 1, name: 'Location1'},
    shows: [concert2Show1, concert2Show2],
};

export const concert3Show1: ShowResponse = {start: '2021-09-25T18:00:00Z', end: '2021-09-25T21:00:00Z', id: 5};
export const concert3Show2: ShowResponse = {start: '2021-09-25T20:00:00Z', end: '2021-09-25T23:00:00Z', id: 6};
export const concert3: ConcertResponse = {
    id: 3,
    artist: 'Artist3',
    location: {id: 2, name: 'Location2'},
    shows: [concert3Show1, concert3Show2],
};

export const concertsMockResponse: ConcertsResponse = {concerts: [concert1, concert2, concert3]};

export const seatingMockResponse: ShowSeatingResponse = {
    rows: [
        {id: 1, name: '01', seats: {total: 10, unavailable: [2]}},
        {id: 2, name: '02', seats: {total: 11, unavailable: []}},
        {id: 3, name: '03', seats: {total: 9, unavailable: []}},
        {id: 4, name: '04', seats: {total: 5, unavailable: []}},
        {id: 5, name: 'Balcony', seats: {total: 10, unavailable: []}},
    ]
};

export const ticket1: TicketResponse = {
    id: 1,
    code: 'stubbed_code1',
    created_at: '2021-09-25T18:00:00Z',
    name: 'stubbed_bookee_name1',
    row: {id: 1, name: '01'},
    seat: 1,
    show: {...concert1Show1, concert: concert1}
}
export const ticket2: TicketResponse = {
    id: 2,
    code: 'stubbed_code2',
    created_at: '2021-09-25T18:00:00Z',
    name: 'stubbed_bookee_name2',
    row: {id: 1, name: '01'},
    seat: 2,
    show: {...concert1Show1, concert: concert1}
}
export const ticketsMockResponse: BookingResponse = {
    tickets: [ticket1, ticket2],
};
