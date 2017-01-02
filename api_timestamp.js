
// Main app. entry point
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');


var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

var error_json = {"unix":null,"natural":null};

app.use(bodyParser.json({ type: '*/*' }));

const from_natural = function (natural_date, err) {
    
    var str_date = natural_date.replace(/%20/g, " ");
    str_date = str_date.split(/[\s,]+/);
 
    // convert to unix time: 2013/09/05 15:34:00
    var str_unix_time = str_date[2] + "/" + (monthNames.indexOf(str_date[0])+1) + "/" + str_date[1] + " 00:00:00";
  
    var v_date  = new Date(str_unix_time).getTime()/1000;
 
    if (isNaN(v_date)) {
        return error_json;
    } else {
      return ({
        unix: v_date,
        natural: natural_date
        });
    }
    
}

const from_unix = function (unix_date) {
    
    var date = new Date(unix_date*1000);

    
    if (isNaN(date.getTime())) {
        return error_json;
    }
    
    var year = date.getFullYear();
    var month = monthNames[date.getMonth()];
    var day = date.getDate();
    var date_string = month + " " + day +  ", " + year;

    return ({
        unix: unix_date,
        natural: date_string
    });
}

app.get('/*', function(req, res){
    var res_json;
    var err;
    

    var str_unix_time = req.originalUrl.slice(1);
    var int_unix_time = parseInt(str_unix_time);
    
    if (isNaN(int_unix_time)) {
        console.log("Is NOT UNIX time");
        res_json = from_natural (str_unix_time, err);
    } else {
        console.log("Is UNIX time");
        res_json = from_unix(int_unix_time);
    }
    
    res.send(res_json);
  });

const port = 8080;
const server = http.createServer(app);
server.listen(port);

console.log('Server listening on: ', port);