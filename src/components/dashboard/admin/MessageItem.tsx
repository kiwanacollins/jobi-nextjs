'use client';

import Swal from 'sweetalert2';
import ViewMessageModal from './ViewMessageModal';
import { deleteContactMessageById } from '@/lib/actions/contact.action';
import deleteIcon from '@/assets/dashboard/images/icon/icon_21.svg';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { getTimestamp } from '@/utils/utils';
import Image from 'next/image';
import { Eye, MessageCircleReply } from 'lucide-react';

interface IAdminItemProps {
  id: string;
  name: string;
  email: string;
  serial: number;
  message: string;
  subject?: string;
  sentAt?: Date;
}

const MessageItem = ({
  name,
  email,
  id,
  serial,
  message,
  subject,
  sentAt
}: IAdminItemProps) => {
  const pathname = usePathname();
  const handleDeleteContactMessage = async (messageId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You cannot recover this message!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Todo: remove message by Id
        const res = await deleteContactMessageById({
          id: messageId,
          path: pathname
        });
        if (res?.status === 'success') {
          Swal.fire({
            title: 'Deleted!',
            text: res?.message,
            icon: 'success'
          });
        }
      }
    });
  };
  return (
    <>
      <tr>
        <td>
          <div className="job-name fw-500">{serial}</div>
        </td>
        <td>
          <div className="job-name fw-500">{name}</div>
        </td>
        <td>
          <div className="job-name fw-500">{email}</div>
        </td>
        <td>
          <div className="job-name fw-500">{getTimestamp(sentAt as Date)}</div>
        </td>
        <td>
          <div
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              display: '-webkit-box',
              boxOrient: 'vertical',
              WebkitLineClamp: 1,
              whiteSpace: 'nowrap'
            }}
            className="job-name fw-500"
          >
            <button
              className="btn "
              data-bs-toggle="modal"
              title="View Message"
              data-bs-target={`#viewMessageModal-${id}`}
            >
              <Eye size={25} />
            </button>
          </div>
        </td>

        <td>
          <div className="action-dots float-end ">
            <div className="d-flex justify-content-end  align-items-center  gap-2 ">
              <Link
                href={`mailto:${email}?subject=${subject}%20Here&body=In response to your message:%0D%0A"${message}"%0D%0A%0D%0AHello${' ' + name},%0D%0A%0D%0A`}
                title="Reply to message"
                className="btn "
              >
                <MessageCircleReply size={25} />
              </Link>
              <button
                onClick={() => handleDeleteContactMessage(id)}
                title="Delete Message"
                className="btn "
              >
                <Image src={deleteIcon} alt="delete" width={25} height={25} />
              </button>
            </div>
          </div>
        </td>
      </tr>

      <ViewMessageModal
        id={id}
        subject={subject}
        message={message}
        name={name}
        email={email}
      />
    </>
  );
};
export default MessageItem;
