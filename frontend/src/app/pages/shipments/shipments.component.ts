import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { Shipment, ShipmentsService } from '../../services/shipments.service';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-shipments',
  imports: [
    HeaderComponent,
    MatTableModule,
    DatePipe,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './shipments.component.html',
  styleUrl: './shipments.component.css'
})
export class ShipmentsComponent {
  private shipmentsService = inject(ShipmentsService);
  shipments: Shipment[] = [];
  displayedColumns: string[] = [
    'trackingCode',
    'recipientName',
    'destinationAddress',
    'status',
    'createdAt',
  ]

  statuses = [
    'CREATED',
    'IN_WAREHOUSE',
    'IN_TRANSIT',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'RETURNED',
    'CANCELLED',
  ];

  ngOnInit() {
    this.loadShipments();
  }

  loadShipments(status?: string) {
    this.shipmentsService.getShipments(status).subscribe({
      next: (response) => {
        this.shipments = response.items;
      },
      error: (error) => console.log(error),
    });
  }
}
