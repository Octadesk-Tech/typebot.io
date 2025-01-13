import Socket from 'socket.io-client'

import services from '@/services'

import * as types from './mutations-types'

let _connectIntervalToken = null

const INITIAL_DEFAULT_DELAY = 50

let _delayConnectInterval = INITIAL_DEFAULT_DELAY

function _delayedConnect(context) {
  if (_delayConnectInterval > 100000) {
    _delayConnectInterval = INITIAL_DEFAULT_DELAY
  }

  _connectIntervalToken && clearTimeout(_connectIntervalToken)

  _connectIntervalToken = setTimeout(
    () => tryConnect(context),
    _delayConnectInterval
  )

  _delayConnectInterval =
    _delayConnectInterval * parseInt(Math.random() * 5 + 1.5)
}

let connecting = false

async function tryConnect(context) {
  if (connecting) {
    return
  }

  console.info('socket connecting...')

  connecting = true

  const token = context.getters.token

  if (token === '') {
    connecting = false
    _delayedConnect(context)
  } else {
    try {
      const socketURL = await services.socket.getSocketURL()

      const socket = Socket(`${socketURL.url}/${context.getters.company}`, {
        path: socketURL.path,
        transports: ['websocket'],
        reconnection: false,
        auth: {
          token: context.getters.token
        }
      })

      services.socket.setSocket(socket)

      _delayConnectInterval = INITIAL_DEFAULT_DELAY

      connecting = false
    } catch (ex) {
      console.error('error on socket connect', ex)

      _delayedConnect(context)

      connecting = false
    }
  }
}

export const connect = context => _delayedConnect(context)

export const setForceDisconnect = (context, value) =>
  context.commit(types.SET_FORCE_DISCONNECT, value)

export const disconnect = context => {
  context.dispatch('setForceDisconnect', true)

  services.socket.socketDisconnect()
}

export const setConnected = (context, value) =>
  context.commit(types.SET_CONNECTED, value)

export const emit = (context, payload) =>
  services.socket.socketEmit(payload.event, payload.data, payload.callback)
