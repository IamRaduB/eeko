#!/usr/bin/env node
import { version } from '../package.json';
import { UiCommand } from './cli/commands/ui.command';
import configServiceInstance from './cli/config.service';
import { UiServer } from './cli/ui/ui.server';
import { InitCommand } from './cli/commands/init.command';
import { FileSystemService } from './cli/fs.service';

async function start() {
  const Commander = await import('commander');
  const cmd = new Commander.Command();

  cmd.name('eeko').description('I18N manager').version(version);

  cmd
    .command('init')
    .description('Initialize Eeko I18N manager')
    .action(async () => {
      const fsService = new FileSystemService();
      const initCommand = new InitCommand(fsService);
      await initCommand.handle();
    });
  cmd
    .command('ui')
    .description('Launch the user interface')
    .action(async () => {
      await configServiceInstance.readConfigFile();
      const server: UiServer = new UiServer();
      const uiCommand = new UiCommand(server, configServiceInstance);
      await uiCommand.handle();
    });

  cmd.parse();
}

start();
