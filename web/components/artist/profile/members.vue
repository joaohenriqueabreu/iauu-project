<template>
  <div>
    <div class="share mb-4 horizontal center" @click="share">
      <h4><icon icon="share-alt" class="mr-4"></icon></h4>
      <h4><span>Compartilhe o link abaixo com os integrantes de sua banda</span></h4>
    </div>
    <div class="link mb-5" @click="share">
      <span id="user-referral-link" ref="link">{{ artist.short_url }}</span>
    </div>
    <div>
      <h5 class="mb-4" v-if="!$empty(artist.name)">Integrantes de {{ artist.name }}</h5>
      <table class="full-width" v-if="!$empty(artist.members)">
        <thead>
          <tr>
            <td></td>
            <th>Nome</th>
            <th>Email</th>
            <th>Administrador</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in members" :key="index">
            <td v-if="!$empty(user)" class="py-3">
              <!-- <avatar :src="user.photo" :username="user.name"></avatar> -->
            </td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <div v-else>
        <h6>Nenhum membro cadastrado</h6>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    roleId: { type: String, default: '' }
  },
  computed: {
    ...mapState({ members: (state) => state.artist.artist.members}),
    ...mapState({ artist:  (state) => state.artist.artist }),
    artistInviteLink() {
      const url = window.location
      return url.protocol + '//' + url.host + '/register?artist=' + this.roleId
    }
  },
  methods: {
    share() {
      const el = document.createElement('textarea')
      el.value = this.artistInviteLink
      el.setAttribute('readonly', '')
      el.style.position = 'absolute'
      el.style.left = '-9999px'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)

      this.$toast.success('Link de indicação copiado!')
    }
  }
}
</script>

<style lang="scss" scoped>
.link {
  text-align: center;
  background: $layer1;
  box-shadow: $shadow;
  padding: 4 * $space;
  border-radius: $edges;
  cursor: pointer;
  transition: $transition;

  &:hover {
    transition: $transition;
    color: $brandLayer;
  }
}

table {
  tr {
    color: $brand;
    transition: $transition;
    &:hover {
      transition: $transition;
      background: $layer5;
    }
  }
}

.ps {
  max-height: 20vh;
}
</style>
