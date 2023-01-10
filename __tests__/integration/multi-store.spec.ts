import { buildApp } from './bootstrap/buildApp'
import { middlewareConfig } from './bootstrap/middleware.config'

describe('[MultiStoreExtension] Owerwrites application config', () => {
  it('test1', async () => {
    const app = await buildApp(middlewareConfig);
    console.log(app)
  })
})