import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { ShipmentsService } from '../../services/shipments.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-shipment',
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './create-shipment.component.html',
  styleUrl: './create-shipment.component.css'
})
export class CreateShipmentComponent {
  private shipmentsService = inject(ShipmentsService);
  private router = inject(Router);

  shipmentForm = new FormGroup({
    originAddress: new FormControl('', Validators.required),
    destinationAddress: new FormControl('', Validators.required),
    recipientName: new FormControl('', Validators.required),
    recipientPhone: new FormControl(''),
    weight: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0.1),
    ]),
  });

  onSubmit() {
    const {
      originAddress,
      destinationAddress,
      recipientName,
      recipientPhone,
      weight,
    } = this.shipmentForm.value;

    if (
      !originAddress || 
      !destinationAddress || 
      !recipientName || 
      !weight
    ) return;

    this,this.shipmentsService.createShipment(
      originAddress,
      destinationAddress,
      recipientName,
      weight,
      recipientPhone || undefined,
    ).subscribe({
      next: () => {
        this.router.navigate(['/shipments']);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
