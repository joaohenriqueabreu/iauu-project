// For some reason this function is called twice, so fix that
let alreadyLogged = false

export default function({ $auth, app }) {
    $auth.onError((error, name, endpoint) => {
      if (!alreadyLogged && error.response !== undefined) {
        app.$toast.error(error.response.data)
      }

      alreadyLogged = !alreadyLogged
    })
}