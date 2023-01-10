import { FetchConfigWithCacheParams } from '../types';

/**
 * Returns cached configuration or fetches and caches new configuration if cache is not valid.
 */
export const fetchConfigWithCache = ({
  cacheManager,
  domain,
  multistore
}: FetchConfigWithCacheParams) => {
  const cachedConfiguration = cacheManager.get(domain);

  if (cachedConfiguration) {
    return cachedConfiguration;
  }

  const fetchedConfiguration = multistore.fetchConfiguration({ domain });

  for (const [fetchedDomain, fetchedDomainConfiguration] of Object.entries(
    fetchedConfiguration
  )) {
    cacheManager.set(fetchedDomain, fetchedDomainConfiguration);
  }

  return fetchedConfiguration[domain];
};
