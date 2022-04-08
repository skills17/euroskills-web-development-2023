import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingPageComponent} from "./pages/landing-page/landing-page.component";
import {BookingPageComponent} from "./pages/booking-page/booking-page.component";
import {TicketPageComponent} from "./pages/ticket-page/ticket-page.component";
import {TicketFormPageComponent} from "./pages/ticket-form-page/ticket-form-page.component";

const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'booking/:concertId/shows/:showId', component: BookingPageComponent},
  {path: 'ticket', component: TicketPageComponent},
  {path: 'ticket-form', component: TicketFormPageComponent},
  {path: '**', redirectTo: '/'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
