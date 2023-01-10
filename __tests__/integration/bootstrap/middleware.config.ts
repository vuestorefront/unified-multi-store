import { mockMultistoreConfig } from '../../../__mocks__/multistore.config.mock';
import { multistoreExtension } from '../../../src/extension';

const multistore = mockMultistoreConfig();

export const middlewareConfig = {
  integrations: {
    test_integration: {
      location: './server',
      extensions: (extensions) => [...extensions, multistoreExtension],
      configuration: {
        baseConfigField: 'untouched',
        api: {
          baseSiteId: 'electronics',
          catalogId: 'electronicsProductCatalog',
          catalogVersion: 'Online',
          defaultLanguage: 'en',
          defaultCurrency: 'USD'
        },
        multistore
      }
    }
  }
};
