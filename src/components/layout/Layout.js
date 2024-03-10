import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
import Main from '../main/Main';
import './layout.css';

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="main__container">
        <Sidebar />
        <Main>{children}</Main>
      </div>
    </>
  );
};
export default Layout;
