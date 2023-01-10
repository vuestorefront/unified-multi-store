import { CacheManager, ExtensionParams } from './types';
import { Request } from 'express';
import { resolveDomain } from './utils/resolveDomain';
import { validateMultistoreMethods } from './utils/validateMultistoreMethods';
import { fetchConfigWithCache } from './utils/fetchConfigWithCache';

let cacheManager: CacheManager;

export const multistoreExtension = {
  name: 'multistore-extension',

  extendApp: ({
    configuration
  }: ExtensionParams) => {
    validateMultistoreMethods(configuration.multistore);
    cacheManager = configuration.multistore.cacheManagerFactory(configuration);
  },

  hooks: (req: Request) => {
    return {
      beforeCreate: ({ configuration }: ExtensionParams) => {
        const domain = resolveDomain(req);

        const storeConfiguration = fetchConfigWithCache({
          cacheManager,
          domain,
          multistore: configuration.multistore
        });

        return configuration.multistore.mergeConfigurations({
          baseConfig: configuration,
          storeConfig: storeConfiguration
        });
      }
    };
  }
};
