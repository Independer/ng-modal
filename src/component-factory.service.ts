import {
  ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable,
  Injector, Type, ViewContainerRef
} from '@angular/core';

@Injectable()
export class ComponentFactoryService {

  constructor(private cfr: ComponentFactoryResolver, private injector: Injector) {
  }

  createComponent<T>(componentType: Type<T>, location?: HTMLElement | ViewContainerRef, injector?: Injector): ComponentRef<T> {
    let componentFactory = this.cfr.resolveComponentFactory(componentType);

    let componentRef: ComponentRef<T>;

    injector = injector || this.injector;

    if (location && location instanceof ViewContainerRef) {
      componentRef = location.createComponent(componentFactory, undefined, injector);
    }
    else {
      componentRef = componentFactory.create(injector);

      let appRef = this.injector.get(ApplicationRef);
      appRef.attachView(componentRef.hostView);

      this.addComponentToDom(location as HTMLElement || document.body, componentRef);
    }

    return componentRef;
  }

  private addComponentToDom<T>(parent: HTMLElement, componentRef: ComponentRef<T>): HTMLElement {
    let componentElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    parent.appendChild(componentElement);

    return componentElement;
  }
}
