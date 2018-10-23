import '../scss/main.scss';
import io from 'socket.io-client';

const SERVER_ADDRESS = process.env.SERVER_ADDRESS;

document.addEventListener('DOMContentLoaded', () => {
  const ACTIVE_CLASSNAME = 'card__action--visible';

  const summonButton = document.getElementById('js_summonButton');
  const retryButton = document.getElementById('js_retryButton');
  const sectionButtonSummon = document.querySelector('.card__action--buttonSummon');
  const sectionButtonRetry = document.querySelector('.card__action--buttonRetry');
  const sectionInfoSummon = document.querySelector('.card__action--infoSummon');
  const sectionInfoOmw = document.querySelector('.card__action--infoOmw');
  const sectionInfoRejection = document.querySelector('.card__action--infoRejection');


  function activate(elements) {
    elements.forEach(element => element.classList.add(ACTIVE_CLASSNAME));
  }

  function deactivate(elements) {
    elements.forEach(element => element.classList.remove(ACTIVE_CLASSNAME));
  }

  function onSummonClick() {
    socket.emit('summon');
  }

  function onMessageSent() {
    activate([sectionInfoSummon, sectionButtonRetry]);
    deactivate([sectionButtonSummon, sectionInfoOmw, sectionInfoRejection]);
  }

  function onRetryClick() {
    activate([sectionButtonSummon]);
    deactivate([sectionInfoSummon, sectionInfoOmw, sectionButtonRetry, sectionInfoRejection]);
  }

  function onConfirmation() {
    activate([sectionInfoSummon, sectionInfoOmw, sectionButtonRetry]);
    deactivate([sectionButtonSummon, sectionInfoRejection]);
  }

  function onRejection() {
    activate([sectionInfoSummon, sectionInfoRejection, sectionButtonRetry]);
    deactivate([sectionButtonSummon, sectionInfoOmw]);
  }

  const socket = io(`${SERVER_ADDRESS}`);

  socket.on('connect', function () {
    console.log('connected to server');
  });

  socket.on('messageSent', onMessageSent);

  socket.on('confirmation', onConfirmation);

  socket.on('rejection', onRejection);

  summonButton.addEventListener('click', onSummonClick);
  retryButton.addEventListener('click', onRetryClick);
});

