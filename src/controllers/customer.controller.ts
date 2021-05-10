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


  patch,



  post,
  put,

  requestBody,
  response
} from '@loopback/rest';
import {generate} from 'generate-password';
import {PasswordKeys} from '../keys/password-keys';
import {ServiceKeys as keys} from '../keys/service-keys';
import {Customer} from '../models';
import {EmailNotifications} from '../models/email-notifications.model';
import {CustomerRepository, UserRepository} from '../repositories';
import {EncryptDecrypt} from '../services/encrypt-decrypt.service';
import {NotificacionesService} from '../services/notificaiones.service';

export class CustomerController {
  constructor(
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @post('/customer')
  @response(200, {
    description: 'Customer model instance',
    content: {'application/json': {schema: getModelSchemaRef(Customer)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Customer, {
            title: 'NewCustomer',
            exclude: ['id'],
          }),
        },
      },
    })
    customer: Omit<Customer, 'id'>,
  ): Promise<Customer> {

    let c = await this.customerRepository.create(customer);
    let randonPassword = generate({
      length: PasswordKeys.LENGTH,
      numbers: PasswordKeys.NUMBERS,
      lowercase: PasswordKeys.LOWERCASE,
      uppercase: PasswordKeys.UPPERCASE
    })
    let password1 = new EncryptDecrypt(keys.MD5).Encrypt(randonPassword);
    let password2 = new EncryptDecrypt(keys.MD5).Encrypt(password1);
    let u = {
      username: c.document,
      password: password2,
      role: 1,
      customerId: c.id
    };

    let user = await this.userRepository.create(u);
    let notificationEmail = new EmailNotifications({
      textBody: `Hola! ${c.name} Bienvenido a mercadoNegro su Usuario es su Documento y contrasenia es : ${randonPassword}`,
      htmlBody: `Hola! ${c.name} Bienvenido a mercadoNegro su Usuario es su Documento <br> contrasenia es : ${randonPassword}`,
      to: customer.email,
      subject: 'Bienvenidos a bordo de MercadoNegro'
    });
    new NotificacionesService().EmailNotifications(notificationEmail)
    c.user = user;
    return c;
  }


  @get('/customer/count')
  @response(200, {
    description: 'Customer model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Customer) where?: Where<Customer>,
  ): Promise<Count> {
    return this.customerRepository.count(where);
  }

  @get('/customer')
  @response(200, {
    description: 'Array of Customer model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Customer, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Customer) filter?: Filter<Customer>,
  ): Promise<Customer[]> {
    return this.customerRepository.find(filter);
  }


  @patch('/customer')
  @response(200, {
    description: 'Customer PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Customer, {partial: true}),
        },
      },
    })
    customer: Customer,
    @param.where(Customer) where?: Where<Customer>,
  ): Promise<Count> {
    return this.customerRepository.updateAll(customer, where);
  }

  @get('/customer/{id}')
  @response(200, {
    description: 'Customer model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Customer, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Customer, {exclude: 'where'}) filter?: FilterExcludingWhere<Customer>
  ): Promise<Customer> {
    return this.customerRepository.findById(id, filter);
  }


  @patch('/customer/{id}')
  @response(204, {
    description: 'Customer PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Customer, {partial: true}),
        },
      },
    })
    customer: Customer,
  ): Promise<void> {
    await this.customerRepository.updateById(id, customer);
  }


  @put('/customer/{id}')
  @response(204, {
    description: 'Customer PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() customer: Customer,
  ): Promise<void> {
    let u = await this.userRepository.findOne({where: {customerId: customer.id}});
    if (u) {
      u.username = customer.document;
      await this.userRepository.replaceById(u.id, u);
    }
    await this.customerRepository.replaceById(id, customer);
  }

  @del('/customer/{id}')
  @response(204, {
    description: 'Customer DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.customerRepository.deleteById(id);
  }
}
