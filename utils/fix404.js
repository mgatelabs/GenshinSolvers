// Import the filesystem module
const fs = require('fs');

fs.writeFileSync("./dist/404.html", fs.readFileSync("./dist/index.html"));