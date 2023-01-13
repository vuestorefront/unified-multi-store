/* eslint-disable no-useless-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

export const mockMultistoreConfig = () => ({
  fetchConfiguration: jest.fn(({ domain }) => {
    return {
      'localhost:3000': {
        baseSiteId: 'electronics',
        catalogId: 'electronicsProductCatalog',
        catalogVersion: 'Online',
        defaultLanguage: 'en',
        defaultCurrency: 'USD'
      },
      'mydomain.io': {
        baseSiteId: 'electronics',
        catalogId: 'electronicsProductCatalog',
        catalogVersion: 'Online',
        defaultLanguage: 'en',
        defaultCurrency: 'USD'
      }
    } as any;
  }),

  mergeConfigurations: jest.fn(({ baseConfig, storeConfig }) => {
    return {
      ...baseConfig,
      api: {
        ...baseConfig.api,
        ...storeConfig
      }
    } as any;
  }),

  cacheManagerFactory: jest.fn(() => {
    return {
      get(key) {
        return {
          baseSiteId: 'electronics',
          catalogId: 'electronicsProductCatalog',
          catalogVersion: 'Online',
          defaultLanguage: 'en',
          defaultCurrency: 'USD'
        } as any;
      },
      set(key, value) {
        return null as any;
      }
    };
  })
});
