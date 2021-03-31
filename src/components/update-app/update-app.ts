import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AppUpdateService} from "../../core/appUpdate.service";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {Platform} from "ionic-angular";
import {AppDownLoadUrl, IOSDownLoadUrl} from "../../app/constants";

@Component({
    selector: 'update-app',
    templateUrl: 'update-app.html'
})
export class UpdateAppComponent {
    @Output() done = new EventEmitter();
    @Input() UpdateText;
    @Input() AppUrl;

    appDownLoadUrl = AppDownLoadUrl;
    iosDownLoadUrl = IOSDownLoadUrl;

    constructor(private appUpdate: AppUpdateService,
                private inAppBrowser: InAppBrowser,
                private platform: Platform) {
    }

    close() {
        this.done.emit();
    }

    updateApp() {
        this.done.emit();
        if (this.platform.is('ios')) {
            this.isIOS();
        } else {
            this.appUpdate.downloadApp(this.AppUrl);
        }
    }

    //
    isIOS() {
        this.inAppBrowser.create(this.iosDownLoadUrl, '_system');
    }

    //去官网更新
    updateAppByWeb() {
        this.inAppBrowser.create(this.appDownLoadUrl, '_system');
    }
}
