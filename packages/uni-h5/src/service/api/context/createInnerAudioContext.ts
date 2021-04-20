import { getRealPath } from '@dcloudio/uni-platform'
import {
  API_CREATE_INNER_AUDIO_CONTEXT,
  defineSyncApi,
} from '@dcloudio/uni-api'
import type { API_TYPE_CREATEE_INNER_AUDIO_CONTEXT } from '@dcloudio/uni-api'

//#region types
type InnerAudioContextEvent =
  | 'onCanplay'
  | 'onPlay'
  | 'onPause'
  | 'onStop'
  | 'onEnded'
  | 'onTimeUpdate'
  | 'onError'
  | 'onWaiting'
  | 'onSeeking'
  | 'onSeeked'

type InnerAudioContextOff =
  | 'offCanplay'
  | 'offPlay'
  | 'offPause'
  | 'offStop'
  | 'offEnded'
  | 'offTimeUpdate'
  | 'offError'
  | 'offWaiting'
  | 'offSeeking'
  | 'offSeeked'

type Property =
  | 'src'
  | 'autoplay'
  | 'loop'
  | 'duration'
  | 'currentTime'
  | 'paused'
  | 'volume'

type InnerAudioProperty = keyof Pick<HTMLMediaElement, Property>

type VoidFunction = (callback: (result: any) => void) => void
//#endregion

/**
 * 可以批量设置的监听事件
 */
const innerAudioContextEventNames: InnerAudioContextEvent[] = [
  'onCanplay',
  'onPlay',
  'onPause',
  'onStop',
  'onEnded',
  'onTimeUpdate',
  'onError',
  'onWaiting',
  'onSeeking',
  'onSeeked',
]

const innerAudioContextOffEventNames: InnerAudioContextOff[] = [
  'offCanplay',
  'offPlay',
  'offPause',
  'offStop',
  'offEnded',
  'offTimeUpdate',
  'offError',
  'offWaiting',
  'offSeeking',
  'offSeeked',
]

// 和audio对象同名同效果的属性
const propertys: InnerAudioProperty[] = [
  'src',
  'autoplay',
  'loop',
  'duration',
  'currentTime',
  'paused',
  'volume',
]

/**
 * 音频上下文对象
 */
class InnerAudioContext implements UniApp.InnerAudioContext {
  /**
   * 当前音频的长度（单位：s），只有在当前有合法的 src 时返回
   */
  duration!: number
  /**
   * 当前音频的播放位置（单位：s），只有在当前有合法的 src 时返回
   */
  currentTime!: number
  /**
   * 当前是是否暂停或停止状态，true 表示暂停或停止，false 表示正在播放
   */
  paused!: boolean
  /**
   * 音频的数据链接，用于直接播放。
   */
  src!: string
  /**
   * 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲
   */
  buffered!: number
  /**
   * 是否自动开始播放，默认 false
   */
  autoplay!: boolean
  /**
   * 是否循环播放，默认 false
   */
  loop!: boolean
  /**
   * 是否遵循系统静音开关，当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音，默认值 true
   */
  obeyMuteSwitch!: boolean
  /**
   * 音量。范围 0~1。
   */
  volume!: number
  /**
   * 原始音频对象
   */
  _audio: HTMLAudioElement
  /**
   * 是否暂停中
   */
  _stoping: boolean
  /**
   * 开始时间
   */
  startTime: number
  /**
   * 事件监听
   */
  _events: Partial<Record<InnerAudioContextEvent, Array<Function>>>
  /**
   * 音频地址
   */
  _src: string = ''
  /**
   * 音频上下文初始化
   */
  constructor() {
    var audio = (this._audio = new Audio())
    this._stoping = false
    propertys.forEach((property) => {
      Object.defineProperty(this, property, {
        set:
          property === 'src'
            ? (src) => {
                audio.src = getRealPath(src)
                this._src = src
                return src
              }
            : (val) => {
                // audio[property] = val
                audio.setAttribute(property, val)
                return val
              },
        get:
          property === 'src'
            ? () => {
                return this._src
              }
            : () => {
                return audio[property]
              },
      })
    })
    this.startTime = 0
    Object.defineProperty(this, 'obeyMuteSwitch', {
      set: () => false,
      get: () => false,
    })
    Object.defineProperty(this, 'buffered', {
      set: () => false,
      get() {
        var buffered = audio.buffered
        if (buffered.length) {
          return buffered.end(buffered.length - 1)
        } else {
          return 0
        }
      },
    })
    // 初始化事件监听列表
    this._events = {}
    innerAudioContextEventNames.forEach((eventName) => {
      this._events[eventName] = []
    })
    audio.addEventListener('loadedmetadata', () => {
      var startTime = Number(this.startTime) || 0
      if (startTime > 0) {
        audio.currentTime = startTime
      }
    })
    // 和audio对象同名同效果的事件
    var eventNames = [
      'canplay',
      'play',
      'pause',
      'ended',
      'timeUpdate',
      'error',
      'waiting',
      'seeking',
      'seeked',
    ]
    var stopEventNames = ['canplay', 'pause', 'seeking', 'seeked', 'timeUpdate']
    eventNames.forEach((eventName) => {
      audio.addEventListener(
        eventName.toLowerCase(),
        () => {
          // stop事件过滤
          if (this._stoping && stopEventNames.indexOf(eventName) >= 0) {
            return
          }
          const EventName = `on${eventName
            .substr(0, 1)
            .toUpperCase()}${eventName.substr(1)}` as InnerAudioContextEvent
          this._events[EventName]!.forEach((callback) => {
            callback()
          })
        },
        false
      )
    })
  }

  /**
   * 播放
   */
  play() {
    this._stoping = false
    this._audio.play()
  }

  /**
   * 暂停
   */
  pause() {
    this._audio.pause()
  }

  /**
   * 停止
   */
  stop() {
    this._stoping = true
    this._audio.pause()
    this._audio.currentTime = 0
    this._events.onStop!.forEach((callback) => {
      callback()
    })
  }

  /**
   * 跳转到
   * @param {number} position
   */
  seek(position: number) {
    this._stoping = false
    position = Number(position)
    if (typeof position === 'number' && !isNaN(position)) {
      this._audio.currentTime = position
    }
  }

  /**
   * 销毁
   */
  destroy() {
    this.stop()
  }

  'onCanplay': VoidFunction
  'onPlay': VoidFunction
  'onPause': VoidFunction
  'onStop': VoidFunction
  'onEnded': VoidFunction
  'onTimeUpdate': VoidFunction
  'onError': VoidFunction
  'onWaiting': VoidFunction
  'onSeeking': VoidFunction
  'onSeeked': VoidFunction

  'offCanplay': VoidFunction
  'offPlay': VoidFunction
  'offPause': VoidFunction
  'offStop': VoidFunction
  'offEnded': VoidFunction
  'offTimeUpdate': VoidFunction
  'offError': VoidFunction
  'offWaiting': VoidFunction
  'offSeeking': VoidFunction
  'offSeeked': VoidFunction
}

// 批量设置音频上下文事件监听方法
innerAudioContextEventNames.forEach((eventName) => {
  InnerAudioContext.prototype[eventName] = function (callback: Function) {
    if (typeof callback === 'function') {
      this._events[eventName]!.push(callback)
    }
  }
})

// 批量设置音频上下文事件取消监听方法
innerAudioContextOffEventNames.forEach((eventName) => {
  InnerAudioContext.prototype[eventName] = function (callback: Function) {
    var handle = this._events[
      eventName.replace('off', 'on') as InnerAudioContextEvent
    ]
    var index = handle!.indexOf(callback)
    if (index >= 0) {
      handle!.splice(index, 1)
    }
  }
})

/**
 * 创建音频上下文
 */
export const createInnerAudioContext = defineSyncApi<API_TYPE_CREATEE_INNER_AUDIO_CONTEXT>(
  API_CREATE_INNER_AUDIO_CONTEXT,
  () => {
    return new InnerAudioContext()
  }
)
