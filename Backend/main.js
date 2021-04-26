var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');



function startServer(port) {
    //Створюється застосунок
    var app = express();
    var api = require('./api');

    //Налаштування директорії з шаблонами


    //Налаштування виводу в консоль списку запитів до сервера
    app.use(morgan('dev'));

    //Розбір POST запитів
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.text());
    app.post('/insert/', api.saveE);
     app.post('/send-html/', api.createDoc);


    //Налаштовуємо сторінки
    app.use(express.static(path.join(__dirname, '../Frontend/www')));

    //Запуск додатка за вказаним портом
    app.listen(port, function () {
        console.log('My Application Running on http://localhost:' + port + '/');
    });
}


module.exports.startServer = startServer;
