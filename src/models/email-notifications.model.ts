import {Model, model, property} from '@loopback/repository';

@model()
export class EmailNotifications extends Model {
  @property({
    type: 'string',
    required: true,
  })
  to: string;

  @property({
    type: 'string',
    required: true,
  })
  subject: string;

  @property({
    type: 'string',
    required: true,
  })
  body: string;

  @property({
    type: 'string',
    required: true,
  })
  htmlBody: string;

  @property({
    type: 'string',
    required: true,
  })
  textBody: string;


  constructor(data?: Partial<EmailNotifications>) {
    super(data);
  }
}

export interface EmailNotificationsRelations {
  // describe navigational properties here
}

export type EmailNotificationsWithRelations = EmailNotifications & EmailNotificationsRelations;
