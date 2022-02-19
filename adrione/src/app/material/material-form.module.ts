import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

const MODULES = [
  DragDropModule,
  MatCardModule,
  MatCheckboxModule,
  MatGridListModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatTabsModule,
  ReactiveFormsModule
];

@NgModule({
  exports: [MODULES]
})
export class MaterialFormModule {}
