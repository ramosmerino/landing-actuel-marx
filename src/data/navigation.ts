export interface NavItem {
    label: string;
    href: string;
    dropdown?: NavItem[];
}

export interface FooterNavLink {
    label: string;
    href: string;
    indent?: boolean;
}

export const navItems: NavItem[] = [
    { label: "INICIO", href: "/" },
    { label: "NUMERO ACTUAL", href: "/numero-actual" },
    { label: "NUMEROS ANTERIORES", href: "/numeros-anteriores" },
    { label: "CONVOCATORIAS", href: "/convocatorias" },
    {
        label: "SOBRE LA REVISTA",
        href: "#",
        dropdown: [
            { label: "ACERCA DE LA REVISTA", href: "/acerca-de-la-revista" },
            { label: "COMITÉ EDITORIAL", href: "/comite-editorial" },
            { label: "NORMAS DE PUBLICACIÓN", href: "/normas-de-publicacion" },
        ],
    },
    {
        label: "BLOG",
        href: "#",
        dropdown: [
            { label: "COLUMNAS DE OPINIÓN", href: "/blog/columnas-de-opinion" },
            { label: "SEPARATAS", href: "/blog/separatas" },
            { label: "NOTICIAS Y EVENTOS", href: "/noticias-y-eventos" },
        ],
    },
    { label: "ENCICLOPEDIA", href: "/enciclopedia" },
    { label: "CONTACTANOS", href: "/contactanos" },
];

function flattenNavItemsForFooter(items: NavItem[]): FooterNavLink[] {
    const links: FooterNavLink[] = [];

    for (const item of items) {
        links.push({ label: item.label, href: item.href });

        if (item.dropdown) {
            for (const child of item.dropdown) {
                links.push({
                    label: child.label,
                    href: child.href,
                    indent: true,
                });
            }
        }
    }

    return links;
}

export const footerLinks = flattenNavItemsForFooter(navItems);
