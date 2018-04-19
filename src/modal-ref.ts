import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operator/first';
import { ModalClosedEventArgs, ModalComponent } from './modal.component';

export abstract class ModalRef<T = any> {
  abstract closed: Observable<ModalClosedEventArgs>;
  abstract injectedData: any | undefined;
  abstract close(...args: any[]): void;
  abstract get componentInstance(): T;
}

export class InternalModalRef<T = any> implements ModalRef<T> {
  private _modal: ModalComponent | undefined;
  private _componentInstance: T | undefined;
  public injectedData: any | undefined;

  registerModal(modal: ModalComponent) {
    this._modal = modal;
  }

  registerComponentInstance(instance: T) {
    this._componentInstance = instance;
  }

  get componentInstance(): T {
    if (!this._componentInstance) {
      throw new Error('Component instance has not been registered yet.');
    }

    return this._componentInstance;
  }

  open() {
    this.modal.open();
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
    return first.call(this.modal.closed);
  }

  private get modal() {
    if (!this._modal) {
      throw new Error('An instance of ModalComponent is not registered. Please make sure that your own modal component ' +
        'that you instantiate via ModalService contains "modal" in its template.')
    }
    return this._modal;
  }
}
