const { GetMessageHistoryService, SaveMessageService } = require('./services');

// Socket config
const app   = require('express')();

// const sjwt = require('socketio-jwt')
const http  = require('http').Server(app);
const io    = require('socket.io')(http, { cors: { origin: '*' }});

// To listen to messages
io.of('/chat').on('connection', (socket) => {
  console.log('Chat connected...');
  let target = {}, room = {};

  socket.on('join', async (user, presentation) => {
    console.log(`User is trying to join ${presentation} room`);
    room = presentation;

    socket.join(presentation);

    console.log('Starting to join room...');
    const getMessageHistorySvc = new GetMessageHistoryService(user, room);
    try {
      await getMessageHistorySvc.get();
      socket.emit('welcome', getMessageHistorySvc.getMessages());

    } catch (error) {
      console.log(error);
      socket.emit('error', 'Failed getting presentation messages');
    }
  });

  socket.on('send', async (user, message) => {
    console.log('New message received...');

    // TODO validate users on message
    const saveMessageService = new SaveMessageService(user, room);
    try {
      await saveMessageService.save(message);
      console.log('Sending received event to client');
      io.of('/chat').to(room).emit('received', saveMessageService.getLatestMessage());
    } catch (error) {
      socket.emit('error', 'Failed to save message');
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Chat Disconnected...');
  })
})

module.exports = http;