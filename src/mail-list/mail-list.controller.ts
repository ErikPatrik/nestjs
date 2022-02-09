import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { MailListService } from './mail-list.service';
import { CreateMailListDto } from './dto/create-mail-list.dto';
import { UpdateMailListDto } from './dto/update-mail-list.dto';

@Controller('mail-list')
export class MailListController {
  constructor(private readonly mailListService: MailListService) {}

  @Post()
  create(@Body() createMailListDto: CreateMailListDto) {
    return this.mailListService.create(createMailListDto);
  }

  @Get()
  async findOne(@Res() res) {
    // @Res já dá a instância da resposta
    const mail = await this.mailListService.findOne();
    return !mail
      ? res.status(HttpStatus.NO_CONTENT).json(null)
      : res.json(mail);
  }
}
