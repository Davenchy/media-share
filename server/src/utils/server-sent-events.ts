type Listener = () => void

class ServerSentEvents {
  private timer: NodeJS.Timeout | undefined = undefined
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

  notify() {
    if (this.timer) return

    this.timer = setTimeout(() => {
      this.timer = undefined
      for (const listener of this.listeners) listener()
    }, 400)
  }
}

export default new ServerSentEvents()
