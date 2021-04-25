var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
const translate = require('google-translate-api')

var nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
         XOAuth2: {
   
        user: "tikhiy.ro@gmail.com",
        clientId: "7682348251768v4c8do.apps.googleusercontent.com",
        clientSecret: "dePJ2oD-0Vd5dc1Xx",
        refreshToken: "1//04TV7GgXf-1tmuQF8Nmir57G7wsQRTzvTuNs8L7ATAsJoIkQgdwHQ1uxt6ZU1-DUBJBpDqY"
         }
    },
    debug: true
   
});

let mailOptions = {
    from: "tikhiy.ro@gmail.com",
    to: "tikhiy.ro@gmail.com",
    subject: 'Nodemailer Project',
    text: 'Hi from your nodemailer project'
};

exports.sendMail = function () {
    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Email sent successfully");
        }
    })
};

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
    app.post('/insert/', api.saveE);


    //Налаштовуємо сторінки
    app.use(express.static(path.join(__dirname, '../Frontend/www')));

    //Запуск додатка за вказаним портом
    app.listen(port, function () {
        console.log('My Application Running on http://localhost:' + port + '/');
    });
}

module.exports.translate = translate;
module.exports.startServer = startServer;
