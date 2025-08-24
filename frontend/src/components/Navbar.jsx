export default function Navbar({ toggleSidebar }) {
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <button onClick={toggleSidebar} className="text-xl">☰</button>
      <h1 className="font-bold text-xl">Zenith Cortex</h1>
    </nav>
  );
}

