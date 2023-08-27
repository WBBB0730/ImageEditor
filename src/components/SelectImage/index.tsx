import styles from './index.module.scss'
import { AdjustIcon, CropIcon, DiscardIcon, DownloadIcon, RedoIcon, SmileIcon, UndoIcon } from '@/assets/icons'
import { Button, Divider, Upload, UploadFile } from 'antd'
import { PictureOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons'
import { useCallback } from 'react'
import store from '@/store'

function Header() {
  return (
    <div className={ styles.header }>
      <Button className={ styles.button } type="text">
        <UndoIcon className={ styles.icon } />
      </Button>
      <Button className={ styles.button } type="text">
        <RedoIcon className={ styles.icon } />
      </Button>

      <Divider className={ styles.divider } type="vertical" />

      <Button className={ styles.button } type="text">
        <CropIcon className={ styles.icon } />
      </Button>
      <Button className={ styles.button } type="text">
        <AdjustIcon className={ styles.icon } />
      </Button>
      <Button className={ styles.button } type="text">
        <SmileIcon className={ styles.icon } />
      </Button>
      <Button className={ styles.button } type="text">
        <ZoomInOutlined className={ styles.icon } />
      </Button>
      <Button className={ styles.button } type="text">
        <ZoomOutOutlined className={ styles.icon } />
      </Button>

      <Divider className={ styles.divider } type="vertical" />

      <Button className={ styles.button } type="text">
        <DiscardIcon className={ styles.icon } />
      </Button>
      <Button className={ styles.button } type="text">
        <DownloadIcon className={ styles.icon } />
      </Button>
    </div>
  )
}

export default function SelectImage() {
  const handleChange = useCallback(({ file }: { file: UploadFile }) => {
    store.setImageSrc(URL.createObjectURL(file as any))
  }, [])

  return (
    <div className={ styles.page }>
      <Header />

      <div className={ styles.content }>
        <Upload
          className={ styles.upload }
          accept="image/*"
          maxCount={ 1 }
          showUploadList={ false }
          beforeUpload={ () => false }
          onChange={ handleChange }
        >
          <p><PictureOutlined className={ styles.icon } /></p>
          <p>点击或拖拽图片到此区域</p>
        </Upload>
      </div>
    </div>
  )
}
