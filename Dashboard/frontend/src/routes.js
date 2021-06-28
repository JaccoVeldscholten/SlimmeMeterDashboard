import Dashboard from "views/Dashboard.js";
import TableList from "views/TableList.js";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Overzicht",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/table",
    name: "Log Informatie",
    icon: "nc-icon nc-notes",
    component: TableList,
    layout: "/admin",
  },
];

export default dashboardRoutes;
