import { DocumentProps, StyleSheet } from '@react-pdf/renderer';
import React from 'react';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

const styles = StyleSheet.create({
  viewPdf: {
    width: '100%',
    maxWidth: '100%',
    height: '80vh',
    '@media max-width: 768px': {
      width: '100%'
    },
    '@media min-width: 320px': {
      width: '100%'
    },
    '@media orientation: landscape': {
      width: '100%'
    }
  }
});

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
          <PDFViewer style={styles.viewPdf}>{children}</PDFViewer>
        </div>
      </div>
    </div>
  );
};
export default ResumeModal;
