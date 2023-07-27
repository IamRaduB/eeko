import { Command } from '../../types/command';
import inquirer, { Answers, QuestionCollection } from 'inquirer';
import { FileSystemService } from '../fs.service';
import { CONFIG_FILE_NAME } from '../../types/config';

export class InitCommand implements Command {
  constructor(private fsService: FileSystemService) {}

  async handle(): Promise<void> {
    const questions: QuestionCollection = [
      {
        type: 'input',
        name: 'rootDir',
        message: 'Path to the root of your UI application',
        default: './',
      },
      {
        type: 'input',
        name: 'i18nLocation',
        message: 'Path to the i18n directory',
        default: './i18n',
      },
      {
        type: 'number',
        name: 'uiPort',
        message: 'Listening port for Eeko UI',
        default: 2016,
      },
    ];
    try {
      const answers = await inquirer.prompt(questions);
      await this.createConfigFile(answers);
    } catch (e) {
      if (e.isTtyError) {
        console.error('Unable to boot inquirer. TTY Error', e);
        return process.exit(1);
      }

      console.error('Unexpected error occured', e);
      process.exit(1);
    }
  }

  async createConfigFile(answers: Answers) {
    await this.fsService.writeFile(CONFIG_FILE_NAME, '', answers);
  }
}
