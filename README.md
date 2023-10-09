# Hikit - Sentieri e Cartografia UI for CAI Bologna
Hikit - Sentieri e Cartografia UI is an italian localized app that makes easy to work with the [SeC API](https://github.com/loreV/SeC), in the context of the Bologna Alpine Club.  
It supports trails related data manipulation and visualization and, as it is strongly related to the API, the versioning is tight to the API itself. 
## Build
Run `ng build` to build the project (before you may need to run an `npm install`).  
The build artifacts will be stored in the `dist/` directory.  
Use the `--prod` flag for a production build.
### Development Run
If you are on a stable branch, simply run `ng serve --proxy-config src/proxy.conf.json --host 0.0.0.0` to start a dev server, then navigate to `http://localhost:4200/` to browse the project runtime. The app runtime will automatically reload if you change any of the source files.

#### Application bindings
When you are not aligned to the backend version, you can self-generate the interface binding from an S&C OpenAPI endpoint by running the [SeC API](https://github.com/loreV/SeC) (for example on default `localhost:8990`) and then by executing `npm run generate-local-binding`. 
Also you can point to a remote OpenAPI file by running `npx openapi-typescript <remote-server-address>/api/v<x>/api-docs --output ./src/binding/Binding.ts`

## Vision and challenges
SeC UI aims to be a strongly end-user focused UI, that easily allows to gather, save and link rich data about trails, accessibility notifications, planned maintenance data and POI, among others.
