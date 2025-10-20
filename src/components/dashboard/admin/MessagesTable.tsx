import { ContactMessages } from '@/database/contact.model';
import MessageItem from './MessageItem';
import MessageSearch from './MessageSearch';
import MessagesPagination from './MessagesPagination';

interface IProps {
  messages: ContactMessages[] | undefined;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalMessages: number;
    pageSize: number;
  };
  currentPage: number;
  searchQuery: string;
}

const MesssgesTable = ({ messages, pagination, currentPage }: IProps) => {
  return (
    <>
      <MessageSearch />
      
      {!messages || messages.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted fs-5">No messages found</p>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table job-alert-table">
              <thead>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Subject</th>
                  <th scope="col">Sent At</th>
                  <th scope="col">View</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody className="border-0">
                {messages.map((message, index) => (
                  <MessageItem
                    key={message._id}
                    serial={((currentPage - 1) * (pagination?.pageSize || 10)) + index + 1}
                    name={message.name}
                    email={message.email}
                    sentAt={message.sentAt}
                    id={message._id}
                    message={message.message}
                    subject={message.subject}
                  />
                ))}
              </tbody>
            </table>
          </div>
          
          {pagination && (
            <MessagesPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
            />
          )}
        </>
      )}
    </>
  );
};
export default MesssgesTable;
