const moment = require('moment')

export function getDayInteger() {
  const day = moment().format('d')
  return parseInt(day)
}
