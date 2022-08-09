const env = process.env.ENV_CONFIG
let baseURL = 'https://www.olsera.io/'
// let baseURL = 'https://api-dash.olsera.co.id/'

if (env === 'dev' || env === 'sit') {
  /***
   * change this to https://api-dash.olsera.co.id/ if you want to dev with production endpoint
   * dont forget to keep with https://externalapi.indociti.com/ before you commit/push
   * test stuck npm build
   */
  baseURL = 'https://api.backoffice.olsera.indociti.com/'
  // baseURL = 'https://externalapi.indociti.com/'
  // baseURL = 'https://api-dash.olsera.co.id/'
  // baseURL = 'https://www.olsera.io/'
} else if (env === 'dash') {
  baseURL = 'https://api-dash.olsera.co.id/'
}

export default baseURL
