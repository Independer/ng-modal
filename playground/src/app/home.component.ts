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
    const modalRef = this.modalService.open(ModalComponent);

    modalRef.componentInstance.data = 'Modal initialization data set from HomeComponent';

    modalRef.closed.subscribe(args => {
      console.log(`Modal closed. Reason: ${ModalCloseReason[args.reason]}. Result: ${args.result}`);
    });
  }
}
