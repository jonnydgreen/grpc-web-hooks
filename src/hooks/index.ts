import * as React from 'react';
import { getUnaryData } from '../grpc/data';
import * as jspb from 'google-protobuf';
import { grpc } from '@improbable-eng/grpc-web';
import { GrpcClientContext } from '../context';

export function useUnary<TReq extends jspb.Message, TRes extends grpc.ProtobufMessage>(
  request: TReq,
  service: grpc.UnaryMethodDefinition<TReq, TRes>
) {
  // Init
  const [data, setData] = React.useState<ReturnType<TRes['toObject']> | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Get client details
  const GrpcClient = React.useContext(GrpcClientContext);

  // Load data after the first render
  React.useEffect(() => {
    // Kick off
    setLoading(true);
    getUnaryData(request, service, GrpcClient.getHost())
      .then(response => {
        setData(response);
        if (error) {
          setError(null);
        }
      })
      .catch(err => {
        setError(err);
        if (data) {
          setData(null);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
