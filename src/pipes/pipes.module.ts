import {NgModule} from '@angular/core';
import {StringSlicePipe} from './string-slice/string-slice';
import {LineFeedPipe} from './line-feed/line-feed';
import {SecondFormatPipe} from './second-format/second-format';
import {ToCeilPipe} from './to-ceil/to-ceil';

@NgModule({
    declarations: [StringSlicePipe,
        LineFeedPipe,
        SecondFormatPipe,
        ToCeilPipe,
    ],
    imports: [],
    exports: [StringSlicePipe,
        LineFeedPipe,
        SecondFormatPipe,
        ToCeilPipe,
    ]
})
export class PipesModule {
}
