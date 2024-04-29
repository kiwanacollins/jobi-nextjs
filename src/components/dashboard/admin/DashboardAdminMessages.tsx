import { getAllContactsMessages } from '@/lib/actions/contact.action';
import MesssgesTable from './MessagesTable';

const DashboardAdminMessages = async () => {
  const { messages } = await getAllContactsMessages();
  return (
    <div>
      <h3 className="fw-500 job-name fw-bold ">Messages Table</h3>
      <div>
        <MesssgesTable messages={messages} />
      </div>
    </div>
  );
};
export default DashboardAdminMessages;
