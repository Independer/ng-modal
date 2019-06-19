import { Component, OnInit } from '@angular/core';
import { ModalRef } from '@independer/ng-modal';

@Component({
  templateUrl: './modal.component.html'
})
export class ModalComponent implements OnInit {
  data: any;
  otherProperty: any;

  constructor(private modal: ModalRef) {
  }

  ngOnInit(): void {
    console.log(`Data: ${this.data}`);
    console.log(`Data passed through modal reference: ${this.otherProperty}`);
  }

  close() {
    this.modal.close('Result from the dialog.');
  }
}
