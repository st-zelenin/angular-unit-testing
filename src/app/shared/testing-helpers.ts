import { defer } from 'rxjs/internal/observable/defer';
import { ComponentFixture } from '@angular/core/testing';
import { DebugElement, Directive, Input, HostListener } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Type } from '@angular/compiler';

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
  constructor(protected _fixture: ComponentFixture<P>) {}

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
