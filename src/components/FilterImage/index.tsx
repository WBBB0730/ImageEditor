import { AdjustProps, CropProps } from '@/store'
import { memo, RefObject, useEffect, useRef } from 'react'
import Konva from 'konva'
import { Image } from 'react-konva'

const FilterImage = memo(({ image, crop, adjust }: {
  image: CanvasImageSource | undefined,
  crop: CropProps,
  adjust: AdjustProps
}) => {
  const imageRef: RefObject<Konva.Image> = useRef(null)
  const { x, y, width, height } = crop
  const { brightness, contrast, saturation, hue, blurRadius, noise } = adjust
  
  useEffect(() => {
    if (!image || imageRef.current === null)
      return
    imageRef.current.cache()
  }, [image])
  
  return (
    <Image
      ref={ imageRef }
      image={ image }
      width={ width } height={ height }
      crop={ {
        x: x, y: y,
        width: width, height: height,
      } }
      filters={ [
        Konva.Filters.Brighten,
        Konva.Filters.Contrast,
        Konva.Filters.HSV,
        Konva.Filters.Blur,
        Konva.Filters.Noise,
      ] }
      brightness={ brightness }
      contrast={ contrast }
      saturation={ saturation }
      hue={ hue }
      blurRadius={ blurRadius }
      noise={ noise } />
  )
})
FilterImage.displayName = 'FilterImage'
export default FilterImage
