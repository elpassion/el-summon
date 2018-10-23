require('dotenv').config();

const http = require('http');
const parseBody = require('parse-body');
const socketIO = require('socket.io');
const { WebClient } = require('@slack/client');
const moment = require('moment');

const PORT = process.env.PORT;
const CHANNEL_ID = process.env.SLACK_CHANNEL_ID;
const SLACK_TOKEN = process.env.SLACK_TOKEN;

const nowForHumans = () => moment(Date.now()).format('HH:mm:ss');

const slackClient = new WebClient(SLACK_TOKEN);
const app = http.createServer(
  (req, res) => {
    if (req && req.method === 'POST') {
      parseBody(req, 1e6, function (err, body) {
        if (err) {
          return console.error(err);
        }
        const { original_message: originalMessage, user, actions } = JSON.parse(body.payload);
        const performedAction = actions[0];
        const isComing = performedAction.value === 'accepted';

        io.to(performedAction.name).emit(isComing ? 'confirmation' : 'rejection');

        const response = {
          ...originalMessage,
          attachments: [{ 'text': `${user.name} ${isComing ? 'is on their way' : 'does not care'} (at ${ nowForHumans() })` }],
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
      });
    }
  }
);
const io = socketIO(app);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

io.on('connection', socket => {
  const { id } = socket;
  console.log(`incoming connection from ${id}`);

  const onSummon = () => {
    console.log(`summon by ${id}`);
    slackClient.chat.postMessage({
      channel: CHANNEL_ID,
      text: `It's ${nowForHumans()} and someone's at the door!`,
      attachments: [
        {
          'text': 'Your reaction:',
          'callback_id': 'summon',
          'color': '#28c23e',
          'attachment_type': 'default',
          'actions': [
            {
              'name': socket.id,
              'text': 'I\'m coming!',
              'type': 'button',
              'value': 'accepted'
            },
            {
              'name': socket.id,
              'text': 'Whatever, I don\'t care',
              'type': 'button',
              'value': 'rejected'
            }
          ]
        }
      ]
    })
      .then(() => {
        console.log(`message sent to ${CHANNEL_ID}`);
        socket.emit('messageSent', 'Message sent to the channel!');
      })
      .catch(console.error);
  };

  socket.on('summon', onSummon);
});
