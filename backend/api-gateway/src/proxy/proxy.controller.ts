import { Controller, All, Req, Res, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller()
export class ProxyController {
  constructor(private httpService: HttpService, private configService: ConfigService) {}

  private async proxyRequest(req, res, targetService: string) {
    try {
      const serviceUrl = this.configService.get<string>(targetService);
      const response = await firstValueFrom(
        this.httpService.request({
          method: req.method,
          url: `${serviceUrl}${req.url}`,
          headers: req.headers,
          data: req.body,
        })
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      res.status(error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error.response?.data || { message: 'Internal Server Error' });
    }
  }

  @All('auth/*')
  async proxyToAuth(@Req() req, @Res() res) {
    return this.proxyRequest(req, res, 'AUTH_SERVICE_URL');
  }

  @All('posts/*')
  async proxyToPost(@Req() req, @Res() res) {
    return this.proxyRequest(req, res, 'POST_SERVICE_URL');
  }
}
