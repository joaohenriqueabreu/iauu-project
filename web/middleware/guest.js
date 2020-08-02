export default function({ app, store, redirect }) {
  // Only when not logged in
  if (app.$auth.loggedIn) {
    store.dispatch('app/setAlert', { type: 'error', message: 'Você já está logado' })
    return redirect('/')
  }
}
