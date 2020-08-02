<template>
  <div class="signup">
    <div class="user artist" @click="$router.push('/role/artist')">
      <h3>Sou um artista e quero receber contatos para shows</h3>
    </div>
    <div class="user contractor" @click="$router.push('/role/contractor')">
      <h3>Sou um produtor ou estou organizando um evento e quero contratar artistas</h3>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.signup {
  height: 90vh;
  width: 100%;

  @include desktop {
    display: flex;
    flex-direction: row;
  }

  @include mobile {
    display: flex;
    flex-direction: column;
  }

  .title {
    @extend .horizontal, .center, .middle;
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
  }

  .user {
    @extend .vertical, .center, .middle;
    @include desktop {
      width: 50%;
      height: 110vh;
      margin-top: -10vh;
      opacity: 0.2;

      &:hover {
        transition: $transition;
        opacity: 0.9;
      }
    }

    @include mobile {
      width: 100%;
      height: 50vh;
    }

    text-align: center;
    transition: $transition;
    z-index: $moveToTop;
    cursor: pointer;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .artist {
    background-image: url('~assets/imgs/general/artist-signup.jpg?webp');

    @include mobile {
      margin-top: -10vh;
    }
  }

  .contractor {
    background-image: url('~assets/imgs/general/contractor-signup.jpg?webp');
  }
}
</style>
