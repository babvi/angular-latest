import { Pipe, PipeTransform } from '@angular/core';

/**
 * Convert Object to array of keys.
 */
@Pipe({
    name: 'alKeys'
})
export class AppKeysPipe implements PipeTransform {

    transform(value: {}): string[] {

        if (!value) {
            return [];
        }

        return Object.keys(value);
    }
}