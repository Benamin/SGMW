import {File} from "@ionic-native/file";import {FileOpener} from "@ionic-native/file-opener";export class FileService {    constructor(private file:File,private fileOpener:FileOpener){}    /**     * 下载文件     * @param url 文件URL     */    downloadFile(fileUrl, fileName) {        const xhr = new XMLHttpRequest();        const fileType = this.getFileMimeType(fileName);        const url = encodeURI(fileUrl);        xhr.open('GET', url);        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");        xhr.responseType = "blob";        xhr.addEventListener("loadstart", (ev) => {        })        xhr.addEventListener("progress", (ev) => {            let progress = Math.round(100.0 * ev.loaded / ev.total);            // alert(progress);        })        xhr.addEventListener("load", (ev) => {            const blob = xhr.response;            if (blob) {                let path = this.file.externalDataDirectory;                this.file.writeFile(path, fileName, blob, {   //写入文件                    replace: true                }).then(                    () => {                        this.fileOpener.open(path + fileName, fileType).catch((err) => {                            alert('打开文件失败！' + err);                        })                    }).catch((err) => {                    alert("下载文件失败！")                })            }        });        xhr.addEventListener("loadend", (ev) => {            // 结束下载事件        });        xhr.addEventListener("error", (ev) => {            alert('下载文件失败！');        });        xhr.addEventListener("abort", (ev) => {        });        xhr.send();    }    //获取文件类型    getFileMimeType(fileName: string): string {        let fileType = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();        let mimeType: string = '';        switch (fileType) {            case 'txt':                mimeType = 'text/plain';                break;            case 'docx':                mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';                break;            case 'doc':                mimeType = 'application/msword';                break;            case 'pptx':                mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';                break;            case 'ppt':                mimeType = 'application/vnd.ms-powerpoint';                break;            case 'xlsx':                mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';                break;            case 'xls':                mimeType = 'application/vnd.ms-excel';                break;            case 'zip':                mimeType = 'application/x-zip-compressed';                break;            case 'rar':                mimeType = 'application/octet-stream';                break;            case 'pdf':                mimeType = 'application/pdf';                break;            case 'jpg':                mimeType = 'image/jpeg';                break;            case 'png':                mimeType = 'image/png';                break;            default:                mimeType = 'application/' + fileType;                break;        }        return mimeType;    }}