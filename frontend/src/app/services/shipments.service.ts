import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShipmentsService {
  private http = inject(HttpClient);

  getShipments() {
    return this.http.get('http://localhost:3000/shipments');
  }

}
