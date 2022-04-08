import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {shareReplay} from "rxjs/operators";
import {Observable} from "rxjs";
import {
  BookingRequest,
  BookingResponse,
  ConcertsResponse,
  ReservationRequest,
  ReservationResponse,
  ShowSeatingResponse,
  TicketResponse
} from "./dto";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly concerts$ = this.httpClient.get<ConcertsResponse>('http://localhost:8080/api/v1/concerts').pipe(
    shareReplay(1)
  );

  constructor(private readonly httpClient: HttpClient) {
  }

  getConcerts(): Observable<ConcertsResponse> {
    return this.concerts$;
  }

  getSeats(concertId: number, showId: number): Observable<ShowSeatingResponse> {
    return this.httpClient.get<ShowSeatingResponse>(`http://localhost:8080/api/v1/concerts/${concertId}/shows/${showId}/seating`);
  }

  postReservation(concertId: number, showId: number, body: ReservationRequest): Observable<ReservationResponse> {
    return this.httpClient.post<ReservationResponse>(`http://localhost:8080/api/v1/concerts/${concertId}/shows/${showId}/reservation`, body);
  }

  postBooking(concertId: number, showId: number, body: BookingRequest): Observable<BookingResponse> {
    return this.httpClient.post<BookingResponse>(`http://localhost:8080/api/v1/concerts/${concertId}/shows/${showId}/booking`, body);
  }

  postTicket(name: string, code: string): Observable<TicketResponse> {
    return this.httpClient.post<TicketResponse>('http://localhost:8080/api/v1/tickets', {name, code});
  }

  postCancelTicket(ticketId: number, name: string, code: string): Observable<void> {
    return this.httpClient.post<void>(`http://localhost:8080/api/v1/tickets/${ticketId}/cancel`, {name, code});
  }
}
