import Main from "./components/Main"
import Login from "./components/Login"

const routes = [
    {
        path:'/',
        element: <Main />
    },
    {
        path:'/login',
        element: <Login />
    }
]

export default routes;