import { logger } from '@cross-chain-aggregator/core/logger'
import { start } from './api.js'

logger.init('router-api')

start()
