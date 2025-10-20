import { getAllContactsMessages } from '@/lib/actions/contact.action';
import MesssgesTable from './MessagesTable';

interface Props {
  searchParams?: {
    page?: string;
    search?: string;
  };
}

const DashboardAdminMessages = async ({ searchParams }: Props) => {
  const page = Number(searchParams?.page) || 1;
  const search = searchParams?.search || '';
  
  const { messages, pagination } = await getAllContactsMessages({
    page,
    pageSize: 10,
    searchQuery: search
  });
  
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-500 job-name fw-bold">Messages ({pagination?.totalMessages || 0})</h3>
      </div>
      <div>
        <MesssgesTable 
          messages={messages} 
          pagination={pagination}
          currentPage={page}
          searchQuery={search}
        />
      </div>
    </div>
  );
};
export default DashboardAdminMessages;
