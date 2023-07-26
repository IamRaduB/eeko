import open from 'open';
import type { UiServer } from '../ui/ui.server';
import { ConfigService } from '../config.service';

export class UiCommand {
  constructor(private server: UiServer, private configServiceInstance: ConfigService) {}
  async handle() {
    await this.server.listen('localhost', this.configServiceInstance.config.uiPort);
    await open(`http://localhost:${this.configServiceInstance.config.uiPort}`, { wait: false });
  }
}
