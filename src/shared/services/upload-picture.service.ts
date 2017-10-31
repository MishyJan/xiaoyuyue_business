import { Injectable } from '@angular/core';
import { PictureServiceProxy } from 'shared/service-proxies/service-proxies';
import { UploadOrgBgComponent } from './../../app/organization-manage/org-info/upload-bg/upload-bg.component';

@Injectable()
export class UploadPictureService {

    _uploadPictureToken: string;

    constructor(
        private _pictureServiceProxy: PictureServiceProxy
    ) {

    }

    // public getPictureUploadToken(): any {
    //     if (this._uploadPictureToken) {
    //         return this._uploadPictureToken;
    //     } else {
    //         return this._pictureServiceProxy.getPictureUploadToken().toPromise().then(result => {
    //             this._uploadPictureToken = result.token;

    //             return this._uploadPictureToken;
    //         })
    //     }
    // }

    public getPictureUploadToken(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (this._uploadPictureToken) {
                resolve(this._uploadPictureToken);
            } else {
                this._pictureServiceProxy.getPictureUploadToken().toPromise().then(result => {
                    this._uploadPictureToken = result.token;
                    resolve(result.token);
                })
            }
        });
    }
}