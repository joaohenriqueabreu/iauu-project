<template>
  <div>
    <div class="share mb-4 horizontal center" @click="share">
      <h4><icon icon="share-alt" class="mr-4"></icon></h4>
      <h4>
        <span>Compartilhe o link abaixo e receba {{ 5 }}% do valor dos shows realizados</span>
      </h4>
    </div>
    <div class="link mb-5" @click="share">
      <icon icon="copy"></icon>
      <span id="user-referral-link" ref="link">{{ userReferralLink }}</span>
    </div>
    <div class="vertical center middle full-height">
      <h4 class="mb-2">Indique e ganhe!</h4>
      <h6 class="mb-5">Como funciona a renda passiva {{ $config.companyName }}?</h6>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tempus quam pellentesque nec nam aliquam. In metus vulputate eu scelerisque felis imperdiet. Sagittis purus sit amet volutpat. A diam sollicitudin tempor id eu nisl nunc. Lectus mauris ultrices eros in cursus. Tristique senectus et netus et malesuada fames ac turpis. Odio morbi quis commodo odio aenean sed. Tempus iaculis urna id volutpat. Leo vel orci porta non pulvinar neque laoreet suspendisse interdum.
      </p>
      <p>
        Vestibulum rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt lobortis. Condimentum vitae sapien pellentesque habitant morbi. Aliquet sagittis id consectetur purus ut faucibus pulvinar elementum integer. Facilisis mauris sit amet massa vitae tortor. Amet est placerat in egestas erat imperdiet. Viverra ipsum nunc aliquet bibendum enim. Erat imperdiet sed euismod nisi porta lorem mollis. Aliquet sagittis id consectetur purus. Egestas purus viverra accumsan in nisl nisi scelerisque. Nam at lectus urna duis convallis convallis tellus id interdum. Morbi leo urna molestie at elementum eu. Quam nulla porttitor massa id neque aliquam. Turpis egestas sed tempus urna et pharetra pharetra. Ac orci phasellus egestas tellus rutrum tellus.
      </p>
      <p>
        Id semper risus in hendrerit gravida rutrum. Scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus. Augue mauris augue neque gravida. Amet commodo nulla facilisi nullam vehicula. Neque volutpat ac tincidunt vitae semper. Habitasse platea dictumst vestibulum rhoncus est pellentesque. Convallis tellus id interdum velit laoreet id donec ultrices. At urna condimentum mattis pellentesque id nibh tortor. Nulla posuere sollicitudin aliquam ultrices sagittis orci a scelerisque purus. Ultricies lacus sed turpis tincidunt id aliquet risus feugiat. A pellentesque sit amet porttitor. Auctor augue mauris augue neque gravida in fermentum et. Aliquet risus feugiat in ante metus dictum. Vulputate eu scelerisque felis imperdiet proin fermentum. Turpis egestas pretium aenean pharetra magna ac placerat vestibulum lectus.
      </p>
      <p>
        In cursus turpis massa tincidunt dui. Quisque non tellus orci ac. Donec ac odio tempor orci dapibus ultrices. Morbi quis commodo odio aenean sed adipiscing diam donec adipiscing. Volutpat sed cras ornare arcu dui. Urna molestie at elementum eu facilisis sed odio morbi quis. A condimentum vitae sapien pellentesque habitant morbi. Ultricies tristique nulla aliquet enim tortor at. Faucibus pulvinar elementum integer enim neque. Diam volutpat commodo sed egestas egestas fringilla phasellus faucibus. A condimentum vitae sapien pellentesque habitant morbi tristique senectus et. Enim nulla aliquet porttitor lacus luctus accumsan. Egestas diam in arcu cursus euismod quis viverra. Sagittis orci a scelerisque purus semper eget duis at tellus. Ligula ullamcorper malesuada proin libero nunc consequat interdum varius sit.
      </p>
      <p>
        Nibh cras pulvinar mattis nunc. Semper auctor neque vitae tempus quam pellentesque nec nam. Magna etiam tempor orci eu lobortis elementum nibh tellus molestie. Eget magna fermentum iaculis eu non. Et odio pellentesque diam volutpat commodo sed egestas. Dictum fusce ut placerat orci nulla pellentesque dignissim. Tortor at auctor urna nunc. Nec feugiat nisl pretium fusce id velit ut tortor. Et sollicitudin ac orci phasellus egestas tellus rutrum tellus pellentesque. In metus vulputate eu scelerisque felis imperdiet proin fermentum leo. In pellentesque massa placerat duis ultricies lacus sed turpis. Tristique et egestas quis ipsum suspendisse ultrices. Amet massa vitae tortor condimentum lacinia quis vel. Aliquet nibh praesent tristique magna sit. Eget nulla facilisi etiam dignissim diam quis enim. Risus at ultrices mi tempus. Faucibus purus in massa tempor nec feugiat nisl. Consectetur adipiscing elit ut aliquam purus sit.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    userReferralLink() {
      const url = window.location
      return url.protocol + '//' + url.host + '/register?from=' + this.$auth.user.referral_token
    }
  },
  methods: {
    share() {
      this.$copyToClipboard(this.userReferralLink)
      this.$toast.success('Link de indicação copiado!')
    }
  }
}
</script>

<style lang="scss" scoped>
.share {
  cursor: pointer;
  transition: $transition;
  &:hover {
    transition: $transition;
    color: $brandLayer;
  }
}

.link {
  cursor: pointer;
  background: $layer1;
  box-shadow: $shadow;
  padding: 4 * $space;
  transition: $transition;
  &:hover {
    transition: $transition;
    color: $brandLayer;
  }
}
</style>
