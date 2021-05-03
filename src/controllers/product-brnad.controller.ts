import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Product,
  Brnad,
} from '../models';
import {ProductRepository} from '../repositories';

export class ProductBrnadController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) { }

  @get('/products/{id}/brnad', {
    responses: {
      '200': {
        description: 'Brnad belonging to Product',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Brnad)},
          },
        },
      },
    },
  })
  async getBrnad(
    @param.path.string('id') id: typeof Product.prototype.id,
  ): Promise<Brnad> {
    return this.productRepository.brnad(id);
  }
}
