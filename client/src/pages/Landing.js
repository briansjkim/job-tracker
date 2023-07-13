import { Link } from "react-router-dom";
import main from "../assets/images/main.svg";
import Wrapper from "../assets/style-wrappers/LandingPage";
import { Logo } from "../components/index";
import { useAppContext } from "../context/appContext";
import { Navigate } from "react-router-dom";

const Landing = () => {
  const { user } = useAppContext();
  return (
    <>
      {user && <Navigate to="/" />}

      <Wrapper>
        <nav>
          <Logo />
        </nav>
        <div className="container page">
          <div className="info">
            <h1>
              Job <span>tracking</span> app
            </h1>
            <p>
              Jobify is a job tracking software application designed to help
              effectively manage and monitor job progress. <br />
              Users can add details such as the work environment and position
              requirements in order to stay organized. The app also provides a
              visual representation of applications per month.
            </p>
            <Link to="../register" relative="path">
              <button className="btn btn-hero">Login</button>
            </Link>
          </div>
          <img src={main} alt="job hunt" className="img main-img" />
        </div>
      </Wrapper>
    </>
  );
};

export default Landing;
