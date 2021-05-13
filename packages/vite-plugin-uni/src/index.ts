import { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import { UniCompiler, initUniCompiler } from '@dcloudio/uni-cli-shared'
import { Options as VueOptions } from '@vitejs/plugin-vue'

import { createConfig } from './config'
import { createConfigResolved } from './configResolved'
import { createConfigureServer } from './configureServer'
import { createHandleHotUpdate } from './handleHotUpdate'
export interface VitePluginUniOptions {
  inputDir?: string
  outputDir?: string
  vueOptions?: VueOptions
}
export interface VitePluginUniResolvedOptions extends VitePluginUniOptions {
  base: string
  command: ResolvedConfig['command']
  platform: UniApp.PLATFORM
  inputDir: string
  outputDir: string
  assetsDir: string
  devServer?: ViteDevServer
  compiler: UniCompiler
}

export * from './vue'

export default function uniPlugin(
  rawOptions: VitePluginUniOptions = {}
): Plugin {
  const options: VitePluginUniResolvedOptions = {
    ...rawOptions,
    base: '/',
    assetsDir: 'assets',
    inputDir: '',
    outputDir: '',
    command: 'serve',
    platform: 'h5',
    compiler: initUniCompiler({
      root: process.env.UNI_CLI_CONTEXT || process.cwd(),
    }),
  }
  return {
    name: 'vite:uni',
    config: createConfig(options),
    configResolved: createConfigResolved(options),
    configureServer: createConfigureServer(options),
    handleHotUpdate: createHandleHotUpdate(options),
  }
}