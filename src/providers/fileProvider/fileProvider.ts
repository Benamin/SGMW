import {Injectable} from "@angular/core"
import "rxjs/add/operator/map"
import {
  AlertController,
  Loading,
  LoadingController,
  ActionSheetController
} from "ionic-angular"
import {Camera, CameraOptions} from "@ionic-native/camera"
import {
  MediaCapture,
  MediaFile,
  CaptureError
} from "@ionic-native/media-capture"

declare let ImagePicker;

@Injectable()
export class FileProvider {
  loading: Loading

  constructor(private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private camera: Camera,
              private mediaCapture: MediaCapture,
              private actionSheetCtrl: ActionSheetController) {
  }

  /**
   * 显示拍照选择
   */
  choosePhoto(type, successCallback, errorCallback) {
    let actionSheet = this.actionSheetCtrl.create({
      title: "选择视频来源",
      buttons: [
        {
          text: "本地",
          role: "destructive",
          handler: () => {
            let options = {
              destinationType: this.camera.DestinationType.NATIVE_URI,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              saveToPhotoAlbum: false,
              correctOrientation: true,
              mediaType: 1 //0为图片，1为视频
            }
            this.getVideo(successCallback, errorCallback, options)
          }
        },
        {
          text: "录制",
          handler: () => {
            let options = {
              destinationType: this.camera.DestinationType.NATIVE_URI,
              sourceType: this.camera.PictureSourceType.CAMERA,
              saveToPhotoAlbum: false,
              correctOrientation: true,
              mediaType: 1 //0为图片，1为视频
            }
            this.getMedia(successCallback, errorCallback, options)
          }
        },
        {
          text: "取消",
          role: "cancel",
          handler: () => {
          }
        }
      ]
    })
    actionSheet.present()
  }

  chooseType(successCallback, errorCallback, isBrowser, limit?) {
    let actionSheet = this.actionSheetCtrl.create({
      title: "选择上传类型",
      buttons: [
        {
          text: "图片",
          role: "destructive",
          handler: () => {
            isBrowser ?
              successCallback(null, "image") :
              this.getImage(successCallback, errorCallback, {
                maximumImagesCount: limit || 9,
                width: 1920,
                height: 1440,
                quality: 100
              })
          }
        },
        {
          text: "视频",
          handler: () => {
            isBrowser ?
              successCallback(null, "video") :
              this.choosePhoto("video", successCallback, errorCallback)
          }
        },
        {
          text: "取消",
          role: "cancel",
          handler: () => {
          }
        }
      ]
    })
    actionSheet.present()
  }

  getImage(successCallback, errorCallback, option) {
    ImagePicker.getPictures(function (result) {
      successCallback(result, "image")
    }, function (err) {
      errorCallback(err)
    }, option);
  }

  getMedia(successCallback, errorCallback, options) {
    this.mediaCapture.captureVideo(options).then(
      (data: MediaFile[]) => {
        let path = data[0].fullPath
        let url = path.startsWith("file://") ? path : "file://" + path
        successCallback(url, "media")
      },
      (err: CaptureError) => {
        console.error(err)
        errorCallback(err)
      }
    )
  }

  getVideo(successCallback, errorCallback, options: CameraOptions) {
    this.camera.getPicture(options).then(
      imageData => {
        let url = imageData.startsWith("file://") ? imageData : "file://" + imageData
        successCallback(url, "cameraVideo")
      },
      err => {
        // Handle error
        errorCallback(err)
      }
    )
  }
}
