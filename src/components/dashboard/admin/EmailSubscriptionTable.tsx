'use client';
import React from 'react';
import { IEmailSubscription } from '@/database/emailSubscription.model';

interface EmailSubscriptionTableProps {
  subscriptions: IEmailSubscription[];
}

const EmailSubscriptionTable = ({ subscriptions = [] }: EmailSubscriptionTableProps) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Ensure subscriptions is always an array
  const safeSubscriptions = Array.isArray(subscriptions) ? subscriptions : [];

  return (
    <div className="bg-white card-box border-20 mt-30">
      <div className="table-header d-flex justify-content-between align-items-center mb-20">
        <h3 className="table-title m0">Email Subscriptions</h3>
        <span className="badge bg-primary">{safeSubscriptions.length} Total</span>
      </div>
      
      {safeSubscriptions.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-muted">No email subscriptions found</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table job-alert-table">
            <thead>
              <tr>
                <th scope="col">Email Address</th>
                <th scope="col">Subscribed Date</th>
                <th scope="col">Source</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody className="border-0">
              {safeSubscriptions.map((subscription, index) => (
                <tr key={subscription._id || index}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="candidate-name">
                        <h4 className="candidate-title">{subscription.email}</h4>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="date-info">
                      {formatDate(subscription.subscribedAt)}
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark">
                      {subscription.source || 'newsletter'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${subscription.isActive ? 'bg-success' : 'bg-secondary'}`}>
                      {subscription.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmailSubscriptionTable;