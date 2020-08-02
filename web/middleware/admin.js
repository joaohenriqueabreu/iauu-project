export default function({ app, redirect }) {
  if (!app.$auth.hasScope('admin')) {
    return redirect('/')
  }
}
