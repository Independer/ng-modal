import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalTransclusionsDirective } from './modal-transclusions.directive';
import { ModalComponent } from './modal.component';
import { ModalService } from './modal.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ModalComponent,
    ModalTransclusionsDirective
  ],
  providers: [
    ModalService
  ],
  exports: [
    ModalComponent,
    ModalTransclusionsDirective
  ]
})
export class ModalModule {
}
