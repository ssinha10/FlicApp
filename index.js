var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/one-click', function (req, res) {
  io.emit('one-click', tableID);
});


app.get('/double-click', function (req, res) {
  io.emit('double-click', tableID);
});


app.get('/hold', function (req, res) {
  io.emit('hold', tableID);
});


io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(app.get('port'), function(){
  console.log('listening on *:5000');
});
