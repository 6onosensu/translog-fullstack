import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface Shipment {
  id: string;
  trackingCode: string;
  recipientName: string;
  destination: string;
  status: string;
  createdAt: string;
}

export interface ShipmentsResponse {
  items: Shipment[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShipmentsService {
  private http = inject(HttpClient);

  getShipments() {
    return this.http.get<ShipmentsResponse>(
      'http://localhost:3000/shipments',
    );
  }

}
