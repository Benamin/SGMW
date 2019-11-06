import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

declare let videojs: any;

@Injectable()
export class VideoJsProvider {

    constructor(public http: HttpClient) {
        let component = videojs.getComponent('Component');
        let TitleBar = videojs.extend(component, {
            constructor(player, options) {
                component.apply(this, arguments);
                if (options.text) {
                    this.updateTextContent(options.text);
                }
            },
            createEl() {
                return videojs.dom.createEl('div', {

                    // Prefixing classes of elements within a player with "vjs-"
                    // is a convention used in Video.js.
                    //给元素加vjs-开头的样式名，是videojs内置样式约定俗成的做法
                    className: 'vjs-title-bar'
                });
            },
            updateTextContent(text) {

                // If no text was provided, default to "Text Unknown"
                // 如果options中没有提供text属性，默认显示Text Unknow
                if (typeof text !== 'string') {
                    text = 'Text Unknown';
                }

                // Use Video.js utility DOM methods to manipulate the content
                // of the component's element.
                // 使用Video.js提供的DOM方法来操作组件元素
                videojs.dom.emptyEl(this.el());
                videojs.dom.appendContent(this.el(), text);
            }
        });

        videojs.registerComponent('TitleBar', TitleBar);
        console.log(videojs);
    }

}
