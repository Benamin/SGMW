import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-Integral',
  templateUrl: './Integral.component.html'
})
export class IntegralComponent implements OnInit {
  
  navliArr=[{
    ParentName: "学员" ,
    src: "./assets/imgs/home/integral-student.jpg",
    label: "学员",
  },{
    ParentName: "讲师" ,
    src: "./assets/imgs/home/integral-lecturer.jpg",
    label: "讲师",
  },{
    ParentName: "内训师" ,
    src: "./assets/imgs/home/integral-training.jpg",
    label: "内训师",
  }];
  navli="学员";
  img_src="./assets/imgs/home/integral-student.jpg";
  constructor() { }

  ngOnInit() {
  }

  switchInformation (data){
    console.log(data);
    this.navli = data.label;
    this.img_src = data.src;
  }

}
