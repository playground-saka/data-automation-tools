declare namespace Model {
  module User {
    interface UserData {
      id: number;
      fullName: string;
      username: string;
      email: string;
      password: string;
      isActive: true;
      createdAt: Date;
      updatedAt: Date;
    }
  }
}
