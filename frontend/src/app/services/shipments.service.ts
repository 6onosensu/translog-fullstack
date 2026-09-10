import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environments';

export interface VehicleShipment {
  shipmentId: string;
  trackingCode: string;
  weight: number;
}

export interface Vehicle {
  vehicleNumber: number;
  shipments: VehicleShipment[];
  totalWeight: number;
  remainingCapacity: number;
}

export interface VehicleAssignmentResponse {
  vehicles: Vehicle[];
  totalVehiclesUsed: number;
  totalWeight: number;
}

export interface ShipmentEvent {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  location: string;
  notes?: string;
  user: {
    id: string;
    email: string;
    name:string;
    role: string;
  }
}

export interface Shipment {
  id: string;
  createdAt: string;
  updatedAt: string;
  trackingCode: string;
  status: string;
  originAddress: string;
  destinationAddress: string;
  recipientName: string;
  recipientPhone?: string;
  weight: string;
  deliveredAt: string | null;
  events?: ShipmentEvent[];
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

  trackShipment(trackingCode: string) {
    return this.http.get<Shipment>(
      `${environment.apiUrl}/tracking/${trackingCode}`,
    );
  }

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

  getShipmentById(id: string) {
    return this.http.get<Shipment>(
      `${environment.apiUrl}/shipments/${id}`,
    );
  }

  updateShipmentStatus(
    id: string,
    status: string,
    location: string,
    notes?: string,
  ) {
    return this.http.patch(
      `${environment.apiUrl}/shipments/${id}/status`,
      {
        status,
        location,
        notes,
      },
    )
  }

  cancelShipment(id: string, location: string, notes?: string) {
    return this.http.delete(
      `${environment.apiUrl}/shipments/${id}`,
      {
        body: {
          location,
          notes,
        },
      },
    );
  }

  createShipment(
    originAddress: string,
    destinationAddress: string,
    recipientName: string,
    weight: number,
    recipientPhone?: string,
  ) {
    return this.http.post(
      `${environment.apiUrl}/shipments`,
      {
        originAddress,
        destinationAddress,
        recipientName,
        recipientPhone,
        weight,
      }
    )
  }

  assignVehicles(shipmentIds: string[], vehicleCapacity: number) {
    return this.http.post<VehicleAssignmentResponse>(
      `${environment.apiUrl}/shipments/assign-vehicles`,
      {
        shipmentIds,
        vehicleCapacity,
      },
    );
  }
}
