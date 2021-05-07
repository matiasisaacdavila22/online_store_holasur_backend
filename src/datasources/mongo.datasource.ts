import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'mongo',
  connector: 'mongodb',
  url: 'mongodb+srv://online_user_store_db:Ea2k7690GM99rI7R@cluster0.pzh4e.mongodb.net/mercadonegro_store_DB?retryWrites=true&w=majority',
  host: 'cluster0.pzh4e.mongodb.net',
  port: 27017,
  user: 'online_user_store_db',
  password: 'Ea2k7690GM99rI7R',
  database: 'ProductSalesDB',
  useNewUrlParser: true,
  useUnifiedTopology: true,

};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MongoDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'mongo';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mongo', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
