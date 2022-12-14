'use strict';

const fs = require('fs');
const args = process.argv;

if (args.length < 3) {
  console.log('please pass microservice name');
  return;
}

function createFolder(fileName) {
  fs.mkdirSync(`./server/${fileName}`);
  const rootPath = `./server/${fileName}/${fileName}`;
  const modelFile = `'use strict'

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const ${fileName}Schema = mongoose.Schema({
    
});

${fileName}Schema.plugin(mongoosePaginate);
module.exports = mongoose.mainConnection.model('${fileName}',${fileName}Schema,'${fileName}s');
`;
  fs.writeFileSync(rootPath + 'Route.js', `'use strict'`);
  fs.writeFileSync(rootPath + 'Model.js', modelFile);
  fs.writeFileSync(rootPath + 'Controller.js', `'use strict'`);
  fs.writeFileSync(rootPath + 'Service.js', `'use strict'`);
  fs.writeFileSync(rootPath + 'Config.json', `{}`);
}

/** */
for (let i = 2; i < args.length; i++) {
  const fileName = args[i];
  createFolder(fileName);
}
