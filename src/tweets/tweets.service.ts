import { Tweet } from './schemas/tweet.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { TweetDocument } from './schemas/tweet.schema';

@Injectable()
export class TweetsService {
  // Pega a instância do TweetModel que recebemos injetada
  // Model importado do Mongoose que usa o tipo Tweet Document
  constructor(
    @InjectModel(Tweet.name)
    private tweetModel: Model<TweetDocument>,
  ) {}

  // aqui criamos os tweets
  // sempre recebemos como retorno uma promessa
  create(createTweetDto: CreateTweetDto) {
    return this.tweetModel.create(createTweetDto);
  }

  // aqui recebemos um parâmetro que é um objeto
  // contendo o offset e o limite, do tipo number
  // e se eu não passar nada, defino como offset 0 e limite 50 (para não consultar tudo)
  findAll(
    { offset, limit }: { offset: number; limit: number } = {
      offset: 0,
      limit: 50,
    },
  ) {
    return this.tweetModel.find().skip(offset).limit(limit).exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} tweet`;
  }

  update(id: number, updateTweetDto: UpdateTweetDto) {
    return `This action updates a #${id} tweet`;
  }

  remove(id: number) {
    return `This action removes a #${id} tweet`;
  }
}

// Pega a instância do TweetModel que recebemos injetada
// Model importado do Mongoose que usa o tipo Tweet Document
// aqui criamos os tweets
// sempre recebemos como retorno uma promessa
