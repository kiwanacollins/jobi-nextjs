const LoadingBlogsPage = () => {
  return (
    <div className="placeholder-glow ">
      <h2 className="main-title placeholder-lg col-8"></h2>
      <div className="container mx-auto ">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 gap-4">
          {[1, 2, 3, 4, 5, 6]?.map((index) => {
            return (
              <div key={index} className="card" aria-hidden="true">
                <div
                  style={{
                    width: '100%',
                    height: '120px'
                  }}
                  className="card-img-top"
                ></div>
                <div className="card-body">
                  <h5 className="card-title placeholder-glow">
                    <span className="placeholder col-6"></span>
                  </h5>
                  <p className="card-text placeholder-glow">
                    <span className="placeholder col-7"></span>
                    <span className="placeholder col-4"></span>
                    <span className="placeholder col-4"></span>
                    <span className="placeholder col-6"></span>
                    <span className="placeholder col-8"></span>
                  </p>
                  <button className="btn btn-primary disabled placeholder col-6"></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default LoadingBlogsPage;
