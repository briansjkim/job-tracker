import { useAppContext } from "../../context/appContext";
import Wrapper from "../../assets/style-wrappers/DashboardFormPage";
import { FormRow, Alert, FormRowSelect } from "../../components/index";

const AddJob = () => {
  const {
    isLoading,
    isEditing,
    showAlert,
    displayAlert,
    position,
    company,
    statusOptions,
    status,
    stageOptions,
    stage,
    jobLocation,
    jobSkills,
    workEnv,
    workEnvOptions,
    handleChange,
    clearValues,
    createJob,
    editJob,
  } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!position || !company || !jobLocation) {
      displayAlert();
      return;
    }

    if (isEditing) {
      editJob();
      return;
    }
    createJob();
  };

  const handleJobInput = (e) => {
    handleChange({ name: e.target.name, value: e.target.value });
  };

  return (
    <Wrapper>
      <form className="form">
        <h3>{isEditing ? "edit job" : "add job"}</h3>
        {showAlert && <Alert />}

        <div className="form-center">
          {/* position */}
          <FormRow
            type="text"
            name="position"
            value={position}
            handleChange={handleJobInput}
          />
          {/* company */}
          <FormRow
            type="text"
            name="company"
            value={company}
            handleChange={handleJobInput}
          />
          {/* location */}
          <FormRow
            type="text"
            labelText="location"
            name="jobLocation"
            value={jobLocation}
            handleChange={handleJobInput}
          />
          {/* requirements */}
          <FormRow
            type="text"
            labelText="skill requirements"
            name="jobSkills"
            value={jobSkills}
            handleChange={handleJobInput}
          />
          {/* status */}
          <FormRowSelect
            name="status"
            value={status}
            handleChange={handleJobInput}
            list={statusOptions}
          />
          {/* stages */}
          <FormRowSelect
            name="stage"
            value={stage}
            handleChange={handleJobInput}
            list={stageOptions}
          />
          {/* workEnv */}
          <FormRowSelect
            name="workEnv"
            labelText="work environment"
            value={workEnv}
            handleChange={handleJobInput}
            list={workEnvOptions}
          />
          <div className="btn-container">
            <button
              className="btn btn-block submit-btn"
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Submit
            </button>

            <button
              className="btn btn-block clear-btn"
              type="button"
              onClick={clearValues}
            >
              {isEditing ? "Cancel Edit" : "Clear Values"}
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};
export default AddJob;
