import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Post from "./Pages/Post";
import Write from "./Pages/Write";
import About from "./Pages/About";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";

const LayOut = () => {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayOut />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/post/:id",
        element: <Post />
      },

      {
        path: "/write",
        element: <Write />
      },
      {
        path: "/about",
        element: <About />
      }
    ]
  },

  {
    path: "/login",
    element: <Login />
  },

  {
    path: "/register",
    element: <Register />
  }
]);

function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
