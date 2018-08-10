# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project

- Use NPM to initialize your project and create package.json to store project dependencies.
```
npm init
```
- Install crypto-js with --save flag to save dependency to our package.json file
```
npm install crypto-js --save
```
- Install level with --save flag
```
npm install level --save
```
- Install express
```
npm install --save express
npm install -g nodemon
npm i multer
```
## Testing

To test code:
- 1. Open terminal in another window
```
curl -X GET http://localhost:3001/block/4
Invalid block if genesis block not created yet
```
- 2. Create Genesis block
```curl -X "POST" "http://localhost:3001/block" -H 'Content-Type: application/json' -d $'{"body":"Genesis block"}'
```
- 3. Add more blocks
```
curl -X "POST" "http://localhost:3001/block" -H 'Content-Type: application/json' -d $'{"body":"block body contents 1"}'
curl -X "POST" "http://localhost:3001/block" -H 'Content-Type: application/json' -d $'{"body":"block body contents 2"}'
```
- 4.
```
curl -X GET http://localhost:3001/block/0
{"hash":"2107bd3e7b9c48c7e45ebde6b24368e69bb99f8c9c962f7583e3503d2eeddedb","height":1,"body":"block body contents 0","time":"1533908826","previousBlockHash":""}
```
```
curl -X GET http://localhost:3001/block/1
{"hash":"25d9ff74df4954c546a3b18560624585197e775571f78e4bf16da298916a3eeb","height":2,"body":"block body contents 1","time":"1533908838","previousBlockHash":"2107bd3e7b9c48c7e45ebde6b24368e69bb99f8c9c962f7583e3503d2eeddedb"}
```
```
curl -X GET http://localhost:3001/block/4
Invalid block_id
```