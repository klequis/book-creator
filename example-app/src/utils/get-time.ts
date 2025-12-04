import { isServer } from 'solid-js/web'

export function getTime(name?: string, showIsServer: boolean = false): string {
  const d = new Date()
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[d.getMonth()]
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  const milliseconds = String(d.getMilliseconds()).padStart(3, '0')
  const formattedTime = `${month} ${day} ${hours}:${minutes}:${seconds}.${milliseconds}`
  const server = isServer ? 'Server' : 'Client'
  return name 
    ? showIsServer 
      ? `${name} | ${server} | ${formattedTime}` 
      : `${name} | ${formattedTime}`
    : showIsServer
      ? `${server} | ${formattedTime}`
      : formattedTime
}
