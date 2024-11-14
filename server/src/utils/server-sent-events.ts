type Listener = (userId: string) => void

class ServerSentEvents {
  private listeners: Listener[] = []

  addListener(listener: Listener) {
    this.listeners.push(listener)
    return () => this.removeListener(listener)
  }

  removeListener(listener: Listener) {
    const index = this.listeners.findIndex(l => l === listener)
    if (index === -1) return
    this.listeners.splice(index, 1)
  }

  push(userId: string) {
    for (const listener of this.listeners) listener(userId)
  }
}

export default new ServerSentEvents()
