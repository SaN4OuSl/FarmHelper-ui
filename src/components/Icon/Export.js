// eslint-disable-next-line react/prop-types
const Export = ({ color, fill }) => {
  return (
    <svg
      fill="#000000"
      y="0px"
      width="16"
      height="16"
      viewBox="0 0 1920 1920"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="m0 1016.081 409.186 409.073 79.85-79.736-272.867-272.979h1136.415V959.611H216.169l272.866-272.866-79.85-79.85L0 1016.082ZM1465.592 305.32l315.445 315.445h-315.445V305.32Zm402.184 242.372-329.224-329.11C1507.042 187.07 1463.334 169 1418.835 169h-743.83v677.647h112.94V281.941h564.706v451.765h451.765v903.53H787.946V1185.47H675.003v564.705h1242.353V667.522c0-44.498-18.07-88.207-49.581-119.83Z"
        fillRule="evenodd"
        fill={fill}
        stroke={color}
      />
    </svg>
  );
};
export default Export;