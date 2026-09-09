import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environments';

interface CurrentUser {
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  login(email: string, password: string) {
    return this.http.post<{ accessToken: string }> (
      `${environment.apiUrl}/auth/login`,
      {
        email,
        password,
      },
    )
  }

  register(
    name: string, 
    email: string, 
    password: string, 
    role: string
  ) {
    return this.http.post(
      `${environment.apiUrl}/auth/register`, 
      {
        name,
        email,
        password,
        role,
      },
    );
  }

  logout() {
    localStorage.removeItem('accessToken');
  }

  getCurrentUser(): CurrentUser | null {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));

    return payload;
  }
}
