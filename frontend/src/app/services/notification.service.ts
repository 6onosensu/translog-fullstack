import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  error(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 6000,
    });
  }

  success(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 6000,
    });
  }
}