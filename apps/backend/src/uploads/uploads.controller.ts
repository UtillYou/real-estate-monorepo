import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { RolesGuard } from '../auth/roles.guard';

@Controller('uploads')
export class UploadsController {
  @Post('image')
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/images',
      filename: (req: any, file: any, cb: any) => {
        const ext = path.extname(file.originalname);
        cb(null, uuidv4() + ext);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  uploadImage(@UploadedFile() file: any, @Req() req: any) {
    // Serve images from /uploads/images
    return { url: `/uploads/images/${file.filename}`,name: file.filename, };
  }
}
