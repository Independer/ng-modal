import { OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/first';
import { Modal, ModalClosedEventArgs } from './modal';

export abstract class ModalComponentBase implements Modal, OnInit {
  @ViewChild(Modal)
  modal: Modal;

  ngOnInit() {
    if (!this.modal) {
      throw new Error('Child component "ind-modal" cannot be found. Please make sure it is present in the template of this modal component.');
    }

    this.closed.subscribe(args => this.onClosed(args));
  }

  open(...args: any[]): void {
    this.modal.open(args);
  }

  close(...args: any[]): void {
    this.modal.close(args);
  }

  get closed(): Observable<ModalClosedEventArgs> {
    // Use "first" here to make sure the observable sequence completes
    // after the first event is fired. Otherwise, if the underlying event implementation
    // uses EventEmitter, the value is emmited, but the sequence is not completed (which is logical since
    // events can be fired multiple times normally, but not in this case) - this can cause problems when we
    // convert Observable to a Promise (using Observable.fromPromise), in which case the Promise will never
    // resolve until the observable sequence is completed.
    return this.modal.closed.first();
  }

  protected onClosed(args: ModalClosedEventArgs) {
    // To be overrided in derived classes
  }
}
