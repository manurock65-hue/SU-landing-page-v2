"use client";

import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { SiteSearch } from "@/components/ui/site-search";
import { cn } from "@/lib/utils";
import {
    DEMO_HREF,
    NAV_MENUS,
    type NavLink,
    type NavMenu,
    type NavSection,
} from "@/lib/nav-data";
import { ChevronDown, Menu, MoveRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Hover underline + arrow adapted from Skiper UI "skiper40" (Link001).
// Attribution: Skiper UI — https://skiper-ui.com (free tier requires credit).
const underlineLink = cn(
    "group/link relative inline-flex w-fit items-center",
    "before:pointer-events-none before:absolute before:left-0 before:top-[1.5em] before:h-px before:w-full before:bg-current before:content-['']",
    "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
    "hover:before:origin-left hover:before:scale-x-100 focus-visible:before:origin-left focus-visible:before:scale-x-100",
    "motion-reduce:before:transition-none",
);

function ArrowUpRight() {
    return (
        <svg
            className="ml-[0.4em] size-[0.55em] shrink-0 translate-y-1 opacity-0 transition-all duration-300 group-hover/link:translate-y-0 group-hover/link:opacity-100 group-focus-visible/link:translate-y-0 group-focus-visible/link:opacity-100 motion-reduce:transition-none"
            fill="none"
            viewBox="0 0 10 10"
            aria-hidden="true"
        >
            <path
                d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function MegaLink({ link }: { link: NavLink }) {
    return (
        <NavigationMenuLink
            href={link.href}
            className={cn(
                underlineLink,
                "text-sm leading-snug text-slate-700 transition-colors hover:text-link focus-visible:text-link focus-visible:outline-none",
            )}
        >
            {link.title}
            <ArrowUpRight />
        </NavigationMenuLink>
    );
}

function SectionHeading({ heading }: { heading: NonNullable<NavSection["heading"]> }) {
    const label = (
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">{heading.title}</span>
    );
    if (!heading.href) {
        return <p className="mb-3 text-slate-400">{label}</p>;
    }
    return (
        <NavigationMenuLink
            href={heading.href}
            className={cn(
                underlineLink,
                "mb-3 text-slate-400 transition-colors hover:text-slate-900 focus-visible:text-slate-900 focus-visible:outline-none",
            )}
        >
            {label}
            <ArrowUpRight />
        </NavigationMenuLink>
    );
}

function MegaPanel({ menu }: { menu: NavMenu }) {
    return (
        <div className="flex gap-2 p-2">
            {/* Feature card */}
            <div className="relative flex w-64 shrink-0 flex-col justify-between overflow-hidden rounded-xl bg-[#060d24] p-6 text-white">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-[#005be2] opacity-50 blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-20 -left-10 size-44 rounded-full bg-cyan-400 opacity-20 blur-3xl"
                />
                <div className="relative">
                    <p className="text-lg font-semibold tracking-tight">{menu.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">{menu.description}</p>
                </div>
                <div className="relative mt-10 flex flex-col items-start gap-3">
                    {menu.overview && (
                        <NavigationMenuLink
                            href={menu.overview.href}
                            className={cn(underlineLink, "text-sm font-medium text-white/85 hover:text-white focus-visible:outline-none")}
                        >
                            {menu.overview.title}
                            <ArrowUpRight />
                        </NavigationMenuLink>
                    )}
                    <Button asChild size="sm" variant="cta" className="rounded-full px-4">
                        <NavigationMenuLink href={DEMO_HREF}>
                            Book a Demo
                            <MoveRight className="ml-2 size-4" />
                        </NavigationMenuLink>
                    </Button>
                </div>
            </div>

            {/* Link columns */}
            <div className="flex gap-10 px-6 py-5">
                {menu.columns.map((column, ci) => (
                    <div key={ci} className="flex w-52 flex-col gap-7">
                        {column.map((section, si) => (
                            <div key={si} className="flex flex-col">
                                {section.heading && <SectionHeading heading={section.heading} />}
                                <ul className="flex flex-col gap-2.5">
                                    {section.links.map((link) => (
                                        <li key={link.title}>
                                            <MegaLink link={link} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

function MobileMenu({ onNavigate }: { onNavigate: () => void }) {
    const [expanded, setExpanded] = useState<string | null>(null);

    return (
        <div className="flex flex-col">
            {NAV_MENUS.map((menu) => {
                const isOpen = expanded === menu.title;
                const panelId = `mobile-${menu.title.toLowerCase()}`;
                return (
                    <div key={menu.title} className="border-b border-slate-100 last:border-0">
                        <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            onClick={() => setExpanded(isOpen ? null : menu.title)}
                            className="flex w-full items-center justify-between px-3 py-4 text-left text-base font-medium text-slate-900"
                        >
                            {menu.title}
                            <ChevronDown
                                className={cn(
                                    "size-4 text-slate-400 transition-transform duration-300 motion-reduce:transition-none",
                                    isOpen && "rotate-180",
                                )}
                            />
                        </button>
                        {isOpen && (
                            <div id={panelId} className="flex flex-col gap-6 px-3 pb-5">
                                {menu.overview && (
                                    <Link href={menu.overview.href} onClick={onNavigate} className="text-sm font-medium text-link">
                                        {menu.overview.title} →
                                    </Link>
                                )}
                                {menu.columns.flat().map((section, si) => (
                                    <div key={si}>
                                        {section.heading && (
                                            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                                                {section.heading.title}
                                            </p>
                                        )}
                                        <ul className="flex flex-col gap-3">
                                            {section.links.map((link) => (
                                                <li key={link.title}>
                                                    <Link
                                                        href={link.href}
                                                        onClick={onNavigate}
                                                        className="flex items-center justify-between text-sm text-slate-600"
                                                    >
                                                        {link.title}
                                                        <MoveRight className="size-4 shrink-0 stroke-1 text-slate-400" />
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function Header1() {
    const [isOpen, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen]);

    return (
        <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
            <div
                className={cn(
                    "relative mx-auto flex h-16 max-w-7xl items-center gap-4 rounded-2xl border px-3 pl-5 backdrop-blur-xl transition-all duration-300 motion-reduce:transition-none",
                    scrolled || isOpen
                        ? "border-slate-200/80 bg-white shadow-lg shadow-slate-900/10"
                        : "border-slate-200/80 bg-white/90 shadow-[0_8px_32px_-12px_rgba(0,91,226,0.25)]",
                )}
            >
                <Link href="/" aria-label="SearchUnify home" className="shrink-0">
                    <Image
                        src="/assets/searchunify-logo.webp"
                        alt="SearchUnify"
                        width={227}
                        height={40}
                        priority
                        className="h-6 w-auto"
                    />
                </Link>

                <NavigationMenu className="static ml-auto hidden lg:flex xl:mx-auto" aria-label="Main">
                    <NavigationMenuList className="gap-1 space-x-0">
                        {NAV_MENUS.map((menu) => (
                            <NavigationMenuItem key={menu.title}>
                                <NavigationMenuTrigger className="h-10 rounded-full bg-transparent px-4 text-[15px] font-medium text-slate-700 hover:bg-slate-900/5 hover:text-slate-900 focus:bg-slate-900/5 focus-visible:ring-2 focus-visible:ring-[#005be2]/40 data-[state=open]:bg-slate-900/5 data-[state=open]:text-slate-900">
                                    {menu.title}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <MegaPanel menu={menu} />
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>

                <div className="ml-auto flex items-center gap-2 lg:ml-0">
                    <SiteSearch />
                    <Button
                        asChild
                        variant="cta"
                        className="group hidden rounded-full px-5 text-[15px] sm:inline-flex"
                    >
                        <Link href={DEMO_HREF}>
                            Book a Demo
                            <MoveRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full lg:hidden"
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isOpen}
                        aria-controls="mobile-nav"
                        onClick={() => setOpen(!isOpen)}
                    >
                        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                    </Button>
                </div>

                {isOpen && (
                    <nav
                        id="mobile-nav"
                        aria-label="Main"
                        className="absolute inset-x-0 top-full mt-2 max-h-[calc(100dvh-6.5rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/15 lg:hidden"
                    >
                        <MobileMenu onNavigate={() => setOpen(false)} />
                        <div className="flex flex-col gap-2 p-3 pt-4">
                            <Button asChild variant="cta" className="w-full rounded-full">
                                <Link href={DEMO_HREF} onClick={() => setOpen(false)}>
                                    Book a Demo
                                </Link>
                            </Button>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}

export { Header1 };
