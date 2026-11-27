import { getDefaultDashboardRoute } from "@/lib/axios/authUtils"
import { getNavItemsByRole } from "@/lib/navItem"
import { getUserInfo } from "@/services/auth.service"
import { NavSection } from "@/types/Dashboard.types"
import DashboardSidebarContent from "./DashboradSidebarContent"


const DashboardSidebar = async () => {
  const userInfo = await getUserInfo()
  const navItems : NavSection[] = getNavItemsByRole(userInfo.role)

  const dashboardHome = getDefaultDashboardRoute(userInfo.role)

  
  return (
    <DashboardSidebarContent userInfo={userInfo} navItems={navItems} dashboardHome={dashboardHome}/>
  )
}

export default DashboardSidebar