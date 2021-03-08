import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ForumService} from "../forum.service";

@Component({
    selector: 'page-choose-topic',
    templateUrl: 'choose-topic.html',
})
export class ChooseTopicPage {

    name;
    latelyList = [];
    topicList = [];
    topicType = 1;  //1 官方话题 2 热门话题

    constructor(public navCtrl: NavController,
                public forumSer: ForumService,
                public serve: ForumService,
                public navParams: NavParams) {
    }

    ionViewDidLoad() {
        const data = {}
        //最近使用的话题
        this.forumSer.LatelyTopic(data).subscribe((res) => {
            if (res) {
                this.latelyList = res.data;
            }
        })

        const data2 = {
            PageIndex: 1,
            PageSize: 1000,
        }
        this.serve.searchtopictag(data2).subscribe((res) => {
            if (res.code == 200) {
                this.topicList = res.data.Items;
            }
        })
    }


    search(e) {

    }

    showKey() {

    }

    sevrData() {
        const data = {
            Name: this.name,
            TopicCreateType: 2,
            TopicType: 0
        }
        this.serve.addtopictag(data).subscribe(
            (res) => {
                if (res) {
                    this.navCtrl.getPrevious().data.topic = {
                        Name: this.name,
                        id: res.data,
                        Selection:true
                    };
                    this.navCtrl.pop();
                }
            }
        )
    }

    selectTopic(item){
        const data =<any> {};
        if(item.TopicId){
            data.Id = item.TopicId;
            data.Name = item.TopicName;
        }else{
            data.Id = item.Id;
            data.Name = item.Name;
        }
        data.Selection = true;
        this.navCtrl.getPrevious().data.topic = data;
        this.navCtrl.pop();
    }

    backPop() {
        this.navCtrl.pop();
    }

}
