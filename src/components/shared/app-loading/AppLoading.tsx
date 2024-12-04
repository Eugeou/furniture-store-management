import { Spin, SpinProps } from 'antd'
import React from 'react'

type AppLoadingProps = {} & SpinProps

const AppLoading: React.FC<AppLoadingProps> = ({ ...props }) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-40 z-50'>
      {/* <div className='loader border-t-4 border-b-4 border-white rounded-full w-16 h-16 animate-spin'></div>
       */}
      <Spin {...props} size='large' />
    </div>
  )
}

export default AppLoading
