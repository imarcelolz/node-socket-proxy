import { v4 as uuid } from 'uuid';

export interface IMessage {
  id: string
  type: string
  payload: string

  toJSON(): string
}

export class Message implements IMessage {
  id: string;
  type: string = '';
  payload: string = '';

  constructor(message: Partial<IMessage>) {
    Object.assign(this, message);
    this.id ||= uuid();
  }

  toJSON(): string {
    return JSON.stringify(this)
  }
}
