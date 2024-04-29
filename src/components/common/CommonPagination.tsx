'use client';
import { formUrlQuery } from '@/utils/utils';
import { useRouter, useSearchParams } from 'next/navigation';
interface Props {
  pageNumber: number;
  isNext: boolean;
}
const CommonPagination = ({ pageNumber, isNext }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleNavigation = (direction: string) => {
    const nextPageNumber =
      direction === 'prev' ? pageNumber - 1 : pageNumber + 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'page',
      value: nextPageNumber.toString()
    });

    router.push(newUrl);
  };

  if (!isNext && pageNumber === 1) return null;
  return (
    <ul className="pagination-two d-flex gap-3  align-items-center style-none">
      <li className="p-2">
        <button
          disabled={pageNumber === 1}
          onClick={() => handleNavigation('prev')}
          role="button"
        >
          <i className="bi bi-chevron-left"></i>
        </button>
      </li>
      <li className="active">
        <a role="button" href="#">
          {pageNumber}
        </a>
      </li>
      <li className="p-2">
        <button
          disabled={!isNext}
          onClick={() => handleNavigation('next')}
          role="button"
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </li>
    </ul>
  );
};
export default CommonPagination;
