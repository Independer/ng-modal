import { Injectable, Injector, Type } from '@angular/core';
import { ComponentFactoryService } from './component-factory.service';
import { ModalRef, InternalModalRef } from './modal-ref';

@Injectable()
export class ModalService {
  constructor(private componentFactory: ComponentFactoryService, private injector: Injector) {
  }

  open<T>(componentType: Type<T>): T {
    const modalRef = new InternalModalRef<T>();

    let injector = Injector.create([
      { provide: InternalModalRef, useValue: modalRef },
      { provide: ModalRef, useValue: modalRef }
    ], this.injector);

    let componentRef = this.componentFactory.createComponent(componentType, undefined, injector);

    modalRef.open();

    modalRef.closed.subscribe(() => {
      componentRef.destroy();
    });

    return componentRef.instance;
  }
}