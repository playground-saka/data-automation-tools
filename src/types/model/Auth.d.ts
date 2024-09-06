declare namespace Model {
  module Auth {
    interface User {
      id: number | null;
      username: string;
      fullName: string;
      email: string;
      isActive: boolean;
    }

    interface AuthData {
      user: User;
      token: string;
    }
  }
}