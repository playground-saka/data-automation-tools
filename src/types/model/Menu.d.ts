declare namespace Model {
  module Menu {
    interface MenuData {
      id: number;
      label: string;
      hasDropdown: boolean;
      link: string;
      iconKey?: string;
      notificationCount?: number;
      children?: MenuData[]
    }
  }
}