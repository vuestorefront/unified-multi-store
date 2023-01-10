/* eslint-disable @typescript-eslint/no-unused-vars */
import { mockMultistoreConfig } from '../../__mocks__/multistore.config.mock';
import { validateMultistoreMethods } from '../../src/utils/validateMultistoreMethods';
import { ERROR_MESSAGES } from '../../src/const';

describe('[MultiStoreExtension] validateMultistoreMethods utility function', () => {
  const multistore = mockMultistoreConfig();

  it('validates fetchConfiguration', () => {
    expect.assertions(1);

    try {
      validateMultistoreMethods({
        ...multistore,
        fetchConfiguration: undefined
      } as any);
    } catch (error) {
      expect(error.message).toBe(
        ERROR_MESSAGES.MULTISTORE_NO_FETCH_CONFIGURATION
      );
    }
  });

  it('validates cacheManagerFactory', () => {
    expect.assertions(1);

    try {
      validateMultistoreMethods({
        ...multistore,
        cacheManagerFactory: undefined
      } as any);
    } catch (error) {
      expect(error.message).toBe(
        ERROR_MESSAGES.MULTISTORE_NO_CACHE_MANAGER_FACTORY
      );
    }
  });

  it('validates mergeConfigurations', () => {
    expect.assertions(1);

    try {
      validateMultistoreMethods({
        ...multistore,
        mergeConfigurations: undefined
      } as any);
    } catch (error) {
      expect(error.message).toBe(
        ERROR_MESSAGES.MULTISTORE_NO_MERGE_CONFIGURATIONS
      );
    }
  });
});
