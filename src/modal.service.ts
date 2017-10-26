import { Injectable, Type } from '@angular/core';
import { Modal } from './modal';
import { ComponentFactoryService } from './component-factory.service';

@Injectable()
export class ModalService {
  constructor(private componentFactory: ComponentFactoryService) {
  }

  open<T extends Modal>(componentType: Type<T>): T {
    let componentRef = this.componentFactory.createComponent(componentType);

    componentRef.instance.open();

    componentRef.instance.closed.subscribe(() => {
      componentRef.dispose();
    });

    return componentRef.instance;
  }
}
