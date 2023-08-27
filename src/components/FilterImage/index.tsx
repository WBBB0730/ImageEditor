import { AdjustProps } from '@/store'
import { memo, RefObject, useEffect, useRef } from 'react'
import Konva from 'konva'
import { Image } from 'react-konva'

const FilterImage = memo(({ image, x, y, adjust }: {
  image: CanvasImageSource | undefined,
  x: number,
  y: number,
  adjust: AdjustProps
}) => {
  const imageRef: RefObject<Konva.Image> = useRef(null)
  const { brightness, contrast, saturation, hue, blurRadius, noise } = adjust
  
  useEffect(() => {
    // console.log('Image Changed')
    if (!image || imageRef.current === null)
      return
    imageRef.current.cache()
  }, [image])
  
  return (
    <Image
      ref={ imageRef }
      image={ image } x={ x } y={ y }
      filters={ [
        Konva.Filters.Brighten,
        Konva.Filters.Contrast,
        Konva.Filters.HSV,
        Konva.Filters.Blur,
        Konva.Filters.Noise]
      }
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
