import { Routes } from '@angular/router';
import { InputFormComponent } from './components/input-form/input-form.component';
import { PalletCapacityCalculationComponent } from './components/pallet-capacity-calculation/pallet-capacity-calculation.component';

export const routes: Routes = [
 { path: 'calculator', component: InputFormComponent},
 { path: 'capacity', component: PalletCapacityCalculationComponent}
];
