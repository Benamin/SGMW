import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'page-view-reply',
  templateUrl: './view-reply.component.html'
})
export class ViewReplyComponent implements OnInit {
  textareaBlur=false;
  constructor() { }

  ngOnInit() {
  }
  textareaclick(){
    this.textareaBlur=true;
    let textDiv:HTMLElement=document.getElementById('textareainp');
    setTimeout(() => {
      textDiv.focus();
    }, 20);
  }
  inputshow_on(){
    this.textareaBlur=false;
  }


}
