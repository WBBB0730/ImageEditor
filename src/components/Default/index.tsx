import styles from './index.module.scss'
import { Button, Divider, Popconfirm, Popover } from 'antd'
import { AdjustIcon, CropIcon, DiscardIcon, DownloadIcon, RedoIcon, SmileIcon, UndoIcon } from '@/assets/icons'
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons'
import store from '@/store'
import { Layer, Stage } from 'react-konva'
import { observer } from 'mobx-react'
import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import downloadURL from '@/utils/downloadURL'
import Konva from 'konva'
import useImage from 'use-image'
import FilterImage from '@/components/FilterImage'

const SCALE_STEP = 0.1
const MAX_SCALE = 4
const MIN_SCALE = 0.1

const Header = observer(({ scale, handleZoomIn, handleZoomOut, handleDownload }: {
  scale: number,
  handleZoomIn: () => void,
  handleZoomOut: () => void,
  handleDownload: () => void
}) => {
  return (
    <div className={ styles.header }>
      <Popover content={ <div className={ styles.desc }>撤销</div> }>
        <Button
          className={ styles.button + (store.currentStepIndex < 1 ? ' ' + styles.disabled : '') }
          type="text"
          disabled={ store.currentStepIndex < 1 }
          onClick={ () => { store.undo() } }>
          <UndoIcon className={ styles.icon } />
        </Button>
      </Popover>
      <Popover content={ <div className={ styles.desc }>恢复</div> }>
        <Button
          className={ styles.button + (store.currentStepIndex < 0 || store.currentStepIndex > store.history.length - 2 ? ' ' + styles.disabled : '') }
          type="text"
          disabled={ store.currentStepIndex < 0 || store.currentStepIndex > store.history.length - 2 }
          onClick={ () => { store.redo() } }>
          <RedoIcon className={ styles.icon } />
        </Button>
      </Popover>
      
      <Divider className={ styles.divider } type="vertical" />
      
      <Popover content={ <div className={ styles.desc }>裁切旋转</div> }>
        <Button className={ styles.button } type="text">
          <CropIcon className={ styles.icon } />
        </Button>
      </Popover>
      <Popover content={ <div className={ styles.desc }>调整</div> }>
        <Button className={ styles.button } type="text" onClick={ handleAdjust }>
          <AdjustIcon className={ styles.icon } />
        </Button>
      </Popover>
      <Popover content={ <div className={ styles.desc }>贴纸</div> }>
        <Button className={ styles.button } type="text">
          <SmileIcon className={ styles.icon } />
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
          title="放弃编辑"
          description="确定要放弃对图片的编辑吗？"
          onConfirm={ handleDiscard }
          okText="确定"
          cancelText="取消"
        >
          <Button className={ styles.button } type="text">
            <DiscardIcon className={ styles.icon } />
          </Button>
        </Popconfirm>
      </Popover>
      <Popover content={ <div className={ styles.desc }>保存</div> }>
        <Button className={ styles.button } type="text" onClick={ handleDownload }>
          <DownloadIcon className={ styles.icon } />
        </Button>
      </Popover>
    </div>
  )
})

const Content = observer(({ contentRef, stageRef, scale, scrollToCenter }: {
  contentRef: RefObject<any>,
  stageRef: RefObject<any>,
  scale: number,
  scrollToCenter: () => void
}) => {
  const [image] = useImage(store.imageSrc)
  
  useEffect(() => {
    if (!image || store.currentStep !== null)
      return
    const { width, height } = image
    store.init(width, height)
    setTimeout(() => {
      scrollToCenter()
    }, 0)
  }, [image, scrollToCenter])
  
  if (store.currentStep === null)
    return <div className={ styles.content } />
  
  const { crop, adjust } = store.currentStep
  const { x, y, width, height } = crop
  
  return (
    <div ref={ contentRef } className={ styles.content }>
      <div className={ styles['stage-area'] }
           style={ { width: width * scale, height: height * scale } }>
        <Stage ref={ stageRef } className={ styles.stage }
               width={ width } height={ height }
               style={ { transform: `scale(${ scale }) translate(-50%, -50%)` } }>
          <Layer>
            <FilterImage
              image={ image }
              crop={ { x, y, width, height } }
              adjust={ adjust } />
          </Layer>
        </Stage>
      </div>
    </div>
  )
})

export default function Default() {
  const contentRef: RefObject<HTMLDivElement> = useRef(null)
  const stageRef: RefObject<Konva.Stage> = useRef(null)
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
  
  /** 处理键盘事件 */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!event.ctrlKey)
      return
    switch (event.code) {
      // ctrl + '='
      case 'Equal':
        handleZoomIn()
        event.preventDefault()
        return
      // ctrl + '-'
      case 'Minus':
        handleZoomOut()
        event.preventDefault()
        return
      // ctrl + Z || ctrl + shift + Z
      case 'KeyZ':
        event.shiftKey ? store.redo() : store.undo()
        return
      // ctrl + Y
      case 'KeyY':
        store.redo()
        return
      // ctrl + S
      case 'KeyS':
        handleDownload()
        event.preventDefault()
        return
    }
  }, [handleZoomIn, handleZoomOut])
  
  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleWheel, handleKeyDown])
  
  /** 保存 */
  const handleDownload = () => {
    if (stageRef.current === null)
      return
    const url = stageRef.current.toDataURL()
    const now = new Date()
    const filename = now.getFullYear() +
      ('0' + (now.getMonth() + 1)).slice(-2) +
      ('0' + now.getDate()).slice(-2) + '_' +
      ('0' + now.getHours()).slice(-2) +
      ('0' + now.getMinutes()).slice(-2) +
      ('0' + now.getSeconds()).slice(-2) + '_' +
      ('000' + now.getMilliseconds()).slice(-4) +
      '.png'
    downloadURL(url, filename)
  }
  
  return (
    <div className={ styles.page }>
      <Header scale={ scale }
              handleZoomIn={ handleZoomIn } handleZoomOut={ handleZoomOut } handleDownload={ handleDownload } />
      <Content contentRef={ contentRef } stageRef={ stageRef } scale={ scale }
               scrollToCenter={ scrollToCenter } />
    </div>
  )
}

/** 调整 */
function handleAdjust() {
  store.setMode('adjust')
}

/** 放弃 */
function handleDiscard() {
  store.discard()
}
