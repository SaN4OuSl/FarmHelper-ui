import GoBackButton from '../Buttons/GoBackButton/GoBackButton';

const PageNotFound = () => {
  const onMouseClick = () => {
    window.location.href = '/';
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '20vh'
      }}>
      <div>
        <h1>404 - Page Not Found</h1>
        <p>The requested page could not be found.</p>
        <GoBackButton onClick={onMouseClick} />
      </div>
    </div>
  );
};
export default PageNotFound;
