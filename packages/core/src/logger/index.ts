import pino from 'pino'
import {
  BlockNotFoundError,
  ContractFunctionExecutionError,
  HttpRequestError,
} from 'viem'

/**
 * LoggerProvider is a class that provides logging functionality.
 * It is a wrapper around the pino logger.
 * It is a singleton class.
 * @description ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️ !IMPORTANT! Before using the logger, it must be initialized with the init method at the top of every entry point file of a service.
 */
export class LoggerProvider {
  private pino = pino(
    {
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      level: process.env['PINO_LEVEL'] || 'info',
    },
    pino.multistream([
      { level: 'error', stream: process.stderr },
      { level: 'fatal', stream: process.stderr },
      { level: 'debug', stream: process.stdout },
    ]),
  )
  private hasBeenInitialized = false
  private _chainId: string | undefined

  get chainId() {
    return this._chainId
  }

  get hasBeenInitializedValue() {
    return this.hasBeenInitialized
  }

  /**
   * @description ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️ !IMPORTANT! Before using the logger, it must be initialized with this method at the top of the entry point file of a service.
   */
  init(chainId: string) {
    this.pino.info('LoggerProvider initialized')
    this._chainId = chainId

    this.hasBeenInitialized = true
  }

  noInitLog(message: string) {
    this.pino.info(message)
  }

  extractorInfo(message: string, error?: unknown) {
    this.msg(message, error)
  }

  extractorWarning(message: string, error?: unknown) {
    this.msg(message, error)
  }

  extractorError(message: string, error?: unknown) {
    this.msg(message, error ?? new Error(message))
  }

  info(message: string, ...args: unknown[]) {
    this._checkInit()
    this.pino.info(args, message)
  }

  debug(message: string, ...args: unknown[]) {
    this._checkInit()
    this.pino.debug(args, message)
  }

  warning(message: string, ...args: unknown[]) {
    this._checkInit()
    this.pino.warn(args, message)
  }

  error(message: string, error?: unknown, ..._args: unknown[]) {
    this._checkInit()
    this.pino.error({ err: error }, message)
  }

  private msg(message: string, error?: unknown) {
    this._checkInit()

    if (error instanceof BlockNotFoundError) {
      this.error(`${this._chainId}: ${message}`, this._cutLongMessage(error))
      return
    }
    if (error instanceof HttpRequestError) {
      const errStr = `${error.status} - ${error.shortMessage} (${error.details})`
      const traceId = error.headers?.get('x-drpc-trace-id') ?? undefined
      this.error(
        `${this._chainId}: ${errStr} / ${message}`,
        this._cutLongMessage(error),
        traceId,
      )
      this.error(
        `${this._chainId}: ${message} / ${errStr}`,
        this._cutLongMessage(error),
        traceId,
      )
      return
    }
    if (
      error instanceof ContractFunctionExecutionError &&
      error.details === 'out of gas'
    ) {
      this.error(
        `${this._chainId}: ${message} / Out of Gas`,
        this._cutLongMessage(error),
      )
      return
    }

    const context = error !== undefined ? `${error}` : undefined
    const details = context?.match(/Details: (.*)/)?.[1]
    const errorStr = context?.match(/^(.*)/)?.[1]?.substring(0, 100)
    const errMsg = [details, errorStr].filter((s) => s !== undefined).join('/')

    if (error === undefined) {
      this.info(
        `${this._chainId}: ${message}${errMsg !== '' ? ` / ${errMsg}` : ''}`,
      )
    } else
      this.error(
        `${this._chainId}: ${errMsg} / ${message}`,
        error !== undefined ? this._cutLongMessage(error) : undefined,
      )
  }

  // private _nowDate(): string {
  //   const d = new Date()
  //   const year = (d.getFullYear() % 100).toString().padStart(2, '0')
  //   const month = (d.getMonth() + 1).toString().padStart(2, '0')
  //   const day = d.getDate().toString().padStart(2, '0')
  //   const hours = d.getHours().toString().padStart(2, '0')
  //   const min = d.getMinutes().toString().padStart(2, '0')
  //   const sec = d.getSeconds().toString().padStart(2, '0')
  //   return `${year}-${month}-${day}T${hours}:${min}:${sec}`
  // }

  private errMessageCache = new Map<unknown, string>()
  private _cutLongMessage(error: unknown): string {
    let msg = this.errMessageCache.get(error)
    if (msg) return msg
    const errStr = `${error}`
    msg =
      errStr.length < 1000
        ? errStr
        : `${errStr.substring(0, 500)} *** ${errStr.substring(
            errStr.length - 500,
          )}`
    this.errMessageCache.set(error, msg)
    return msg
  }

  private _checkInit() {
    if (!this.hasBeenInitialized) {
      throw new Error('LoggerProvider has not been initialized')
    }
  }
}

export const logger = new LoggerProvider()
