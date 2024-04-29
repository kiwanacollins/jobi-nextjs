import { ContactMessages } from '@/database/contact.model';
import MessageItem from './MessageItem';

interface IProps {
  messages: ContactMessages[] | undefined;
}

const MesssgesTable = ({ messages }: IProps) => {
  return (
    <div className="table-responsive">
      <table className="table job-alert-table">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Sent At</th>
            <th scope="col">Message</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody className="border-0">
          {messages?.map((message, index) => (
            <MessageItem
              key={message._id}
              serial={index + 1}
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
  );
};
export default MesssgesTable;
