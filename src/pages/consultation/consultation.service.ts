import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { SERVER_API_URL } from "../../app/app.constants";
import { HTTP } from "@ionic-native/http";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import {Componentsdetails} from './componentsdetails/componentsdetails.component';
import {NumberOneDetailsComponent} from '../number-one/numberOneDetails/numberOneDetails.component';
import { CourseDetailPage } from "../learning/course-detail/course-detail";
import {FocusCoursePage} from "../learning/focus-course/focus-course";
import {InnerCoursePage} from "../learning/inner-course/inner-course";

const SERVER_HTTP_URL = ['chinacloudsites.cn', 'sgmw.com.cn','elearningapi.sgmw.com'];


@Injectable()
export class ConsultationService {
    APP_URL_JUMP = [
        {
            name: '课程',
            spliceUrl: '#/courseDetail/',
            Component:CourseDetailPage,
            Params:['id'],
            go_url:(navCtrl,id)=>{
                // navCtrl.push(CourseDetailPage,{id:id});
                this.GetProductById(id).subscribe(res => {
                    if (res.data) {
                        console.log('课程详情',res)
                        let e_data=res.data;
                        if (e_data.TeachTypeName == "集中培训") {
                            navCtrl.push(FocusCoursePage, {id: e_data.Id});
                        } else if (e_data.TeachTypeName == "内训") {
                            navCtrl.push(InnerCoursePage, {id: e_data.Id});
                        } else {
                            navCtrl.push(CourseDetailPage, {id: e_data.Id, StructureType: e_data.StructureType});
                        }
                    }
                });

            }
        },
        {
            name: '咨询详情',
            spliceUrl: '#/notice/detail/',
            Component:Componentsdetails,
            Params:['id'],
            go_url:(navCtrl,id)=>{
                navCtrl.push(Componentsdetails, { data:{
                    Id: id
                }});
            }
        },
        {
            name:'状元说',
            spliceUrl:'/#/notice/xsgjdetail/',
            Component:NumberOneDetailsComponent,
            Params:['id'],
            go_url:(navCtrl,id)=>{
                navCtrl.push(NumberOneDetailsComponent, { data:{
                    Id: id
                }});
            }
        }

    ]
    constructor(
        private http: HttpClient,
        private nativeHttp: HTTP,
        private inAppBrowser: InAppBrowser) {
    }

    // 获取新闻列表
    GetNewsList(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/news/GetNewsList', data);
    }

    // 获取新闻类别信息
    GetDictionaryByPCode(): Observable<any> {
        return this.http.get(SERVER_API_URL + '/Dictionary/GetDictionaryByPCode?code=zxzx');
    }
    // 获取新闻详情
    GetNewsByID(id) {
        return this.http.get(SERVER_API_URL + '/ENews/GetNewsByID?id=' + id);
    }
    // 获取相关新闻
    GetRelationNewsByID(id): Observable<any> {
        return this.http.get(SERVER_API_URL + '/ENews/GetRelationNewsByID?id=' + id);
    }

    //课程详情
    GetProductById(id): Observable<any> {
         return this.http.get(SERVER_API_URL + '/EProduct/GetProductById?pid=' + id);
    }

    // 遍历元素 为元素 修改元素的转跳方法
    ModifyALabelSkip(innerHtml: HTMLElement,navCtrl) {
        let allA = innerHtml.querySelectorAll('a');
        const goUrl = (url) => {
            for(let n =0 ;n<this.APP_URL_JUMP.length;n++){
                let a_u=this.APP_URL_JUMP[n];
                if(url.match(a_u.spliceUrl)){
                    a_u.go_url(navCtrl,url.split(a_u.spliceUrl)[1]);
                };
            }
        }

        for (let n = 0; n < allA.length; n++) {
            let onedom = allA[n];
            let _href = onedom.getAttribute('href');
            let is_href=onedom.getAttribute('_href');
            if (_href&&!is_href) {
                onedom.setAttribute('_href', _href);
                onedom.setAttribute('href', 'javascript:void(0);');
                onedom.addEventListener('click', (e: any) => {
                    let url_href = e.target.getAttribute('_href');
                    const is_APP_url = SERVER_HTTP_URL.some(e => {
                        let is_a_U=this.APP_URL_JUMP.some(a_u => {
                           return url_href.includes(a_u.spliceUrl)
                        });
                        return url_href.includes(e)&&is_a_U;
                    });

                    if(is_APP_url){
                        goUrl(url_href);
                    }else{
                        this.inAppBrowser.create(url_href, '_system');
                    }

                })
            }
        }
    }

}
