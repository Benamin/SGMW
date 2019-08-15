import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar/navbar';
import {IonicPageModule} from "ionic-angular";
@NgModule({
	declarations: [NavbarComponent],
	imports: [
		IonicPageModule
	],
	exports: [NavbarComponent]
})
export class ComponentsModule {}
