import { CommonModule } from '@angular/common';
import { Component, inject, input  } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  messageService = inject(MessageService);

  showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }
}
