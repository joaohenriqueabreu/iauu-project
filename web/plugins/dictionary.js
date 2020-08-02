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
        fans: 'Fãs',
        score: 'Avaliações'
      },
      icon: {
        presentations: 'music',
        fans: 'child',
        score: 'star'
      }
    }
  }
}

export default ({ app }, inject) => {
  inject('dictionary', dictionary)
}
