import Main from "./components/Main"
import Login from "./components/Login"
import QuestionCard from "./components/QuestionCard";
import Score from "./components/Score";

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
    },
    {
        path:"/score",
        element:<Score />
    }
]

export default routes;