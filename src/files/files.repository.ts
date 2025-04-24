import { Injectable } from "@nestjs/common";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import * as toStream from 'buffer-to-stream'

@Injectable()
export class FilesRepository {
    async uploadImg(fileImg: Express.Multer.File): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });

            toStream(fileImg.buffer).pipe(upload);
        });
    }
} 