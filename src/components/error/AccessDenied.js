const PageNotFound = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '20vh'
      }}>
      <div>
        <h1>403 - Access Denied</h1>
        <p>You do not have enough rights.</p>
      </div>
    </div>
  );
};
export default PageNotFound;
