import {Component, Input} from '@angular/core';
import {ConcertResponse, ShowResponse} from "../../dto";

@Component({
  selector: 'app-show-card',
  templateUrl: './show-card.component.html',
  styleUrls: ['./show-card.component.scss']
})
export class ShowCardComponent {

  @Input()
  concert!: Omit<ConcertResponse, 'shows'>;
  @Input()
  show!: ShowResponse;
  @Input()
  disableClick = false;

}
