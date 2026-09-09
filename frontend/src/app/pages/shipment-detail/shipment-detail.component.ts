import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { ActivatedRoute } from '@angular/router';
import { Shipment, ShipmentsService } from '../../services/shipments.service';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-shipment-detail',
  imports: [
    HeaderComponent,
    DatePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './shipment-detail.component.html',
  styleUrl: './shipment-detail.component.css'
})
export class ShipmentDetailComponent {
  private route = inject(ActivatedRoute);
  private shipmentsService = inject(ShipmentsService);
  shipmentId = this.route.snapshot.paramMap.get('id');
  shipment: Shipment | null = null;

  statusForm = new FormGroup({
    status: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    notes: new FormControl(''),
  });

  cancelForm = new FormGroup({
    location: new FormControl('', Validators.required),
    notes: new FormControl(''),
  });

  getNextStatuses(status: string): string[] {
    switch (status) {
      case 'CREATED':
        return ['IN_WAREHOUSE'];

      case 'IN_WAREHOUSE':
        return ['IN_TRANSIT'];

      case 'IN_TRANSIT':
        return ['OUT_FOR_DELIVERY'];

      case 'OUT_FOR_DELIVERY':
        return ['DELIVERED', 'RETURNED'];

      default:
        return [];
    }
  }

  onStatusSubmit() {
    if (!this.shipmentId) return;

    const status = this.statusForm.value.status;
    const location = this.statusForm.value.location;
    const notes = this.statusForm.value.notes;

    if (!status || !location) return;

    this.shipmentsService.updateShipmentStatus(
      this.shipmentId,
      status,
      location,
      notes || undefined,
    ).subscribe({
      next: () => {
        this.loadShipment();
        this.statusForm.reset();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  onCancel() {
    if (!this.shipmentId) return;

    const location = this.cancelForm.value.location;
    const notes = this.cancelForm.value.notes;

    if (!location) return;

    this.shipmentsService
      .cancelShipment(
        this.shipmentId,
        location,
        notes || undefined,
      )
      .subscribe({
        next: () => {
          this.cancelForm.reset();
          this.loadShipment();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  ngOnInit() {
    this.loadShipment();
  }

  loadShipment() {
    if (!this.shipmentId) return;

    this.shipmentsService.getShipmentById(this.shipmentId)
      .subscribe({
        next: (response) => {
          this.shipment = response;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
