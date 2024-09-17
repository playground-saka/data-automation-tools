declare namespace Model {
  module Auth {
    interface User {
      id: number | null;
      username: string;
      fullName: string;
      email: string;
      isActive: boolean;
      role: string;
    }

    interface AuthData {
      user: User;
      token: string;
      permissions: string[];
      menus:Menu.MenuData[]
    }
  }
}