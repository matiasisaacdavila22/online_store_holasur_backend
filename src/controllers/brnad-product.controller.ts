import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Brnad,
  Product,
} from '../models';
import {BrnadRepository} from '../repositories';

export class BrnadProductController {
  constructor(
    @repository(BrnadRepository) protected brnadRepository: BrnadRepository,
  ) { }

  @get('/brnads/{id}/products', {
    responses: {
      '200': {
        description: 'Array of Brnad has many Product',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Product)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Product>,
  ): Promise<Product[]> {
    return this.brnadRepository.products(id).find(filter);
  }

  @post('/brnads/{id}/products', {
    responses: {
      '200': {
        description: 'Brnad model instance',
        content: {'application/json': {schema: getModelSchemaRef(Product)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Brnad.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            title: 'NewProductInBrnad',
            exclude: ['id'],
            optional: ['brnadId']
          }),
        },
      },
    }) product: Omit<Product, 'id'>,
  ): Promise<Product> {
    return this.brnadRepository.products(id).create(product);
  }

  @patch('/brnads/{id}/products', {
    responses: {
      '200': {
        description: 'Brnad.Product PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
    product: Partial<Product>,
    @param.query.object('where', getWhereSchemaFor(Product)) where?: Where<Product>,
  ): Promise<Count> {
    return this.brnadRepository.products(id).patch(product, where);
  }

  @del('/brnads/{id}/products', {
    responses: {
      '200': {
        description: 'Brnad.Product DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Product)) where?: Where<Product>,
  ): Promise<Count> {
    return this.brnadRepository.products(id).delete(where);
  }
}
