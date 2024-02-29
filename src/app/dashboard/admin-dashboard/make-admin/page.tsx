const Page = () => {
  return (
    <div>
      <div className="dash-input-wrapper mb-30">
        <label htmlFor="">Make Admin*</label>
        <div className="skills-wrapper">
          <div className="dash-input-wrapper mb-30">
            <input type="text" placeholder="Make admin by email address" />
            <button className="btn btn-primary mt-3 p-3">Make admin</button>
          </div>
        </div>
      </div>

      {/* Skills end */}
    </div>
  );
};
export default Page;
