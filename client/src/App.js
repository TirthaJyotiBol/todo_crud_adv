import './App.css';
import Home from './pages/Home';
import AllTodo from "../src/components/AllTodo.jsx"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import TodoDetails from './pages/TodoDetails.jsx';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/todos',
      element: <AllTodo />
    },
    {
      path:'/todo/details/:id',
      element:<TodoDetails/>
    }
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
