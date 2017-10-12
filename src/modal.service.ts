import { Injectable, ComponentFactoryResolver, Type, Injector, ApplicationRef, EmbeddedViewRef } from '@angular/core';
import { Modal } from './modal';

@Injectable()
export class ModalService {
  constructor(private cfr: ComponentFactoryResolver, private defaultInjector: Injector) {
  }

  open<T extends Modal>(componentType: Type<T>): T {
    let componentFactory = this.cfr.resolveComponentFactory(componentType);

    let componentRef = componentFactory.create(this.defaultInjector);

    let appRef = this.defaultInjector.get(ApplicationRef);
    appRef.attachView(componentRef.hostView);

    let componentElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    document.body.appendChild(componentElement);

    componentRef.instance.open();

    componentRef.instance.closed.subscribe(() => {
      appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    });

    return componentRef.instance;
  }
}
