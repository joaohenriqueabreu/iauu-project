<script>
import PresentationList from '@/components/presentation/list';

export default {
  extends: PresentationList,
  computed: {
    redirectRoute() { return '/artist/presentations'; }
  }
}
</script>