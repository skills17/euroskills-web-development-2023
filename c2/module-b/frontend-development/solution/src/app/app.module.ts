import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LandingPageComponent} from './pages/landing-page/landing-page.component';
import {BookingPageComponent} from './pages/booking-page/booking-page.component';
import {TicketPageComponent} from './pages/ticket-page/ticket-page.component';
import {TicketFormPageComponent} from './pages/ticket-form-page/ticket-form-page.component';
import {ShowCardComponent} from './components/show-card/show-card.component';
import {HttpClientModule} from "@angular/common/http";
import {SeatingComponent} from './components/seating/seating.component';
import {CountdownComponent} from './components/countdown/countdown.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    BookingPageComponent,
    TicketPageComponent,
    TicketFormPageComponent,
    ShowCardComponent,
    SeatingComponent,
    CountdownComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
