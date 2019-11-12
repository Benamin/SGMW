import { NgModule } from '@angular/core';
import { StringSlicePipe } from './string-slice/string-slice';
import { LineFeedPipe } from './line-feed/line-feed';
@NgModule({
	declarations: [StringSlicePipe,
    LineFeedPipe],
	imports: [],
	exports: [StringSlicePipe,
    LineFeedPipe]
})
export class PipesModule {}
