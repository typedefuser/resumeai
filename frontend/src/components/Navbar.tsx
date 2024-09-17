// Navbar.tsx

const Navbar = (): JSX.Element => {
    
  const navItems = [
    { name: 'Home', href: '#home' }
  ];
  
  return (
    <nav className="bg-black bg-opacity-80 rounded-xl backdrop-blur-md p-4 fixed top-1 w-full z-10 shadow">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-xl font-bold">
          <a href="/">MyLogo</a>
        </div>
        
        {/* Navigation Links */}    
        <ul className="flex space-x-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <a 
                href={item.href} 
                className="text-white backdrop-blur-2xl bg-zinc-950 z-10 rounded-2xl p-2"
              >
                <span>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
