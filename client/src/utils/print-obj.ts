// @ts-nocheck

function printKeys(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      printKeys(obj[key]) // Recursive call for nested objects
    } else {
      console.log(`${key}: ${obj[key]}`)
    }
  }
}

function printEachKey(keyName, obj) {
  if (typeof obj[keyName] === 'string') {
    console.log(keyName, obj[keyName])
  } else {
    printKeys(obj[keyName])
  }
}

export function printObj(objName, obj) {
  console.group(objName)
  for (const key in obj) {
    console.group(key)
    printEachKey(key, obj)
    console.groupEnd()
  }
  console.groupEnd()
}
