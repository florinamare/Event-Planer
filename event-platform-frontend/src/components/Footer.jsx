import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#1D5C5F] text-white py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <img src="/logo.png" alt="Logo" className="w-32 mb-3" />
          <h1 className="text-lg font-bold">Eventfy</h1>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Navigare</h2>
          <ul className="space-y-1">
            <li><Link to="/" className="hover:text-[#C89459]">Home</Link></li>
            <li><Link to="/events" className="hover:text-[#C89459]">Evenimente</Link></li>
            <li><Link to="/map" className="hover:text-[#C89459]">Harta</Link></li>
            <li><Link to="/auth" className="hover:text-[#C89459]">Autentificare</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Link-uri utile</h2>
          <ul className="space-y-1">
            <li><a href="#about" className="hover:text-[#C89459]">Despre</a></li>
            <li><a href="#contact" className="hover:text-[#C89459]">Contact</a></li>
            <li><a href="#terms" className="hover:text-[#C89459]">Termeni și condiții</a></li>
          </ul>
        </div>

        <div>
  <h2 className="font-semibold mb-2">Urmărește-ne</h2>
  <div className="flex space-x-4">
    <a href="#" className="hover:text-[#C89459]" aria-label="Facebook">
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3H14v7A10 10 0 0022 12z" />
      </svg>
    </a>
    <a href="#" className="hover:text-[#C89459]" aria-label="Instagram">
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h10zm-5 3.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 1.5a3 3 0 110 6 3 3 0 010-6zm4.5-.9a1.1 1.1 0 100 2.2 1.1 1.1 0 000-2.2z" />
      </svg>
    </a>
    <a href="#" className="hover:text-[#C89459]" aria-label="LinkedIn">
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M4.98 3.5C4.98 4.9 3.9 6 2.5 6S0 4.9 0 3.5 1.1 1 2.5 1 5 2.1 5 3.5zM.5 8h4V24h-4V8zm7.5 0h3.7v2.2h.1c.5-1 1.7-2.2 3.5-2.2 3.8 0 4.5 2.5 4.5 5.7V24h-4v-8.3c0-2-.1-4.6-2.8-4.6s-3.2 2.2-3.2 4.5V24h-4V8z" />
      </svg>
    </a>
  </div>
</div>

      </div>

      <div className="text-center mt-6 text-sm text-gray-300">
        © 2025 Eventfy. Toate drepturile rezervate.
      </div>
    </footer>
  );
};

export default Footer;
