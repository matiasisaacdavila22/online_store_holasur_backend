import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Brnad, BrnadRelations, Product} from '../models';
import {ProductRepository} from './product.repository';

export class BrnadRepository extends DefaultCrudRepository<
  Brnad,
  typeof Brnad.prototype.id,
  BrnadRelations
> {

  public readonly products: HasManyRepositoryFactory<Product, typeof Brnad.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('ProductRepository') protected productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(Brnad, dataSource);
    this.products = this.createHasManyRepositoryFactoryFor('products', productRepositoryGetter,);
    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }
}
