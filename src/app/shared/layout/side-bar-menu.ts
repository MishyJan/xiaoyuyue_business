export class SideBarMenu {
    name = '';
    displayName = '';
    items: SideBarMenuItem[];

    constructor(name: string, displayName: string, items: SideBarMenuItem[]) {
        this.name = name;
        this.displayName = displayName;
        this.items = items;
    }
}

export class SideBarMenuItem {
    name = '';
    permissionName = '';
    icon = '';
    route = '';
    items: SideBarMenuItem[];

    constructor(name: string, permissionName: string, icon: string, route: string, items?: SideBarMenuItem[]) {
        this.name = name;
        this.permissionName = permissionName;
        this.icon = icon;
        this.route = route;

        if (items === undefined) {
            this.items = [];
        } else {
            this.items = items;
        }
    }
}