import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { ActivatedRoute } from '@angular/router';
import { Shipment, ShipmentsService } from '../../services/shipments.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-shipment-detail',
  imports: [
    HeaderComponent,
    DatePipe,
  ],
  templateUrl: './shipment-detail.component.html',
  styleUrl: './shipment-detail.component.css'
})
export class ShipmentDetailComponent {
  private route = inject(ActivatedRoute);
  private shipmentsService = inject(ShipmentsService);
  shipmentId = this.route.snapshot.paramMap.get('id');
  shipment: Shipment | null = null;

  ngOnInit() {
    if (!this.shipmentId) return;

    this.shipmentsService.getShipmentById(this.shipmentId).subscribe({
      next: (response) => {
        this.shipment = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
