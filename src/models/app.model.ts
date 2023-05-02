import { makeAutoObservable } from 'mobx';

export class ApplicationModel {
  jwtToken: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  setToken(value: string) {
    this.jwtToken = value;
  }
}

const appModel = new ApplicationModel();

export default appModel;