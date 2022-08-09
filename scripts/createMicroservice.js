'use strict'

const fs = require('fs');
const args = process.argv;

if( args.length < 3 ){
    console.log("please pass microservice name");
    return;
}

function createFolder(fileName){
    fs.mkdirSync(`./server/${fileName}`);
    const rootPath = `./server/${fileName}/${fileName}`;
    fs.writeFileSync(rootPath + 'Route.js', `'use strict'`);
    fs.writeFileSync(rootPath + 'Model.js', `'use strict'`);
    fs.writeFileSync(rootPath + 'Controller.js', `'use strict'`);
    fs.writeFileSync(rootPath + 'Service.js', `'use strict'`);
    fs.writeFileSync(rootPath + 'Config.json', `{}`);
}


/** */
for( let i = 2 ; i < args.length ; i++){
    const fileName = args[i];
    createFolder(fileName);
}