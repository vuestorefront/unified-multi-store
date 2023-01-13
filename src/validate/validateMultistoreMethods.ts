import { MultistoreExtensionMethods } from '../types';
import { ERROR_MESSAGES } from '../const';

/**
 * Validates if multi-store extension methods exists in the configuration input.
 */
export const validateMultistoreMethods = (
  methodName: string,
  multistore?: MultistoreExtensionMethods
) => {
  if (!multistore[methodName]) {
    console.error(ERROR_MESSAGES[methodName]);
    throw new Error(ERROR_MESSAGES[methodName]);
  }
};
