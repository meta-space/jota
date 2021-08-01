import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HamburgerButtonComponent } from './components/hamburger-icon/hamburger-icon.component';
import { HamburgerButtonLeftArrowComponent } from './components/hamburger-icon-left-arrow/hamburger-icon-left-arrow.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        HamburgerButtonComponent,
        HamburgerButtonLeftArrowComponent
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HamburgerButtonComponent,
        HamburgerButtonLeftArrowComponent
    ]
})
export class SharedModule
{
}
