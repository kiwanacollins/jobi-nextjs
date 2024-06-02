import LoadingTableSkeleton from "@/components/skaletons/TableSkeleton";

const LoadingBlogsPage = () => {
    return (
      <div className="position-relative placeholder-wave ">
        <div className="d-flex align-items-center justify-content-between mb-40 lg-mb-30">
          <h2 className="main-title placeholder placeholder-wave col-2  bg-success m0"></h2>
          <div className="short-filter d-flex gap-3  placeholder placeholder-wave col-2  bg-success align-items-center">
            <div className="text-dark fw-500 placeholder placeholder-wave col-2  bg-success  me-2"></div>
            <div className="text-dark placeholder placeholder-wave col-2  bg-success fw-500 me-2"></div>
          </div>
        </div>
  
        <LoadingTableSkeleton />
      </div>
    );
  };
  export default LoadingBlogsPage;