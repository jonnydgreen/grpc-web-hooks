export interface IGrpcClientOptions {
  host: string;
}

export class GrpcClient {
  private host: string;

  public constructor(options: IGrpcClientOptions) {
    this.host = this.validateHost(options.host);
  }

  public getHost() {
    return this.host;
  }

  private validateHost(host: string) {
    return host;
  }
}
