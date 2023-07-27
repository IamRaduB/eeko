import Fastify, { FastifyInstance } from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';
import { FileSystemService } from '../fs.service';
import configServiceInstance from '../config.service';
import { TranslateService } from '../translate.service';
import * as fs from 'fs';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';

export interface IQuerystring {
  locale: string;
}

export class UiServer {
  private readonly app: FastifyInstance;

  constructor() {
    this.app = Fastify({
      logger: false,
    });

    this.setupApp();

    this.bindRoutes();
  }

  setupApp() {
    if (process.env.devMode) {
      this.app.register(cors, {
        origin: 'http://localhost:5173',
      });
    } else {
      const indexPath = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        'ui'
      );
      this.app.register(fastifyStatic, {
        root: indexPath,
      });
    }
  }

  bindRoutes() {
    this.app.get<{
      Querystring: IQuerystring;
      Headers: {};
    }>('/list-i18n', async (req, res) => {
      const translateService = new TranslateService(
        new FileSystemService(process.cwd()),
        configServiceInstance
      );
      try {
        const result = await translateService.getFilesForProject();
        return res.send(result);
      } catch (e) {
        console.error(e);
        return res.send({
          status: 0,
          message: `Unable to read i18n directory`,
        });
      }
    });

    this.app.get<{
      Querystring: IQuerystring;
      Headers: {};
    }>('/i18n', async (req, res) => {
      const translateService = new TranslateService(
        new FileSystemService(process.cwd()),
        configServiceInstance
      );
      const query = req.query;
      try {
        if (!query.locale) {
          return {
            status: 0,
            message: 'File path was not provided',
          };
        }

        const result = await translateService.loadFileContents(
          query.locale as string
        );
        if (!result) {
          return res.status(404).send({
            status: 0,
            message: `Translation file ${req.query.locale} not found`,
          });
        }
        return result;
      } catch (e) {
        console.error(e);
        res.status(500).send({
          status: 0,
          message: `Unable to read translation file ${req.query.locale}`,
        });
      }
    });

    this.app.post<{
      Querystring: IQuerystring;
      Headers: {};
    }>('/i18n', async (req, res) => {
      const translateService = new TranslateService(
        new FileSystemService(process.cwd()),
        configServiceInstance
      );
      const query = req.query;
      try {
        if (!query.locale) {
          res.status(400).send({
            status: 0,
            message: 'File name was not provided',
          });
        }

        const result = await translateService.createTranslation(
          query.locale as string
        );

        return result;
      } catch (e) {
        console.error(e);
        res.status(500).send({
          status: 0,
          message: `Unable to write translation file ${req.query.locale}`,
        });
      }
    });

    this.app.put<{
      Querystring: IQuerystring;
      Headers: {};
    }>('/i18n', async (req, res) => {
      const translateService = new TranslateService(
        new FileSystemService(process.cwd()),
        configServiceInstance
      );
      const body = req.body;
      try {
        if (!req.query.locale) {
          res.status(400).send({
            status: 0,
            message: 'File name was not provided',
          });
        }

        const result = await translateService.updateTranslation(
          req.query.locale as string,
          body
        );
        return result;
      } catch (e) {
        console.error(e);
        res.status(500).send({
          status: 0,
          message: `Unable to update translation file ${req.query.locale}`,
        });
      }
    });

    this.app.get('/', (req, res) => {
      const indexPath = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        'ui',
        'index.html'
      );
      const stream = fs.createReadStream(indexPath);
      res.type('text/html').send(stream);
    });

    this.app.all('/project/*', (req, res) => {
      const indexPath = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        'ui',
        'index.html'
      );
      const stream = fs.createReadStream(indexPath);
      res.type('text/html').send(stream);
    });
  }

  async listen(host: string, port: number): Promise<void> {
    await this.app.listen({ port, host });
    console.log('Eeko UI is running on port', port);
  }

  get serverInstance() {
    return this.app;
  }
}
