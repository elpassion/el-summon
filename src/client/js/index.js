import '../scss/main.scss';
import io from 'socket.io-client';

const SERVER_ADDRESS = 'http://localhost:8000';
const socket = io(SERVER_ADDRESS);

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
