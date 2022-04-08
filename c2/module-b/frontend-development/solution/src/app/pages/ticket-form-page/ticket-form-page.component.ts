import {Component} from '@angular/core';
import {ApiService} from "../../api.service";
import {Router} from "@angular/router";
import {finalize} from "rxjs/operators";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-ticket-form-page',
  templateUrl: './ticket-form-page.component.html',
  styleUrls: ['./ticket-form-page.component.scss']
})
export class TicketFormPageComponent {

  name = '';
  code = '';

  loading = false;
  incorrectDetails = false;
  formValidated = false;

  constructor(private readonly apiService: ApiService,
              private readonly router: Router) {
  }

  submitForm(form: NgForm) {
    this.formValidated = true;
    if (form.invalid) {
      return;
    }
    this.loading = true;
    this.apiService.postTicket(this.name, this.code).pipe(
      finalize(() => this.loading = false)
    ).subscribe(response => {
      this.router.navigate(['/ticket'], {state: response});
    }, () => {
      this.incorrectDetails = true;
    });
  }
}
