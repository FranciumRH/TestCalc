import { Routes } from '@angular/router';
import { InputFormComponent } from './components/input-form/input-form.component';
import { WarehouseCrmComponent } from './pages/warehouse-crm/warehouse-crm.component';

export const routes: Routes = [
 { path: 'calculator', component: InputFormComponent},
 { path: 'warehouse', component: WarehouseCrmComponent} 
]
