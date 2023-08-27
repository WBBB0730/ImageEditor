import { action, computed, makeObservable, observable } from 'mobx'

export interface CropProps {
  x: number,
  y: number,
  width: number,
  height: number,
}

export interface AdjustProps {
  brightness: number,   // 亮度
  contrast: number,     // 对比度
  saturation: number,   // 饱和度
  hue: number,          // 色相
  blurRadius: number,   // 模糊
  noise: number,        // 颗粒
}

interface Step {
  crop: CropProps,
  adjust: AdjustProps,
}

const defaultCrop: CropProps = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
}

export const defaultAdjust: AdjustProps = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hue: 0,
  blurRadius: 0,
  noise: 0,
}

class Store {
  imageSrc = ''
  imageData = ''
  mode = ''
  history: Step[] = [{
    crop: { ...defaultCrop },
    adjust: { ...defaultAdjust },
  }]
  currentStepIndex = -1
  
  constructor() {
    makeObservable(this, {
      imageSrc: observable,
      imageData: observable,
      mode: observable,
      history: observable,
      currentStepIndex: observable,
      
      currentStep: computed,
      
      setImageSrc: action,
      init: action,
      discard: action,
      setMode: action,
      undo: action,
      redo: action,
      applyAdjust: action,
    })
  }
  
  get currentStep() {
    return this.currentStepIndex !== -1 && this.history.length ? this.history[this.currentStepIndex] : null
  }
  
  setImageSrc(imageSrc: string) {
    this.imageSrc = imageSrc
  }
  
  init(width: number, height: number) {
    this.history = [{
      crop: { x: 0, y: 0, width, height },
      adjust: { brightness: 0, contrast: 0, saturation: 0, hue: 0, blurRadius: 0, noise: 0 },
    }]
    this.currentStepIndex = 0
  }
  
  /** 重置为开始状态 */
  discard() {
    this.imageSrc = ''
    this.mode = ''
    this.history = [{
      crop: { x: 0, y: 0, width: 0, height: 0 },
      adjust: { brightness: 0, contrast: 0, saturation: 0, hue: 0, blurRadius: 0, noise: 0 },
    }]
    this.currentStepIndex = -1
  }
  
  /** 切换模式 */
  setMode(mode: '' | 'crop' | 'adjust') {
    this.mode = mode
  }
  
  undo() {
    if (this.currentStepIndex > 0)
      this.currentStepIndex--
  }
  
  redo() {
    if (this.currentStepIndex < this.history.length - 1)
      this.currentStepIndex++
  }
  
  applyAdjust(adjust: AdjustProps) {
    const step: Step = { ...this.currentStep!, adjust }
    this.history.length = ++this.currentStepIndex
    this.history.push(step)
  }
}

const store = new Store()
export default store
