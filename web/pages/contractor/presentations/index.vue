<script>
import PresentationList from '@/components/presentation/list';

export default {
  extends: PresentationList,
  computed: {
    redirectRoute() { return 'contractor/presentations'; }
  }
}
</script>