import '../scss/main.scss';
import io from 'socket.io-client';

const SERVER_ADDRESS = process.env.SERVER_ADDRESS;
const PORT = process.env.PORT;
const socket = io(`${SERVER_ADDRESS}:${PORT}`);

socket.on('connect', function () {
  console.log('connected to server');
});

socket.on('message', function (payload) {
  console.log('received message:', payload);
});

const onSummonClick = () => {
  socket.emit('summonClick');
};

document.addEventListener('DOMContentLoaded', () => {
  const summonButton = document.getElementById('summonButton');
  summonButton.addEventListener('click', onSummonClick);
});
