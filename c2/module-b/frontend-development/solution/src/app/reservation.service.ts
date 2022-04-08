import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {BookingRequest, BookingResponse, ReservationRequest, ReservationResponse} from "./dto";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

// const RESERVATION_DURATION = 60 * 5;
const RESERVATION_DURATION = 5;

@Injectable()
export class ReservationService {

  token?: string;
  reservedUntil?: Date;

  private reservations?: { row: number; seat: number; }[];

  constructor(private apiService: ApiService) {
  }

  getReservations(): { row: number; seat: number; }[] {
    return this.reservations || [];
  }

  getReservedUntil(): Date | undefined {
    return this.reservedUntil;
  }

  createOrUpdateReservation(concertId: number, showId: number, reservations: { row: number; seat: number; }[]): Observable<ReservationResponse> {
    const body: ReservationRequest = {
      reservation_token: this.token,
      // duration: RESERVATION_DURATION,
      reservations,
    }
    return this.apiService.postReservation(concertId, showId, body).pipe(
      tap(response => {
        this.updateState(response, reservations);
      })
    );
  }

  private updateState(response: ReservationResponse, reservations: { row: number; seat: number; }[]) {
    this.token = response.reservation_token;
    this.reservedUntil = response.reserved_until != null ? new Date(response.reserved_until) : undefined;
    this.reservations = reservations;
  }

  confirmBooking(concertId: number, showId: number, booking: Omit<BookingRequest, 'reservation_token'>): Observable<BookingResponse> {
    if (!this.token) {
      throw new Error('cannot make booking if token is not set');
    }
    const body: BookingRequest = {reservation_token: this.token, ...booking};
    return this.apiService.postBooking(concertId, showId, body);
  }

  clearReservation() {
    this.token = undefined;
    this.reservedUntil = undefined;
    this.reservations = undefined;
  }
}
