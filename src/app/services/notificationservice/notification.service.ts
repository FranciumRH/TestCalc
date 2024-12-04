import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private toastr: ToastrService) { }
  showSuccess(message: string, title: string = 'Успешно') {
    this.toastr.success(message, title);
  }

  showError(message: string, title: string = 'Ошибка') {
    this.toastr.error(message, title);
  }

  showInfo(message: string, title: string = 'Информация') {
    this.toastr.info(message, title);
  }

  showWarning(message: string, title: string = 'Предупреждение') {
    this.toastr.warning(message, title);
  }
}
