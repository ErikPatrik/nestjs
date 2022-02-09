import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { TweetsService } from '../tweets.service';
import { Cache } from 'cache-manager';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

// aqui é executado independente, a cada 5 segundos
@Injectable()
export class CheckNewTweetsTask {
  // limite de tweets
  private limit: number = 10;

  constructor(
    private tweetService: TweetsService,
    @Inject(CACHE_MANAGER) // constante que é uma string
    private cache: Cache,
    @InjectQueue('emails') // colocamos o nome da fila registrado
    private emailsQueue: Queue,
  ) {}

  // método assíncrono
  @Interval(5000) //executado a cada 5 segundos
  async handle() {
    console.log('procurando tweets...');
    let offset = await this.cache.get<number>('tweet-offset'); // esperamos um numero
    offset = offset === undefined || offset === null ? 0 : offset;

    console.log(`offset: ${offset}`);

    const tweets = await this.tweetService.findAll({
      offset,
      limit: this.limit,
    });

    console.log(`tweets counts: ${tweets.length}`);

    if (tweets.length === this.limit) {
      console.log('achou mais tweets');

      await this.cache.set('tweet-offset', offset + this.limit, {
        ttl: 1 * 60 * 10, // 10 minutos
      });

      this.emailsQueue.add({});
    }
  }
}

// page 1 2 3
// como fazer a busca no banco convencional: select * from tabela limit 0, 15 (página 1)
// agora, 15, 15

// fila de processamento, usando redis, determinando um job no redis, e quanto ve
// que tem um novo trabalho, processa o que a gente quiser
