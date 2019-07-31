import { defer } from 'rxjs/internal/observable/defer';
import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

export function asyncError<T>(errorObject: any) {
  return defer(() => Promise.reject(errorObject));
}

export abstract class Page<P> {
  constructor(protected _fixture: ComponentFixture<P>) {}

  protected query<T>(selector: string): T {
    return this._fixture.nativeElement.querySelector(selector);
  }

  protected queryAll<T>(selector: string): T[] {
    return this._fixture.nativeElement.querySelectorAll(selector);
  }

  protected queryDe(selector: string): DebugElement {
    return this._fixture.debugElement.query(By.css(selector));
  }

  protected queryAllDe(selector: string): DebugElement[] {
    return this._fixture.debugElement.queryAll(By.css(selector));
  }
}
