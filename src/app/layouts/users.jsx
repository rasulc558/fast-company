import React from "react";
import { Redirect, useParams } from "react-router-dom";
import UserPage from "../components/common/page/userPage";
import UsersListPage from "../components/common/page/usersListPage";
import EditUserPage from "../components/common/page/editUserPage";
import UserProvider from "../hooks/useUsers";
import { useAuth } from "../hooks/useAuth";

const Users = () => {
  const params = useParams();
  const { userId, edit } = params;
  const { currentUser } = useAuth();

  return (
    <>
      <UserProvider>
        {userId ? (
          edit ? (
            currentUser._id === userId ? (
              <EditUserPage />
            ) : (
              <Redirect to={`/users/${currentUser._id}/edit`} />
            )
          ) : (
            <UserPage userId={userId} />
          )
        ) : (
          <UsersListPage />
        )}
      </UserProvider>
    </>
  );
};

export default Users;
