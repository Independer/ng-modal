import {
  ApplicationRef, ComponentFactoryResolver, ComponentRef,
  EmbeddedViewRef, Injectable, Injector, Type, ViewContainerRef
} from '@angular/core';

import {
  ComponentType,
  Portal,
  ComponentPortal,
  DomPortalHost
} from '@angular/cdk/portal';

export interface ModalComponentRef<T> {
  instance: T;
  dispose();
}

@Injectable()
export class ComponentFactoryService {
  constructor(
      private cfr: ComponentFactoryResolver,
      private defaultInjector: Injector,
      private appRef: ApplicationRef) {
  }

  /**
   * Instantiates a component and adds it to the DOM.
   * @constructor
   * @param {Type<T>} componentType - Type of the component to create, e.g. "DynamicComponent".
   * @param {HTMLElement | ViewContainerRef} location - (Optional) Location where to inject the
   * component in the DOM, can be an arbitrary HTML element or a ViewContainerRef.
   * @param {Injector} injector - (Optional) Injector that should be used as a parent injector
   * for the component. This is useful only if you want to inject into the component services
   * that are provided in a different place from where ComponentFactoryService is provided.
   */
  createComponent<T>(
      componentType: Type<T>,
      location?: HTMLElement,
      injector?: Injector): ModalComponentRef<T> {

    let componentPortal = new ComponentPortal(componentType);

    let bodyPortalHost = new DomPortalHost(
      location || document.body,
      this.cfr,
      this.appRef,
      injector || this.defaultInjector);

    let componentRef = bodyPortalHost.attach(componentPortal) as ComponentRef<T>;

    return {
      instance: componentRef.instance,
      dispose: () => {
        bodyPortalHost.detach();
      }
    };
  }
}
