import { useEffect } from "react";
import { useAppContext } from "../context/appContext";
import { Loading, Job, PageBtnContainer, Alert } from "./index";
import Wrapper from "../assets/style-wrappers/JobsContainer";

const JobsContainer = () => {
  const {
    isEditing,
    getJobs,
    jobs,
    isLoading,
    totalJobs,
    clearValues,
    search,
    searchStatus,
    searchEnv,
    sort,
    numOfPages,
    page,
    showAlert,
  } = useAppContext();

  useEffect(() => {
    getJobs();
    // **TODO fix this and add useCallback
    // eslint-disable-next-line
  }, [page, search, searchStatus, searchEnv, sort]);

  if (isEditing) {
    clearValues();
  }

  if (isLoading) {
    return <Loading center />;
  }

  if (jobs.length === 0) {
    return (
      <Wrapper>
        <h2>No jobs to display</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {showAlert && <Alert />}
      <h5>
        {totalJobs} job{jobs.length > 1 && "s"} found
      </h5>
      <div className="jobs">
        {jobs.map((job) => {
          return <Job key={job._id} job={job} />;
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};

export default JobsContainer;
