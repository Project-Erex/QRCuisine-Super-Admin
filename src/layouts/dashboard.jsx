import {Routes, Route, useNavigate} from "react-router-dom";
import {Cog6ToothIcon} from "@heroicons/react/24/solid";
import {IconButton} from "@material-tailwind/react";
import {Sidenav, DashboardNavbar, Configurator, Footer} from "@/widgets/layout";
import routes from "@/routes";
import {useMaterialTailwindController, setOpenConfigurator} from "@/context";
import {useEffect, useState} from "react";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const {sidenavType} = controller;

  const navigation = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isLooged = localStorage.getItem("accessToken");
    if (!isLooged) {
      navigation("/auth/sign-in");
    }
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"}
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}>
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        {isLoading ? (
          <div className="flex justify-center w-full items-center h-screen">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <Routes>
            {routes.map(
              ({layout, pages}) =>
                layout === "dashboard" &&
                pages.map(({path, element}) => (
                  <Route exact path={path} element={element} />
                )),
            )}
          </Routes>
        )}
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
