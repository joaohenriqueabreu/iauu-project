<template>
  <div>
    <form-button class="social-login" @action="login">
      <h6><icon :icon="icon" class="mr-2"></icon>Login com {{ name }}</h6>
    </form-button>
  </div>
</template>