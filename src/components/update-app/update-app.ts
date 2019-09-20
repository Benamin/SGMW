import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AppUpdateService} from "../../core/appUpdate.service";

@Component({
  selector: 'update-app',
  templateUrl: 'update-app.html'
})
export class UpdateAppComponent {
  @Output() done = new EventEmitter();
  @Input() UpdateText;
  @Input() AppUrl;

  constructor(private appUpdate:AppUpdateService) {
  }

  close(){
    this.done.emit();
  }

  updateApp(){
    this.appUpdate.downloadApp(this.AppUrl);
  }

}
