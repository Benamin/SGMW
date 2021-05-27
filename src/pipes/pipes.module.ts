import { NgModule } from '@angular/core';
import { StringSlicePipe } from './string-slice/string-slice';
import { LineFeedPipe } from './line-feed/line-feed';
import { SecondFormatPipe } from './second-format/second-format';
import { ToCeilPipe } from './to-ceil/to-ceil';
import { TimeFormatPipe } from './time-format/time-format';
@NgModule({
	declarations: [StringSlicePipe,
    LineFeedPipe,
    SecondFormatPipe,
    ToCeilPipe,
    TimeFormatPipe],
	imports: [],
	exports: [StringSlicePipe,
    LineFeedPipe,
    SecondFormatPipe,
    ToCeilPipe,
    TimeFormatPipe]
})
export class PipesModule {}
