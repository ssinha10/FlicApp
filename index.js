var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

mongoose.connect('mongodb://waiterqueue:waiterqueue@ds013738.mongolab.com:13738/heroku_txdrn6vx');

var TableQueue = require('./models/TableQueue');
var queue;
TableQueue.find({}, function(err, queues){
  if (err){
    console.log(err);
    return;
  }
  if(queues.length >=1){
    queue = queues[0];
  } else {
    queue = new TableQueue();
    queue.save(function(err){
      if (err){
        console.log(err);
        return;
      }
    });
  }
});


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/one-click/:tableID', function (req, res) {
  io.emit('one-click', req.tableID);
  queue.addTable(req.tableID, "service");
  console.log(queue);
  res.send('success');
});


app.get('/double-click/:tableID', function (req, res) {
  io.emit('double-click', req.tableID);
  queue.addTable(req.tableID, "check");
  console.log(queue);
  res.send('success');
});


app.get('/hold/:tableID', function (req, res) {
  io.emit('hold', req.tableID);
  res.send('success');
});


io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(app.get('port'), function(){
  console.log('listening on *:5000');
});
