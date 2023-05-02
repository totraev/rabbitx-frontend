import { makeAutoObservable } from "mobx";

import appModel, { type ApplicationModel } from "../models/app.model";
import connection, { type ConnectionService } from "../services/api/connection.service";
import authService, { type AuthService } from "../services/api/auth.service";

type ConnectionState = "disconnected" | "connecting" | "connected";

class ApplicationViewModel {
  connectionState: ConnectionState = "disconnected";

  constructor(
    private appModel: ApplicationModel,
    private connection: ConnectionService,
    private authServide: AuthService
  ) {
    makeAutoObservable(this);

    this.connection.on("state", (ctx) => {
      this.updateConnectionState(ctx.newState);
    });

    this.connection.getToket = this.authenticate;
  }

  get isAuth(): boolean {
    return Boolean(this.appModel.jwtToken);
  }

  updateConnectionState(status: ConnectionState) {
    this.connectionState = status;
  }

  authenticate = async (): Promise<string> => {
    if (this.isAuth) {
      return this.appModel.jwtToken;
    }

    const jwtToken = await this.authServide.getToken();

    this.appModel.setToken(jwtToken ?? '');

    return jwtToken ?? '' 
  }

  init(): Promise<void> {
    this.reset();
    
    return this.connection.connect();
  }

  reset() {
    this.connection.disconnect();

    this.connectionState = 'disconnected';
  }
}

const appViewModel = new ApplicationViewModel(appModel, connection, authService);

export default appViewModel;
