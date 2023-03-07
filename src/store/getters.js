import employee from "@/store/modules/employee";

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.employee.token,
  name: state => state.employee.name,
  routers: state => state.routers
}
export default getters
