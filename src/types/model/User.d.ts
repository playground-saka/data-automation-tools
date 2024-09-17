declare namespace Model {
  module User {
    interface UserData {
      id: number;
      fullName: string;
      username: string;
      email: string;
      password: string;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
      role: Model.Role.RoleData[];
    }
  }
}
