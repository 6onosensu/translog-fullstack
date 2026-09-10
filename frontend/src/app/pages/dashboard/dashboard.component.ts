import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { MatCardModule } from '@angular/material/card';
import { ShipmentsService } from '../../services/shipments.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HeaderComponent,
    MatCardModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private shipmentService = inject(ShipmentsService);
  private notification = inject(NotificationService);

  statuses = [
    { name: 'CREATED', total: 0 },
    { name: 'IN_WAREHOUSE', total: 0 },
    { name: 'IN_TRANSIT', total: 0 },
    { name: 'OUT_FOR_DELIVERY', total: 0 },
    { name: 'DELIVERED', total: 0 },
    { name: 'RETURNED', total: 0 },
    { name: 'CANCELLED', total: 0 },
  ]

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    for (const status of this.statuses) {
      this.shipmentService.getShipments(status.name)
        .subscribe({
          next:(response) => {
            status.total = response.total;
          },
          error: () => {
            this.notification.error('Failed to load dashboard');
          },
        });
    }
  }
}
