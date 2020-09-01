import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {CreateUserPage} from './pages/admin/CreateUserPage'
import {SettingsPage} from './pages/admin/SettingsPage'
import {EditUserPage} from './pages/admin/EditUserPage'
import {AuthPage} from './pages/AuthPage'
import {ClientsListPage} from './pages/admin/ClientsListPage'
import {HomePage} from "./pages/client/HomePage";
import {useAuth} from "./hooks/auth.hook";

export const useRoutes = (isAuthenticated) => {
  const {userRole} = useAuth()

  if (isAuthenticated && userRole === 'admin') {
    return (
      <Switch>
        <Route path="/" exact>
          <ClientsListPage />
        </Route>
        <Route path="/settings" exact>
          <SettingsPage />
        </Route>
        <Route path="/create" exact>
          <CreateUserPage />
        </Route>
        <Route path="/edit/:id">
          <EditUserPage />
        </Route>
        <Redirect to="/CreateUserPage" />
      </Switch>
    )
  }

  if(isAuthenticated && userRole === 'client') {
    return (
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Redirect to="/" />
      </Switch>
    )
  }

  return (
    <Switch>
      <Route path="/" exact>
        <AuthPage />
      </Route>
      <Redirect to="/" />
    </Switch>
  )
}
