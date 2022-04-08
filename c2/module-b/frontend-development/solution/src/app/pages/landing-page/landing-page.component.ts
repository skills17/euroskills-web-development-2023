import {Component} from '@angular/core';
import {ApiService} from "../../api.service";
import {ConcertResponse, ShowResponse} from "../../dto";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
})
export class LandingPageComponent {
  concerts?: ConcertResponse[];

  artists: string[] = [];
  locations: string[] = [];

  artistFilter = '';
  locationFilter = '';
  dateFilter?: string;

  filterActive = false;

  constructor(private apiService: ApiService) {
    this.apiService.getConcerts().subscribe(response => {
      this.concerts = response.concerts;
      this.artists = this.concerts
        .map(concert => concert.artist)
        .reduce((a, b) => a.includes(b) ? a : [...a, b], [] as string[]);
      this.locations = this.concerts
        .map(concert => concert.location.name)
        .reduce((a, b) => a.includes(b) ? a : [...a, b], [] as string[]);
    });
  }

  getShownConcerts(): { concert: ConcertResponse, show: ShowResponse }[] | undefined {
    if (!this.concerts) {
      return undefined;
    }
    this.filterActive = false;
    let shown = this.concerts?.flatMap(concert => concert.shows.map(show => ({concert, show}))) || [];
    if (this.artistFilter) {
      shown = shown.filter(show => show.concert.artist === this.artistFilter);
      this.filterActive = true;
    }
    if (this.locationFilter) {
      shown = shown.filter(show => show.concert.location.name === this.locationFilter);
      this.filterActive = true;
    }
    if (this.dateFilter) {
      const filterDate = new Date(this.dateFilter);
      shown = shown.filter(show => filterDate.toDateString() === new Date(show.show.start).toDateString());
      this.filterActive = true;
    }

    shown.sort((a, b) => (+new Date(a.show.start)) - (+new Date(b.show.start)));

    return shown;
  }

  clearFilter() {
    this.filterActive = false;
    this.dateFilter = undefined;
    this.artistFilter = '';
    this.locationFilter = '';
  }
}
