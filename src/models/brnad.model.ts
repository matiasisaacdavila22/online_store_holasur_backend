import {Entity, model, property, hasMany} from '@loopback/repository';
import {Product} from './product.model';

@model()
export class Brnad extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  code: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @hasMany(() => Product)
  products: Product[];

  constructor(data?: Partial<Brnad>) {
    super(data);
  }
}

export interface BrnadRelations {
  // describe navigational properties here
}

export type BrnadWithRelations = Brnad & BrnadRelations;
