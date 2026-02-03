import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Utils {
  constructor() {}
  public* range(end: number,start=0): Generator<number,void,unknown> {
    for (let i = start; i <= end; i++) {
      yield i;
    }
  }
}
