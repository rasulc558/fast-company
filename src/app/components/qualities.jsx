import React from "react";

const Qualities = ({ userQualities }) => {
  return (
    <td>
      {userQualities.map((item) => (
        <span className={"badge m-1 bg-" + item.color} key={item._id}>
          {item.name}
        </span>
      ))}
    </td>
  );
};

export default Qualities;
