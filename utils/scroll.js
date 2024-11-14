"use strict";
const messageLogger=()=>{
    var app2 = require('http').createServer().listen(3001);
    var io = require('socket.io').listen(app2);
    var AsteriskAmi = require('asterisk-manager');
    var ami = new require('asterisk-manager')('user', 'secret', {host: 'localhost', port: 3001});
    io.sockets.on('connection', function(socket) {
        socket.emit('notification', {message: "connected"});
    });
    ami.on('managerevent', function(data) {
        console.log(data);
        io.sockets.emit('ami_event', data);
    });
    ami.connect(function(){
    });
}
module.exports=messageLogger;