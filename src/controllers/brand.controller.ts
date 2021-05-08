import {
  authenticate
} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param,
  patch, post,
  put,

  requestBody,
  response
} from '@loopback/rest';
import {Brnad} from '../models';
import {BrnadRepository} from '../repositories';

export class BrandController {
  constructor(
    @repository(BrnadRepository)
    public brnadRepository: BrnadRepository,
  ) { }

  @authenticate('admin', 'customer')
  @post('/brand')
  @response(200, {
    description: 'Brnad model instance',
    content: {'application/json': {schema: getModelSchemaRef(Brnad)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Brnad, {
            title: 'NewBrnad',
            exclude: ['id'],
          }),
        },
      },
    })
    brnad: Omit<Brnad, 'id'>,
  ): Promise<Brnad> {
    return this.brnadRepository.create(brnad);
  }


  @get('/brand/count')
  @response(200, {
    description: 'Brnad model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Brnad) where?: Where<Brnad>,
  ): Promise<Count> {
    return this.brnadRepository.count(where);
  }

  @authenticate('admin')
  @get('/brand')
  @response(200, {
    description: 'Array of Brnad model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Brnad, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Brnad) filter?: Filter<Brnad>,
  ): Promise<Brnad[]> {
    return this.brnadRepository.find(filter);
  }

  @authenticate('admin')
  @patch('/brand')
  @response(200, {
    description: 'Brnad PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Brnad, {partial: true}),
        },
      },
    })
    brnad: Brnad,
    @param.where(Brnad) where?: Where<Brnad>,
  ): Promise<Count> {
    return this.brnadRepository.updateAll(brnad, where);
  }

  @get('/brand/{id}')
  @response(200, {
    description: 'Brnad model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Brnad, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Brnad, {exclude: 'where'}) filter?: FilterExcludingWhere<Brnad>
  ): Promise<Brnad> {
    return this.brnadRepository.findById(id, filter);
  }

  @authenticate('admin')
  @patch('/brand/{id}')
  @response(204, {
    description: 'Brnad PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Brnad, {partial: true}),
        },
      },
    })
    brnad: Brnad,
  ): Promise<void> {
    await this.brnadRepository.updateById(id, brnad);
  }

  @authenticate('admin')
  @put('/brand/{id}')
  @response(204, {
    description: 'Brnad PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() brnad: Brnad,
  ): Promise<void> {
    await this.brnadRepository.replaceById(id, brnad);
  }

  @authenticate('admin')
  @del('/brand/{id}')
  @response(204, {
    description: 'Brnad DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.brnadRepository.deleteById(id);
  }
}
