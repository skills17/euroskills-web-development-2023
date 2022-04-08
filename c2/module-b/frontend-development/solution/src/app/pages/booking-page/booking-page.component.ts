import {Component} from '@angular/core';
import {ApiService} from '../../api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BookingRequest, ConcertResponse, ReservationResponse, ShowResponse, ShowSeatingResponse} from '../../dto';
import {finalize, first} from 'rxjs/operators';
import {ReservationService} from '../../reservation.service';
import {COUNTRIES} from "../../constants";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.scss'],
  providers: [ReservationService]
})
export class BookingPageComponent {

  readonly COUNTRIES = COUNTRIES;

  concert?: ConcertResponse;
  show?: ShowResponse;
  seats?: ShowSeatingResponse;
  selectedSeats: { row: number; seat: number; }[] = [];
  reservedUntil?: Date;
  reservations?: ReservationResponse;
  expired = false;
  step: 'seat_selection' | 'booking_form' = 'seat_selection';
  booking: Omit<BookingRequest, 'reservation_token'> = {address: '', city: '', country: '', name: '', zip: ''};

  formValidated = false;
  isSaving = false;

  constructor(private readonly apiService: ApiService,
              private readonly reservationService: ReservationService,
              private readonly router: Router,
              private route: ActivatedRoute) {

    this.selectedSeats = this.reservationService.getReservations();
    this.reservedUntil = this.reservationService.getReservedUntil();

    this.route.params.pipe(first()).subscribe(params => {
      const concertId = +params['concertId'];
      const showId = +params['showId'];
      this.loadConcert(concertId, showId);
    });
  }

  private loadConcert(concertId: number, showId: number) {
    this.apiService.getConcerts().subscribe(response => {
      this.concert = response.concerts.find(concert => concert.id === concertId);
      if (!this.concert) {
        console.error('Concert with Id does not exist.');
        this.router.navigate(['/']);
        return;
      }
      this.show = this.concert.shows.find(show => show.id === showId);
      if (!this.show) {
        console.error('Show with Id does not exist.');
        this.router.navigate(['/']);
        return;
      }

      this.apiService.getSeats(concertId, showId).subscribe(response => {
        this.seats = response;
      });
    });
  }

  seatsChanged(seats: { row: number; seat: number; }[]) {
    this.reservationService.createOrUpdateReservation(this.concert!.id, this.show!.id, seats).subscribe(() => {
      this.expired = false;
      this.selectedSeats = seats;
      this.selectedSeats = this.reservationService.getReservations();
      this.reservedUntil = this.reservationService.getReservedUntil();
    });
  }

  getRow(selectedSeat: { row: number, seat: number }): { name: string } | undefined {
    return this.seats?.rows.find(row => row.id === selectedSeat.row);
  }

  goToBookingForm() {
    this.step = 'booking_form'
  }

  goToSeatSelection() {
    this.step = 'seat_selection';
  }

  expireReservation() {
    this.expired = true;
    this.reservedUntil = undefined;
    this.selectedSeats = [];
    this.step = 'seat_selection';
  }

  confirmBooking(form: NgForm) {
    this.formValidated = true;
    if (form.invalid) {
      return;
    }
    this.isSaving = true;
    this.reservedUntil = undefined;
    this.reservationService.confirmBooking(this.concert!.id, this.show!.id, this.booking).pipe(
      finalize(() => {
        this.isSaving = false;
      })
    ).subscribe(response => {
      this.router.navigate(['/ticket'], {state: response});
    });
  }
}
