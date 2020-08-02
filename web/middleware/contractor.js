export default function({ app, redirect }) {
  if (!app.$auth.hasScope('contractor')) {
    return redirect('/')
  }
}
