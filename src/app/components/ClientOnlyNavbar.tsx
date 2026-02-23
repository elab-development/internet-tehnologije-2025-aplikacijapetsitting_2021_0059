"use client";

import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("./NavBar"), {
  ssr: false,
  loading: () => <header style={{ height: "68px", borderBottom: "1px solid #ccc", backgroundColor: "white" }} />,
});

export default function ClientOnlyNavbar() {
  return <Navbar />;
}
