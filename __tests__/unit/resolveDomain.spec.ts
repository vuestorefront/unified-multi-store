import { mockRequest } from '../../__mocks__/request.mock';
import { resolveDomain } from '../../src/utils/resolveDomain';
import { Request } from 'express';

describe('[MultiStoreExtension] resolveDomain utility function', () => {
  it('responds with origin header for client-side communication', () => {
    const ORIGIN = 'https://origin-mydomain.io';
    const DOMAIN = 'origin-mydomain.io';
    const X_FORWARDED_HOST = 'x-forwarded-host-mydomain.io';
    const HOST = 'host-mydomain.io';
    
    const mockedRequest = mockRequest();
    mockedRequest.headers['origin'] = ORIGIN;
    mockedRequest.headers['x-forwarded-host'] = X_FORWARDED_HOST;
    mockedRequest.headers['host'] = HOST;
    mockedRequest.get.mockImplementation((header) => {
      if (header === 'origin') return ORIGIN;
      if (header === 'x-forwarded-host') return X_FORWARDED_HOST;
      return HOST;
    });

    const resolvedDomain = resolveDomain(mockedRequest as any as Request);

    expect(resolvedDomain).toBe(DOMAIN);
  });

  it('responds with x-forwarded-host header for server-side communication', () => {
    const ORIGIN = undefined;
    const X_FORWARDED_HOST = 'x-forwarded-host-mydomain.io';
    const HOST = 'host-mydomain.io';
    
    const mockedRequest = mockRequest();
    mockedRequest.headers['origin'] = ORIGIN;
    mockedRequest.headers['x-forwarded-host'] = X_FORWARDED_HOST;
    mockedRequest.headers['host'] = HOST;
    mockedRequest.get.mockImplementation((header) => {
      if (header === 'origin') return ORIGIN;
      if (header === 'x-forwarded-host') return X_FORWARDED_HOST;
      return HOST;
    });

    const resolvedDomain = resolveDomain(mockedRequest as any as Request);

    expect(resolvedDomain).toBe(X_FORWARDED_HOST);
  });

  it('fallbacks to host header for server-side communication', () => {
    const ORIGIN = undefined;
    const X_FORWARDED_HOST = undefined;
    const HOST = 'host-mydomain.io';
    
    const mockedRequest = mockRequest();
    mockedRequest.headers['origin'] = ORIGIN;
    mockedRequest.headers['x-forwarded-host'] = X_FORWARDED_HOST;
    mockedRequest.headers['host'] = HOST;
    mockedRequest.get.mockImplementation((header) => {
      if (header === 'origin') return ORIGIN;
      if (header === 'x-forwarded-host') return X_FORWARDED_HOST;
      return HOST;
    });

    const resolvedDomain = resolveDomain(mockedRequest as any as Request);

    expect(resolvedDomain).toBe(HOST);
  });
});
