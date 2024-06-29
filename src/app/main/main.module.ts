import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MainRoutingModule } from './main-routing.module';

// Containers
import { PageComponent } from './page/page.component';

// Components
import { ModalComponent } from './page/modal/modal.component';
import { WidgetComponent } from './page/widget/widget.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MainRoutingModule,
  ],
  declarations: [
    // Containers
    PageComponent,
    // Components
    ModalComponent,
    WidgetComponent
  ],
})
export class MainModule { }
