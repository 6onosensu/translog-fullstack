import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environments';

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

  getShipments(status?: string, page = 1) {
    if (status) {
      return this.http.get<ShipmentsResponse>(
        `${environment.apiUrl}/shipments`,
        {
          params: { status, page },
        },
      );
    }

    return this.http.get<ShipmentsResponse>(
      `${environment.apiUrl}/shipments`,
      { params: { page } },
    );
  }

}
