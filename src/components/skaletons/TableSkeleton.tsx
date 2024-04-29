const LoadingTableSkeleton = () => (
  <div className="table-responsive placeholder-glow ">
    <table className="table job-alert-table">
      <thead>
        <tr>
          <th scope="col">
            <div className="placeholder bg-success w-50"></div>
          </th>
          <th scope="col">
            <div className="placeholder bg-success w-75"></div>
          </th>
          <th scope="col">
            <div className="placeholder bg-success w-50"></div>
          </th>
          <th scope="col">
            <div className="placeholder bg-success w-25"></div>
          </th>
        </tr>
      </thead>
      <tbody className="border-0">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
          <tr key={index}>
            <td>
              <div className="placeholder bg-success w-50"></div>
            </td>
            <td>
              <div className="placeholder bg-success w-75"></div>
            </td>
            <td>
              <div className="placeholder bg-success w-50"></div>
            </td>
            <td>
              <div className="placeholder bg-success w-25"></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default LoadingTableSkeleton;
