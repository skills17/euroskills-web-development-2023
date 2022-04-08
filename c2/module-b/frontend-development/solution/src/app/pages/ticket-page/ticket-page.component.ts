import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {TicketResponse} from "../../dto";
import {ApiService} from "../../api.service";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-ticket-page',
  templateUrl: './ticket-page.component.html',
  styleUrls: ['./ticket-page.component.scss']
})
export class TicketPageComponent implements OnInit {
  tickets?: TicketResponse[];
  cancellingTicket: { [index: string]: boolean } = {};

  constructor(private readonly router: Router,
              private readonly apiService: ApiService) {
    let routeStateTickets = this.router.getCurrentNavigation()?.extras.state?.tickets;
    if (!routeStateTickets) {
      this.router.navigate(['/ticket-form']);
    } else {
      this.tickets = routeStateTickets
    }
  }

  ngOnInit(): void {
  }

  confirmCancelTicket(ticket: TicketResponse) {
    const confirmed = confirm(`Do you really want to cancel the ticket for row "${ticket.row.name}" and seat "${ticket.seat}"?`);
    if (!confirmed) {
      return;
    }
    this.cancellingTicket[`${ticket.id}`] = true;
    this.apiService.postCancelTicket(ticket.id, ticket.name, ticket.code).pipe(
      finalize(() => {
        this.cancellingTicket[`${ticket.id}`] = false;
      })
    ).subscribe(() => {
      this.tickets?.splice(this.tickets?.indexOf(ticket), 1);
      if (this.tickets?.length === 0) {
        this.router.navigate(['/']);
      }
    });
  }
}
