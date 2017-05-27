const fs = require('fs')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const chokidar = require('chokidar')
const process = require('process')
const NodeCache = require('node-cache')

const cache = new NodeCache()

const port = 3000
const dataFile = 'data/data.json'

app.use('/', express.static('src'))
app.use('/media', express.static('media'))

process.on('uncaughtException', function (err) {
  console.error(`Uncaught exception: ${err}`)
})

function refreshData (callback) {
  fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err) throw err
    cache.set('data', data)
    if (callback) callback(data)
  })
}

function sendData (socket) {
  let data = cache.get('data')
  if (data == null) {
    refreshData((data) => {
      socket.emit('data', data)
    })
  } else {
    socket.emit('data', data)
  }
}

io.on('connection', (socket) => {
  sendData(socket)
})

chokidar.watch(dataFile).on('change', () => {
  refreshData(() => sendData(io))
})

server.listen(port, () => {
  console.log(`Live at port ${port} 😎`)
})
