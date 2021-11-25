import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Pipes
import { AppKeysPipe } from '../../pipes/alKeys.Pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [AppKeysPipe],
  exports: [AppKeysPipe]
})
export class SharedModule { }
