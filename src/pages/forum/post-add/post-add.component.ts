import { Component, OnInit } from '@angular/core';
import { NavController ,
        NavParams,
        Img} from "ionic-angular";
import {ForumService} from "../forum.service";
declare let ImagePicker;


@Component({
  selector: 'page-post-add',
  templateUrl: './post-add.component.html'
})
export class PostAddComponent implements OnInit {
  url:any;  
  data: string = "";  
  lidata={
    Id:"7051bb5e-8729-49f4-b95a-016d7d8474ce",
    postId:''
};
  Title="";
  imgitems:any=[];
  editImgOk=false;
  editData=null;
  constructor(
    private navCtrl: NavController,
    private serve:ForumService,
    public navParams: NavParams,) {

    }

  ngOnInit() {
    let data = this.navParams.get('data');
    if(data.Status==1){
      this.lidata.Id=data.TopicPlateId;
      this.lidata.postId=data.Id;
      this.Title=data.Title;
      this.getData();
    }else{
      this.lidata=data;
    }
    console.log('新增帖子',this.lidata);
    // console.log(this.serve.Upload_UploadFiles);
  }


  ameR=false; 
  backPop(){
    this.ameR=true;
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
  }

  // 上传图片
  uploadFile(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
        let file: File = fileList[0];
        let formData: FormData = new FormData();
        formData.append('file', file);
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
        });
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

  editImgOkText="";
  // 新增 或 保存草稿
  forum_post_add(IsSaveAndPublish){
    let textareaImg:HTMLElement=document.getElementById('textareaImg');
    let textInnerHTML:any=textareaImg.innerHTML;
    if(!this.Title){
      return;
    }
    let data={
      "Title": this.Title,//帖子标题
      "TopicPlateId": this.lidata.Id,//帖子所属板块编号
      "Content": textInnerHTML,//帖子内容
      "IsSaveAndPublish": IsSaveAndPublish//是否保存并提交
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
        setTimeout(() => {
          this.editImgOk=false;
          this.backPop();
        }, 2000);
      }
    });
  }
}
