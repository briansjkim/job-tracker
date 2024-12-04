import { FormRow, FormRowSelect } from "./index";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/style-wrappers/SearchContainer";

const SearchContainer = () => {
  const {
    isLoading,
    search,
    searchStatus,
    searchEnv,
    sort,
    sortOptions,
    statusOptions,
    workEnvOptions,
    handleChange,
    clearFilters,
  } = useAppContext();

  const handleSearch = (e) => {
    handleChange({ name: e.target.name, value: e.target.value });
  };

  const handleClear = (e) => {
    e.preventDefault();
    clearFilters();
  };

  return (
    <Wrapper>
      <form className="form">
        <h4>Search Form</h4>
        <div className="form-center">
          <FormRow
            labelText="company"
            type="text"
            name="search"
            value={search}
            handleChange={handleSearch}
          ></FormRow>
          <FormRowSelect
            labelText="job status"
            name="searchStatus"
            value={searchStatus}
            handleChange={handleSearch}
            list={["all", ...statusOptions]}
          ></FormRowSelect>
          <FormRowSelect
            labelText="work environment"
            name="searchEnv"
            value={searchEnv}
            handleChange={handleSearch}
            list={["all", ...workEnvOptions]}
          ></FormRowSelect>
          <FormRowSelect
            name="sort"
            value={sort}
            handleChange={handleSearch}
            list={sortOptions}
          ></FormRowSelect>
          <button
            className="btn btn-block btn-danger"
            disabled={isLoading}
            onClick={handleClear}
          >
            Clear Filters
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default SearchContainer;
