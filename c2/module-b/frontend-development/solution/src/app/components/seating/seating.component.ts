import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ShowSeatingResponse} from "../../dto";

@Component({
  selector: 'app-seating',
  templateUrl: './seating.component.html',
  styleUrls: ['./seating.component.scss']
})
export class SeatingComponent {

  @Input()
  seating!: ShowSeatingResponse;
  @Input()
  selectedSeats: { row: number; seat: number; }[] = [];

  @Output()
  seatsChanged = new EventEmitter<{ row: number; seat: number; }[]>();

  getSeats(seats: { total: number; unavailable: number[] }) {
    const seatArr = Array(seats.total).fill(false);
    seats.unavailable.forEach(unavailableSeat => {
      seatArr[unavailableSeat - 1] = true;
    })
    return seatArr;
  }

  toggleSeat(row: { id: number; name: string; seats: { total: number; unavailable: number[]; } }, seat: number, occupied: boolean) {
    if (occupied && !this.isSeatSelected(row.id, seat)) {
      return;
    }

    const rowId = row.id;
    let index = this.selectedSeats.findIndex(s => s.row === rowId && s.seat === seat);
    if (index >= 0) {
      this.selectedSeats.splice(index, 1);
    } else {
      this.selectedSeats.push({row: rowId, seat})
    }
    this.selectedSeats.sort((a, b) =>
      `${a.row}-${a.seat}`.localeCompare(`${b.row}-${b.seat}`, 'en', {numeric: true}));
    this.seatsChanged.emit(this.selectedSeats);
  }

  isSeatSelected(rowId: number, seat: number) {
    return this.selectedSeats.some(s => s.row === rowId && s.seat === seat);
  }
}
