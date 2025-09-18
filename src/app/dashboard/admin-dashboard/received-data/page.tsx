import EmailSubscriptionTable from '@/components/dashboard/admin/EmailSubscriptionTable';
import { getEmailSubscriptions } from '@/lib/actions/admin.action';

const Page = async () => {
  // Handle potential errors from getEmailSubscriptions
  let subscriptions = [];
  try {
    const emailResult = await getEmailSubscriptions();
    subscriptions = emailResult?.data || [];
  } catch (error) {
    console.error('Failed to fetch email subscriptions:', error);
    subscriptions = [];
  }

  return (
    <div>
      <h2 className="main-title mb-40">Subscribed Emails</h2>
      
      {/* Email Subscriptions Section */}
      <div>
        <EmailSubscriptionTable subscriptions={subscriptions} />
      </div>
    </div>
  );
};

export default Page;
