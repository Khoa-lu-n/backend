module.exports.success = (data) => {
  if(!data) throw new Error('Missing data.')
  return {
    success: true,
    data: data,
    code: 20
  }
}

module.exports.fail = (msg) => {
  return {
    success: false,
    reason: msg || 'Something went wrong.',
    code: 21
  }
}

module.exports.unauth = () => {
  return {
    success: false,
    reason: 'unauthorized.',
    code: 22
  }
}
