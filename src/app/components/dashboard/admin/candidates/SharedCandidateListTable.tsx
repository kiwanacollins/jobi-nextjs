import SharedCandidateTableItem from './SharedCandidateTableItem';

interface SharedCandidateListTableProps {
  sharedCandidates: any;
}
const SharedCandidateListTable = ({
  sharedCandidates
}: SharedCandidateListTableProps) => {
  return (
    <div className="table-responsive">
      <table className="table job-alert-table">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Company Name</th>
            <th scope="col">Employee Name</th>
            <th scope="col">Candiates</th>
          </tr>
        </thead>
        <tbody className="border-0">
          {sharedCandidates?.map((item: any, index: any) => (
            <SharedCandidateTableItem
              id={index + 1}
              key={item._id}
              employeeId={item.employeeId.clerkId}
              companyName={item.employeeId.companyName}
              employeeName={item.employeeId.name}
              email={item.employeeId.email}
              candidates={item.candidates}
            />
          ))}

          {sharedCandidates.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center">
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default SharedCandidateListTable;
