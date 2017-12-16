import { Component } from '@angular/core';
import { ModalRef } from '@independer/ng-modal';

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
