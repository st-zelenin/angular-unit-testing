import { DebugElement, Directive, HostListener, Input } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { defer } from 'rxjs/internal/observable/defer';

export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

export function asyncError<T>(errorObject: any) {
  return defer(() => Promise.reject(errorObject));
}

@Directive({
  selector: '[routerLink]'
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  @HostListener('click')
  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

export abstract class Page<P> {
  constructor(protected _fixture: ComponentFixture<P>) { }

  protected query<T>(selector: string): T {
    return this._fixture.nativeElement.querySelector(selector);
  }

  protected queryAll<T>(selector: string): T[] {
    return this._fixture.nativeElement.querySelectorAll(selector);
  }

  protected queryDeByCss(selector: string): DebugElement {
    return this._fixture.debugElement.query(By.css(selector));
  }

  protected queryAllDeByCss(selector: string): DebugElement[] {
    return this._fixture.debugElement.queryAll(By.css(selector));
  }

  protected queryDeByDirective(directive): DebugElement {
    return this._fixture.debugElement.query(By.directive(directive));
  }

  protected queryAllDeByDirective(directive): DebugElement[] {
    return this._fixture.debugElement.queryAll(By.directive(directive));
  }
}

export const ButtonClickEvents = {
  left: { button: 0 },
  right: { button: 2 }
};

export function click(el: DebugElement | HTMLElement, eventObj: any = ButtonClickEvents.left): void {
  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler('click', eventObj);
  }
}
