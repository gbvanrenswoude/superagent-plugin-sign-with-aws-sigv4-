/* eslint-disable no-console */
import { getDefaultRoleAssumerWithWebIdentity } from '@aws-sdk/client-sts';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import aws4 from 'aws4';
import url from 'url';


export async function signSuperagentRequest() {
    const provider = defaultProvider({
        roleAssumerWithWebIdentity: getDefaultRoleAssumerWithWebIdentity(),
    });
    const tempAwsCredentials = await provider();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function signRequest(req: any) {
        const end = req.end;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        req.end = function (cb: any) {
            const data = req.header['Content-Type'] === 'application/json' ? JSON.stringify(req._data) : req._formData;

            const headers = req.header;
            if (tempAwsCredentials.sessionToken) {
                headers['X-Amz-Security-Token'] = tempAwsCredentials.sessionToken;
            }

            const parsedUrl = url.parse(req.url, true);
            const path = parsedUrl.path;

            const signedOptions = aws4.sign(
                {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    host: parsedUrl.host!,
                    method: req.method,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    path: path!,
                    body: data,
                    service: 'execute-api',
                    region: 'na-east-1', // TODO
                    headers: headers,
                },
                tempAwsCredentials,
            );

            req.header = signedOptions.headers;

            req.end = end;
            req.end(cb);

            return this;
        };

        return req;
    };
}
