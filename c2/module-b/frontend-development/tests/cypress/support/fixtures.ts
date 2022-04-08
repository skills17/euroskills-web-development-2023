import {BookingResponse, ConcertResponse, ShowResponse, ShowSeatingResponse, TicketResponse} from '../dto';
import {ConcertsResponse} from '../../../solution/src/app/dto';

export const concert1Show1: ShowResponse = {start: '2021-09-30T22:30:00', end: '2021-10-01T00:30:00', id: 4};
export const concert1Show2: ShowResponse = {start: '2021-10-01T19:00:00', end: '2021-10-01T21:00:00', id: 2};
export const concert1: ConcertResponse = {
    id: 2,
    artist: 'Bilderbuch',
    location: {id: 3, name: 'Das Orpheum'},
    shows: [concert1Show1, concert1Show2],
};

export const concert2Show1: ShowResponse = {start: '2021-09-30T19:00:00', end: '2021-09-30T21:00:00', id: 5};
export const concert2Show2: ShowResponse = {start: '2021-10-01T22:30:00', end: '2021-10-02T00:30:00', id: 6};
export const concert2: ConcertResponse = {
    id: 3,
    artist: 'Wanda',
    location: {id: 2, name: 'Freilufthalle B'},
    shows: [concert2Show1, concert2Show2],
};

export const concert3Show1: ShowResponse = {start: '2021-10-03T20:00:00', end: '2021-10-03T23:00:00', id: 3};
export const concert3: ConcertResponse = {
    id: 4,
    artist: 'Christina Stürmer',
    location: {id: 3, name: 'Das Orpheum'},
    shows: [concert3Show1],
};

export const concert4Show1: ShowResponse = {start: '2021-10-02T21:00:00', end: '2021-10-03T00:00:00', id: 1};
export const concert4: ConcertResponse = {
    id: 1,
    artist: 'Opus',
    location: {id: 1, name: 'Oper Graz'},
    shows: [concert4Show1],
};

export const concertsMockResponse: ConcertsResponse = {concerts: [concert1, concert2, concert3, concert4]};

export const seatingMockResponse: ShowSeatingResponse = {
    rows: [
        {id: 1, name: '01', seats: {total: 14, unavailable: [2]}},
        {id: 2, name: '02', seats: {total: 15, unavailable: []}},
        {id: 3, name: '03', seats: {total: 13, unavailable: []}},
        {id: 4, name: '04', seats: {total: 11, unavailable: []}},
        {id: 5, name: 'Balcony', seats: {total: 10, unavailable: []}},
    ]
};

export const ticket1: TicketResponse = {
    id: 1,
    code: 'stubbed_code1',
    created_at: new Date().toISOString(),
    name: 'myname',
    row: {id: 1, name: '01'},
    seat: 1,
    show: {...concert1Show1, concert: concert1}
}
export const ticket2: TicketResponse = {
    id: 2,
    code: 'stubbed_code2',
    created_at: new Date().toISOString(),
    name: 'myname',
    row: {id: 1, name: '01'},
    seat: 2,
    show: {...concert1Show1, concert: concert1}
}
export const ticketsMockResponse: BookingResponse = {
    tickets: [ticket1, ticket2],
};
