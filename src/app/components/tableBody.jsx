import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Link } from "react-router-dom";

const TableBody = ({ data, columns }) => {
  const renderContent = (item, colomn) => {
    if (columns[colomn].component) {
      const component = columns[colomn].component;
      if (typeof component === "function") {
        return component(item);
      }
      return component;
    } else if (columns[colomn].path === "name") {
      return (
        <Link to={`/users/${item._id}`}>
          {_.get(item, columns[colomn].path)}
        </Link>
      );
    } else {
      return _.get(item, columns[colomn].path);
    }
  };

  return (
    <tbody>
      {data.map((item) => (
        <tr key={item._id}>
          {Object.keys(columns).map((colomn) => (
            <td key={colomn}>{renderContent(item, colomn)}</td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

TableBody.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.object.isRequired
};

export default TableBody;
