import NavbarItem from "./navbar-item.model";
import { Authority } from "app/config/authority.constants";

export const Tabs: NavbarItem[] = [
    { name: 'Użytkownicy', route: '/users', icon: 'pi pi-cog', authorities: [Authority.ADMIN, Authority.USERS_ADMINISTRATION] },
    { name: 'Uprawnienia', route: '/authorities', icon: 'pi pi-eye', authorities: [Authority.ADMIN, Authority.USERS_ADMINISTRATION] },
    { name: 'Tygodniowe raporty', route: '/weekly-reports', icon: 'pi pi-calendar-plus', authorities: [Authority.ADMIN, Authority.WEEKLY_REPORTS] },
    { name: 'Ewidencja czasu pracy', route: '/working-time-records', icon: 'pi pi-calendar-plus', authorities: [Authority.ADMIN, Authority.USER] }
];
