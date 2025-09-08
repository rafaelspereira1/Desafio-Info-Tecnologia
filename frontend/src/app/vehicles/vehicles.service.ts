import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vehicle } from './vehicle.model';

@Injectable({ providedIn: 'root' })
export class VehiclesService {
  private http = inject(HttpClient);
  private readonly base = '/api/vehicles';

  vehicles = signal<Vehicle[] | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  refresh() {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<Vehicle[]>(this.base).subscribe({
      next: (v) => {
        this.vehicles.set(v);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e?.error?.message || 'Erro ao carregar veículos');
        this.loading.set(false);
      },
    });
  }

  create(data: Omit<Vehicle, 'id'>) {
    return this.http.post<Vehicle>(this.base, data);
  }

  remove(id: string) {
    return this.http.delete(`${this.base}/${id}`);
  }
}
