import axios from 'axios'
import store from './store'
import baseURL from '@/utils/baseURL'

function generateToken() {
  if (store.state.sessionToken && store.state.tokenAttendance) {
    return store.state.tokenAttendance.access_token
  } else if (store.state.webview.webviewMode) {
    return store.state.webview.token.access_token
  } else {
    if (store.state.user.token) {
      return store.state.user.token.access_token
    } else {
      return null
    }
  }
}

export default function generateErrorMessage(error) {
  let errorCode = 0
  let statusCode = 500
  let message = 'Connection timeout, please check your internet connection'
  let string = 'Connection timeout, please check your internet connection'
  
  if (error.response) {
    if (error.response.data.type !== 'application/json') {
      if (error.response.status !== 422) {
        const errorError = error.response.data.error.error
        let errArr = errorError
        string = errArr
        if (typeof errorError !== 'string') {
          string = ''
          errArr = Object.values(errorError)
          for (let index = 0; index < errArr.length; index++) {
            string += '- ' + errArr[index]
          }
        }

        if (error.response) {
          statusCode = error.response.data.error.status_code
          message = error.response.data.error.message
          errorCode = error.response.data.error.error_code
        } else {
          string = message
        }
      } else {
        const errorError = error.response.data.errors
        let errArr = errorError
        
        console.log('htpc', error.response.data)
        string = errArr
        if (typeof errorError !== 'string') {
          string = []
          errArr = Object.values(errorError)
          for (let index = 0; index < errArr.length; index++) {
            string += '- ' + errArr[index]
            // string.push(errArr[index])
          }
        }

        if (error.response) {
          statusCode = error.response.status
          message = error.response.data.errors.message
          errorCode = error.response.data.status
        } else {
          string = message
        }
      }
      console.log('err', error.response)
    }
  }

  return {
    ...error,
    statusCode,
    message,
    string,
    errorCode
  }
}

axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  const errorXHR = generateErrorMessage(error)
  return Promise.reject(errorXHR)
});

export const BASE_URL = baseURL

/**
 * FOR HTTP with only main URL
 */
export const HTTP = axios.create({
  baseURL
})

HTTP.interceptors.response.use(response => {
  return response
}, error => {
  const errorXHR = generateErrorMessage(error)
  return Promise.reject(errorXHR)
})

/**
 * FOR HTTP with only main URL + '/api
 */
export const API = axios.create({
  baseURL: baseURL + 'api'
})

API.interceptors.request.use(config => {
  if (generateToken()) {
    config.headers['Authorization'] = 'Bearer ' + generateToken()
  }
  return config
}, error => {
  return Promise.reject(error)
})

API.interceptors.response.use(response => {
  return response
}, error => {
  if (error.response && error.response.status === 401) {
    store.dispatch('logout')
    return
  } else {
    const errorXHR = generateErrorMessage(error)
    return Promise.reject(errorXHR)
  }
})

/**
 * REQUEST WITH LOGGEDIN REQUIREMENTS
 */
const service = axios.create()

service.interceptors.request.use(config => {
  let fallbackLocale = store.state.userStores.langId
  if (!fallbackLocale) {
    fallbackLocale = 'id'
  }
  let fallbackUrlId = ''
  if (store.getters.webviewMode) {
    fallbackUrlId = store.getters.webviewSelectedStore.url_id
  } else {
    fallbackUrlId = store.getters.selectedStore.url_id
  }
  let fallbackVersion = 'v1'
  if (config.version) {
    fallbackVersion = config.version
  }
  config.baseURL = `${baseURL}api/${fallbackUrlId}/admin/${fallbackVersion}/${fallbackLocale}`
  config.headers['Authorization'] = 'Bearer ' + generateToken()
  return config
}, error => {
  return Promise.reject(error)
})

service.interceptors.response.use(response => {
  return response
}, error => {
  // to handle cancelable request
  if (axios.isCancel(error)){
    return Promise.reject({isCancelled: true})
  }
  const errorXHR = generateErrorMessage(error)
  return Promise.reject(errorXHR)
})


/**
 * DEPRECATED function for dynamic URL regeneration
 */
function baseApi(domainId, locale = store.state.userStores.langId, endPoint) {
  let fallbackLocale = locale
  if (!fallbackLocale) {
    fallbackLocale = 'id'
  }
  return BASE_URL + 'api/' + domainId + '/admin/v1/' + fallbackLocale + '/' + endPoint
}

export { baseApi, service }
