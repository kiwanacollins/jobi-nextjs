import Image from 'next/image';
import Link from 'next/link';

interface ISharedCandidateTableItem {
  id: number;
  companyName: string;
  employeeName: string;
  email: string;
  candidates: any[];
}
const SharedCandidateTableItem = ({
  companyName,
  employeeName,
  email,
  id,
  candidates
}: ISharedCandidateTableItem) => {
  return (
    <tr>
      <td>
        <div className="job-name fw-500">{id}</div>
      </td>
      <td>
        <div className="job-name fw-500">{companyName}</div>
      </td>
      <td>
        <div className="job-name fw-500">{employeeName}</div>
      </td>
      <td>
        <div className="job-status text-capitalize d-flex justify-content-center align-items-center  flex-wrap gap-1">
          {candidates?.map((candidate, index) => {
            return (
              <Link
                href={`/candidate-profile/${candidate.resumeId}`}
                className=""
                key={index}
              >
                <Image
                  src={candidate.picture}
                  alt={candidate.name}
                  title={candidate.name}
                  width={50}
                  height={50}
                  className="rounded-circle"
                />
              </Link>
            );
          })}
        </div>
      </td>
    </tr>
  );
};
export default SharedCandidateTableItem;
