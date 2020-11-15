import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash-es';
//import * as _ from "lodash";
@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  // transform(value: unknown, ...args: unknown[]): unknown {
  //   return null;
  // }
  transform = orderBy;
}
