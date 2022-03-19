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

1. Run docker compose up `localstack`
2. Move to `serveless` dir & run `serverless deploy`
   
   for localStack. run`serverlsss deploy -s local`
   
   ***requirements: LocalStack Pro.**
3. Move to `ws-chat-client` dir & run `vite dev`.
4. Open (localhost)[http://localhost:3000] on 2 browser tab.
5. Send message.
