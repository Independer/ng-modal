import {
  Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnDestroy, HostListener,
  forwardRef, OnInit
} from '@angular/core';
import { ModalBodyStylingHelper } from './modal-body-styling.helper';
import { Modal, ModalClosedEventArgs, ModalCloseReason } from './modal';

@Component({
  selector: 'ind-modal',
  templateUrl: './modal.component.html',
  // tslint:disable-next-line:no-forward-ref
  providers: [{ provide: Modal, useExisting: forwardRef(() => ModalComponent) }]
})
export class ModalComponent implements Modal, OnInit, OnDestroy {
  @Input() closeOnEscape = true;
  @Input() closeOnOutsideClick = true;
  @Input() showCloseButton = true;
  @Input() type: 'popup' | 'side-panel' | 'large-side-panel' = 'popup';
  @Input() stickyFooter = false;
  @Input() routeBehavior = false;

  @Output() closed = new EventEmitter<ModalClosedEventArgs>(false);

  @ViewChild('modalRoot') modalRoot: ElementRef;
  @ViewChild('header') headerElement: ElementRef;
  @ViewChild('body') bodyElement: ElementRef;
  @ViewChild('footer') footerElement: ElementRef;

  isOpened = false;
  isClosing = false;

  @HostListener('window:resize')
  onWindowResize() {
    if (this.isOpened) {
      this.updateBodyPosition();
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

    this.isOpened = true;
    this.isClosing = false;

    window.setTimeout(() => {
      this.modalRoot.nativeElement.focus();
      this.updateBodyPosition();
    }, 0);

    ModalBodyStylingHelper.onModalOpened();
  }

  close(result: any) {
    this.doClose(ModalCloseReason.Programmatically, result);
  }

  onOutsideClick() {
    if (this.closeOnOutsideClick) {
      this.doClose(ModalCloseReason.OutsideClick);
    }
  }

  onEscapePressed() {
    if (this.closeOnEscape) {
      this.doClose(ModalCloseReason.Escape);
    }
  }

  onCloseButtonClick() {
    this.doClose(ModalCloseReason.CloseButton);
  }

  protected doClose(reason: ModalCloseReason, result?: any) {
    if (!this.isOpened || this.isClosing) {
      return;
    }

    if (reason === ModalCloseReason.BrowserBackNavigation && this.routeBehavior) {
      // Don't do anything and let the angular router close the modal
      this.onClosed(reason, result);
      return;
    }

    this.isClosing = true;

    this.onModalRootAnimationEnd(() => {
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

  private onModalRootAnimationEnd(callback: () => any) {
    let element = this.modalRoot.nativeElement;
    let eventName = this.getAnimationEndEventName(element);

    if (eventName !== undefined) {
      let runOnce = (e: any) => {
        callback();
        element.removeEventListener(e.type, runOnce);
      };

      element.addEventListener(eventName, runOnce, false);
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

  private updateBodyPosition() {
    let headerEl = this.headerElement.nativeElement;
    let bodyEl = this.bodyElement.nativeElement;
    let footerEl = this.footerElement.nativeElement;

    // Set top offset by the header height
    headerEl.style.height = '';
    let headerHeight = headerEl.clientHeight + 'px';
    headerEl.style.height = headerHeight;
    bodyEl.style.top = headerHeight;

    // Set bottom offset by the footer height
    footerEl.style.height = '';
    let footerHeight = footerEl.clientHeight + 'px';
    footerEl.style.height = footerHeight;
    bodyEl.style.bottom = footerHeight;
  }
}


