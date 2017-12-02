import { Component } from '@angular/core';
import { ModalService } from 'ind-modal';
import { ModalComponent } from './modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  constructor(private modalService: ModalService) {
  }

  openModal() {
    this.modalService.open(ModalComponent);
  }
}
