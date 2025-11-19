import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-test-errors',
  imports: [],
  templateUrl: './test-errors.html',
  styleUrl: './test-errors.css'
})
export class TestErrors {
  private http = inject(HttpClient);
  baseurl = environment.apiUrl;


  get500Error() {
    this.http.get(this.baseurl + 'buggy/server-error').subscribe({
      next: res => console.log(res),
      error: err => console.log(err)
    })
  }

  get404Error() {
    this.http.get(this.baseurl + 'buggy/not-found').subscribe({
      next: res => console.log(res),
      error: err => console.log(err)
    })
  }

  get400Error() {
    this.http.get(this.baseurl + 'buggy/bad-request').subscribe({
      next: res => console.log(res),
      error: err => console.log(err)
    })
  }


  get401Error() {
    this.http.get(this.baseurl + 'buggy/auth').subscribe({
      next: res => console.log(res),
      error: err => console.log(err)
    })
  }

  get400ValidationError() {
    this.http.post(this.baseurl + 'account/register', {}).subscribe({
      next: res => console.log(res),
      error: err => console.log(err)
    })
  }
}
