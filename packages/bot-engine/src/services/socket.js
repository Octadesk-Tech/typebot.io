import { url as URLResolver } from '@octadesk-tech/services'
import store from '@/store'
import pako from 'pako'

export const getSocketURL = async () => {
  const baseURL = new URL(
    (await URLResolver.getAPIURL('websocket')) || process.env.VUE_APP_SOCKET_URL //verificar a variavel de ambiente
  )
  const url = baseURL.hostname
  const path = baseURL.pathname == '/' ? '' : baseURL.pathname

  return {
    url: `wss://${url}`,
    path: `${path}/socket.io`
  }
}

let _socket

function emit(event, payload) {
  const camelcased =
    'socket' +
    event
      .replace('SOCKET', '')
      .replace(/^([A-Z])|[\W\s_]+(\w)/g, (match, p1, p2) =>
        p2 ? p2.toUpperCase() : p1.toLowerCase()
      )

  for (const namespaced in store._actions) {
    const action = namespaced.split('/').pop()

    if (action.startsWith('socket') && action === camelcased) {
      const decompressedMessage = JSON.parse(
        pako.inflate(payload, { to: 'string' })
      )
      store.dispatch(namespaced, decompressedMessage)
    }
  }
}

const disconnect = () => {
  store.dispatch('setConnected', false)

  _socket = undefined

  if (!store.getters.forceDisconnect) {
    store.dispatch('connect')
  }
}

const socketConnect = () => {
  store.dispatch('setConnected', _socket.connected)

  store.dispatch('setForceDisconnect', false)

  console.info('socket connected')
}

export const setSocket = socket => {
  _socket = socket

  _socket.on('connect', () => socketConnect())

  _socket.on(
    'disconnect',
    err => console.log('socket_disconnect') || console.dir(err) || disconnect()
  )

  _socket.on(
    'error',
    err => console.log('socket_error') || console.dir(err) || disconnect()
  )

  _socket.on(
    'connect_error',
    err =>
      console.log('socket_connect_error') || console.dir(err) || disconnect()
  )

  _socket.on(
    'connect_timeout',
    err =>
      console.log('socket_connect_timeout') || console.dir(err) || disconnect()
  )

  _socket.on(
    'reconnect_error',
    err =>
      console.log('socket_reconnect_error') || console.dir(err) || disconnect()
  )

  _socket.on(
    'reconnect_failed',
    err =>
      console.log('socket_reconnect_failed') || console.dir(err) || disconnect()
  )

  _socket.onevent = packet => emit('SOCKET_' + packet.data[0], packet.data[1])
}

export const socketEmit = (event, payload, callback) => {
  if (_socket) {
    _socket.emit(event, payload, callback)
  }
}

export const socketDisconnect = () =>
  _socket ? _socket.disconnect() : undefined
