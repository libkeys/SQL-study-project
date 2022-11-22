const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const mysql = require('mysql2');

app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'study1',
    password: '4248SQLxyz'
});

connection.connect(function (err) {
    if (err) {
        return console.log(`There is an error ${err.message}`);
    }
    else {
        console.log('Подключение к серверу MySQL успешно установлено');
    }
})

// connection.query('SELECT * FROM users', function(err, results, fields){
//     console.log(err);
//     console.log(results);
//     // console.log(fields);
// })

app.get('/about', function (request, response) {
    response.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/send-user', function (request, response) {
    // console.log(request.body);
    let requestData = request.body;
    let result = new Promise(function (resolve, reject) {
        connection.query(`INSERT INTO users(age, name, country) VALUES (${requestData.age}, '${requestData.name}', '${requestData.country}');`, function (err, results, fields) {
            // console.log(results);
            answer = {}
            if (err !== null) {
                answer.result = err;
                answer.message = 'something went wrong'
                reject(answer);
            }
            else {
                answer.result = results;
                answer.message = 'everything is fine'
                data = 22
                resolve(answer);
            }
        })
    })

    result.then(result => {
        response.end(JSON.stringify(result));
        console.log(result);
    }).catch(err => {
        response.end(JSON.stringify(err))
    });


    // async function sendRequest2() {
    //     let result = await sendRequest();
    //     // result.then(data => {
    //     //     console.log(data);
    //     // })
    //     console.log(result)
    //     result.then(data => {return data});
    // }

    // let data = '';
    // async function sendRequest(){
    //     connection.query(`INSERT INTO users(age, name, country) VALUES (${requestData.age}, '${requestData.name}', '${requestData.country}');`, function (err, results, fields) {
    //         console.log(results);
    //         answer = {}
    //         if (err !== null) {
    //             answer.result = err;
    //             answer.message = 'something went wrong'
    //         }
    //         else {
    //             answer.result = results;
    //             answer.message = 'everything is fine'
    //             data = answer
    //         }
    //     })
    // }

    // result = sendRequest();
    // console.log(result);

    // let result = sendRequest()
    // console.log(result)
    // response.end(JSON.stringify(result));

    // fs.writeFileSync(filePath, JSON.stringify(request.body));
    // response.end(JSON.stringify(answer));
});

app.get('/get-users', function(request, response){
    let result = new Promise(function (resolve, reject) {
        connection.query(`select * from users;`, function (err, results, fields) {
            // console.log(results);
            if (err !== null) {
                let answer = err;
                reject(answer);
            }
            else {
                let answer = results;
                resolve(answer);
            }
        })
    });

    result.then(answer => {
        console.log(answer)
        response.end(JSON.stringify(answer));
    });
});

app.post('/delete-user', function(request, response){
    // console.log(request.body);
    let requestID = request.body.iduser
    let result = new Promise(function (resolve, reject) {
        connection.query(`select * from users where idUser='${requestID}';`, function (err, results, fields) {
            // console.log(results);
            if (err !== null) {
                let answer = err;
                reject(answer);
            }
            else {
                let answer = results;
                resolve(answer);
            }
        })
    });
    result.then(answer => {
        console.log(answer)
        response.send(JSON.stringify(answer))
    })
    connection.query(`delete from users where idUser='${requestID}';`, function(err, results, fields){
    });
    // result.then(answer => {
    //     response.end(JSON.stringify(answer));
    // });
})

// app.post('/send-another', function (request, response) {
//     let answer = request.body
//     answer.anotherField = 88
//     response.end(JSON.stringify(answer));
// });

app.listen(3000);

