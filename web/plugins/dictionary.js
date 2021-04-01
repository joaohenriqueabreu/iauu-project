const dictionary = {
  payment: {
    label: {
      closed: 'Retirado',
      active: 'Realizado',
      pending: 'Pendente',
      total: 'Total'
    }
  },
  artist: {
    stats: {
      label: {
        presentations: 'Apresentações',
        followers: 'Seguidores',
        score: 'Avaliações'
      },
      icon: {
        presentations: 'music',
        followers: 'child',
        score: 'star'
      }
    }
  }
}

export default ({ app }, inject) => {
  inject('dictionary', dictionary)
}
