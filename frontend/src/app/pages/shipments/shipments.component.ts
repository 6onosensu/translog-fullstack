import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { ShipmentsService } from '../../services/shipments.service';

@Component({
  selector: 'app-shipments',
  imports: [HeaderComponent],
  templateUrl: './shipments.component.html',
  styleUrl: './shipments.component.css'
})
export class ShipmentsComponent {
  private shipmentsService = inject(ShipmentsService);
  
  ngOnInit() {
    this.shipmentsService.getShipments().subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
