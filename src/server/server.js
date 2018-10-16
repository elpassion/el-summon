const http = require('http');
const socketIO = require('socket.io');

const app = http.createServer();
const io = socketIO(app);

app.listen(8000, () => {
  console.log('listening on post 8000');
});

io.on('connection', socket => {
  console.log('client connected,', socket.id);
  socket.send({ body: 'hello!', sender: 'server' });

  socket.on('disconnect', () => console.log('client disconnected,', socket.id));

  socket.on('summonClick', () => console.log('someone was summoned'));
});
