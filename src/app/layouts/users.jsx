import React from "react";
import { Redirect, Switch, useParams } from "react-router-dom";
import UserPage from "../components/common/page/userPage";
import UsersListPage from "../components/common/page/usersListPage";
import EditUserPage from "../components/common/page/editUserPage";
import UserProvider from "../hooks/useUsers";
import { useAuth } from "../hooks/useAuth";

const Users = () => {
  const params = useParams();
  const { userId, edit } = params;
  const { currentUser } = useAuth();

  // http://localhost:3000/users/yhPx8jUDN7c6wWOjxDwd5AL5chm1/edit
  // http://localhost:3000/users/yhPx8jUDN7c6wWOjxDwd5AL5chm1/edit

  return (
    <>
      <UserProvider>
        {userId ? (
          edit ? (
            currentUser._id === userId ? (
              <EditUserPage />
            ) : (
              <Redirect
                to={`/users/${currentUser._id}/edit`}
                component={EditUserPage}
              />
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
