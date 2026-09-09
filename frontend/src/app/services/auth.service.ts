import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

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
      'http://localhost:3000/auth/login',
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
      'http://localhost:3000/auth/register', 
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
