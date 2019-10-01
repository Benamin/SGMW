import { Component, OnInit } from '@angular/core';
import { NavController } from "ionic-angular";
import {ForumService} from "../forum.service";
declare let ImagePicker;


@Component({
  selector: 'page-post-add',
  templateUrl: './post-add.component.html'
})
export class PostAddComponent implements OnInit {

  cropPicture="assets/imgs/forum/other/p771_img1@3x.jpg";
  
  url:any;  
  avatarPath='./assets/imgs/logo.png';//默认图片  
  data: string = "";  
  imageBase64 : Array<string>=[];  
  constructor(private navCtrl: NavController,private serve:ForumService) { }
  ngOnInit() {
    console.log(this.serve.Upload_UploadFiles);
  }
  imgitems:any=[];
  backPop(){
    this.navCtrl.pop();
  }
  upload(e:any) {
    let f=e.target.files;
    console.log(f);
    var str = "";
    var reader = new FileReader(); //
    reader.readAsDataURL(f[0]);
    reader.onload = (e:any) => {// 当读取操作成功完成时调用.
        let str = e.target.result;
        this.imgitems.push(str);
    }
  }




  uploadFile(event) {
    console.log(event);
    let fileList: FileList = event.target.files;
  
    if (fileList.length > 0) {
        let file: File = fileList[0];
        let formData: FormData = new FormData();
        formData.append('file', file);
        this.serve.Upload_UploadFiles(formData).then(res => {
          console.log(res);
        });

        // var oReq = new XMLHttpRequest();
        // oReq.open("POST", "/api/Upload/UploadFiles", true);
        // oReq.onload = function(oEvent) {
        //   if (oReq.status == 200) {
        //     // oOutput.innerHTML = "Uploaded!";
        //   } else {
        //     // oOutput.innerHTML = "Error " + oReq.status + " occurred when trying to upload your file.<br \/>";
        //   }
        // };
      
        // oReq.send(formData);

    }
  


  }


  // getPicture(){  
  //   ImagePicker.getPictures((result) => {
  //     console.log(result);
  //     // alert(JSON.stringify(result));
  //     alert(result.images.length);
  //     this.image1 = result.images[0].path;
  //     if (result.images.length > 0) {
  //       result.images.forEach(element => {
  //         alert(element.uri);
  //         this.addImgArr.push({ path: element.path, describe: '', uri: element.uri });
  //       });
  //       alert(JSON.stringify(this.addImgArr));
  //       this.zone.run(() => {
  //       });
  //     }
  //   }, (err) => {
  //     alert(err);
  //   }, {
  //     maximumImagesCount: 9,
  //     width: 1920,
  //     height: 1440,
  //     quality: 100,
  //     destinationType: 1,
  //   });
  // }  

}
