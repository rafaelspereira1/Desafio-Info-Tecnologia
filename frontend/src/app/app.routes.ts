import { Routes } from '@angular/router';
import { VehiclesListComponent } from './vehicles/vehicles-list.component';

export const routes: Routes = [
  { path: '', component: VehiclesListComponent },
  { path: '**', redirectTo: '' },
];
