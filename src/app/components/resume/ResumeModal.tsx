import { DocumentProps } from '@react-pdf/renderer';
import React from 'react';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

const ResumeModal = ({
  children
}: {
  children: React.ReactElement<DocumentProps>;
}) => {
  return (
    <div
      className="modal fade"
      id="resumeModal"
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <PDFViewer style={{ width: '100%', height: '100vh' }}>
            {children}
          </PDFViewer>
        </div>
      </div>
    </div>
  );
};
export default ResumeModal;
