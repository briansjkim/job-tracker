import { Outlet, Link } from "react-router-dom";
import { Navbar, SmallSidebar, BigSidebar } from "../../components/";
import { useAppContext } from "../../context/appContext";
import Wrapper from "../../assets/style-wrappers/SharedLayout";

const SharedLayout = () => {
  const { user } = useAppContext();

  return (
    <>
      <Wrapper>
        <main className="dashboard">
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className="dashboard-page">
              <Outlet />
            </div>
          </div>
        </main>
      </Wrapper>
    </>
  );
};
export default SharedLayout;
