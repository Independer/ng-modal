import {
  ApplicationRef, ComponentFactoryResolver, ComponentRef,
  Injectable, Injector, Type, ViewContainerRef
} from '@angular/core';

import {
  ComponentType,
  Portal,
  ComponentPortal,
  DomPortalHost
} from '@angular/cdk/portal';

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
      location?: HTMLElement | ViewContainerRef,
      injector?: Injector): ComponentRef<T> {

    // The location where the component should live in Angular's logical component tree, where
    // it will be part of change detection, etc.
    // This is different from where the component renders, which is determined by the PortalHost.
    let logicalLocation: ViewContainerRef | undefined = undefined;

    // Host element for rendering the component. By default, use "body".
    let domLocation: HTMLElement = document.body;

    if (location) {
      if (location instanceof HTMLElement) {
        // The location was provided as an arbitrary element and we don't
        // know if it is part of the Angular app, so leave it "undefined"
        // and let the PortalHost take care of attaching it to the Angular app.
        logicalLocation = undefined;
        domLocation = location;
      }
      else {
        // Location is ViewContainerRef, so use it as the logical tree location as well as actuall
        // render location.
        logicalLocation = location;
        domLocation = location.element.nativeElement;
      }
    }

    // Create a Portal based on the given component type
    let componentPortal = new ComponentPortal(componentType, logicalLocation, injector);

    // Create a PortalHost with the specified location as its anchor element
    let bodyPortalHost = new DomPortalHost(
      domLocation,
      this.cfr,
      this.appRef,
      injector || this.defaultInjector);

    // Attach the Portal to the PortalHost. This will instantiate the component and add
    // it to the DOM. We get a ComponentRef back that we can use to access the component
    // instance as well as destroy the component after we're done with it.
    let componentRef = bodyPortalHost.attach(componentPortal) as ComponentRef<T>;

    return componentRef;
  }
}
