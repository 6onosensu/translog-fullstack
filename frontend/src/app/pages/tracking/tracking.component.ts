import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { Shipment, ShipmentsService } from '../../services/shipments.service';
import { HeaderComponent } from '../../components/header/header.component';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-tracking',
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    DatePipe,
  ],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.css'
})
export class TrackingComponent {
  private notification = inject(NotificationService);
  private shipmentService = inject(ShipmentsService);

  shipment: Shipment | null = null;

  trackingForm = new FormGroup({
    trackingCode: new FormControl('', Validators.required),
  });

  onSubmit() {
    const trackingCode = this.trackingForm.value.trackingCode;

    if (!trackingCode) return;

    this.shipmentService.trackShipment(trackingCode).subscribe({
      next: (response) => {
        this.shipment = response;
      },
      error: (error) => {
        this.shipment = null;
        this.notification.error('Shipment not found');
      },
    });
  }
}
