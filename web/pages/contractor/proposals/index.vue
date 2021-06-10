<script>
import ProposalList     from '@/components/proposal/list';
import ProposalInfo     from '@/components/proposal/info';
import ProposalDetails  from '@/components/proposal/contractor/details';
export default {
  extends: ProposalList,
  components: {
    ProposalInfo,
    ProposalDetails
  }
}
</script>