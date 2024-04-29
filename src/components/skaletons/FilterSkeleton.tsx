const FilterSkeleton = () => {
  return (
    <div className="filter-area-tab h-100 placeholder-wave placeholder bg-white  offcanvas offcanvas-start">
      {[1, 2, 3, 4, 5, 6, 7].map((item) => (
        <div key={item}>
          <h5 className="placeholder-glow">
            <span className="placeholder col-6 bg-success"></span>
          </h5>
          <p className="card-text placeholder-glow">
            <span className="placeholder col-7 bg-success"></span>
            <span className="placeholder col-6 bg-success"></span>
            <span className="placeholder col-6 bg-success"></span>
          </p>
          <p className="card-text placeholder-glow">
            <span className="placeholder col-7 bg-success"></span>
            <span className="placeholder col-6 bg-success"></span>
            <span className="placeholder col-6 bg-success"></span>
          </p>
        </div>
      ))}

      {/* Additional modifications or content go here */}

      {/* Example: Add a single placeholder element at the end */}
      <div className="content-placeholder placeholder col-6 bg-success"></div>
      <button className="btn btn-primary disabled placeholder bg-success col-6"></button>
    </div>
  );
};
export default FilterSkeleton;
