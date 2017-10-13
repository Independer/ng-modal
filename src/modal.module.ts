import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalTransclusionsDirective } from './modal-transclusions.directive';
import { ModalComponent } from './modal.component';
import { ModalService } from './modal.service';
import { ComponentFactoryService } from './component-factory.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ModalComponent,
    ModalTransclusionsDirective
  ],
  providers: [
    ComponentFactoryService,
    ModalService
  ],
  exports: [
    ModalComponent,
    ModalTransclusionsDirective
  ]
})
export class IndModalModule {
}
