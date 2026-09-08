import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  login(email: string, password: string) {
    return this.http.post<{ accessToken: string }> (
      'http://localhost:3000/auth/login',
      {
        email,
        password,
      },
    )
  }

  logout() {
    localStorage.removeItem('accessToken');
  }
}
