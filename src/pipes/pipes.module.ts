import { NgModule } from '@angular/core';
import { StringSlicePipe } from './string-slice/string-slice';
import { LineFeedPipe } from './line-feed/line-feed';
import { SecondFormatPipe } from './second-format/second-format';
@NgModule({
	declarations: [StringSlicePipe,
    LineFeedPipe,
    SecondFormatPipe],
	imports: [],
	exports: [StringSlicePipe,
    LineFeedPipe,
    SecondFormatPipe]
})
export class PipesModule {}
