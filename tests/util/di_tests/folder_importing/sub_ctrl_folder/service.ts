import 'reflect-metadata';
import { Component } from '../../../../../index';

@Component()
export class DummyService {
  constructor (private _statusCode: number = 5) {}

  getStatusCode(): number {
    return this._statusCode;
  }
}
