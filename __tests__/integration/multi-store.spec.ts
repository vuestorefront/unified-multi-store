import request from 'supertest';
import { Express } from 'express';
import { integrations } from './bootstrap/middleware.config';
import { createServer } from '@vue-storefront/middleware';
import { mockMiddlewareConfig } from '../../__mocks__/middleware.config.mock';
import { multistoreExtension } from '../../src/extension';

describe('[MultiStoreExtension] Unified multi-store approach', () => {
  const mockedMiddlewareConfig = mockMiddlewareConfig();

  describe('Extended app', () => {
    let app: Express;

    const bootstrapedConfig = {
      ...integrations.bootstraped,
      configuration: mockedMiddlewareConfig,
      extensions: (extensions) => [...extensions, multistoreExtension]
    };

    beforeAll(async () => {
      app = await createServer({
        integrations: {
          bootstraped: bootstrapedConfig
        }
      });
    });

    describe('Domain: localhost:3000', () => {
      const domain = 'localhost:3000';

      const domainSpecificConfig = {
        ...mockedMiddlewareConfig.multistore.fetchConfiguration({})[domain],
        uri: 'uri'
      };

      it('based on x-forwarded-host header for server-to-server communication', async () => {
        const { body } = await request(app)
          .post('/bootstraped/getConfig')
          .set('x-forwarded-host', domain)
          .set('host', domain)
          .send([]);

        expect(body.config.api).toEqual(domainSpecificConfig);
      });

      it('based on fallback to host header for server-to-server communication', async () => {
        const { body } = await request(app)
          .post('/bootstraped/getConfig')
          .set('x-forwarded-host', '')
          .set('host', domain)
          .send([]);

        expect(body.config.api).toEqual(domainSpecificConfig);
      });

      it('based on origin header for client-to-server communication', async () => {
        const { body } = await request(app)
          .post('/bootstraped/getConfig')
          .set('origin', `http://${domain}`)
          .send([]);

        expect(body.config.api).toEqual(domainSpecificConfig);
      });
    });

    describe('Domain: mydomain.io', () => {
      const domain = 'mydomain.io';

      const domainSpecificConfig = {
        ...mockedMiddlewareConfig.multistore.fetchConfiguration({})[domain],
        uri: 'uri'
      };

      it('based on x-forwarded-host header for server-to-server communication', async () => {
        const { body } = await request(app)
          .post('/bootstraped/getConfig')
          .set('x-forwarded-host', domain)
          .set('host', domain)
          .send([]);

        expect(body.config.api).toEqual(domainSpecificConfig);
      });

      it('based on fallback to host header for server-to-server communication', async () => {
        const { body } = await request(app)
          .post('/bootstraped/getConfig')
          .set('x-forwarded-host', '')
          .set('host', domain)
          .send([]);

        expect(body.config.api).toEqual(domainSpecificConfig);
      });

      it('based on origin header for client-to-server communication', async () => {
        const { body } = await request(app)
          .post('/bootstraped/getConfig')
          .set('origin', `http://${domain}`)
          .send([]);

        expect(body.config.api).toEqual(domainSpecificConfig);
      });
    });
  });
});
