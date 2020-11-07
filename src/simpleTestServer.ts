import { EventBroker } from './eventBroker'
import { Message, IMessage } from './message'
import { ProxyEvents } from './proxy'

export interface ActionResult {}
export type Action = (payload: string) => ActionResult
export type ActionMapping = { [key: string]: Action }

export function serverMessagePattern(serverName: string) {
  return `Server:${serverName}`
}

export class SimpleTestServer {
  private actions: ActionMapping = {}

  constructor(
    protected serverName: string,
    protected eventBroker: EventBroker
  ) {
    this.eventBroker.publish(new Message({ type: ProxyEvents.ServerRegister, payload: serverName }))
    this.eventBroker.subscribe(serverMessagePattern(serverName), this.onMessage)
  }

  registerAction(name: string, action: Action) {
    this.actions[name] = action
  }

  private onMessage(message: IMessage) {
    console.debug(`Server: ${this.serverName}, received a message:`, JSON.stringify(message))

    this.eventBroker.publish(new Message({ type: ProxyEvents.MessageReceived, id: message.id }))

    const action = this.actions[message.type]
    if(!action) {
      console.warn(`I don't know how to handle this message type type: ${message.type}`)
      return
    }

    action(message.payload)
  }
}
