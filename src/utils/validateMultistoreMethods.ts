import { MultistoreExtensionMethods } from '../types';
import { ERROR_MESSAGES } from '../const';

/**
 * Validates if multi-store extension methods exists in the configuration input.
 */
export const validateMultistoreMethods = (
  multistore?: MultistoreExtensionMethods
) => {
  if (!multistore?.fetchConfiguration) {
    console.error(ERROR_MESSAGES.MULTISTORE_NO_FETCH_CONFIGURATION);
    throw new Error(ERROR_MESSAGES.MULTISTORE_NO_FETCH_CONFIGURATION);
  }

  if (!multistore?.mergeConfigurations) {
    console.error(ERROR_MESSAGES.MULTISTORE_NO_MERGE_CONFIGURATIONS);
    throw new Error(ERROR_MESSAGES.MULTISTORE_NO_MERGE_CONFIGURATIONS);
  }

  if (!multistore?.cacheManagerFactory) {
    console.error(ERROR_MESSAGES.MULTISTORE_NO_CACHE_MANAGER_FACTORY);
    throw new Error(ERROR_MESSAGES.MULTISTORE_NO_CACHE_MANAGER_FACTORY);
  }
};
