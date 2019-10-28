import { Component, OnInit,NgZone } from '@angular/core';
import { NavController ,
        NavParams,
        LoadingController,
        Img} from "ionic-angular";
import {ForumService} from "../forum.service";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

declare let ImagePicker;


@Component({
  selector: 'page-post-add',
  templateUrl: './post-add.component.html'
})
export class PostAddComponent implements OnInit {
  url:any;  
  data: string = "";  
  lidata={
    Id:"7051bb5e-8729-49f4-b95a-016d7d8474ce", // 板块id
    postId:'',  // 帖子Id
    Status:null
  };
  Title="";
  imgitems:any=[];
  editImgOk=false;
  editData=null;
  innerHeightOld=0;
  paddingBottom= '0px';
  constructor(
    private navCtrl: NavController,
    private serve:ForumService,
    public navParams: NavParams,
    private loadCtrl: LoadingController,
    private zone: NgZone
    ) {

      if(this.serve.iosOrAndroid()=="Ios"){
        Observable.fromEvent(window, "native.keyboardshow")
        .debounceTime(100)
        .subscribe((event: any) => {
            // alert('显示:'+JSON.stringify(event))
  
            this.paddingBottom=event.keyboardHeight+20+'px';
            let paddingBottomdom=document.getElementById('buttomImgDiv');
            paddingBottomdom.style.paddingBottom=this.paddingBottom;
            console.log(paddingBottomdom);
            //this.keyboardshowHeightBottom=event.keyboardHeight+'px';
        });
  
        Observable.fromEvent(window, "native.keyboardhide")
        .debounceTime(100)
        .subscribe((event: any) => {
          this.paddingBottom=0+'px';
          document.getElementById('buttomImgDiv').style.paddingBottom=this.paddingBottom;
        });
      }
    }

  ngOnInit() {
    let data = this.navParams.get('data');
    if(data.Status==1){
      this.lidata.Id=data.TopicPlateId;
      this.lidata.postId=data.Id;
      this.lidata.Status=data.Status;
      this.Title=data.Title;
      this.getData();
    }else{
      this.lidata=data;
    }
    console.log('新增帖子',this.lidata);
    console.log('this.innerHeightOld',this.innerHeightOld)
  }

  focusAmeR=false;
  backPop(){
    this.navCtrl.pop();
  }


  // 获取帖子信息
  getData(){
    this.serve.forum_post_get({ postId: this.lidata.postId }).subscribe((res: any) => {
      let textareaImg:HTMLElement=document.getElementById('textareaImg');
      textareaImg.innerHTML=res.data.Content;
    let imgDom = textareaImg.querySelectorAll('img');
     if(imgDom){
       for(let n=0;n<imgDom.length;n++){
         let e=imgDom[n];
        this.imgitems.push({
          src:e.src,
          alt:e.alt,
       })
       }
  
     }
     
      console.log(imgDom);
    });
  }

  upload(e:any) {
    let f=e.target.files;
    console.log(f);
    var reader = new FileReader(); //
    reader.readAsDataURL(f[0]);
    reader.onload = (e:any) => {// 当读取操作成功完成时调用.
        let src = e.target.result;
        this.imgitems.push({
          src:src,
          alt:'',
        });
    }
  }
  focusNode:any ="";
  anchorOffset=0;

  // 光标变化 获取光标位置
  selectionStart(element){
      console.log(element);
      let Selection=(<any>document).getSelection();
      console.log(Selection);
      this.focusNode=Selection.focusNode;
      this.anchorOffset=Selection.anchorOffset;
      (<any>document).getSelection().anchorOffset;
      setTimeout(() => {
        this.ImgSome();
      }, 10);
  }

  // 选择图片
  addImg(){
    let pic_selector:HTMLElement=document.getElementById('pic_selector');
    console.log();
    pic_selector.click();
  }
  //  在文文字中插入图片
  SetaddImg(imgSrc,alt){ 
    let textareaImg:HTMLElement=document.getElementById('textareaImg');
    let textArr=this.focusNode.data.split('');
    textArr.splice(this.anchorOffset,0,'<img alt="'+alt+'" src="'+imgSrc+'"> ');
    let NewText="";
    textArr.forEach(element => {
      NewText+=element;
    });
    this.focusNode.data=NewText;
    this.replaceText();
  }
  DomAddImg(imgSrc,alt){
    let textareaImg:any=document.getElementById('textareaImg');
    if(textareaImg){
      textareaImg.append('<img alt="'+alt+'" src="'+imgSrc+'"> ');
      let newDiv=document.createElement("div");
      newDiv.innerHTML="&nbsp;";
      textareaImg.append(newDiv);
    }
    //  if(this.anchorOffset==0&&this.focusNode.id=='textareaImg'){
    //     textareaImg.append('<img src="'+imgSrc+'" title=""> ');
    //  }else if(this.anchorOffset==0&&!this.focusNode.id){
    //     textareaImg.append('<img src="'+imgSrc+'" title=""> ');
    //  }else if(this.focusNode.id=='textareaImg'){
    //  }
     this.replaceText();
  }
  
  replaceText(){
      let textareaImg:HTMLElement=document.getElementById('textareaImg');
      let textInnerHTML:any=textareaImg.innerHTML;
      textInnerHTML= textInnerHTML.replace('&lt;','<');
      textInnerHTML= textInnerHTML.replace('&gt;','>');
      textareaImg.innerHTML=textInnerHTML;
      this.zone.run(() => {
        textareaImg.innerHTML=textInnerHTML;
      })
  }

  // 上传图片
  uploadFile(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const loading = this.loadCtrl.create({
        content: '加载中...'
      });
      loading.present();
      const addImgS = (fileList_n,index) =>{
          let formData: FormData = new FormData();
          formData.append('file', fileList_n);
      
          this.serve.Upload_UploadFiles(formData).then((res:any) => {
            this.imgitems.push({
              src:res.data,
              alt:'',
            })
            if(!this.focusNode.data){
              this.DomAddImg(res.data,'');
            }else{
              this.SetaddImg(res.data,'');
            }
            if(fileList.length-1>index){
              addImgS(fileList[index+1],index+1);
            }else{
              loading.dismiss();
            }
          });
      }
      addImgS(fileList[0],0);

     
        
    }
  }

  // 获取焦点
  htmlTextDle(){
    let textareaImg:HTMLElement=document.getElementById('textareaImg');
    let innerText:any=textareaImg.innerText;
    if(innerText=='请输入正文'){
      textareaImg.innerText="";
    }

  }

  // 过滤删除图片
  ImgSome(){
    let textareaImg:HTMLElement=document.getElementById('textareaImg');
    let textInnerHTML:any=textareaImg.innerHTML;
    for(let i =0;i< this.imgitems.length;i++){
      let n_time=this.imgitems[i];
      let is_src =textInnerHTML.includes(n_time.src);
      if(!is_src){
        this.imgitems.splice(i,1);
        i--;
      }
    }
  }
  editImg={newalt:"",
src:''};
  iseditImg=false;

  editimg(data){
      this.editImg = data;
      this.editImg['newalt']=data.alt;
      this.iseditImg=true;
  }
  // 编辑图片完成
  editPicturesOk(){
    this.editImg['alt']= this.editImg['newalt'];
    let textareaImg:HTMLElement=document.getElementById('textareaImg');
    let ImgDom:any= textareaImg.querySelector(`img[src='${this.editImg.src}']`);
    ImgDom.alt=this.editImg['newalt'];
    console.log(ImgDom);
    this.iseditImg=false;
  }
  
  loading=null;
  sevrData_click=false;
  sevrData(IsSaveAndPublish){
    
    if(!this.Title||this.sevrData_click){
      return;
    }
    this.loading = this.loadCtrl.create({
      content:''
    });
    this.loading.present();
    let textareaImg:HTMLElement=document.getElementById('textareaImg');
    let textInnerHTML:any=textareaImg.innerHTML;
    

    if(this.lidata.Status==1){ // 草稿帖子 修改帖子
      this.forum_post_edit(IsSaveAndPublish,textInnerHTML);
    }else{
      this.forum_post_add(IsSaveAndPublish,textInnerHTML);
    }
    this.sevrData_click=true;
  }
  forum_post_edit(IsSaveAndPublish,textInnerHTML){
    let data={
      "Id":this.lidata.postId,//帖子编号
      "Title": this.Title,//帖子标题
      "TopicPlateId": this.lidata.Id,//帖子所属板块编号
      "Content": textInnerHTML,//帖子内容
      "IsSaveAndPublish": IsSaveAndPublish,//是否保存并提交
    }
    this.serve.forum_post_edit(data).subscribe((res:any) => {
      console.log(res);
      if(res.code == 200){
        if(IsSaveAndPublish){
          this.editImgOkText='帖子发布成功';
        }else{
          this.editImgOkText='保存成功';
        }
        this.editImgOk=true;
        this.loading.dismiss();
        
        setTimeout(() => {
          this.editImgOk=false;
          this.backPop();
        }, 2000);
      }else{
        this.sevrData_click=false;
      }

    })
  }

  editImgOkText="";


  // 新增 或 保存草稿
  forum_post_add(IsSaveAndPublish,textInnerHTML){

    let data={
      "Title": this.Title,//帖子标题
      "TopicPlateId": this.lidata.Id,//帖子所属板块编号
      "Content": textInnerHTML,//帖子内容
      "IsSaveAndPublish": IsSaveAndPublish,//是否保存并提交
     
    }
    this.serve.forum_post_add(data).subscribe((res:any) => {
      console.log(res);
      if(res.code == 200){
        if(IsSaveAndPublish){
          this.editImgOkText='帖子发布成功';
        }else{
          this.editImgOkText='保存成功';
        }
        this.editImgOk=true;
        this.loading.dismiss();
        setTimeout(() => {
          this.editImgOk=false;
          this.backPop();
        }, 2000);
      }else{
        this.sevrData_click=false;
      }
    });
  }
    // this.focusAmeR=true;
    // setTimeout(function(){
    //   console.log('下拉滑动');
    //   document.body.scrollTop = document.body.scrollHeight;
    // },20);

}
