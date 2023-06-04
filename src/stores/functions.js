export function loadData(item) {
  // item.loading = true;

  var auth = { Authorization: 'Token d5ee83538b357e350221f46aa6d3421f62c95ccc' }

  fetch('http://192.168.0.34:8000/api/' + item.url, { headers: auth })
    .then((data) => {
      if (data.ok) {
        return data.json()
      }
      throw new Error('Request failed!')
    })
    .then((data) => {
      item.loading = false
      item.data = data
      item.error = null
    })
    .catch((error) => {
      item.loading = false
      item.error = error
      console.error('There was an error!', error)
    })
    .finally(() => {
      item.loading = false
    })
}


export function ready(item) {
  return !item.loading && item.data
}