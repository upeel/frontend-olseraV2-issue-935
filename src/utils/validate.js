export function validateUsername(str) {
  if (str && str.length > 4) {
    return true
  }
  return false
}

export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

export function isvalidateInputPercen(str) {
  if (str > 100) {
    return false
  }
  return true
}

export function stringIsNumberActually(str) {
  if (str) {
    const toString = str.toString()
    const arr = toString.split('')
    let valid = true
    arr.map(item => {
      // console.log(parseInt(item))
      if (!parseInt(item)) valid = false
      return
    })
    // console.log(valid)
    return valid
  }
}

export function phoneNumber(inputtxt) {
  // console.log('inputtxt', inputtxt)
  const plusLength = (inputtxt.match(/\+/g) || []).length
  var phoneno = /^[\d +]+$/
  if (inputtxt.match(phoneno) && plusLength === 1) {
    return true
  } else {
    return false
  }
}

export function phoneNumberE164(phoneNumber) {
  const regEx = /^\+[1-9]\d{10,14}$/
  return regEx.test(phoneNumber)
}
