function createFilename() {
  const now = new Date()
  return now.getFullYear() +
    ('0' + (now.getMonth() + 1)).slice(-2) +
    ('0' + now.getDate()).slice(-2) + '_' +
    ('0' + now.getHours()).slice(-2) +
    ('0' + now.getMinutes()).slice(-2) +
    ('0' + now.getSeconds()).slice(-2) + '_' +
    ('000' + now.getMilliseconds()).slice(-4) + '.png'
}

export default function downloadURL(url: string, filename?: string) {
  const link = document.createElement('a')
  filename = filename || createFilename()
  link.download = filename
  link.href = url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
