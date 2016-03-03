var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

//we'll keep clients data here
var clients = {};
var playerCount = 0;
var id = 0;

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  // console.log('New Client id=', socket.id, socket.handshake.address);
  playerCount++;
  id++;


    socket.emit('connected', { playerId: id });
    console.log('Client connected id:', id);
    io.emit('count', { playerCount: playerCount });


  socket.on('disconnect', function () {
    playerCount--;
    console.log('Client disconnected');
    io.emit('count', { playerCount: playerCount });
  });

  socket.on('update', function (data) {
    socket.broadcast.emit('updated', data);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
