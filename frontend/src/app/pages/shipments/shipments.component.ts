import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { Shipment, ShipmentsService } from '../../services/shipments.service';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-shipments',
  imports: [
    HeaderComponent,
    MatTableModule,
    DatePipe,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    RouterLink,
  ],
  templateUrl: './shipments.component.html',
  styleUrl: './shipments.component.css'
})
export class ShipmentsComponent {
  private notification = inject(NotificationService);
  private shipmentsService = inject(ShipmentsService);
  shipments: Shipment[] = [];

  total = 0;
  page = 1;
  selectedStatus = '';

  displayedColumns: string[] = [
    'trackingCode',
    'recipientName',
    'destinationAddress',
    'status',
    'createdAt',
  ]

  ngOnInit() {
    this.loadShipments();
  }

  loadShipments() {
    this.shipmentsService
      .getShipments(this.selectedStatus, this.page)
      .subscribe({
        next: (response) => {
          this.shipments = response.items;
          this.total = response.total;
          this.page = response.page;
        },
        error: () => this.notification.error(
          'Failed to load shipments'
        ),
      });
  }

  onStatusChange(status: string) {
    this.selectedStatus = status;
    this.page = 1;
    this.loadShipments();
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.loadShipments();
  }
}
