import { BrowserRouter, HashRouter } from "react-router-dom";
import Providers from "./app/providers";
import Router from "./app/router";
import { getRouterBasename, IS_DEMO_MODE } from "./shared/config";

export default function App() {
  const RouterProvider = IS_DEMO_MODE ? HashRouter : BrowserRouter;
  const basename = IS_DEMO_MODE ? undefined : getRouterBasename();

  return (
    <RouterProvider basename={basename}>
      <Providers>
        <Router />
      </Providers>
    </RouterProvider>
  );
}
