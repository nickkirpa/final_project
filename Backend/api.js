var mongoose = require('mongoose');
var cron = require('node-cron');


var SubsSchema;
var Subs;

function ddf() {
    // Импортировать модуль mongoose


    // Установим подключение по умолчанию
    var mongoDB = 'mongodb://127.0.0.1/test';
    mongoose.connect(mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    mongoose.connect(mongoDB);
    // Позволим Mongoose использовать глобальную библиотеку промисов
    mongoose.Promise = global.Promise;
    // Получение подключения по умолчанию
    var db = mongoose.connection;

    // Привязать подключение к событию ошибки  (получать сообщения об ошибках подключения)
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    console.log("Connected to mongoDB");
    SubsSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true
        }
    }, ); //Приствореннімоделізадаєтьсяназваколекції(таблиці)
    Subs = mongoose.model('subs', SubsSchema);



};
exports.ddf = ddf;

async function sendSch() {
    cron.schedule('46 4 * * *', () => {
        sendAll("Scheduled group mail","Test msg");
        console.log("Scheduled sent");
    });
};
exports.sendSch = sendSch;

async function sendAll(subj,mess) {
    let result = await Subs.find({});
    result.forEach(function (element) {
        console.log(element.email);
        send(subj, mess, element.email);
    });
};
exports.sendAll = sendAll;
var nodemailer = require('nodemailer');

async function send(subj, mess, to) {
    const mailfrom = 'odiagpopogodi@gmail.com'; //emailAccount@maildomen.dom, //DISABLE SECURITY IN GOOGLE
    //IN ORDER TO GET THIS FUNCTION WORK
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: mailfrom,
            pass: "ozsoaxvifxxlmscz" //password here
        }
    });


    let result = await transporter.sendMail({
        from: mailfrom,
        to: to,
        subject: subj,
        text: mess
    });
    console.log(result);

}

exports.send = send;



exports.saveE = function saveE(req, res) {
    const tempSplit = JSON.stringify(req.body).split('"', 3);
    var email = tempSplit[1];
    console.log(email);
    if (email === undefined) {
        res.send("empty field");
        return;
    }

    Subs.exists({
        email: email
    }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log("Such document already exist?: " + result);
            if (!result) {

                var subs = new Subs({
                    email: email,
                });
                subs.save(function (err, subs_db) {

                    if (!err) {
                        console.log(subs_db._id);
                        console.log("successfully added to db");
                    }
                });
                res.send("Inserted into db");
            }
            if (result) res.send("Such document already exist");
        }
    });


};
