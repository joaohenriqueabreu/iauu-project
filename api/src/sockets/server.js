const GetMessageHistoryService = require('../services/message/getMessageHistory')
const SearchUnreadNotificationsService = require('../services/notification/searchUnreadNotifications')
const MarkNotificationReadService = require('../services/notification/markNotificationRead')
const SaveMessageService = require('../services/message/saveMessage')

// Socket config
const app = require('express')()

// const sjwt = require('socketio-jwt')
const http = require('http').Server(app)
const io = require('socket.io')(http)
const eventHandler = require('../events/handler')

io.of('/notifications').on('connection', (socket) => {
  console.log('User connected for notifications...')

  // Fetch existing socketUser notifications
  socket.on('login', async (socketUser) => {
    console.log('User logged in...')
    const searchUnreadNotificationsSvc = new SearchUnreadNotificationsService(socketUser)
    searchUnreadNotificationsSvc.search()
      .then(() => socket.emit('unreadNotifications', searchUnreadNotificationsSvc.getNotifications()))
      .catch((error) => socket.emit('error', 'Failed getting unread notifications'))

    eventHandler.on('newNotification', (user, notification) => {
      // Only owners should see their own notifications (this is not very nice TODO search alternative solution)
      if (socketUser.id !== user.id) { return }
      console.log('received new notification event...')
      notification.message = 'Another notification'
      socket.emit('newNotification', notification)
    })
  })

  socket.on('read', (socketUser, notification) => {
    console.log('Marking notification read')
    const markNotificationReadSvc = new MarkNotificationReadService(socketUser, notification)
    markNotificationReadSvc.markRead()
      .then(() => socket.emit('notificationRead', markNotificationReadSvc.getNotifications()))
      .catch((error) => socket.emit('error', 'Failed marking notification read'))
  })

  socket.on('disconnect', () => {
    console.log('Notifications Disconnected...')
  })
})

// To listen to messages
io.of('/chat').on('connection', (socket) => {
  console.log('Chat connected...')
  let target = {}, room = {}

  socket.on('join', (presentation) => {
    room = presentation

    socket.join(presentation, () => { 
      const getMessageHistorySvc = new GetMessageHistoryService(null, { id: presentation })
      getMessageHistorySvc.get()
        .then(() => socket.emit('welcome', getMessageHistorySvc.getMessages()))
        .catch((error) => socket.emit('error', 'Failed getting presentation messages'))
      })
  })

  socket.on('send', (user, message) => {
    console.log('New message received...')

    // TODO validate users on message
    const saveMessageService = new SaveMessageService(user, { id: room, message: message })
    saveMessageService.save()
      .then(() => { io.of('/chat').to(room).emit('received', saveMessageService.getLatestMessage()) })
      .catch((error) => socket.emit('error', 'Failed to save message'))
  })
  
  socket.on('disconnect', () => {
    console.log('Chat Disconnected...')
  })
})

module.exports = http