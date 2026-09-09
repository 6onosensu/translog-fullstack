import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
private authService = inject(AuthService);

  registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    role: new FormControl('OPERATOR', Validators.required),
  });
  
  onSubmit() {
    const { name, email, role } = this.registerForm.value;

  if (!name || !email || !role) {
    return;
  }

  const password = 'change_me'

  this.authService.register(name, email, password, role).subscribe({
    next: (response) => {
      console.log(response);
    },
    error: (error) => {
      console.log(error);
    },
  });
  }
}
