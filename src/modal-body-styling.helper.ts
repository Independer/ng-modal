import { Injectable } from '@angular/core';

@Injectable()
export class ModalBodyStylingHelper {

  private static activeModalsCount = 0;
  private static restoreBodyStyling: (() => void | undefined) | undefined = undefined;

  public static onModalOpened() {
    // Modify the document body only if this is the first modal
    if (ModalBodyStylingHelper.activeModalsCount === 0) {
      ModalBodyStylingHelper.restoreBodyStyling = ModalBodyStylingHelper.modifyBodyStylingForOpenModal();
    }

    ModalBodyStylingHelper.activeModalsCount++;
  }

  public static onModalClosed() {
    if (ModalBodyStylingHelper.activeModalsCount === 0) {
      // If there were no modals open we don't need to do anything
      return;
    }

    ModalBodyStylingHelper.activeModalsCount--;

    if (ModalBodyStylingHelper.activeModalsCount === 0) {
      // Restore only if the last modal was closed
      ModalBodyStylingHelper.restoreBodyStyling();
    }
  }

  private static modifyBodyStylingForOpenModal(): () => void {
    let originalBodyPadding: number | undefined;
    let originalBodyScrollPosition: number;

    let widthDiffs = window.innerWidth - document.body.clientWidth;
    originalBodyScrollPosition = document.body.scrollTop;

    document.body.classList.add('modal-open');

    let scrollBarWidth = widthDiffs - (window.innerWidth - document.body.clientWidth);
    if (scrollBarWidth > 0) {
      originalBodyPadding = parseInt((document.body.style.paddingRight || '0'), 10);
      document.body.style.paddingRight = (originalBodyPadding + scrollBarWidth) + 'px';
      document.body.classList.add('modal-padded');
    }

    window.setTimeout(() => {
      document.body.style.top = -originalBodyScrollPosition + 'px';
    }, 700);

    // Return a function that restores the styles back.
    return () => {
      // do not try to remove all the classes in one line, as IE is not able to interpret it. Each class should be removed separately.
      document.body.classList.remove('modal-open');
      document.body.classList.remove('modal-padded');

      document.body.style.top = '';

      if (originalBodyScrollPosition !== undefined && document.body.scrollTop !== originalBodyScrollPosition) {
        document.body.scrollTop = originalBodyScrollPosition;
      }

      if (originalBodyPadding) {
        document.body.style.paddingRight = originalBodyPadding + 'px';
      }
      else {
        document.body.style.paddingRight = '';
      }
    };
  }
}
