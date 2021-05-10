import { Pipe, PipeTransform } from '@angular/core';
import cronstrue from 'cronstrue';
@Pipe({
  name: 'cronStr',
})
export class CronStrPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    return cronstrue.toString(value);
  }
}
