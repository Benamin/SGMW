import { Component, OnInit } from '@angular/core';
import { NavController } from "ionic-angular";
declare var AlloyCrop;
@Component({
  selector: 'page-post-add',
  templateUrl: './post-add.component.html'
})
export class PostAddComponent implements OnInit {

  cropPicture="assets/imgs/forum/other/p771_img1@3x.jpg";
  constructor(private navCtrl: NavController,) { }
  ngOnInit() {
  }

  backPop(){
    this.navCtrl.pop();
  }

    //裁剪图片操作
    // crop()
    // {
    //   //https://github.com/AlloyTeam/AlloyCrop
    //   new AlloyCrop({
    //     image_src: 'assets/imgs/forum/other/p771_img1@3x.jpg',
    //     circle: false,   //是否是圆形剪切，false为方形
    //     width: 320,     // 选区的宽
    //     height: 320,    // 选区的高
    //     output: 2,      //输出的倍率。比如如果output为2，选区的宽300，选区的高100，输出的图像的分辨率为 (2×300，2×100）
    //     ok: (base64, canvas) => {   //确定裁剪操作
    //       this.cropPicture = base64;
    //     },
    //     cancel: () => {     //取消裁剪操作
    //     },
    //     ok_text: "确定",
    //     cancel_text: "取消"
    //   });
    // }

}
