import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Product} from './product.model';
import {ShoppingCart} from './shopping-cart.model';

@model()
export class SaleItem extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'date',
    required: true,
  })
  addDate: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'number',
    required: true,
  })
  amount: number;

  @belongsTo(() => Product)
  productId: string;

  @belongsTo(() => ShoppingCart)
  shoppingCartId: string;

  constructor(data?: Partial<SaleItem>) {
    super(data);
  }
}

export interface SaleItemRelations {
  // describe navigational properties here
}

export type SaleItemWithRelations = SaleItem & SaleItemRelations;
