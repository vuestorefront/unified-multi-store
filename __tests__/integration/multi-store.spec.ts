import request from 'supertest';
import { Express } from 'express';
import { integrations } from './bootstrap/middleware.config';
import { createServer } from '@vue-storefront/middleware';
import { mockMiddlewareConfig } from '../../__mocks__/middleware.config.mock';
import { multistoreExtension } from '../../src/extension';

describe('[MultiStoreExtension] Unified multi-store approach', () => {
  const mockedMiddlewareConfig = mockMiddlewareConfig();

  describe('No extension app', () => {
    let pureApp;

    const noExtensionConfig = {
      ...integrations.bootstraped,
      configuration: mockedMiddlewareConfig
    };

    beforeAll(async () => {
      pureApp = await createServer({
        integrations: {
          bootstraped: noExtensionConfig
        }
      });
    });

    describe('uses default configuration without extension', () => {
      it('igrores x-forwarded-host header for server-to-server communication', async () => {
        const { body } = await request(pureApp)
          .post('/bootstraped/getConfig')
          .set('x-forwarded-host', 'mydomain.io')
          .set('host', 'mydomain.io')
          .send([]);

        expect(body.config).toEqual(
          JSON.parse(JSON.stringify(noExtensionConfig.configuration))
        );
      });

      it('ignores fallback to host header for server-to-server communication', async () => {
        const { body } = await request(pureApp)
          .post('/bootstraped/getConfig')
          .set('x-forwarded-host', '')
          .set('host', 'mydomain.io')
          .send([]);

        expect(body.config).toEqual(
          JSON.parse(JSON.stringify(noExtensionConfig.configuration))
        );
      });

      it('ignores origin header for client-to-server communication', async () => {
        const { body } = await request(pureApp)
          .post('/bootstraped/getConfig')
          .set('origin', 'http://mydomain.io')
          .send([]);

        expect(body.config).toEqual(
          JSON.parse(JSON.stringify(noExtensionConfig.configuration))
        );
      });
    });
  });

  describe('Extended app', () => {
    let extendedApp: Express;

    const bootstrapedConfig = {
      ...integrations.bootstraped,
      configuration: mockedMiddlewareConfig,
      extensions: (extensions) => [...extensions, multistoreExtension]
    };

    beforeAll(async () => {
      extendedApp = await createServer({
        integrations: {
          bootstraped: bootstrapedConfig
        }
      });
    });

    describe('overwrites base configuration with store specific', () => {
      it('based on x-forwarded-host header for server-to-server communication', async () => {
        const { body } = await request(extendedApp)
          .post('/bootstraped/getConfig')
          .set('x-forwarded-host', 'mydomain.io')
          .set('host', 'mydomain.io')
          .send([]);

        expect(body.config).toEqual(
          JSON.parse(JSON.stringify(bootstrapedConfig.configuration))
        );
      });

      it('based on fallback to host header for server-to-server communication', async () => {
        const { body } = await request(extendedApp)
          .post('/bootstraped/getConfig')
          .set('x-forwarded-host', '')
          .set('host', 'mydomain.io')
          .send([]);

        expect(body.config).toEqual(
          JSON.parse(JSON.stringify(bootstrapedConfig.configuration))
        );
      });

      it('based on origin header for client-to-server communication', async () => {
        const { body } = await request(extendedApp)
          .post('/bootstraped/getConfig')
          .set('origin', 'http://mydomain.io')
          .send([]);

        expect(body.config).toEqual(
          JSON.parse(JSON.stringify(bootstrapedConfig.configuration))
        );
      });
    });
  });
});
