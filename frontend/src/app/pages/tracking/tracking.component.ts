import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { Shipment, ShipmentsService } from '../../services/shipments.service';
import { HeaderComponent } from '../../components/header/header.component';

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
        console.log(error);
      },
    });
  }
}
