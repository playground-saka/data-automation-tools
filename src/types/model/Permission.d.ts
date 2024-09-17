declare namespace Model {
  module Permission {
    interface PermissionData {
      id: number
      parentId: number | null
      name: string
      asModule: boolean
      alias: string
      root: string
      rolePermission: RolePermissionData | null,
      children: PermissionData[]
      checked?: boolean
    }

    interface RolePermissionData {
      id: number
      roleId: number
      permissionId: number
    }
  }
}