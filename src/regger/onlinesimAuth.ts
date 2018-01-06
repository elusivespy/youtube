var ajax = require("./sendData.js");


body: {
    username: username
    password: password
    dev_key: dev_key
}

// ajax

var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://onlinesim.ru/api/login.php",
    "method": "POST",
    "data" : {
       "username": "trussss",
       "password": "password",
       "dev_key": "Ключ доступен только для разработчиков, обратитесь в тех. поддержду",
    },
    "headers": {
        "accept": "application/json"
    }
}
