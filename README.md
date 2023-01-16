# Unified multi-store

Unified multi-store approach for VSF eCommerce integrations.

## Getting started

Unified multi-store is an extension for VSF middleware that overwrites the base configuration with a store-specific config.
To setup multi-store in your VSF middleware:

1. Import `multistoreExtension` from `@vsf-enterprise/multistore` package and extend the middleware config. SAP example:

```diff
# middleware.config.js

require('dotenv').config();
+ const { multistoreExtension } = require('@vsf-enterprise/multistore');

module.exports = {
  integrations: {
    sapcc: {
      location: '@vsf-enterprise/sapcc-api/server',
+     extensions: (extensions) => [
+       ...extensions,
+       multistoreExtension
+     ],
      configuration: {
        OAuth: {
          uri: process.env.SAPCC_OAUTH_URI,
          clientId: process.env.SAPCC_OAUTH_CLIENT_ID,
          clientSecret: process.env.SAPCC_OAUTH_CLIENT_SECRET,
          tokenEndpoint: process.env.SAPCC_OAUTH_TOKEN_ENDPOINT,
          tokenRevokeEndpoint: process.env.SAPCC_OAUTH_TOKEN_REVOKE_ENDPOINT,
          cookieOptions: {
            'vsf-sap-token': { secure: process.env.NODE_ENV !== 'development' }
          }
        },
        api: {
          uri: process.env.SAPCC_API_URI,
          baseSiteId: 'electronics',
          catalogId: 'electronicsProductCatalog',
          catalogVersion: 'Online',
          defaultLanguage: 'en',
          defaultCurrency: 'USD'
        }
      }
    }
  }
};
```

2. Prepare multistore configuration. Create `multistore.config.js` file containing the following methods

- `fetchConfiguration({ domain }): Record<string, StoreConfig>` - fetches store configuration. Method accepts domain as an argument and returns with the store-specific configuration based on the domains where the domain is an key and configuration is a value.
- `mergeConfigurations({ baseConfig, storeConfig }): StoreConfig` - overwrites base configuration with store-specific config.
- `cacheManagerFactory(): { get: (key: string) => StoreConfig, set(key: string, value: StoreConfig)}` - creates cache manager with `get` and `set` methods.

Example multistore configuration, which overwrites the `api` parameter of base configuration and uses `node-cache` as a cache manager.

```javascript
// multistore.config.js

const NodeCache = require('node-cache');

module.exports = {
  fetchConfiguration(/* { domain } */) {
    return {
      'mydomain.io': {
        baseSiteId: 'apparel-uk',
        catalogId: 'apparelProductCatalog',
        catalogVersion: 'Online',
        defaultLanguage: 'en',
        defaultCurrency: 'GBP'
      },
      'localhost:3000': {
        baseSiteId: 'electronics',
        catalogId: 'electronicsProductCatalog',
        catalogVersion: 'Online',
        defaultLanguage: 'en',
        defaultCurrency: 'USD'
      }
    };
  },
  mergeConfigurations({ baseConfig, storeConfig }) {
    return {
      ...baseConfig,
      api: {
        ...baseConfig.api,
        ...storeConfig
      }
    };
  },
  cacheManagerFactory() {
    const client = new NodeCache({
      stdTTL: 10
    });

    return {
      get(key) {
        return client.get(key);
      },
      set(key, value) {
        return client.set(key, value);
      }
    };
  }
};
```

3. Add multi-store configuration to `middleware.config.js`:

```diff
# middleware.config.js

require('dotenv').config();
+ const multistore = require('./multistore.config');
const { multistoreExtension } = require('@vsf-enterprise/multistore');

module.exports = {
  integrations: {
    sapcc: {
      location: '@vsf-enterprise/sapcc-api/server',
      extensions: (extensions) => [
        ...extensions,
        multistoreExtension
      ],
      configuration: {
        OAuth: {
          uri: process.env.SAPCC_OAUTH_URI,
          clientId: process.env.SAPCC_OAUTH_CLIENT_ID,
          clientSecret: process.env.SAPCC_OAUTH_CLIENT_SECRET,
          tokenEndpoint: process.env.SAPCC_OAUTH_TOKEN_ENDPOINT,
          tokenRevokeEndpoint: process.env.SAPCC_OAUTH_TOKEN_REVOKE_ENDPOINT,
          cookieOptions: {
            'vsf-sap-token': { secure: process.env.NODE_ENV !== 'development' }
          }
        },
        api: {
          uri: process.env.SAPCC_API_URI,
          baseSiteId: 'electronics',
          catalogId: 'electronicsProductCatalog',
          catalogVersion: 'Online',
          defaultLanguage: 'en',
          defaultCurrency: 'USD'
        }
      },
+     multistore
    }
  }
};
```
