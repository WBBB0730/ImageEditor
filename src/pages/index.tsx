import Head from 'next/head'
import { ConfigProvider } from 'antd'
import SelectImage from '@/components/SelectImage'
import store from '@/store'
import { observer } from 'mobx-react'
import Default from '@/components/Default'
import Adjust from '@/components/Adjust'

const Page = observer(() => {
  if (!store.imageSrc)
    return <SelectImage />
  switch (store.mode) {
    case 'adjust':
      return <Adjust />
    default:
      return <Default />
  }
})

export default function App() {
  return (
    <ConfigProvider theme={ { token: { colorPrimary: '#fa8c16' } } }>
      <Head>
        <title>WBBB&apos;s Image Editor</title>
      </Head>
      <Page />
    </ConfigProvider>
  )
}
