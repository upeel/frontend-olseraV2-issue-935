const env = process.env.ENV_CONFIG
let baseAppURL = 'https://www.olsera.io/'

if (env === 'dev' || env === 'sit') {
  baseAppURL = 'https://d1fjozuxvl1n9t.cloudfront.net/'
} else if (env === 'dash') {
  baseAppURL = 'https://dashboard.olsera.co.id/'
}

export default baseAppURL
