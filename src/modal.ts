import { Observable } from 'rxjs/Observable';

export enum ModalCloseReason {
  Programmatically,
  OutsideClick,
  Escape,
  CloseButton,
  BrowserBackNavigation,
  Destroy
}

export class ModalClosedEventArgs {
  constructor(public readonly reason: ModalCloseReason, public readonly result: any) {
  }
}

export abstract class Modal {
  abstract closed: Observable<ModalClosedEventArgs>;
  abstract open(...args: any[]): void;
  abstract close(result?: any): void;
}
