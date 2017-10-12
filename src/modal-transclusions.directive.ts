import { Directive } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'ind-modal-header, ind-modal-content, ind-modal-footer, ind-model-header-after'
})
export class ModalTransclusionsDirective {
}