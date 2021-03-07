# SeC - Sentieri e Cartografia UI
SeC UI is an italian localized app that makes easy to work with the [SeC API](https://github.com/loreV/SeC).  
It supports trails related data manipulation and visualization and, as it is strongly related to the API, the versioning is tight to the API itself. 
## Build
Run `ng build` to build the project (before you may need to run an `npm install`).  
The build artifacts will be stored in the `dist/` directory.  
Use the `--prod` flag for a production build.
### Development Run
Run `ng serve --proxy-config src/proxy.conf.json --host 0.0.0.0` for a dev server. Navigate to `http://localhost:4200/`.
The app will automatically reload if you change any of the source files.
## Vision and challenges
SeC UI aims to be a strong end-user focused UI, that easily allow to gather and save rich data about trails, while connecting this data to a community accessibility notifications, planned maintenance data and POI.
It aims to provide a first point of access for trails management while integrating to central storage via OSM by REST APIs.
