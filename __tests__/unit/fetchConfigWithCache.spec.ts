/* eslint-disable @typescript-eslint/no-unused-vars */
import { mockMultistoreConfig } from '../../__mocks__/multistore.config.mock';
import { fetchConfigWithCache } from '../../src/utils/fetchConfigWithCache';

describe('[MultiStoreExtension] fetchConfigWithCache utility function', () => {
  const multistore = mockMultistoreConfig();
  const DOMAIN = 'mydomain.io';
  const FETCH_RESPONSE = {
    'mydomain.io': {
      baseSiteId: 'electronics',
      catalogId: 'electronicsProductCatalog',
      catalogVersion: 'Online',
      defaultLanguage: 'en',
      defaultCurrency: 'USD'
    }
  };

  it('gets configuration from cache', () => {
    const cacheManager = {
      get: jest.fn((key) => {
        return {
          baseSiteId: 'electronics',
          catalogId: 'electronicsProductCatalog',
          catalogVersion: 'Online',
          defaultLanguage: 'en',
          defaultCurrency: 'USD'
        };
      }),
      set: jest.fn()
    };

    fetchConfigWithCache({ cacheManager, domain: DOMAIN, multistore });

    expect(cacheManager.get).toBeCalled();
    expect(multistore.fetchConfiguration).not.toBeCalled();
  });

  it('fetches new configuration when cache expires ', () => {
    const cacheManager = {
      get: jest.fn((key) => undefined),
      set: jest.fn((key, value) => {})
    };
    multistore.fetchConfiguration.mockReturnValue(FETCH_RESPONSE);
    const STORE_CONFIG = Object.values(FETCH_RESPONSE)[0];

    const res = fetchConfigWithCache({
      cacheManager,
      domain: DOMAIN,
      multistore
    });

    expect(res).toEqual(STORE_CONFIG);
  });

  it('caches fetched configuration ', () => {
    const cacheManager = {
      get: jest.fn((key) => undefined),
      set: jest.fn((key, value) => {})
    };
    multistore.fetchConfiguration.mockReturnValue(FETCH_RESPONSE);
    const [cacheKey, cacheValue] = Object.entries(FETCH_RESPONSE)[0];

    fetchConfigWithCache({
      cacheManager,
      domain: DOMAIN,
      multistore
    });

    expect(cacheManager.set).toBeCalledWith(cacheKey, cacheValue);
  });
});
