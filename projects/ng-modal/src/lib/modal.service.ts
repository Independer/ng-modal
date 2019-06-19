import { Injectable, Injector, Type } from '@angular/core';
import { ComponentFactoryService } from './component-factory.service';
import { ModalRef, InternalModalRef } from './modal-ref';

@Injectable()
export class ModalService {
  constructor(private componentFactory: ComponentFactoryService, private injector: Injector) {
  }

  open<T>(componentType: Type<T>, initialise?: (instance: T) => void): ModalRef<T> {
    const modalRef = new InternalModalRef<T>();

    const injector = Injector.create({
      providers: [
        { provide: InternalModalRef, useValue: modalRef },
        { provide: ModalRef, useValue: modalRef }
      ],
      parent: this.injector
    });

    const componentRef = this.componentFactory.createComponent(componentType, undefined, injector);

    modalRef.registerComponentInstance(componentRef.instance);

    if (initialise) {
      initialise(modalRef.componentInstance);
    }

    modalRef.open();

    modalRef.closed.subscribe(() => {
      componentRef.destroy();
    });

    return modalRef;
  }
}
