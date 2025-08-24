import React from "react";

const Navbar = () => {
  return (
    <div className="w-full h-14 bg-blue-600 flex items-center px-6 shadow-md text-white">
      <h1 className="font-bold text-xl">ZenithCortex</h1>
      <div className="ml-auto flex gap-4">
        <button className="hover:underline">Notifications</button>
        <button className="hover:underline">Profile</button>
      </div>
    </div>
  );
};

export default Navbar;
