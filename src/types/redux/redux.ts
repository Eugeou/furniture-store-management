import { AppDispatch, RootState } from '@/redux/store'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
export type ActionRedux = {
  type: string
  payload: unknown
}

export type NotifyScreen = { open: boolean; message: string; type: string }

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()
