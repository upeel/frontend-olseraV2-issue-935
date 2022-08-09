import axios from 'axios'
let baseURL = 'https://www.googleapis.com/webfonts/v1/'

const webfonts = axios.create({
  baseURL: baseURL,
  timeout: 3000,
  params: {
    key: 'AIzaSyBkm3L2NpTjdJCq6yRYWIKhE-wkRpjwAZQ',
    sort: 'popularity'
  }
})

export default webfonts