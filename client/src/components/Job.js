import moment from "moment";
import { FaLocationArrow, FaCalendarAlt } from "react-icons/fa";
import { GiStairsGoal } from "react-icons/gi";
import { HiBuildingOffice } from "react-icons/hi2";
import { useAppContext } from "../context/appContext";
import { Link } from "react-router-dom";
import Wrapper from "../assets/style-wrappers/Job.js";
import JobInfo from "./JobInfo";

const Job = ({ job }) => {
  const { setEditJob, deleteJob } = useAppContext();

  let date = moment(job.createdAt);
  date = date.format("MMM Do, YYYY");
  return (
    <Wrapper>
      <header>
        <div className="main-icon">{job.company.charAt(0)}</div>
        <div className="info">
          <h5>{job.position}</h5>
          <h5>{job.company}</h5>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaLocationArrow />} text={job.jobLocation} />
          <JobInfo icon={<HiBuildingOffice />} text={job.workEnv} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<GiStairsGoal />} text={job.stage} />
          <div className={`status ${job.status}`}>{job.status}</div>
        </div>
        <footer>
          <div className="actions">
            <Link
              to="/add-job"
              className="btn edit-btn"
              onClick={() => setEditJob(job._id)}
            >
              Edit
            </Link>
            <button
              type="button"
              className="btn delete-btn"
              onClick={() => deleteJob(job._id)}
            >
              Delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>
  );
};

export default Job;
