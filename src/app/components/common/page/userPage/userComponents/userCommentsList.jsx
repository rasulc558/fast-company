import React from "react";
import PropTypes from "prop-types";
import SelectField from "../../../form/selectField";
import TextAreaField from "../../../form/textAreaField";

const UserCommentList = ({
  allUsers,
  data,
  handleChange,
  isValid,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="card mb-2">
        <div className="card-body">
          <SelectField
            label="New Comment"
            defaultOption="Выберите пользователя"
            options={allUsers}
            name="selectedUser"
            onChange={handleChange}
            value={data.selectedUser || ""}
          />

          <TextAreaField
            name="comment"
            label="оставьте комментарий"
            onChange={handleChange}
            value={data.comment || ""}
          />

          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isValid()}
            >
              Отправить
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

UserCommentList.propTypes = {
  allUsers: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  data: PropTypes.object,
  handleChange: PropTypes.func,
  isValid: PropTypes.func,
  onSubmit: PropTypes.func
};

export default UserCommentList;
