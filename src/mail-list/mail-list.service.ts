import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMailListDto } from './dto/create-mail-list.dto';
import { UpdateMailListDto } from './dto/update-mail-list.dto';
import { MailList, MailListDocument } from './schemas/mail-list.schema';
import { Model } from 'mongoose';

@Injectable()
export class MailListService {
  constructor(
    @InjectModel(MailList.name)
    private mailListModel: Model<MailListDocument>,
  ) {}

  async create({ emails }: CreateMailListDto) {
    const mail = await this.findOne();
    if (!mail) {
      // se não existi email, faço a criação
      return this.mailListModel.create({
        emails,
      });
    }
    await mail.update({ emails }).exec();
    return this.findOne();
  }

  async findOne() {
    const mails = await this.mailListModel.find().exec();
    return mails.length ? mails[0] : null;
  }
}
