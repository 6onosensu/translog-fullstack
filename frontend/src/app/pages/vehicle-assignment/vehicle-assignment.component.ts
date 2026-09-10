import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HeaderComponent } from '../../components/header/header.component';
import { Shipment, ShipmentsService, VehicleAssignmentResponse } from '../../services/shipments.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-vehicle-assignment',
  standalone: true,
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './vehicle-assignment.component.html',
  styleUrls: ['./vehicle-assignment.component.css']
})
export class VehicleAssignmentComponent {
  private shipmentsService = inject(ShipmentsService);
  private notification = inject(NotificationService);
  shipments: Shipment[] = [];
  selectedShipmentIds: string[] = [];
  assigning = false;

  vehicleCapacity = new FormControl<number | null>(
    null, 
    [Validators.required, Validators.min(1)]
  );

  result: VehicleAssignmentResponse | null = null;

  ngOnInit() {
    this.loadShipments();
  }

  loadShipments() {
    this.shipmentsService.getShipments('IN_WAREHOUSE')
      .subscribe({
        next: (response) => {
          this.shipments = response.items;
        },
        error: () => {
          this.notification.error('Failed to load shipments');
        },
      });
  }

  selectShipment(id: string) {
    if (this.selectedShipmentIds.includes(id)) {
      this.selectedShipmentIds = this.selectedShipmentIds.filter(
        (shipmentId) => shipmentId !== id,
      );
    } else {
      this.selectedShipmentIds.push(id);
    }
  }

  assignVehicles() {
    const capacity = this.vehicleCapacity.value;
    if (!capacity || this.selectedShipmentIds.length === 0) return;
    if (this.hasTooHeavyShipment(capacity)) {
      this.notification.error('Some shipments are too heavy');
      return;
    }

    this.assigning = true;

    this.shipmentsService
      .assignVehicles(this.selectedShipmentIds, capacity)
      .subscribe({
        next: (response) => {
          this.result = response;
          this.assigning = false;
        },
        error: () => {
          this.assigning = false;
          this.notification.error('Failed to assign vehicles');
        },
      });
  }

  hasTooHeavyShipment(capacity: number) {
    const selectedShipments = this.shipments.filter((shipment) =>
      this.selectedShipmentIds.includes(shipment.id),
    );

    return selectedShipments.some(
      (shipment) => Number(shipment.weight) > capacity,
    );
  }
}
