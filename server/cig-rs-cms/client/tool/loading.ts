export const remove = () => {
  try {
    const loadBg = document.getElementById('loading_bg')
    if (loadBg) document.body.removeChild(loadBg)

    const load = document.getElementById('loading')
    if (load) document.body.removeChild(load)
  } catch (e) {
    console.log(e)
  }
}

export const add = () => {
  remove()
  const loadingBg = document.createElement('div')
  loadingBg.className = 'loading_bg'
  loadingBg.id = 'loading_bg'
  document.body.appendChild(loadingBg)

  const loading = document.createElement('div')
  loading.className = 'loading'
  loading.id = 'loading'
  document.body.appendChild(loading)
}
