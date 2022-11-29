import React from "react";
import { useParams } from "react-router-dom";
import UserPage from "../components/common/page/userPage";
import UsersListPage from "../components/common/page/usersListPage";
import EditUserPage from "../components/common/page/editUserPage";

const Users = () => {
  const params = useParams();
  const { userId, edit } = params;
  return (
    <>
      {userId ? (
        edit ? (
          <EditUserPage />
        ) : (
          <UserPage userId={userId} />
        )
      ) : (
        <UsersListPage />
      )}
    </>
  );
};

export default Users;
