import { Component } from '@angular/core';
import { ModalService, ModalCloseReason } from '@independer/ng-modal';
import { ModalComponent } from './modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  constructor(private modalService: ModalService) {
  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent, modal => {
      modal.data = 'Modal initialization data set from HomeComponent';
      modal.otherProperty = 123;
      // etc.
    });

    modalRef.componentInstance.data = 'Modal initialization data set from HomeComponent';

    modalRef.closed.subscribe(args => {
      console.log(`Modal closed. Reason: ${ModalCloseReason[args.reason]}. Result: ${args.result}`);
    });
  }
}
