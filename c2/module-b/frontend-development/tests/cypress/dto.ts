export interface ConcertsResponse {
    concerts: ConcertResponse[];
}

export interface ConcertResponse {
    id: number;
    artist: string;
    location: LocationResponse;
    shows: ShowResponse[];
}

export interface LocationResponse {
    id: number;
    name: string;
}

export interface ShowResponse {
    id: number;
    start: string;
    end: string;
    concert?: Omit<ConcertResponse, 'shows'>;
}

export interface ShowSeatingResponse {
    rows: {
        id: number;
        name: string;
        seats: {
            total: number;
            unavailable: number[];
        }
    }[];
}

export interface ReservationRequest {
    reservation_token?: string;
    reservations: {
        row: number;
        seat: number;
    }[];
    duration?: number;
}

export interface ReservationResponse {
    reserved: boolean;
    reservation_token: string;
    reserved_until: string;
}

export interface BookingRequest {
    reservation_token: string;
    name: string;
    address: string;
    city: string;
    zip: string;
    country: string;
}

export interface BookingResponse {
    tickets: TicketResponse[];
}

export interface TicketResponse {
    id: number;
    code: string;
    name: string;
    created_at: string;
    row: { id: number, name: string };
    seat: number;
    show: ShowResponse;
}
