const express = require('express');
const app = express();
const http = require('http').Server(app);
const ejs = require('ejs');
const io = require('socket.io')(http);
const marked = require('marked');
const bad = require('bad-words');
const filter = new bad();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function(req, res) {
  res.render("index");
});

io.sockets.on('connection', (socket) => {
  socket.on('username', function(username) {
    socket.username = username;
    io.emit('is_online', '<i>' + socket.username + ' joined</i>');
  });

  socket.on('disconnect', (username) => {
    io.emit('is_online', '<i>' + socket.username + ' left</i>');
  });

  socket.on('chat_message', (message) => {
    let time = new Date();
    io.emit('chat_message',`<i>${time.toLocaleTimeString()}</i><br>` +  '<strong>' + socket.username + '</strong>: ' + marked(filter.clean(message)));
  });
});

const server = http.listen(8080, () => {
  console.log('listening on *:8080');
});

