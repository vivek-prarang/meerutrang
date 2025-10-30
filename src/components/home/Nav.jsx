export default function Nav() {
  return (
    <nav className="theme-btn mb-2 p-4 ">
      <ul className="flex space-x-6 justify-center flex-col theme-btn">
        <li>
          <a className="text-white hover:text-gray-200 font-semibold " href="https://www.prarang.in/rampur">
            HOME / होम
          </a>
        </li>
        <li>
          <a className="text-white hover:text-gray-200 font-semibold" href="https://www.prarang.in/rampur/all-posts">
            See All Posts / सभी रंग देखे
          </a>
        </li>
        <li>
          <a target="_blank" className="text-white hover:text-gray-200 font-semibold" href="https://hindi.prarang.in/Rampur">
            District Metrics / जिला मेट्रिक्स
          </a>
        </li>
        <li>
          <a className="text-white hover:text-gray-200 font-semibold" href="https://www.prarang.in/about-us">
            ABOUT US / हमारे बारे में
          </a>
        </li>
      </ul>
    </nav>
  );
}
