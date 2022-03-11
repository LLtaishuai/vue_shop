function isObject (o) {
  return Object.prototype.toString.call(o) === '[object Array]' || Object.prototype.toString.call(o) === '[object Object]'
}
function deepclone (o, hash = new Map()) {
  if (!isObject(o)) {
    return o
  }
  if (hash.has(o)) {
    return hash.get(o)
  }
  const obj = Array.isArray(o) ? [] : {}
  hash.set(o, obj)
  for (const k in o) {
    if (isObject(o[k])) {
      obj[k] = deepclone(o[k], hash)
    } else {
      obj[k] = o[k]
    }
  }
  return obj
}
export default deepclone
