# API Interfaces

The API returns and accepts the  following types:

```
ConcertsResponse {
    concerts ConcertResponse[]
}

ConcertResponse {
    id        number
    artist    string
    location  LocationResponse
    shows     ShowResponse[]
}

LocationResponse {
    id   number
    name string
}

ShowResponse {
    id      number
    start   string
    end     string
    concert ConcertResponse? // nested property "shows" not present
}

ShowSeatingSeats {
    total       number
    unavailable number[]
}

ShowSeatingRow {
    id    number
    name  string
    seats ShowSeatingSeats[]
}

ShowSeatingResponse {
    rows ShowSeatingRow[]
}

ReservationSeat {
  row  number
  seat number
}

ReservationRequest {
    reservation_token string?
    reservations      ReservationSeat[]
    duration          number?
}

ReservationResponse {
    reserved          boolean
    reservation_token string
    reserved_until    string
}

BookingRequest {
    reservation_token string
    name              string
    address           string
    city              string
    zip               string
    country           string
}

BookingResponse {
    tickets TicketResponse[]
}

TicketRow {
    id   number
    name string
}

TicketResponse {
    id         number
    code       string
    name       string
    created_at string
    row        TicketRow
    seat       number
    show       ShowResponse
}
```
