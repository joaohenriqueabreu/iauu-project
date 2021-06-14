<script>
import ProposalList     from '@/components/proposal/list';
import ProposalItem     from '@/components/proposal/item';
import ProposalDetails  from '@/components/proposal/contractor/details';
export default {
  extends: ProposalList,
  components: {
    ProposalItem,
    ProposalDetails
  }
}
</script>