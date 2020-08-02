<template>
  <auth-provider network="facebook"></auth-provider>
</template>

<script>
import AuthProvider from '@/components/auth/provider'
export default {
  layout: 'guest',
  components: {
    'auth-provider': AuthProvider
  }
}
</script>
