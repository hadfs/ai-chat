export class Cors {
  private app: any = null;
  constructor(app) {
    this.app = app;
    this.handle();
  }
  handle() {
    this.app.enableCors({
      origin: "*",
      allowedHeaders: ['Authorization', 'content-type'],
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    });
   }
}