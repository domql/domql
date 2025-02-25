'use strict'

export const NODE_ENV = process.env.NODE_ENV

export const isProduction = (env = NODE_ENV) =>
  env === 'production' ||
  env === 'prod' ||
  (env !== 'development' && env !== 'dev' && env !== 'test')
export const isTest = (env = NODE_ENV) => env === 'test'
export const isDevelopment = (env = NODE_ENV) =>
  env === 'development' || env === 'dev'

export const getNev = (key, env = NODE_ENV) => env[key]
