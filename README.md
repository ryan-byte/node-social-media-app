# Social Media App
- Still in development.

### config file:
- Add `config.env` file to the server folder, then add the following:
```
jwtSecretKey = "<secret string>"
PORT = <integer>
mongodbURL = "<mongodb connect url>"
```

### how to run the project:
- Install the project modules by running the following commands on the root of the project:
```
npm ci
npm run install-modules
```

- Run project (without nodemon):
```
npm start
```
- Run project (with nodemon):
```
npm run dev
```



### pages color palette:
- Located at /client/src/assets/styles/colorScheme.css