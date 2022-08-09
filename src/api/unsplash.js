import axios from 'axios'
let baseURL = 'https://api.unsplash.com/'
// let baseURL = ''

const service = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: 'Client-ID af6f1a1e62c5f3fa84f21587f498591d1856a8192753e80221d6fc95cb562921'
  }
})

export default service