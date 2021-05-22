import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Advertising, AdvertisingRelations} from '../models';

export class AdvertisingRepository extends DefaultCrudRepository<
  Advertising,
  typeof Advertising.prototype.id,
  AdvertisingRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Advertising, dataSource);
  }
}
