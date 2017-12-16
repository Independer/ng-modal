import {
  Component, Input, Output, EventEmitter, ElementRef, OnDestroy, HostListener,
  OnInit, ViewChild, HostBinding, Optional, Directive
} from '@angular/core';
import { ModalBodyStylingHelper } from './modal-body-styling.helper';
import { InternalModalRef } from './modal-ref';

export enum ModalCloseReason {
  Programmatically,
  OutsideClick,
  Escape,
  CloseButton,
  BrowserBackNavigation,
  Destroy
}

export class ModalClosedEventArgs {
  constructor(public readonly reason: ModalCloseReason,
              public readonly result: any) {
  }
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'modal-header, modal-content, modal-footer, model-header-after'
})
export class ModalTransclusionsDirective {
}



@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modal',
  templateUrl: './modal.component.html'
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() closeOnEscape = true;
  @Input() closeOnOutsideClick = true;
  @Input() showCloseButton = true;
  @Input() routeBehavior = false;

  @Output() closed = new EventEmitter<ModalClosedEventArgs>(false);

  @ViewChild('modalRoot') modalRoot: ElementRef;
  @ViewChild('backdrop') backdrop: ElementRef;

  get classModalClosing() { return this.isClosing; }

  @HostBinding('style.display')
  get styleDisplay() { return this.isOpening || this.isOpened ? 'block' : 'none'; }

  @HostBinding('attr.hidden')
  @HostBinding('attr.area-hidden')
  get attrHidden() { return !this.isOpened && !this.isOpening ? '' : undefined; }

  get classFade() { return this.isOpening || this.isOpened; }
  get classShow() { return this.isOpened && !this.isClosing; }

  private isClosing = false;
  private isOpening = false;
  private isOpened = false;

  constructor(@Optional() modalRef?: InternalModalRef) {
    if (modalRef) {
      modalRef.registerModal(this);
    }
  }

  @HostListener('window:popstate')
  onBrowserBack() {
    this.doClose(ModalCloseReason.BrowserBackNavigation);
  }

  ngOnInit() {
    if (this.routeBehavior) {
      this.open();
    }
  }

  ngOnDestroy() {
    if (this.isOpened) {
      this.onClosed(ModalCloseReason.Destroy);
    }
  }

  open(...args: any[]) {
    if (this.isOpened) {
      return;
    }

    this.isClosing = false;
    this.isOpening = true;

    setTimeout(() => {
      this.isOpening = false;
      this.isOpened = true;
      this.modalRoot.nativeElement.focus();
    }, 0);

    ModalBodyStylingHelper.onModalOpened();
  }

  close(result: any) {
    this.doClose(ModalCloseReason.Programmatically, result);
  }

  onBackdropClick() {
    if (this.closeOnOutsideClick) {
      this.doClose(ModalCloseReason.OutsideClick);
    }
  }

  onModalRootClick(event: Event) {
    if (!this.closeOnOutsideClick) {
      return;
    }

    if (event.target !== event.currentTarget) {
      // Only close if user clicked anywhere on the root element and
      // not inside the dialog content.
      return;
    }

    this.doClose(ModalCloseReason.OutsideClick);
  }

  @HostListener('keydown.esc')
  onEscapePressed() {
    if (this.closeOnEscape) {
      this.doClose(ModalCloseReason.Escape);
    }
  }

  onCloseButtonClick() {
    this.doClose(ModalCloseReason.CloseButton);
  }

  protected doClose(reason: ModalCloseReason, result?: any) {
    if (!this.isOpened) {
      return;
    }

    if (reason === ModalCloseReason.BrowserBackNavigation && this.routeBehavior) {
      // Don't do anything and let the angular router close the modal
      this.onClosed(reason, result);
      return;
    }

    this.isClosing = true;

    this.onAnimationEnd(this.modalRoot.nativeElement, () => {
      this.onClosed(reason, result);
    });
  }

  protected onClosed(reason: ModalCloseReason, result?: any) {
    this.isOpened = false;
    this.isClosing = false;

    ModalBodyStylingHelper.onModalClosed();

    this.closed.emit(new ModalClosedEventArgs(reason, result));

    if (this.routeBehavior && reason !== ModalCloseReason.BrowserBackNavigation && reason !== ModalCloseReason.Destroy) {
      window.history.back();
    }
  }

  private onAnimationEnd(element: HTMLElement, callback: () => any) {
    const animationEventName = this.getAnimationEndEventName(element);
    const transitionEventName = this.getTransitionEndEventName(element);

    if (animationEventName !== undefined || transitionEventName !== undefined) {
      let done = false;

      let runOnce = () => {
        if (!done) {
          callback();
          done = true;
        }

        element.removeEventListener(animationEventName, runOnce);
        element.removeEventListener(transitionEventName, runOnce);
      };

      if (animationEventName !== undefined) {
        element.addEventListener(animationEventName, runOnce, false);
      }

      if (transitionEventName !== undefined) {
        element.addEventListener(transitionEventName, runOnce, false);
      }
    }
    else {
      callback();
    }
  }

  private getAnimationEndEventName(el: any): string | undefined {
    let animations: any = {
      'animation': 'animationend',
      'OAnimation': 'oAnimationEnd',
      'MozAnimation': 'animationend',
      'WebkitAnimation': 'webkitAnimationEnd',
      'MSAnimation': 'MSAnimationEnd'
    };

    for (let t in animations) {
      if (el.style[t] !== undefined) {
        return animations[t];
      }
    }

    return undefined;
  }

  private getTransitionEndEventName(el: any): string | undefined {
    let transitions: any = {
      'transition' : 'transitionend',
      'OTransition' : 'oTransitionEnd',
      'MozTransition' : 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd',
      'MSTransition': 'MSTransitionEnd'
    };

    for (let t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }

    return undefined;
  }
}


