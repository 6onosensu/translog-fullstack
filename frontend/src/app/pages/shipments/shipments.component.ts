import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { Shipment, ShipmentsService } from '../../services/shipments.service';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-shipments',
  imports: [
    HeaderComponent,
    MatTableModule,
    DatePipe,
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

  ngOnInit() {
    this.shipmentsService.getShipments().subscribe({
      next: (response) => {
        this.shipments = response.items;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
