var main = require('./Backend/main');
var main2 = require('./Backend/api');
main2.ddf();
main.startServer(5050);
main2.sendSch();