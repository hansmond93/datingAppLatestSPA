import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginCreds, RegisterCreds, User } from '../../types/user';
import { tap, timeout } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private likesService = inject(LikesService);
  private baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);


  register(creds: RegisterCreds) {
    return this.http.post<User>(this.baseUrl + 'account/register', creds, {withCredentials: true}).pipe(
      tap(user => {
        if(user) {
          this.setCurrentUser(user)
          this.startTokenRefreshInterval()
        }
      })
    );
  }

  login(creds:LoginCreds) {
    return this.http.post<User>(this.baseUrl + 'account/login', creds, {withCredentials: true}).pipe(
      tap(user => {
        if(user) {
          this.setCurrentUser(user);
          this.startTokenRefreshInterval();
        }
      })
    );
  }

  refreshToken() {
    return this.http.post<User>(this.baseUrl + 'account/refresh-token', {}, {withCredentials: true});
  }

  startTokenRefreshInterval() {
    setInterval(() => {
      this.http.post<User>(this.baseUrl + 'account/refresh-token', {}, {withCredentials: true}).subscribe({
        next: user => {
          this.setCurrentUser(user)
        }, 
        error: () => {
          this.logout()
        }
      })
    }, 300 * 1000)
  }

  setCurrentUser(user: User) {
    user.roles = this.getRolesFromTOken(user);
    this.currentUser.set(user);
    this.likesService.getLikeIds();
  }

  logout() {
    localStorage.removeItem('filters');
    this.likesService.clearLikeIds();
    this.currentUser.set(null);
  }

  private getRolesFromTOken(user: User): string[] {
    const payload = user.token.split('.')[1];
    const decoded = atob(payload);
    const jaysonPayload = JSON.parse(decoded);

    return Array.isArray(jaysonPayload.role) ? jaysonPayload.role : [jaysonPayload.role]
  }

}
