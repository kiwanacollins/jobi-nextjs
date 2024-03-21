import SharedCandidateListTable from '@/app/components/dashboard/admin/candidates/SharedCandidateListTable';
import { getShareSavedCandidates } from '@/lib/actions/admin.action';

const Page = async () => {
  const { data } = await getShareSavedCandidates();

  return (
    <div>
      <h2 className="main-title">Shared Candidate List</h2>
      <SharedCandidateListTable sharedCandidates={data} />
    </div>
  );
};
export default Page;
