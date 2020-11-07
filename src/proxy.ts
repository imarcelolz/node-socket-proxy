import { EventBroker } from './eventBroker'
import { IMessage, Message } from './message'
import { SimpleTestServer } from './simpleTestServer'
import { Server as WebSocketServer } from 'ws';
import { v4 as uuid } from 'uuid'

export enum ProxyEvents {
  ServerRegister = 'ProxyEvents:ServerRegisrer',
  ServerRemove = 'ProxyEvents:ServerRemove',
  MessageReceived = 'ProxyEvents:MessageReceived',
}

type ServerId = string
type SessionId = string

export class Proxy {
  private websocket: WebSocketServer

  constructor(private eventBroker: EventBroker, private sessionManager: SessionManager) {

    this.websocket = new WebSocketServer({ port: 8080 })
    this.websocket.on('connection', this.onClientConnected)
  }

  async processClientMessage(sessionId: SessionId, message: IMessage) {
    const server = await this.sessionManager.getServerBySession(sessionId)

    server.dispatch(message)
  }

  async processServerMessage(serverId: ServerId, message: IMessage) {
    const sessions = await this.sessionManager.getSessionsByServer(serverId)

    sessions.map((session) => session.dispatch(message))
  }

  private onClientConnected(_instance: any, socket: any) {
    const session = new Session(uuid(), socket)

    this.sessionManager.addSession(session)
    // todo: handle disconection
  }

  private onServerConected(serverId: ServerId) {
    this.sessionManager.addServer(new Server(serverId, this.eventBroker))
  }
}


class SessionManager {
  servers: Server[] = []
  sessions: Session[] = []

  addServer(server: Server) {
    this.servers.push(server)
  }

  addSession(session: Session) {
    this.sessions.push(session)
  }

  removeSession(session: Session) {
  }

  removeServer(session: Session) {
  }

  getSessionsByServer(serverId: ServerId): Promise<Session[]> {
    return Promise.resolve(this.sessions)
  }

  getServerBySession(sessionId: SessionId): Promise<Server> {
    return Promise.resolve(this.servers[0])
  }
}

interface ICanHandleMessages {
  id: string
  dispatch(message: IMessage): void
}

class Server implements ICanHandleMessages {
  constructor(
    public readonly id: string,
    private eventBroker: EventBroker
  ) {}

  dispatch(message: IMessage): void {
    this.eventBroker.publish(this.id, message)
  }
}

class Session implements ICanHandleMessages {
  constructor(public readonly id: string, private socket: WebSocket) {
    this.dispatch(new Message({ type: 'sessionId', payload: id}))
  }

  dispatch(message: IMessage): void {
    this.socket.send(message.toJSON())
  }
}
