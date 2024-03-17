'use client';
import React, { useEffect } from 'react';
import { resetFilter } from '@/redux/features/filterSlice';
import { useAppDispatch } from '@/redux/hook';
import { animationCreate } from '@/utils/utils';
import { usePathname } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import NextNProgress from 'nextjs-progressbar';

if (typeof window !== 'undefined') {
  require('bootstrap/dist/js/bootstrap');
}

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  //  handle reset first time render this page
  const handleReset = () => {
    dispatch(resetFilter());
  };

  useEffect(() => {
    animationCreate();
  }, []);
  useEffect(() => {
    handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  return (
    <>
      <NextNProgress
        color="#29DDDD"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />
      {children}
      <ToastContainer />
    </>
  );
};

export default Wrapper;
