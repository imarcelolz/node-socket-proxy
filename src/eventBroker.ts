import redis, { RedisClient } from 'redis'
import { IMessage } from './message'

type EventHandler = (message: IMessage) => void

export class EventBroker {
  private redis: RedisClient

  constructor(redisUrl: string) {
    this.redis = redis.createClient(redisUrl)
  }

  publish(eventName: string, message: IMessage): Promise<void> {
    // this.redis.publish(message.type, JSON.stringify(message))

    return Promise.resolve()
  }

  subscribe(eventName: string, eventHandler: EventHandler): Promise<void> {
    // this.redis.psubscribe(eventName)
    // this.redis.on('')
    // this.redis.psubscribe(eventName, (_pattern: string, _channel: string, data: string) => {
    //   eventHandler(new Message(JSON.parse(data)))
    // })
    return Promise.resolve()
  }

  unsubscribe(eventName: string, eventHandler: EventHandler): Promise<void> {
    // this.redis.punsubscribe(eventName, eventHandler)
    return Promise.resolve()
  }
}
