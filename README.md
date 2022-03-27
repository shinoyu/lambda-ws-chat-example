# lambda-ws-chat-example
Example: web socket message app on AWS.

## Tools to use.

- localstack on docker
- pnpm
- vita
- serverless framework


## Enviroments settings.

Using serverless framework on localstack.

```
pnpm install -g serverless
pnpm install --save-dev serverless-localstack
```

## Usage

1. Create and setup AWS Account, then create aws profile for the runnable suverless iac operation.
2. Move to `serveless` dir & run `serverless deploy`
3. Move to `ws-chat-client` dir.
4. Define settings in .env.local as in .env variables.
5. run `vite dev`.
6. Open (localhost)[http://localhost:3000] on 2 browser tab.
7. Send message.
