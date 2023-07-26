import { UiCommand } from './ui.command';
import { ConfigService } from '../config.service';
import open from 'open';

jest.mock('open', () => {
  return jest.fn().mockResolvedValue(true);
});

describe('UiCommand', () => {
  let command;
  let server;
  // eslint-disable-next-line prefer-const
  let configInstance = {};

  Object.defineProperty(configInstance, 'config', {
    get: jest.fn(() => ({ uiPort: 3000 })),
    set: jest.fn(),
  });
  beforeEach(() => {
    server = {
      app: {
        listen: jest.fn(),
      },
      listen: jest.fn().mockResolvedValue(true),
    };
    command = new UiCommand(server, configInstance as ConfigService);
  });

  describe(UiCommand.prototype.handle.name, function () {
    it('should set up server listening on the port values specified in the config', async () => {
      await command.handle();
      expect(server.listen).toHaveBeenCalledWith('localhost', 3000);
    });

    it('should open the default browser to localhost on the port specified in the config', async () => {
      await command.handle();
      expect(open).toHaveBeenCalledWith('http://localhost:3000', { wait: false });
    });
  });
});
