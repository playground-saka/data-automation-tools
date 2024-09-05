'use client'

import React, { useEffect, useState } from 'react'

import { usePathname } from 'next/navigation';

import Link from 'next/link';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  PresentationChartBarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  BellIcon,
  BuildingOffice2Icon,
  ChartBarSquareIcon,
} from "@heroicons/react/24/outline"
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { setLogout } from '@/store/slices/authSlice';

type Props = {}

type MenuItem = {
  id: number;
  label: string;
  icon: JSX.Element;
  hasDropdown?: boolean;
  notificationCount?: number;
  dropdownItems?: { label: string, link: string }[];
  link?: string; // For menu items without dropdown
};

const menuList: MenuItem[] = [
  // {
  //   id: 0,
  //   label: "Notifikasi",
  //   icon: (
  //     <BellIcon className="h-4 w-4 text-zinc-800/80 group-hover:text-zinc-800" />
  //   ),
  //   notificationCount: 14,
  //   link: "/notification",
  // },
  {
    id: 1,
    label: "Dashboard",
    icon: (
      <PresentationChartBarIcon className="h-4 w-4 text-zinc-800/80 group-hover:text-zinc-800" />
    ),
    hasDropdown: false,
    link: "/dashboard",
  },
  {
    id: 2,
    label: "Master",
    icon: (
      <BuildingOffice2Icon className="h-4 w-4 text-zinc-800/80 group-hover:text-zinc-800" />
    ),
    hasDropdown: true,
    dropdownItems: [
      { label: "User", link: "/master/user" },
      { label: "Kategori", link: "/master/kategori" },
      { label: "Pelanggan", link: "/master/pelanggan" },
      { label: "Formula", link: "/master/formula" },
      { label: "Logsheet", link: "/master/logsheet" },
    ],
    link: "/master",
  },
  {
    id: 3,
    label: "Analisis Data",
    icon: (
      <ChartBarSquareIcon className="h-4 w-4 text-zinc-800/80 group-hover:text-zinc-800" />
    ),
    hasDropdown: true,
    dropdownItems: [{ label: "Selisih", link: "/analisis-data/selisih" }],
    link: "/analisis-data",
  },
];

function Index({}: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Automatically open dropdown if the current route is in a dropdown item
    menuList.forEach((item) => {
      if (item.hasDropdown) {
        item.dropdownItems?.forEach((dropdownItem) => {
          if (pathname.includes(dropdownItem.link)) {
            setOpen(item.id);
          }
        });
      }
    });
  }, [pathname]);

  const handleOpen = (value: number) => {
    setOpen(open === value ? null : value);
  };

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
    dispatch(setLogout());
    router.push("/login");
  };


  return (
    <aside className="bg-white min-h-screen h-screen w-full max-w-[18rem] border-r flex flex-col fixed top-0">
      <div className="px-8 py-6 flex flex-row items-center gap-2 pt-12">
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
              <h1 className="text-xs text-stone-800 capitalize">{auth.user?.username}</h1>
              <h1 className="text-xs text-stone-800/70">
                Chief Technology Officer
              </h1>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-center">
          <Button
            onClick={handleLogout}
            type="button"
            size={"default"}
            className="w-[100px] px-4 py-3"
          >
            Keluar
          </Button>
        </div>
      </div>

      <div className="bg-white flex-grow overflow-y-auto px-4 py-4">
        {menuList.map((item) => (
          <div key={item.id}>
            {item.hasDropdown ? (
              <div
                className={`relative w-full flex flex-row gap-2 px-4 py-2.5 items-center justify-between cursor-pointer transition-all ease-in-out hover:bg-gray-100 group ${
                  isActive(item.link, item.dropdownItems) ? "bg-indigo-50" : ""
                }`}
                onClick={() => handleOpen(item.id)}
              >
                {isActive(item.link, item.dropdownItems) && (
                  <span className="absolute -left-0.5 top-1/4 h-1/2 w-1 rounded-full bg-indigo-500"></span>
                )}
                <div className="flex flex-row gap-2 items-center">
                  <div className="mr-2">
                    {React.cloneElement(item.icon, {
                      className: `h-5 w-5 ${
                        isActive(item.link, item.dropdownItems)
                          ? "text-indigo-500 group-hover:text-indigo-500"
                          : "text-zinc-800/70 group-hover:text-zinc-800"
                      }`,
                    })}
                  </div>
                  <p
                    className={`text-sm ${
                      isActive(item.link, item.dropdownItems)
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
                    isActive(item.link, item.dropdownItems)
                      ? "text-indigo-500"
                      : ""
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
                    {React.cloneElement(item.icon, {
                      className: `h-5 w-5 ${
                        isActive(item.link)
                          ? "text-indigo-500 group-hover:text-indigo-500"
                          : "text-zinc-800/70 group-hover:text-zinc-800"
                      }`,
                    })}
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
            {open === item.id && item.dropdownItems && (
              <div className="flex flex-col gap-1">
                {item.dropdownItems.map((dropdownItem, index) => (
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

export default Index