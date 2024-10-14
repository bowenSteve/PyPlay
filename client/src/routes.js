import Main from "./components/Main"
import Login from "./components/Login"
import QuestionCard from "./components/QuestionCard";

const routes = [
    {
        path:'/',
        element: <Main />
    },
    {
        path:'/login',
        element: <Login />
    },
    {
        path:"/questioncard/:id",
        element: <QuestionCard />
    }
]

export default routes;