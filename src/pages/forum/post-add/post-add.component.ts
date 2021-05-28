import {Component, NgZone, OnInit} from '@angular/core';
import {ActionSheetController, LoadingController, NavController, NavParams, ToastController,} from "ionic-angular";
import {ForumService} from "../forum.service";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import {CommonService} from "../../../core/common.service";
import {ChooseTopicPage} from "../choose-topic/choose-topic";
import {Keyboard} from "@ionic-native/keyboard";
import {ChooseImageProvider} from "../../../providers/choose-image/choose-image";
import {ShortVideoProvider} from "../../../providers/short-video/short-video";

declare let ImagePicker;


@Component({
    selector: 'page-post-add',
    templateUrl: './post-add.component.html'
})
export class PostAddComponent implements OnInit {
    url: any;
    data: string = "";
    lidata = {
        Id: "7051bb5e-8729-49f4-b95a-016d7d8474ce", // 板块id
        postId: '',  // 动态Id
        Status: null
    };
    Title = "";
    imgitems: any = [];
    editImgOk = false;
    editData = null;
    innerHeightOld = 0;
    paddingBottom = '0px';
    choicePlateShow = false;
    textareaHeight = 'calc(100% - 10px)';

    topicList = [];  //话题列表

    ApplyEssence = false;  //true为申请精华贴
    textareaLength = 100;
    leaveShow = true;

    //视频
    video = {
        src: "",
        poster: "",
        isLoad: false,
    };
    CoverUrl = "";  //如果是视频 则上传封面
    multiple: boolean | string = ""; // video=只选择视频 image=只选择图片

    videoFiles;  //上传文件成功后的返回值

    constructor(
        private commonSer: CommonService,
        private navCtrl: NavController,
        private serve: ForumService,
        public navParams: NavParams,
        private keyboard: Keyboard,
        private chooseImagePro: ChooseImageProvider,
        private shortVideoPro: ShortVideoProvider,
        private actionSheetCtrl: ActionSheetController,
        private loadCtrl: LoadingController,
        private zone: NgZone,
        private toastCtrl: ToastController
    ) {

        //

        if (this.serve.iosOrAndroid() == "Ios" && !this.serve.isIOS14) {
            Observable.fromEvent(window, "native.keyboardshow")
                .debounceTime(100)
                .subscribe((event: any) => {
                    this.paddingBottom = event.keyboardHeight + 20 + 'px';
                    let paddingBottomdom = document.getElementById('buttomImgDiv');
                    paddingBottomdom.style.paddingBottom = this.paddingBottom;
                    //this.keyboardshowHeightBottom=event.keyboardHeight+'px';
                });

            Observable.fromEvent(window, "native.keyboardhide")
                .debounceTime(100)
                .subscribe((event: any) => {
                    this.paddingBottom = 0 + 'px';
                    document.getElementById('buttomImgDiv').style.paddingBottom = this.paddingBottom;
                });
        }
    }


    ngOnInit() {
        let data = this.navParams.get('data');

        if (data.Status) {
            this.lidata.Id = data.TopicPlateId;
            this.lidata.postId = data.Id;
            this.lidata.Status = data.Status;

            this.Title = data.Title;
            this.getData();
            this.loading = this.loadCtrl.create({
                content: ''
            });
            this.loading.present();
        } else {
            this.lidata = data;
            this.forum_topicplate_search();
            this.topicplateSearchtopictag();
        }
    }

    ionViewDidEnter() {
        this.leaveShow = false;
        const data = this.navParams.get('topic');
        console.log(data);
        if (data) {
            const isIncludes = this.conversationDataSelection.some(e => e.Id == data.Id);
            if (!isIncludes) {  //如果已有则不添加
                this.conversationDataSelection.push(data);
            }
        }
    }


    focusAmeR = false;

    backPop() {
        this.leaveShow = true;
        this.navCtrl.pop();
    }

    choicePlateList = [];
    ForumHistory = [];
    conversationData = [];

    ForumHistorySelection = []; // 选中的板块
    conversationDataSelection = [];// 选中的话题

    plateType = '';

    // 获取模块列表
    forum_topicplate_search() {
        this.serve.forum_topicplate_search({}).subscribe((res: any) => {
            this.ForumHistory = res.data.Items;
            this.ForumHistorySelection
            this.init_TopicItem();
        })
    }

    topicplateSearchtopictag() {
        this.serve.topicplateSearchtopictag({PageSize: 500}).subscribe((res: any) => {
            this.conversationData = res.data.Items;
            this.init_TopicItem();
        })
    }

    /**
     * conversationData=话题  ForumHistory==板块
     * @param type
     */
    choicePlate(type) {
        this.plateType = type;

        if (type == 'ForumHistory') {
            this.choicePlateList = [...this.ForumHistory]
        }
        if (type == 'conversationData') {
            this.choicePlateList = [...this.conversationData]
        }
        this.choicePlateShow = true;
    }

    choicePlateListClick(itme) {
        itme['Selection'] = !itme.Selection;
    }

    SelectionChoicePlate(plateType) {
        this.choicePlateShow = false;
        if (plateType == 'ForumHistory') {
            this.ForumHistorySelection = [...this.choicePlateList.filter(e => e.Selection)]
        }
        if (plateType == 'conversationData') {
            this.conversationDataSelection = [...this.choicePlateList.filter(e => e.Selection)]
        }
    }

    init_ = 0;

    init_TopicItem() {
        this.init_++;

        if (this.init_ == 2) {
            this.ForumHistory.forEach(e => {
                this.P_data.TopicItem.forEach(element => {
                    if (element.TopicId == e.Id) {
                        e['Selection'] = true;
                        this.ForumHistorySelection.push(e);
                    }
                });
            })
            this.conversationData.forEach(e => {
                this.P_data.TopicTagItem.forEach(element => {
                    if (element.TopicId == e.Id) {
                        e['Selection'] = true;
                        this.conversationDataSelection.push(e);

                    }
                });
            })
            if (this.loading) {
                this.loading.dismiss();
            }
        }
    }

    P_data = <any>{
        TopicItem: [],
        TopicTagItem: [],
    };

    inputChange() {
        let textareaImg = document.querySelector("#textareaImg");
        this.textareaLength = 100 - textareaImg.innerHTML.length > 0 ? 100 - textareaImg.innerHTML.length : 0;
    }

    // 获取动态信息
    getData() {
        this.serve.forum_post_get({postId: this.lidata.postId}).subscribe((res: any) => {
            this.P_data = res.data;
            this.ApplyEssence = res.data.ApplyEssence;
            // this.init_TopicItem();
            this.forum_topicplate_search();
            this.topicplateSearchtopictag();
            let textareaImg: HTMLElement = document.getElementById('textareaImg');
            textareaImg.innerHTML = res.data.Content;
            let imgDom = textareaImg.querySelectorAll('img');
            let DivDom: any = textareaImg.querySelectorAll('div[src]');
            if (DivDom) {
                for (let n = 0; n < DivDom.length; n++) {
                    DivDom[n].contenteditable = false;
                }
            }
            if (imgDom) {
                for (let n = 0; n < imgDom.length; n++) {
                    let e = imgDom[n];
                    this.imgitems.push({
                        src: e.src,
                        alt: e.alt,
                    })
                }
            }
            if (this.P_data.IsVideo) {
                this.CoverUrl = this.P_data.Pvideo.CoverUrl;
                this.videoFiles = this.P_data.Pvideo.files;
                this.multiple = "video";
            }

        });
    }

    upload(e: any) {
        let f = e.target.files;
        var reader = new FileReader(); //
        reader.readAsDataURL(f[0]);
        reader.onload = (e: any) => {// 当读取操作成功完成时调用.
            let src = e.target.result;
            this.imgitems.push({
                src: src,
                alt: '',
            });
        }
    }

    focusNode: any = "";
    anchorOffset = 0;

    // 光标失去焦点
    blurSelectionStart(element) {
        let Selection = (<any>document).getSelection();
        this.focusNode = Selection.focusNode;
        this.anchorOffset = Selection.anchorOffset;
        (<any>document).getSelection().anchorOffset;
        setTimeout(() => {
            this.ImgSome();
            let textareaImg: HTMLElement = document.getElementById('textareaImg');
            this.zone.run(() => {
            })
        }, 50);
    }

    // 光标变化 获取光标位置
    selectionStart(element) {
        let Selection = (<any>document).getSelection();
        this.focusNode = Selection.focusNode;
        this.anchorOffset = Selection.anchorOffset;
        (<any>document).getSelection().anchorOffset;
        setTimeout(() => {
            this.ImgSome();
            let textareaImg: HTMLElement = document.getElementById('textareaImg');
            this.zone.run(() => {
            })
        }, 100);
    }

    // 选择图片
    addImg() {
        let textareaImg: HTMLElement = document.getElementById('textareaImg');
        let innerText: any = textareaImg.innerText;
        if (innerText == '请输入正文') {
            textareaImg.innerText = "";
        }
    }

    chooseVideo() {
        if (this.multiple === "") {
            let modal = this.actionSheetCtrl.create(
                {
                    buttons: [
                        {
                            text: '选择视频',
                            role: '',
                            handler: () => {
                                let video_selector: any = document.getElementById('video_selector');
                                video_selector.value = '';
                                video_selector.click();
                            }
                        },
                        {
                            text: '选择图片',
                            role: '',
                            handler: () => {  //选择视频或者图片
                                let image_selector: any = document.getElementById('image_selector');
                                image_selector.value = '';
                                image_selector.click();
                            }
                        },
                        {
                            text: '取消',
                            role: 'cancel',
                            handler: () => {
                                return
                            }
                        },
                    ]
                }
            )
            modal.present();
        }
        if (this.multiple === "image") {
            let image_selector: any = document.getElementById('image_selector');
            image_selector.value = '';
            image_selector.click();
        }
        if (this.multiple === "video") {
            let video_selector: any = document.getElementById('video_selector');
            video_selector.value = '';
            video_selector.click();
        }
    }

    selectCoverImage() {
        let cover_selector: any = document.getElementById('cover_selector');
        cover_selector.value = '';
        cover_selector.click();
    }

    letfImgSrc = '';

    addImgDom(insert_element, target_element) {
        let newDiv = document.createElement("div");
        newDiv.innerHTML = insert_element;
        let parent = target_element.parentNode;
        //最后一个子节点 lastElementChild兼容其他浏览器 lastChild  兼容ie678;
        let last_element = parent.lastElementChild || parent.lastChild;
        //兄弟节点同样也是有兼容性
        let target_sibling = target_element.nextElementSibling || target_element.nextSibling;
        if (last_element == target_element) {//先判断目标节点是不是父级的最后一个节点，如果是的话，直接给父级加子节点就好
            parent.appendChild(newDiv);
        } else {//不是最好后一个节点  那么插入到目标元素的下一个兄弟节点之前（就相当于目标元素的insertafter）
            parent.insertBefore(newDiv, target_sibling);
        }
    }

    // 在文文字中插入图片
    SetaddImg(imgSrcArr, alt) {

        if (!this.focusNode) {
            imgSrcArr.forEach(element => {
                this.DomAddImg(element, '');
            });
            return
        }
        let textareaImg: HTMLElement = document.getElementById('textareaImg');

        if (!this.focusNode.parentElement) {
            imgSrcArr.forEach(imgSrc => {
                let domText = `
        <div style='display: inline-block; padding-top: 9px;padding-bottom: 17px;color: #6F6F6F;'>
          <img alt='${alt}' src='${imgSrc}'>
          <div contenteditable='false' style='text-align: center;font-size: 12px;' src='${imgSrc}'>${alt}</div>
        </div>`;
                let ImgDom: any = textareaImg.querySelector(`img[src='${this.letfImgSrc}']`);
                let imgParentNode = ImgDom.parentNode;
                this.addImgDom(domText, imgParentNode);
                this.letfImgSrc = imgSrc;
            });

            this.replaceText();
            return
        }
        let textArr = [];
        if (this.focusNode && this.focusNode.data) {
            textArr = this.focusNode.data.split('');
        }

        imgSrcArr.reverse();
        imgSrcArr.forEach(imgSrc => {
            this.letfImgSrc = imgSrc;
            textArr.splice(this.anchorOffset, 0, `<div style='display: inline-block; text-align: center; padding-top: 9px;padding-bottom: 17px;font-size: 12px;'><img alt='${alt}+' src='${imgSrc}'> <div contenteditable='false' style='text-align: center;font-size: 12px;' src='${imgSrc}'>${alt}</div></div>`);
        });
        let NewText = "";
        textArr.forEach(element => {
            NewText += element;
        });

        if (this.focusNode.id == "textareaImg") {
            textareaImg.innerHTML = NewText;
        } else {
            this.focusNode.data = NewText;
        }

        this.replaceText();
    }

    // 在Dom中插入图片
    DomAddImg(imgSrc, alt) {
        this.letfImgSrc = imgSrc;
        let textareaImg: any = document.getElementById('textareaImg');
        if (textareaImg) {
            let domText = `
      <div style='display: inline-block; padding-top: 9px;padding-bottom: 17px;'>
        <img alt='${alt}' src='${imgSrc}'>
        <div contenteditable='false' style='text-align: center;font-size: 12px;color: #6F6F6F;' src='${imgSrc}'>${alt}</div>
      </div>`;
            textareaImg.append(domText);
            let newDiv = document.createElement("div");
            newDiv.innerHTML = "&nbsp;";
            textareaImg.append(newDiv);
        }
        this.replaceText();
    }

    replaceText() {
        let textareaImg: HTMLElement = document.getElementById('textareaImg');
        let textInnerHTML: any = textareaImg.innerHTML;
        textInnerHTML = textInnerHTML.replace(/\&lt;/g, '<');
        textInnerHTML = textInnerHTML.replace(/\&gt;/g, '>');
        textareaImg.innerHTML = textInnerHTML;
        this.zone.run(() => {
            textareaImg.innerHTML = textInnerHTML;
        })
    }

    // 上传视频或文件
    uploadMultipleFile(event) {
        let fileList: FileList = event.target.files;
        let file = fileList[0];
        let type = this.commonSer.ImageOrVideo(file.name);
        this.multiple = type;
        if (type === "image") {  //选择文件为图片
            this.uploadImageFile(event)
        }
        if (type === "video") {   //选择文件是视频
            if (file.size > 20971520) {
                this.commonSer.alert('上传视频不能超过20M');
                this.multiple = "";
                return;
            }
            this.video.isLoad = true;
            //本地预览
            let url = URL.createObjectURL(file);
            console.log(url);
            //ios 只能播放的时候 截图。。
            let video = <any>document.getElementById("video_id");
            video.volume = 0;
            video.src = url;
            video.addEventListener('canplay', () => {
                console.log("video canplay")
                this.captureImage()
            });
            //上传服务器
            this.uploadVideoFile(file);
        }
    }

    //上传视频
    uploadVideoFile(file) {
        let formData: FormData = new FormData();
        formData.append('file', file);
        this.serve.UploadVideoFiles(formData).then((res: any) => {
            console.log("videoFiles", res);
            this.video.isLoad = false;
            this.videoFiles = Object.assign(res.data, {
                "icon": "MP4",
                "filename": file.name,
                "DisplayName": file.name,
                "Size": file.size,
                "fileUrl": res.data.Url,
                "Description": "短视频",
                "UploadWay": 0
            });
        });
    }

    //上传图片
    uploadImageFile(event) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            const loading = this.loadCtrl.create({
                content: '上传中...'
            });
            loading.present();
            let srcArr = [];
            const addImgS = (fileList_n, index) => {
                let formData: FormData = new FormData();
                formData.append('file', fileList_n);
                this.serve.Upload_UploadFiles(formData).then((res: any) => {
                    this.imgitems.push({
                        src: res.data,
                        alt: '',
                    })
                    srcArr.push(res.data);
                    if (!this.focusNode.data && fileList.length == 1) {
                        this.DomAddImg(res.data, '');
                        loading.dismiss();
                        return
                    }
                    if (fileList.length - 1 > index) {
                        addImgS(fileList[index + 1], index + 1);
                    } else {
                        this.SetaddImg(srcArr, '');
                        loading.dismiss();
                    }
                });
            }
            addImgS(fileList[0], 0);
        }
    }

    //上传视频封面
    uploadVideoCover(event) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            const loading = this.loadCtrl.create({
                content: '上传中...'
            });
            loading.present();
            let formData: FormData = new FormData();
            formData.append('file', fileList[0]);
            this.serve.Upload_UploadFiles(formData).then((res: any) => {
                this.CoverUrl = res.data;
                loading.dismiss();
            });
        }
    }

    //视频截图
    captureImage() {
        let video = <any>document.getElementById("video_id");
        let canvas = document.createElement("canvas");
        canvas.width = video.videoWidth * 0.5;
        canvas.height = video.videoHeight * 0.5;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        const blob = this.commonSer.base64ToBlob(canvas.toDataURL("image/png"));
        const file = this.commonSer.blobToFile(blob, 'test');
        let formData: FormData = new FormData();
        formData.append('file', file);
        video.pause();
        this.serve.Upload_UploadFiles(formData).then((res: any) => {
            console.log("CoverUrl", res.data);
            this.CoverUrl = res.data;
        });

    };

    // 获取焦点
    htmlTextDle() {
        let textareaImg: HTMLElement = document.getElementById('textareaImg');
        let innerText: any = textareaImg.innerText;
        if (innerText == '请输入正文') {
            textareaImg.innerText = "";
        }

    }

// 过滤删除图片
    ImgSome() {
        let textareaImg: HTMLElement = document.getElementById('textareaImg');
        let textInnerHTML: any = textareaImg.innerHTML;
        for (let i = 0; i < this.imgitems.length; i++) {
            let n_time = this.imgitems[i];
            let is_src = textInnerHTML.includes(n_time.src);
            if (!is_src) {
                this.imgitems.splice(i, 1);
                i--;
            }
        }
    }

    editImg = {newalt: "", src: ''};
    iseditImg = false;

    editimg(data) {
        this.editImg = data;
        this.editImg['newalt'] = data.alt;
        this.iseditImg = true;
    }

// 编辑图片完成
    editPicturesOk() {
        this.editImg['alt'] = this.editImg['newalt'];
        let textareaImg: any = document.getElementById('textareaImg');
        let ImgDom: any = textareaImg.querySelector(`img[src='${this.editImg.src}']`);
        let DivDom: any = textareaImg.querySelector(`div[src='${this.editImg.src}']`);

        if (!DivDom) {
            let newDiv = document.createElement("div");
            newDiv.innerHTML = `
        <div contenteditable='false' style='text-align: center;font-size: 12px;' src='${this.editImg.src}'>${this.editImg.newalt}</div>
        <div>&nbsp;</div>
      `;
            ImgDom.parentNode.append(newDiv);
        } else {
            DivDom.innerText = this.editImg['newalt'];
        }
        ImgDom.alt = this.editImg['newalt'];
        this.iseditImg = false;
    }

    loading = null;
    sevrData_click = false;

    sevrData(IsSaveAndPublish) {
        if (this.Title.length > 50) {
            this.serve.presentToast('标题不能超过50个字符');
            return;
        }
        if (this.multiple === "video" && this.video.isLoad) {
            this.commonSer.alert("视频未上传完成 请稍后再试");
            return
        }
        let textareaImg: HTMLElement = document.getElementById('textareaImg');
        let textInnerHTML: any = textareaImg.innerHTML;
        let textInnerTEXT: any = textareaImg.innerText;
        console.log(textInnerTEXT);
        if (textInnerTEXT == '请输入正文' || textInnerTEXT.length < 1) {
            this.serve.presentToast('请填写动态或者内容');
            return;
        }

        if (textInnerTEXT.length > 20000) {
            this.serve.presentToast('动态内容不能超过20000个字符');
            return
        }

        if (this.ApplyEssence && (textInnerTEXT.length < 200 || this.imgitems.length === 0)) {
            this.serve.presentToast('有图片且动态字数大于200的才可以申请精华贴')
            return
        }

        let TopicPlateIds = [];
        let TopicTagPlateIds = [];

        //板块
        this.ForumHistorySelection.forEach(e => {
            if (e.Selection) {
                TopicPlateIds.push(e.Id);
            }
        });

        //话题
        this.conversationDataSelection.forEach(e => {
            if (e.Selection) {
                TopicTagPlateIds.push(e.Id);
            }
        });
        if (TopicPlateIds.length == 0) {
            return this.serve.presentToast('请选择动态板块');
        }
        //话题非必选
        // if (TopicTagPlateIds.length == 0) {
        //     return this.serve.presentToast('请选择动态话题');
        // }

        this.loading = this.loadCtrl.create({
            content: '发布中...'
        });
        this.loading.present();
        if (this.lidata.Status) { // 修改 草稿 动态
            this.forum_post_edit(IsSaveAndPublish, textInnerHTML, TopicPlateIds, TopicTagPlateIds);
        } else {
            this.forum_post_add(IsSaveAndPublish, textInnerHTML, TopicPlateIds, TopicTagPlateIds);
        }
        this.sevrData_click = true;
    }

// 修改动态
    forum_post_edit(IsSaveAndPublish, textInnerHTML, TopicPlateIds, TopicTagPlateIds) {
        let data = {
            "Id": this.lidata.postId,//动态编号
            "Title": this.Title,//动态标题
            "TopicPlateId": this.lidata.Id,//动态所属板块编号
            "Content": textInnerHTML,//动态内容
            "IsSaveAndPublish": IsSaveAndPublish,//是否保存并提交
            "TopicPlateIds": TopicPlateIds,
            "TopicTagPlateIds": TopicTagPlateIds,  //话题编号
            "ApplyEssence": this.ApplyEssence  ////true为申请精华贴
        }

        this.serve.editforumtagpost(data).subscribe((res: any) => {
            if (res.code == 200) {
                if (IsSaveAndPublish) {
                    this.editImgOkText = '动态发布成功';
                } else {
                    this.editImgOkText = '保存成功';
                }
                this.editImgOk = true;

                setTimeout(() => {
                    this.editImgOk = false;
                    this.backPop();
                }, 2000);
            } else {
                this.commonSer.alert(res.message);
                this.sevrData_click = false;
            }
            this.loading.dismiss();
        });
    }

    editImgOkText = "";


// 新增 或 保存草稿
    forum_post_add(IsSaveAndPublish, textInnerHTML, TopicPlateIds, TopicTagPlateIds) {
        this.addnewforumtagpost(IsSaveAndPublish, textInnerHTML, TopicPlateIds, TopicTagPlateIds)
    }

    addnewforumtagpost(IsSaveAndPublish, textInnerHTML, TopicPlateIds, TopicTagPlateIds) {
        let data = {
            "IsSaveAndPublish": IsSaveAndPublish,//保持并发布
            "Title": this.Title,//动态标题
            "IsVideo": this.multiple === "video",
            "CoverUrl": this.CoverUrl,
            "files": this.videoFiles,
            "TopicPlateIds": TopicPlateIds,
            "TopicTagPlateIds": TopicTagPlateIds,
            "Content": textInnerHTML,//动态内容
            "ApplyEssence": this.ApplyEssence  ////true为申请精华贴
        }

        this.serve.addnewforumtagpost(data).subscribe((res: any) => {
            if (res.code == 200) {
                if (IsSaveAndPublish) {
                    this.editImgOkText = '动态发布成功';
                } else {
                    this.editImgOkText = '保存成功';
                }
                this.editImgOk = true;
                setTimeout(() => {
                    this.editImgOk = false;
                    this.backPop();
                }, 2000);
            } else {
                this.commonSer.alert(res.message);
                this.sevrData_click = false;
            }
            this.loading.dismiss();
        })
    }


    presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,//3秒后自动消失
            position: 'middle',//位置
            showCloseButton: true,
            closeButtonText: "关闭"
        });
        toast.onDidDismiss(() => {
            console.log('toast被关闭之后执行');
        });
        toast.present();//符合触发条件后立即执行显示。一定不能忘了这个
    }

    //删除图片
    del_img(item, i) {
        this.imgitems.splice(i, 1);
        let textareaImg: any = document.getElementById('textareaImg');
        let ImgDom: any = textareaImg.querySelector(`img[src='${item.src}']`);
        let DivDom: any = textareaImg.querySelector(`div[src='${item.src}']`);
        ImgDom.parentNode.removeChild(ImgDom);
        DivDom.parentNode.removeChild(DivDom);
        if (this.imgitems.length === 0) {
            this.multiple = "";
        }
    }

    //删除视频
    del_video() {
        this.multiple = "";
        this.CoverUrl = "";
        this.videoFiles = {};
    }

    deleteItem(index) {
        this.conversationDataSelection.splice(index, 1);
    }

//添加话题
    addTopic() {
        if (this.conversationDataSelection.length > 2) {
            this.commonSer.alert("最多选择3个话题");
            return
        }
        this.navCtrl.push(ChooseTopicPage);
    }

    //playVideo
    playVideo() {
        let video = <any>document.getElementById("video_id");
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }

}
