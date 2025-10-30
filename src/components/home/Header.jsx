export default function Header({ data }) {
  return (
    <header className="flex justify-between items-center p-4">
      <div id="left">
        {/* logo */}
        <img src="https://www.prarang.in/assets/images/logo2x.png" alt="Login" className="w-24 md:w-32" />
      </div>
      <div id="right">
        <button className="theme-btn font-bold py-2 px-4 rounded">
           <i className="fas fa-map mr-2"></i>शहर का नक्शा
        </button>
      </div>
    </header>
  );
}

