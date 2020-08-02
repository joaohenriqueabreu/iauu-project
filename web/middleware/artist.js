export default function({ app, redirect }) {
  if (!app.$auth.hasScope('artist')) {
    return redirect('/')
  }
}
