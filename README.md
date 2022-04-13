## Steup
Folder structure to develop Near smart contract using assembly language.

### Project

1. Install `Node 14`
2. npm init
3. npm i -g near-cli
4. npm i --save-dev 'assemblyscript@^0.19.3'
5. npx asinit .
6. npm i --save-dev @as-pect/cli
7. npx asp --init
8. npm i near-sdk-as

### Modification

1. update `as-pect.config.js` and import `near-sdk-as/imports`
2. replace asconfig.json content by
```js
{
  "entry": "assembly/index.ts",
  "options": {
    "binaryFile": "out/main.wasm"
  },
  "extends": "near-sdk-as/asconfig.json"
}
``` 
### Test

1. npx asp

### Create Testnet Account

1. near login
2. code `~/.near-credentials/testnet`

### Setup Contract Dev

1. Delete `tests` folder
2. Add `out` folder.
3. Import near-sdk-as types: add a new file `assembly/as_types.d.ts` then copy/past this code
```js
/// <reference types="near-sdk-as/assembly/as_types" />
```
4. Add a file `deploy.sh`
5. run `chmod +x deploy.sh`
6. copy/past this code

```sh
#!/bin/bash
near deploy --accountId "account_id" --wasmFile "out/main.wasm"
```

### Near CMDs

1. Deploy: `./deploy.sh`
2. view contract storage: `near view-state "account_id" --finality final`
3. create a Tx: `near call method_name '{args}' --accountId "account_id"`
4. view data: `near view account_id method_name '{args}'`
5. Tx status: `near tx-status hash --accountId account_id`
