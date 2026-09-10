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
import { NotificationService } from '../../services/notification.service';

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
  private notification = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private shipmentsService = inject(ShipmentsService);
  shipmentId = this.route.snapshot.paramMap.get('id');
  shipment: Shipment | null = null;

  loading = false;
  updatingStatus = false;
  cancelling = false

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
    this.updatingStatus = true;


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
        this.notification.success('Shipment status updated');
        this.updatingStatus = false;
        this.loadShipment();
        this.statusForm.reset();
      },
      error: () => {
        this.updatingStatus = false;
        this.notification.error('Failed to update shipment status');
      }
    })
  }

  onCancel() {
    if (!this.shipmentId) return;
    this.cancelling = true;

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
          this.cancelling = false;
          this.loadShipment();
          this.notification.success('Shipment cancelled');
        },
        error: () => {
          this.cancelling = false;
          this.notification.error('Failed to cancel shipment');
        },
      });
  }

  ngOnInit() {
    this.loadShipment();
  }

  loadShipment() {
    this.loading = true;
    if (!this.shipmentId) return;

    this.shipmentsService.getShipmentById(this.shipmentId)
      .subscribe({
        next: (response) => {
          this.shipment = response;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.notification.error('Failed to load shipment');
        },
      });
  }
}
