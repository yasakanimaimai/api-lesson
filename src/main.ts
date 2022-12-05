import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'
import { Request } from 'express'
import * as cookieParser from 'cookie-parser'
import * as csurf from 'csurf'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // class-validatorを機能を有効化のためにuseGlobalPipesが必要
  // ValidationPipeはinterfaceにないプロパティを省く
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.enableCors({
    credentials: true,
    origin: [
      'http://localhost:3000',
      'https://todo-nextjs-silk.vercel.app',
  ],
  })
  app.use(cookieParser())
  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      },
      value: (req: Request) => {
        return req.header('csrf-token')
     }
    }),
  );
  await app.listen(process.env.PORT || 3005);
}
bootstrap();
