import Main from "./components/Main"
import Login from "./components/Login"
import QuestionCard from "./components/QuestionCard";
import Score from "./components/Score";
import Register from "./components/Register";

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
        path: '/register',
        element: <Register />

    },
    {
        path:"/questioncard/:id",
        element: <QuestionCard />
    },
    {
        path:"/score",
        element:<Score />
    }
]

export default routes;