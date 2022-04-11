# superagent-plugin-sign-with-aws-sigv4-
Sign Superagent requests with AWS IAM Sigv4 from containers with AWS IAM IRSA backed Service Accounts.

WIP - dumpplace


## Usage 

`.use(await signSuperagentRequest())`


```ts
async function callSomeApiPut(param1: string, param2: string) {
    const url = `${baseURL}/${param1}/${param2}`;
    const call = await superagent
        .put(url)
        .use(await signSuperagentRequest())
        .accept('json');
    return call;
}

async function callSomeApiDelete(param1: string, param2: string) {
    const url = `${baseURL}/${param1}/${param2}`;
    const call = await superagent
        .delete(url)
        .use(await signSuperagentRequest())
        .accept('json');
    return call;
}
```