import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {SERVER_API_URL} from "../../app/app.constants";
import {HTTP} from "@ionic-native/http";
import { DatePipe } from '@angular/common';
import {Componentsdetails} from '../consultation/componentsdetails/componentsdetails.component';
import {NumberOneDetailsComponent} from '../number-one/numberOneDetails/numberOneDetails.component';
import { CourseDetailPage } from "../learning/course-detail/course-detail";
import { InAppBrowser } from "@ionic-native/in-app-browser";
const SERVER_HTTP_URL = ['chinacloudsites.cn', 'sgmw.com.cn','elearningapi.sgmw.com'];
@Injectable()
export class numberOneService {
  APP_URL_JUMP = [
    {
        name: '课程',
        spliceUrl: '#/courseDetail/',
        Component:CourseDetailPage,
        Params:['id'],
        go_url:(navCtrl,id)=>{
            navCtrl.push(CourseDetailPage,{id:id});
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
    constructor(private http: HttpClient,private nativeHttp:HTTP,private datePipe: DatePipe,private inAppBrowser: InAppBrowser) {
    }

    
    // 获取DOM
    GetDictionaryByPCode(): Observable<any> {
        return this.http.get(SERVER_API_URL + '/Dictionary/GetDictionaryByPCode?code=NewsType');
    }

    // 获取销售案例
    newsGetNewsList(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/news/GetNewsList',data);
    }
    // 获取销冠风采
    GetNewsList(data): Observable<any> {
        return this.http.post(SERVER_API_URL + '/winnerNews/GetNewsList',data);
    }
  

    GetNewsByID(id): Observable<any> {
        return this.http.get(SERVER_API_URL + '/winnerNews/GetNewsByID?id='+id);
    }
    GetRelationNewsByID(id): Observable<any> {
        return this.http.get(SERVER_API_URL + '/winnerNews/GetRelationNewsByID?id='+id);
    }


    // 格式化时间
    formatDate(date, flag?: Number) {
        if (date) {
          switch (flag) {
            case 0:
              return this.datePipe.transform(date, 'yyyy');
            case 1:
              return this.datePipe.transform(date, 'yyyy-MM');
            case 2:
              return this.datePipe.transform(date, 'yyyy-MM-dd');
            case 3:
              return this.datePipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
            case 4:
                return this.datePipe.transform(date, 'yyyy-MM-dd HH:mm');
          }
        } else {
          return null;
        }
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