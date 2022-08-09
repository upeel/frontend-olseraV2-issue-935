import { asyncRouterMap, constantRouterMap } from '@/routes'

/**
 * @param role.role_id
 * @param route
 */
function hasPermission(role, route) {
  if (route.meta && route.meta.roles_except) {
    // console.log(!route.meta.roles_except.includes(role.role_id), role.role_id)
    if('store_age_month' in route.meta){
      var satuHari = 24*60*60*1000;
      var tgl1 = new Date(role.store_used);
      var tgl2 = new Date();
      var selisihTgl = Math.round(Math.round((tgl2.getTime() - tgl1.getTime()) / (satuHari)));
      return selisihTgl > ((route.meta.store_age_month/12)*365) ? true  : false
    }else{
      return !route.meta.roles_except.includes(role.role_id)
    }
  } else {
    return true
  }
}

/**
 * @param routes asyncRouterMap
 * @param role
 */
function filterAsyncRouter(routes, role) {
  // console.log(role)
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    const userPassed = hasPermission(role, tmp)
    if (userPassed) {
      if (tmp.children && userPassed) {
        tmp.children = filterAsyncRouter(tmp.children, role)
      }
      res.push(tmp)
    }
  })

  return res
}

const routesByPermission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, role) {
      return new Promise(resolve => {
        const accessedRouters = filterAsyncRouter(asyncRouterMap, role)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default routesByPermission
