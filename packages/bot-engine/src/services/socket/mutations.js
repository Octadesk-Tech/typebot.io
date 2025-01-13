import * as types from './mutations-types'

export default {
  [types.SET_CONNECTED](state, connected) {
    state.connected = connected
  },
  [types.SET_FORCE_DISCONNECT](state, value) {
    state.forceDisconnect = value
  }
}
