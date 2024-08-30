declare namespace Model {
  module Auth {
    interface User {
      id: number | null;
      username: string;
      email: string;
      isActive: boolean;
    }

    interface AuthData {
      user: User;
      token: string;
    }
  }
}