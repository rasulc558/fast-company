import React from "react";
import { Redirect, useParams } from "react-router-dom";
import UserPage from "../components/common/page/userPage";
import UsersListPage from "../components/common/page/usersListPage";
import EditUserPage from "../components/common/page/editUserPage";
import { useSelector } from "react-redux";
import { getCurrentUserId } from "../store/users";
import UserLoader from "../components/ui/hoc/usersLoader";

const Users = () => {
  const params = useParams();
  const { userId, edit } = params;
  const currentUserId = useSelector(getCurrentUserId());

  return (
    <>
      <UserLoader>
        {userId ? (
          edit ? (
            currentUserId === userId ? (
              <EditUserPage />
            ) : (
              <Redirect to={`/users/${currentUserId}/edit`} />
            )
          ) : (
            <UserPage userId={userId} />
          )
        ) : (
          <UsersListPage />
        )}
      </UserLoader>
    </>
  );
};

export default Users;
