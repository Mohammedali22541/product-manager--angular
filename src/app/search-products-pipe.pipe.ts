import { Product } from './product';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchProductsPipe',
})
export class SearchProductsPipePipe implements PipeTransform {
  transform(allProducts: Product[], term: string): Product[] | null {
    return allProducts.filter(
      (Product) =>
        Product.name.toLocaleLowerCase().includes(term.toLocaleLowerCase()) ||
        Product.category.toLowerCase().includes(term.toLowerCase())
    );
  }
}
