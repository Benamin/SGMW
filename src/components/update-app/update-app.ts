import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AppUpdateService} from "../../core/appUpdate.service";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {Platform} from "ionic-angular";

@Component({
    selector: 'update-app',
    templateUrl: 'update-app.html'
})
export class UpdateAppComponent {
    @Output() done = new EventEmitter();
    @Input() UpdateText;
    @Input() AppUrl;

    constructor(private appUpdate: AppUpdateService,
                private inAppBrowser: InAppBrowser,
                private platform: Platform) {
    }

    close() {
        this.done.emit();
    }

    updateApp() {
        if (this.platform.is('ios')) {
            this.isIOS()
        } else {
            this.appUpdate.downloadApp(this.AppUrl);
        }
    }

    //
    isIOS() {
        const IOSUrl = 'https://apps.apple.com/us/app/骏菱学社/id1478072690?l=zh&ls=1';
        this.inAppBrowser.create(IOSUrl, '_system');
    }
}
