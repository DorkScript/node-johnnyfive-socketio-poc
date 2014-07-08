var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
app.use(express.static(__dirname + '/public'));

server.listen(8000);
var five = require("johnny-five"),
    potentiometer,
    board = new five.Board();

io.sockets.on('connection', function (socket) {
  console.log('Socket connected');
  socket.emit('connected');

  board.on("ready", function() {
    potentiometer = new five.Sensor({
      pin: "A0",
      freq: 250
    });

    board.repl.inject({
      pot: potentiometer
    });

    potentiometer.on("data", function() {
      // console.log(this.value);
      socket.emit("data", this.value);
    });
  });
});
