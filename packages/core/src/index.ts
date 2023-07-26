#!/usr/bin/env node
import { version } from '../package.json';
import { UiCommand } from './cli/commands/ui.command';
import configServiceInstance from './cli/config.service';
import { UiServer } from './cli/ui/ui.server';

async function start() {
  const Commander = await import('commander');
  const cmd = new Commander.Command();
  await configServiceInstance.readConfigFile();

  cmd.name('Eeko').description('I18n manager').version(version);

  cmd
    .command('ui')
    .description('Launch the user interface')
    .action(async () => {
      const server: UiServer = new UiServer();
      const uiCommand = new UiCommand(server, configServiceInstance);
      await uiCommand.handle();
    });

  cmd.parse();
}

start();
