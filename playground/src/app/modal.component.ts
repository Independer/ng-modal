import { Component } from '@angular/core';
import { ModalRef } from 'ind-modal';

@Component({
  templateUrl: './modal.component.html'
})
export class ModalComponent {
  constructor(private modal: ModalRef) {
  }

  close() {
    this.modal.close();
  }
}
