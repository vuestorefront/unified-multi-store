import { CacheManager, ExtensionParams } from './types';
import { Request } from 'express';
import { resolveDomain } from './resolve/resolveDomain';
import { validateMultistoreMethods } from './validate/validateMultistoreMethods';
import { requiredMethodsErrors } from './validate/requiredMethodsErrors';
import { fetchConfigWithCache } from './cache/fetchConfigWithCache';

let cacheManager: CacheManager;

export const multistoreExtension = {
  name: 'multistore-extension',

  extendApp: ({ configuration }: ExtensionParams) => {
    for (const requiredMethod in requiredMethodsErrors) {
      validateMultistoreMethods(requiredMethod, configuration.multistore);
    }

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
