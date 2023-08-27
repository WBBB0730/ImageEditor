import styles from './index.module.scss'
import { Button, Divider, Popconfirm, Popover, Slider } from 'antd'
import {
  ApplyIcon,
  BlurIcon,
  BrightnessIcon,
  ContrastIcon,
  DiscardIcon,
  HueIcon,
  NoiseIcon,
  ResetIcon,
  SaturationIcon,
} from '@/assets/icons'
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons'
import store, { AdjustProps, defaultAdjust } from '@/store'
import { Layer, Stage } from 'react-konva'
import { observer } from 'mobx-react'
import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import Konva from 'konva'
import useImage from 'use-image'
import { isEqual } from 'lodash'
import FilterImage from '@/components/FilterImage'

const SCALE_STEP = 0.1
const MAX_SCALE = 4
const MIN_SCALE = 0.1

const Header = observer(({ scale, adjust, handleZoomIn, handleZoomOut, handleReset, handleSet, handleApply }: {
  scale: number,
  adjust: AdjustProps,
  handleZoomIn: () => void,
  handleZoomOut: () => void,
  handleReset: () => void,
  handleSet: (attr: keyof AdjustProps, value: number) => void,
  handleApply: () => void,
}) => {
  const [tempAdjust, setTempAdjust] = useState({ ...adjust })
  useEffect(() => {
    setTempAdjust({ ...adjust })
  }, [adjust])
  
  return (
    <div className={ styles.header }>
      <Popover content={ <div className={ styles.desc }>重置</div> }>
        <Popconfirm
          title="重置"
          description="确定要重置所有调整吗？"
          onConfirm={ handleReset }
          okText="确定"
          cancelText="取消"
        >
          <Button className={ styles.button } type="text">
            <ResetIcon className={ styles.icon } />
          </Button>
        </Popconfirm>
      </Popover>
      
      <Divider className={ styles.divider } type="vertical" />
      
      <Popover title={ (
        <div className={ styles.title }>
          <span>亮度</span>
          <Button className={ styles.button } type="text" size="small"
                  onClick={ () => handleSet('brightness', 0) }>重置</Button>
        </div>
      ) } content={ (
        <Slider
          className={ styles.slider } marks={ { 0: ' ' } } included={ false }
          value={ tempAdjust.brightness * 100 } min={ -100 } max={ 100 } step={ 1 }
          onChange={ (value) => { setTempAdjust({ ...tempAdjust, 'brightness': value / 100 }) } }
          onAfterChange={ (value) => { handleSet('brightness', value / 100) } } />
      ) }>
        <Button className={ styles.button } type="text">
          <BrightnessIcon className={ styles.icon } />
        </Button>
      </Popover>
      <Popover title={ (
        <div className={ styles.title }>
          <span>对比度</span>
          <Button className={ styles.button } type="text" size="small"
                  onClick={ () => handleSet('contrast', 0) }>重置</Button>
        </div>
      ) } content={ (
        <Slider
          className={ styles.slider } marks={ { 0: ' ' } } included={ false }
          value={ tempAdjust.contrast } min={ -100 } max={ 100 } step={ 1 }
          onChange={ (value) => { setTempAdjust({ ...tempAdjust, 'contrast': value }) } }
          onAfterChange={ (value) => { handleSet('contrast', value) } } />
      ) }>
        <Button className={ styles.button } type="text">
          <ContrastIcon className={ styles.icon } />
        </Button>
      </Popover>
      <Popover title={ (
        <div className={ styles.title }>
          <span>饱和度</span>
          <Button className={ styles.button } type="text" size="small"
                  onClick={ () => handleSet('saturation', 0) }>重置</Button>
        </div>
      ) } content={ (
        <Slider
          className={ styles.slider } marks={ { 0: ' ' } } included={ false }
          value={ tempAdjust.saturation * 40 } min={ -100 } max={ 100 } step={ 1 }
          onChange={ (value) => { setTempAdjust({ ...tempAdjust, 'saturation': value / 40 }) } }
          onAfterChange={ (value) => { handleSet('saturation', value / 40) } } />
      ) }>
        <Button className={ styles.button } type="text">
          <SaturationIcon className={ styles.icon } />
        </Button>
      </Popover>
      <Popover title={ (
        <div className={ styles.title }>
          <span>色相</span>
          <Button className={ styles.button } type="text" size="small"
                  onClick={ () => handleSet('hue', 0) }>重置</Button>
        </div>
      ) } content={ (
        <Slider
          className={ styles.slider } marks={ { 0: ' ' } } included={ false }
          value={ tempAdjust.hue } min={ -180 } max={ 180 } step={ 1 }
          onChange={ (value) => { setTempAdjust({ ...tempAdjust, 'hue': value }) } }
          onAfterChange={ (value) => { handleSet('hue', value) } } />
      ) }>
        <Button className={ styles.button } type="text">
          <HueIcon className={ styles.icon } />
        </Button>
      </Popover>
      <Popover title={ (
        <div className={ styles.title }>
          <span>模糊</span>
          <Button className={ styles.button } type="text" size="small"
                  onClick={ () => handleSet('blurRadius', 0) }>重置</Button>
        </div>
      ) } content={ (
        <Slider
          className={ styles.slider } marks={ { 0: ' ' } } included={ false }
          value={ tempAdjust.blurRadius * 2 } min={ 0 } max={ 100 } step={ 1 }
          onChange={ (value) => { setTempAdjust({ ...tempAdjust, 'blurRadius': value / 2 }) } }
          onAfterChange={ (value) => { handleSet('blurRadius', value / 2) } } />
      ) }>
        <Button className={ styles.button } type="text">
          <BlurIcon className={ styles.icon } />
        </Button>
      </Popover>
      <Popover title={ (
        <div className={ styles.title }>
          <span>颗粒</span>
          <Button className={ styles.button } type="text" size="small"
                  onClick={ () => handleSet('noise', 0) }>重置</Button>
        </div>
      ) } content={ (
        <Slider
          className={ styles.slider } marks={ { 0: ' ' } } included={ false }
          value={ tempAdjust.noise * 100 } min={ 0 } max={ 100 } step={ 1 }
          onChange={ (value) => { setTempAdjust({ ...tempAdjust, 'noise': value / 100 }) } }
          onAfterChange={ (value) => { handleSet('noise', value / 100) } } />
      ) }>
        <Button className={ styles.button } type="text">
          <NoiseIcon className={ styles.icon } />
        </Button>
      </Popover>
      <Popover content={ <div className={ styles.desc }>放大</div> }>
        <Button className={ styles.button + (scale * (1 + SCALE_STEP) > MAX_SCALE ? ' ' + styles.disabled : '') }
                type="text"
                disabled={ scale * (1 + SCALE_STEP) > MAX_SCALE } onClick={ handleZoomIn }>
          <ZoomInOutlined className={ styles.icon } />
        </Button>
      </Popover>
      <Popover content={ <div className={ styles.desc }>缩小</div> }>
        <Button className={ styles.button + (scale * (1 - SCALE_STEP) < MIN_SCALE ? ' ' + styles.disabled : '') }
                type="text"
                disabled={ scale * (1 - SCALE_STEP) < MIN_SCALE }
                onClick={ handleZoomOut }>
          <ZoomOutOutlined className={ styles.icon } />
        </Button>
      </Popover>
      
      <Divider className={ styles.divider } type="vertical" />
      
      <Popover content={ <div className={ styles.desc }>放弃</div> }>
        <Popconfirm
          title="放弃"
          description="确定要放弃此次调整吗？"
          onConfirm={ handleDiscard }
          okText="确定"
          cancelText="取消"
        >
          <Button className={ styles.button } type="text">
            <DiscardIcon className={ styles.icon } />
          </Button>
        </Popconfirm>
      </Popover>
      <Popover content={ <div className={ styles.desc }>应用</div> }>
        <Button className={ styles.button } type="text" onClick={ handleApply }>
          <ApplyIcon className={ styles.icon } />
        </Button>
      </Popover>
    </div>
  )
})

const Content = observer(({ contentRef, stageRef, scale, adjust }: {
  contentRef: RefObject<any>,
  stageRef: RefObject<any>,
  scale: number,
  adjust: AdjustProps,
}) => {
  if (store.currentStep === null)
    return <div className={ styles.content } />
  
  // const [image] = useState(new window.Image())
  // image.src = store.imageSrc
  const [image] = useImage(store.imageSrc)
  
  const { x, y, width, height } = store.currentStep.crop
  
  return (
    <div ref={ contentRef } className={ styles.content }>
      <div className={ styles['stage-area'] }
           style={ { width: width * scale, height: height * scale } }>
        <Stage ref={ stageRef } className={ styles.stage } width={ width } height={ height }
               style={ { transform: `scale(${ scale }) translate(-50%, -50%)` } }>
          <Layer>
            <FilterImage
              image={ image } x={ x } y={ y }
              adjust={ adjust } />
          </Layer>
        </Stage>
      </div>
    </div>
  )
})

export default function Adjust() {
  const contentRef: RefObject<HTMLDivElement> = useRef(null)
  const stageRef: RefObject<Konva.Stage> = useRef(null)
  
  /** 缩放倍数 */
  const [scale, setScale] = useState(1)
  
  /** 放大 */
  const handleZoomIn = useCallback(() => {
    if (scale * (1 + SCALE_STEP) > MAX_SCALE)
      return
    setScale(scale * (1 + SCALE_STEP))
  }, [scale])
  
  /** 缩小 */
  const handleZoomOut = useCallback(() => {
    if (scale * (1 - SCALE_STEP) < MIN_SCALE)
      return
    setScale(scale * (1 - SCALE_STEP))
  }, [scale])
  
  /** 滚动到中央 */
  const scrollToCenter = () => {
    if (contentRef.current === null)
      return
    const div = contentRef.current
    div.scrollLeft = (div.scrollWidth - div.clientWidth) / 2
    div.scrollTop = (div.scrollHeight - div.clientHeight) / 2
  }
  
  // 页面加载完成时滚动到中央
  useEffect(() => {
    scrollToCenter()
  }, [])
  
  // 缩放时滚动到中央
  useEffect(() => {
    scrollToCenter()
  }, [scale])
  
  /** 处理滚轮事件 */
  const handleWheel = useCallback((event: WheelEvent) => {
    if (!event.ctrlKey)
      return
    if (event.deltaY < 0)
      handleZoomIn()
    else if (event.deltaY > 0)
      handleZoomOut()
    event.preventDefault()
  }, [handleZoomIn, handleZoomOut])
  
  // 监听滚轮事件
  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [handleWheel])
  
  /** 调整参数 */
  const [adjust, setAdjust] = useState<AdjustProps>({ ...store.currentStep!.adjust })
  
  /** 重置 */
  const handleReset = useCallback(() => {
    setAdjust({ ...defaultAdjust })
  }, [])
  
  /** 设置 */
  const handleSet = useCallback((attr: keyof AdjustProps, value: number) => {
    const temp = { ...adjust }
    temp[attr] = value
    setAdjust(temp)
  }, [adjust])
  
  /** 应用 */
  const handleApply = useCallback(() => {
    if (store.currentStep === null)
      return
    if (isEqual(adjust, store.currentStep.adjust)) {
      store.setMode('')
      return
    }
    store.applyAdjust(adjust)
    store.setMode('')
  }, [adjust])
  
  return (
    <div className={ styles.page }>
      <Header scale={ scale } adjust={ adjust }
              handleZoomIn={ handleZoomIn } handleZoomOut={ handleZoomOut }
              handleReset={ handleReset } handleSet={ handleSet } handleApply={ handleApply } />
      <Content contentRef={ contentRef } stageRef={ stageRef } scale={ scale } adjust={ adjust } />
    </div>
  )
}

/** 放弃 */
function handleDiscard() {
  store.setMode('')
}
