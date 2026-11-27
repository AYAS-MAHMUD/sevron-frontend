import { getDefaultDashboardRoute } from "@/lib/axios/authUtils"
import { getNavItemsByRole } from "@/lib/navItem"
import { getUserInfo } from "@/services/auth.service"
import { NavSection } from "@/types/Dashboard.types"
import DashboardNavbarContent from "./DashboardNavbarContent"


const DashboardNavbar = async () => {
   const userInfo = await getUserInfo()
    const navItems : NavSection[] = getNavItemsByRole(userInfo.role)
  
    const dashboardHome = getDefaultDashboardRoute(userInfo.role)
  return (
    <DashboardNavbarContent userInfo={userInfo} navItems={navItems} dashboardHome={dashboardHome}/>
  )
}

export default DashboardNavbar