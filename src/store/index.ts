import { action, computed, makeObservable, observable } from 'mobx'
import Konva from 'konva'
import downloadURL from '@/utils/downloadURL'

export interface Origin {
  src: string,
  scale: number
}

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

const defaultOrigin: Origin = { src: '', scale: 1 }

const defaultCrop: CropProps = { x: 0, y: 0, width: 0, height: 0 }

export const defaultAdjust: AdjustProps = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hue: 0,
  blurRadius: 0,
  noise: 0,
}

class Store {
  origin = { src: '', scale: 1 }
  imageData = ''
  mode = ''
  history: Step[] = [{
    crop: { ...defaultCrop },
    adjust: { ...defaultAdjust },
  }]
  currentStepIndex = -1
  
  constructor() {
    makeObservable(this, {
      imageData: observable,
      mode: observable,
      history: observable,
      currentStepIndex: observable,
      
      currentStep: computed,
      
      init: action,
      handleInit: action,
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
  
  init(src: string) {
    const image = new Image()
    image.src = src
    image.onload = () => {
      this.handleInit(image)
    }
  }
  
  handleInit(image: HTMLImageElement) {
    const { src, width, height } = image
    const scale = 540 / height
    this.origin = { src, scale }
    
    const canvas = document.createElement('canvas')
    canvas.width = width * scale
    canvas.height = 540
    const ctx = canvas.getContext('2d')
    ctx!.drawImage(image, 0, 0, width * scale, 540)
    store.imageData = canvas.toDataURL()
    
    this.history = [{
      crop: { x: 0, y: 0, width: width * scale, height: 540 },
      adjust: { ...defaultAdjust },
    }]
    this.currentStepIndex = 0
  }
  
  /** 放弃编辑 */
  discard() {
    this.origin = { ...defaultOrigin }
    this.imageData = ''
    this.mode = ''
    this.history = [{
      crop: { x: 0, y: 0, width: 0, height: 0 },
      adjust: { brightness: 0, contrast: 0, saturation: 0, hue: 0, blurRadius: 0, noise: 0 },
    }]
    this.currentStepIndex = -1
  }
  
  download() {
    return new Promise((resolve) => {
      if (this.currentStep === null)
        return Promise.reject()
      
      const { origin, currentStep } = this
      
      const { scale } = origin
      
      const container = document.createElement('div')
      container.id = 'temp-container'
      container.style.display = 'none'
      document.body.appendChild(container)
      
      const stage = new Konva.Stage({
        container: 'temp-container',
        width: currentStep.crop.width / scale,
        height: currentStep.crop.height / scale,
      })
      
      const layer = new Konva.Layer()
      
      const img = new Image()
      img.src = this.origin.src
      
      img.onload = () => {
        const image = new Konva.Image({
          image: img,
          width: currentStep.crop.width / scale, height: currentStep.crop.height / scale,
          crop: {
            x: currentStep.crop.x / scale,
            y: currentStep.crop.y / scale,
            width: currentStep.crop.width / scale,
            height: currentStep.crop.height / scale,
          },
          filters: [
            Konva.Filters.Brighten,
            Konva.Filters.Contrast,
            Konva.Filters.HSV,
            Konva.Filters.Blur,
            Konva.Filters.Noise,
          ],
          ...this.currentStep!.adjust,
        })
        image.cache()
        layer.add(image)
        stage.add(layer)
        
        stage.toBlob().then((blob) => {
          const url = URL.createObjectURL(blob as Blob)
          downloadURL(url)
          URL.revokeObjectURL(url)
          document.body.removeChild(container)
          resolve(null)
        })
      }
    })
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
