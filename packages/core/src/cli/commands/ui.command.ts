import open from 'open';
import type { UiServer } from '../ui/ui.server';
import configServiceInstance, { ConfigService } from '../config.service';
import { Command } from '../../types/command';

export class UiCommand implements Command {
  constructor(
    private server: UiServer,
    private configServiceInstance: ConfigService
  ) {}
  async handle() {
    await this.server.listen(
      'localhost',
      this.configServiceInstance.config.uiPort
    );

    if (process.env.devMode) {
      return;
    }

    await open(`http://localhost:${this.configServiceInstance.config.uiPort}`, {
      wait: false,
    });
  }
}
