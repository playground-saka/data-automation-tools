"use client";

import React, { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

import Link from "next/link";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { LogOut, ChevronDown } from "lucide-react";

import {
  PresentationChartBarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  BuildingOffice2Icon,
  ChartBarSquareIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { logout } from "@/store/slices/authSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings2Icon } from 'lucide-react';
import { toTitleCase } from "@/utils/formatter";

type Props = {};


function Index({}: Props) {

  const renderIcon = (iconKey: string) => {
    const iconMapping: Record<string, JSX.Element> = {
      PresentationChartBarIcon: (
        <PresentationChartBarIcon className="h-4 w-4 text-zinc-800/80 group-hover:text-zinc-800" />
      ),
      ChartBarSquareIcon: (
        <ChartBarSquareIcon className="h-4 w-4 text-zinc-800/80 group-hover:text-zinc-800" />
      ),
      BuildingOffice2Icon: (
        <BuildingOffice2Icon className="h-4 w-4 text-zinc-800/80 group-hover:text-zinc-800" />
      ),
      Cog6ToothIcon: (
        <Cog6ToothIcon className="h-4 w-4 text-zinc-800/80 group-hover:text-zinc-800" />
      ),
    };
    return iconMapping[iconKey] || null;
  };

  const [menuList, setMenuList] = useState<Model.Menu.MenuData[]>([
    {
      id: 9999,
      label: "Dashboard",
      iconKey: "PresentationChartBarIcon",
      hasDropdown: false,
      link: "/dashboard",
    },
  ]);
  const [open, setOpen] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const menus = localStorage.getItem("menus");
    if (menus) {
      const parsedMenus = JSON.parse(menus) as Model.Menu.MenuData[];
      setMenuList((prevState) => [...prevState, ...parsedMenus]);
    }
  }, []);

  useEffect(() => {
    // Automatically open dropdown if the current route is in a dropdown item
    menuList.forEach((item) => {
      if (item.hasDropdown) {
        item.children?.forEach((dropdownItem) => {
          if (pathname.includes(dropdownItem.link)) {
            setOpen(item.id);
          }
        });
      }
    });
  }, [menuList, pathname]);

  const handleOpen = (value: number) => {
    setOpen(open === value ? null : value);
  };

  const [loading, setLoading] = useState(false);

  const isActive = (link?: string, dropdownItems?: { link: string }[]) => {
    if (link && pathname.startsWith(link)) {
      return true;
    }
    if (dropdownItems) {
      return dropdownItems.some((item) => pathname === item.link);
    }
    return false;
  };
  const auth = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    await dispatch(logout()).then(() => {
      router.push("/login");
    }).catch((error) => {
      
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <aside className="bg-white min-h-screen h-screen w-full max-w-[18rem] border-r flex flex-col fixed top-0">
      <div className="px-8 py-6 flex flex-row items-center gap-2 pt-12">
        <Image src="/images/logo.png" alt="Daman" width={80} height={60} />
        <h1 className="text-2xl font-bold">
          Daman.<span className="text-xs text-stone-800/30">V1.0.0</span>
        </h1>
      </div>
      <div className="flex flex-col border-y bg-gray-100 border-inigo-800/10">
        <div className="flex flex-row justify-between items-center px-4">
          <div className="flex flex-row items-center gap-4 px-4 py-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h1 className="text-xs text-stone-800 capitalize">
                {auth.user?.fullName}
              </h1>
              <h1 className='text-xs text-stone-800/70'>
                { auth.user?.role ? toTitleCase(auth.user.role) : '' }
                {/* Chief Technology Officer */}
              </h1>
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <ChevronDown className="mr-2 h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex items-center justify-center">
                    <Button
                      className="justify-center"
                      size={"sm"}
                      variant="ghost"
                      disabled={loading}
                      isLoading={loading}
                      onClick={handleLogout}
                      type="button"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Keluar
                    </Button>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="bg-white flex-grow overflow-y-auto px-4 py-4">
        {menuList.map((item) => (
          <div key={item.id}>
            {item.hasDropdown ? (
              <div
                className={`relative w-full flex flex-row gap-2 px-4 py-2.5 items-center justify-between cursor-pointer transition-all ease-in-out hover:bg-gray-100 group ${
                  isActive(item.link, item.children) ? "bg-indigo-50" : ""
                }`}
                onClick={() => handleOpen(item.id)}
              >
                {isActive(item.link, item.children) && (
                  <span className="absolute -left-0.5 top-1/4 h-1/2 w-1 rounded-full bg-indigo-500"></span>
                )}
                <div className="flex flex-row gap-2 items-center">
                  <div className="mr-2">
                    {item.iconKey
                      ? React.cloneElement(renderIcon(item.iconKey), {
                          className: `h-5 w-5 ${
                            isActive(item.link, item.children)
                              ? "text-indigo-500 group-hover:text-indigo-500"
                              : "text-zinc-800/70 group-hover:text-zinc-800"
                          }`,
                        })
                      : null}
                  </div>
                  <p
                    className={`text-sm ${
                      isActive(item.link, item.children)
                        ? "text-indigo-500 group-hover:text-indigo-500"
                        : "text-zinc-800/70 group-hover:text-zinc-800"
                    }`}
                  >
                    {item.label}
                  </p>
                </div>
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`h-4 w-4 transition-transform ${
                    open === item.id ? "rotate-180" : ""
                  } ${
                    isActive(item.link, item.children) ? "text-indigo-500" : ""
                  }`}
                />
                {item.notificationCount && (
                  <div className="px-2 py-0.5 bg-gray-300 rounded-xl ml-2">
                    <p className="text-xs">{item.notificationCount}</p>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.link!}
                className={`relative w-full flex flex-row gap-2 px-4 py-2.5 items-center justify-between cursor-pointer transition-all ease-in-out hover:bg-gray-100 group ${
                  isActive(item.link) ? "bg-indigo-50" : ""
                }`}
              >
                {isActive(item.link) && (
                  <span className="absolute -left-0.5 top-1/4 h-1/2 w-1 rounded-full bg-indigo-500"></span>
                )}
                <div className="flex flex-row gap-2 items-center">
                  <div className="mr-2">
                    {item.iconKey
                      ? React.cloneElement(renderIcon(item.iconKey), {
                          className: `h-5 w-5 ${
                            isActive(item.link)
                              ? "text-indigo-500 group-hover:text-indigo-500"
                              : "text-zinc-800/70 group-hover:text-zinc-800"
                          }`,
                        })
                      : null}
                  </div>
                  <p
                    className={`text-sm ${
                      isActive(item.link)
                        ? "text-indigo-500 group-hover:text-indigo-500"
                        : "text-zinc-800/70 group-hover:text-zinc-800"
                    }`}
                  >
                    {item.label}
                  </p>
                </div>
                {item.notificationCount && (
                  <div className="px-2 py-0.5 bg-gray-300 rounded-xl ml-2">
                    <p className="text-xs">{item.notificationCount}</p>
                  </div>
                )}
              </Link>
            )}

            {/* Dropdown Items */}
            {open === item.id && item.children && (
              <div className="flex flex-col gap-1">
                {item.children.map((dropdownItem, index) => (
                  <Link key={`${item.id}-${index}`} href={dropdownItem.link}>
                    <div
                      className={`w-full flex flex-row items-center justify-between gap-2 px-4 py-2.5 cursor-pointer transition-all ease-in-out hover:bg-gray-100 group ${
                        isActive(dropdownItem.link) ? "font-bold" : ""
                      }`}
                    >
                      <div className="pl-6 flex flex-row gap-2 items-center">
                        <ChevronRightIcon className="h-3 w-3 text-zinc-800/70 group-hover:text-zinc-800" />
                        <p className="text-sm text-zinc-800/70 cursor-pointer group-hover:text-zinc-800">
                          {dropdownItem.label}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Index;
