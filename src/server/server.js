require('dotenv').config();

const http = require('http');
const socketIO = require('socket.io');
const { WebClient } = require('@slack/client');
const moment = require('moment');

const PORT = process.env.PORT;
const CHANNEL_ID = process.env.SLACK_CHANNEL_ID;
const SLACK_TOKEN = process.env.SLACK_TOKEN;

const slackClient = new WebClient(SLACK_TOKEN);
const app = http.createServer();
const io = socketIO(app);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

io.on('connection', socket => {
  console.log('connection')
  const onSummon = () => {
    console.log('summon')
    slackClient.chat.postMessage({
      channel: CHANNEL_ID,
      text: `It's ${moment(Date.now()).format('HH:mm:ss')} and someone's at the door!`
    })
      .then(() => {
        socket.send({ body: 'Message sent to channel!' });
      })
      .catch(console.error);
  };

  socket.on('summonClick', onSummon);
});
