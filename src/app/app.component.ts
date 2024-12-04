import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
 
@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, CommonModule, ToastrModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pallete-calc-app';
}
