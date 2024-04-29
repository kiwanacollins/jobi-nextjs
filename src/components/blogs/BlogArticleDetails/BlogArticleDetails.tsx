import Image from 'next/image';

import { IBlog } from '@/database/Blog.model';
import ParseHTML from '../../common/parseHTML';
import { getTimestamp } from '@/utils/utils';
const BlogArticleDetails = ({ item }: { item: IBlog }) => {
  return (
    <article className="blog-details-meta">
      <div className="blog-pubish-date">
        {'Posted'} - {getTimestamp(item.updatedAt as Date)}
        {item.author && <a href="#">{item?.author || '. By Rakib Hasan'}</a>}
      </div>
      <h2 className="blog-heading">{item?.title}</h2>
      <div className="img-meta mb-15">
        <Image
          src={item.image.url}
          width={400}
          height={300}
          alt="blog-img"
          className="lazy-img"
        />
      </div>
      <br />
      <ParseHTML data={item.content} />
      <div className="bottom-widget border-bottom d-sm-flex align-items-center justify-content-between">
        <ul className="d-flex gap-2  tags style-none pb-20">
          <li>Tag:</li>
          {item?.tags?.map((tag, i) => (
            <li key={i}>
              <a href="#">{tag}</a>
            </li>
          ))}
        </ul>
        <ul className="d-flex share-icon align-items-center style-none pb-20">
          <li>Share:</li>
          <li>
            <a href="#">
              <i className="bi bi-google"></i>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="bi bi-twitter"></i>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="bi bi-instagram"></i>
            </a>
          </li>
        </ul>
      </div>
    </article>
  );
};
export default BlogArticleDetails;
