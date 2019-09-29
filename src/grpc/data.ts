import * as jspb from 'google-protobuf';
import { grpc } from '@improbable-eng/grpc-web';
// import { getHost } from './client';

export function getUnaryData<TReq extends jspb.Message, TRes extends grpc.ProtobufMessage>(
  request: TReq,
  service: grpc.UnaryMethodDefinition<TReq, TRes>,
  host: string
): Promise<ReturnType<TRes['toObject']>> {
  return new Promise((resolve, reject) => {
    grpc.unary(service, {
      request,
      host,
      onEnd: (res: grpc.UnaryOutput<TRes>) => {
        const { status, statusMessage, message } = res;
        if (status !== grpc.Code.OK) {
          return reject(new Error(`Error ${status}: ${statusMessage}`));
        } else if (!message) {
          return reject(new Error(`Error ${grpc.Code.NotFound} : No data found`));
        }

        return resolve(message.toObject() as ReturnType<TRes['toObject']>);
      },
    });
  });
}

export function getDataStream<TReq extends jspb.Message, TRes extends grpc.ProtobufMessage>(
  request: TReq,
  service: grpc.MethodDefinition<TReq, TRes>,
  onMessageCallback: (message: TRes) => void,
  host: string
) {
  return new Promise<string>((resolve, reject) => {
    const client = grpc.client(service, {
      host,
    });
    client.onMessage(onMessageCallback as (message: grpc.ProtobufMessage) => void);
    client.onEnd((code: grpc.Code, message: string) => {
      if (code !== grpc.Code.OK) {
        return reject(new Error(`Error ${status}: ${message}`));
      }
      return resolve(message);
    });
    client.start();
    client.send(request);
  });
}
