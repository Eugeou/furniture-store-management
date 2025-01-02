import { getUser, selectAuth, setToken } from '@/redux/slices/auth.slice'
import { login} from '@/services/auth-service'
import { StoreLogin } from '@/types/entities/auth-entity'
import { useAppDispatch, useAppSelector } from '@/types/redux/redux'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLoading } from './useLoading'

export function useAuth() {
  const [auth, setAuth] = useState(null)
  const { token } = useAppSelector(selectAuth)
  //   const { user } = useAppSelector((state) => state.user)
  const { isLoading, startLoading, stopLoading } = useLoading()

  const dispatch = useAppDispatch()
  const navigate = useRouter().push

  // Simulate authentication check on mount
  useEffect(() => {
    const checkAuthentication = () => {
      // Perform your authentication check here
      // Example: Check if the user is logged in from a persisted token or session

      // Simulating asynchronous authentication check
      setTimeout(() => {
        // If the user is authenticated, set the user object
        const isAuthenticated = /* Your authentication check logic */ true
        if (isAuthenticated) {
          //   setUser({
          //     /* User data */
          //   });
        }

        // setIsLoading(false);
      }, 1000)
    }

    checkAuthentication()
  }, [])

  useEffect(() => {
    if (token.AccessToken) {
      dispatch(getUser())
    }
  }, [token?.AccessToken, dispatch])

  // Login function
  const onLogin = async <T>( paramLogin: StoreLogin, callbackSuccess?: (response?: T) => void) => {
    startLoading()
    try {
      const { email, password } = paramLogin

      const response = await login(
        { email,
        password}
      )
      console.log("Data: ", response.data)
      if (response.data.data?.AccessToken) {
        dispatch(setToken(response.data.data))
        localStorage.setItem('role', response.data.role)
        localStorage.setItem('userId', response.data.data.UserId)
      }

      toast.success('Đăng nhập thành công')
      console.log(token)
      callbackSuccess?.()
      //navigate('/report/daily-report')
    } catch (err: unknown) {
      console.log(err)
      //toast.error(err?.response?.data?.message || err?.message)
      toast.error('Đăng nhập thất bại!')
    } finally {
      stopLoading()
    }
  }

  // Logout function
  const logout = () => {
    // Perform your logout logic here
    // Example: Clear session, remove tokens, etc.

    return new Promise(() => {
      // Simulating asynchronous logout
      setTimeout(() => {
        setAuth(null)
        // resolve();
      }, 500)
    })
  }

  return {
    auth,
    isLoading,
    onLogin,
    logout
    // user
  }
}
