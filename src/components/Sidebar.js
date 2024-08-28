// import React, { useState, useContext, useEffect } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
// import HamburgerButton from './HamburgerMenuButton/HamburgerButton';
// import { GoHome } from 'react-icons/go';
// import { MdAccountBalance } from "react-icons/md";
// import { TbMoneybag } from "react-icons/tb";

// import { LuCalendarMinus } from 'react-icons/lu';
// import { BiSolidUserDetail } from "react-icons/bi";
// import { FaAngleRight } from "react-icons/fa6";
// import { MdOutlinePeopleAlt } from "react-icons/md";
// import ThemeToggle from './ThemeToggle';
// import { ThemeContext } from './ThemeContext';

// const Sidebar = () => {
//   const [open, setOpen] = useState(true);
//   const [mobileMenu, setMobileMenu] = useState(false);
//   const [activeMenu, setActiveMenu] = useState(null); // Subcategories are collapsed by default
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { theme } = useContext(ThemeContext);

//   const Menus = [
//     { title: 'Draw Winner', path: '/', src: <GoHome size={25} /> },
//     {
//       title: 'Subscription',
//       path: '#',
//       src: <MdOutlinePeopleAlt size={25} />,
//       hasSubcategories: true,
//     },
//     {
//       title: 'Contest Detail',
//       path: '#',
//       src: <BiSolidUserDetail size={25} />,
//       hasSubcategories: true,
//     },
//     { title: 'UnSubscription', path: '/unsub', src: <LuCalendarMinus size={25} /> },
//     { title: 'Revenue', path: '/revenue', src: <TbMoneybag  size={25} /> },
//     // { title: 'Count', path: '/getcount', src: <MdAccountBalance  size={25} /> },


//   ];

//   const Subcategories = [
//     { title: 'Status', path: '/subscription/status' },
//     { title: 'SubDate', path: '/subscription/subdatetime' },
//     { title: 'By Msisdn', path: '/subscription/msisdn' },
//   ];

//   const SubcategoriesContest = [
//     { title: 'Ticket Id', path: '/contest/ticket' },
//     { title: 'By Date', path: '/contest' },
//   ];

//   const handleSubcategoryClick = (path) => {
//     navigate(path);

//     // Do not hide the subcategories after navigation
//     // Hide the submenu only on smaller screens (e.g., mobile)
//     if (window.innerWidth < 1024) {
//       setActiveMenu(null);
//       setMobileMenu(false);
//     }
//   };

//   // Load the last active menu from localStorage
//   useEffect(() => {
//     const savedActiveMenu = localStorage.getItem('activeMenu');
//     if (savedActiveMenu !== null) {
//       setActiveMenu(parseInt(savedActiveMenu, 10));
//     }
//   }, []);

//   // Save the activeMenu to localStorage whenever it changes
//   useEffect(() => {
//     if (activeMenu !== null) {
//       localStorage.setItem('activeMenu', activeMenu);
//     } else {
//       localStorage.removeItem('activeMenu');
//     }
//   }, [activeMenu]);

//   return (
//     <>
//       {/* Desktop Sidebar */}
//       <div
//         className={`fixed top-0 left-0 h-screen p-3 shadow duration-300 overflow-y-auto w-60 hidden lg:block ${
//           theme === 'dark' ? 'bg-black shadow-gray-700' : 'bg-sky-600'
//         } ${theme === 'dark' ? 'text-white' : 'text-white'}`}
//       >
//         <div className='flex justify-end'>
//           <ThemeToggle />
//         </div>
//         <div className={`flex ${open && 'gap-x-4'} justify-center items-center mt-8`}>
//           {open && (
//             <span className='text-xl lg:text-[24px] font-serif whitespace-nowrap font'>
//               Dashboard
//             </span>
//           )}
//         </div>
//         <ul className='pt-3'>
//           {Menus.map((menu, index) => (
//             <React.Fragment key={index}>
//               <li
//                 className={`group flex items-center justify-between gap-x-6 p-2 rounded-lg cursor-pointer hover:bg-white hover:text-black ${
//                   location.pathname === menu.path && 'bg-black/10'
//                 }`}
//               >
//                 <Link to={menu.path} className='flex items-center w-full'>
//                   <div className='flex items-center'>
//                     <span className='text-2xl group-hover:text-black'>{menu.src}</span>
//                     <span
//                       className={`ml-2 ${!open && 'hidden'} origin-left duration-300 group-hover:text-black`}
//                     >
//                       {menu.title}
//                     </span>
//                   </div>
//                 </Link>
//                 {menu.hasSubcategories && (
//                   <span className='text-xl group-hover:text-black' onClick={() => setActiveMenu(activeMenu === index ? null : index)}>
//                     {activeMenu === index ? <BsChevronUp /> : <BsChevronDown />}
//                   </span>
//                 )}
//               </li>
//               {menu.hasSubcategories && activeMenu === index && (
//                 <ul className={`pl-6`}>
//                   {(menu.title === 'Contest Detail' ? SubcategoriesContest : Subcategories).map((subcategory, subIndex) => (
//                     <li
//                       key={subIndex}
//                       className={`group flex items-center p-2 rounded-lg cursor-pointer hover:bg-white hover:text-black ${
//                         location.pathname === subcategory.path && 'bg-black/10'
//                       }`}
//                       onClick={() => handleSubcategoryClick(subcategory.path)}
//                     >
//                       <span className='text-lg group-hover:text-black'>
//                         <FaAngleRight />
//                       </span>
//                       <span
//                         className={`ml-2 ${!open && 'hidden'} origin-left duration-300 group-hover:text-black`}
//                       >
//                         {subcategory.title}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </React.Fragment>
//           ))}
//         </ul>
//       </div>

//       {/* Mobile/Medium Screen Menu */}
//       <div className='pt-3 lg:hidden'>
//         <HamburgerButton setMobileMenu={setMobileMenu} mobileMenu={mobileMenu} />
//       </div>

//       <div
//         className={`lg:hidden text-xl ${
//           mobileMenu ? 'flex' : 'hidden'
//         } h-screen w-[340px] absolute z-50 flex-col items-start self-start py-8 mt-16 space-y-6 font-bold sm:w-auto left-0 right-6 ${
//           theme === 'dark' ? 'bg-black' : 'bg-sky-600'
//         } ${theme === 'dark' ? 'text-white' : 'text-white'} drop-shadow-md rounded-b-xl`}
//       >
//         {Menus.map((menu, index) => (
//           <React.Fragment key={index}>
//             <div className='w-full px-2'>
//               <div
//                 className={`${
//                   location.pathname === menu.path ? 'bg-gray-900' : ''
//                 } p-4 rounded-xl hover:bg-gray-900 flex items-center justify-between`}
//               >
//                 <Link to={menu.path} className='flex items-center w-full'>
//                   <span className='flex items-center'>
//                     {menu.src}
//                     <span className='ml-2'>{menu.title}</span>
//                   </span>
//                 </Link>
//                 {menu.hasSubcategories && (
//                   <button
//                     className='text-xl'
//                     onClick={(e) => {
//                       e.stopPropagation(); // Prevent event from bubbling
//                       setActiveMenu(activeMenu === index ? null : index);
//                     }}
//                   >
//                     {activeMenu === index ? <BsChevronUp /> : <BsChevronDown />}
//                   </button>
//                 )}
//               </div>
//               {menu.hasSubcategories && activeMenu === index && (
//                 <ul className='pl-6'>
//                   {(menu.title === 'Contest Detail' ? SubcategoriesContest : Subcategories).map((subcategory, subIndex) => (
//                     <li
//                       key={subIndex}
//                       className={`group flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-900 ${
//                         location.pathname === subcategory.path ? 'bg-gray-900' : ''
//                       }`}
//                       onClick={() => handleSubcategoryClick(subcategory.path)}
//                     >
//                       <span className='text-lg group-hover:text-black'>
//                         <FaAngleRight />
//                       </span>
//                       <span className='ml-2'>{subcategory.title}</span>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </React.Fragment>
//         ))}
//       </div>
//     </>
//   );
// };

// export default Sidebar;


import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BsChevronDown, BsChevronUp, BsChevronRight } from 'react-icons/bs'; // Import BsChevronRight here
import HamburgerButton from './HamburgerMenuButton/HamburgerButton';
import { GoHome } from 'react-icons/go';
import { MdAccountBalance } from "react-icons/md";
import { TbMoneybag } from "react-icons/tb";
import { LuCalendarMinus } from 'react-icons/lu';
import { BiSolidUserDetail } from "react-icons/bi";
import { FaAngleRight } from "react-icons/fa6";
import { MdOutlinePeopleAlt } from "react-icons/md";
import ThemeToggle from './ThemeToggle';
import { ThemeContext } from './ThemeContext';

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // Subcategories are collapsed by default
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const Menus = [
    { title: 'Draw Winner', path: '/', src: <GoHome size={25} /> },
    {
      title: 'Subscription',
      path: '#',
      src: <MdOutlinePeopleAlt size={25} />,
      hasSubcategories: true,
    },
    {
      title: 'Contest Detail',
      path: '#',
      src: <BiSolidUserDetail size={25} />,
      hasSubcategories: true,
    },
    { title: 'UnSubscription', path: '/unsub', src: <LuCalendarMinus size={25} /> },
    { title: 'Revenue', path: '/revenue', src: <TbMoneybag size={25} /> },
  ];

  const Subcategories = [
    { title: 'Status', path: '/subscription/status' },
    { title: 'SubDate', path: '/subscription/subdatetime' },
    { title: 'By Msisdn', path: '/subscription/msisdn' },
  ];

  const SubcategoriesContest = [
    { title: 'Ticket Id', path: '/contest/ticket' },
    { title: 'By Date', path: '/contest' },
  ];

  const handleMenuClick = (index) => {
    if (activeMenu === index) {
      setActiveMenu(null); // Collapse if clicking the same menu
    } else {
      setActiveMenu(index); // Expand the clicked menu
    }
  };

  const handleSubcategoryClick = (path) => {
    navigate(path);
    // Hide the submenu only on smaller screens (e.g., mobile)
    if (window.innerWidth < 1024) {
      setMobileMenu(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    // Hide the submenu only on smaller screens (e.g., mobile)
    if (window.innerWidth < 1024) {
      setMobileMenu(false);
    }
  };

  // Load the last active menu from localStorage
  useEffect(() => {
    const savedActiveMenu = localStorage.getItem('activeMenu');
    if (savedActiveMenu !== null) {
      setActiveMenu(parseInt(savedActiveMenu, 10));
    }
  }, []);

  // Save the activeMenu to localStorage whenever it changes
  useEffect(() => {
    if (activeMenu !== null) {
      localStorage.setItem('activeMenu', activeMenu);
    } else {
      localStorage.removeItem('activeMenu');
    }
  }, [activeMenu]);

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen p-3 shadow duration-300 overflow-y-auto w-60 hidden lg:block ${
          theme === 'dark' ? 'bg-black shadow-gray-700' : 'bg-sky-600'
        } ${theme === 'dark' ? 'text-white' : 'text-white'}`}
      >
        <div className='flex justify-end'>
          <ThemeToggle />
        </div>
        <div className={`flex ${open && 'gap-x-4'} justify-center items-center mt-8`}>
          {open && (
            <span className='text-xl lg:text-[24px] font-serif whitespace-nowrap font'>
              Dashboard
            </span>
          )}
        </div>
        <ul className='pt-3'>
          {Menus.map((menu, index) => (
            <React.Fragment key={index}>
              <li
                className={`group flex items-center justify-between gap-x-6 p-2 rounded-lg cursor-pointer hover:bg-white hover:text-black ${
                  location.pathname === menu.path && 'bg-black/10'
                }`}
                onClick={() => menu.hasSubcategories ? handleMenuClick(index) : handleNavigation(menu.path)}
              >
                <div className='flex items-center w-full'>
                  <div className='flex items-center'>
                    <span className='text-2xl group-hover:text-black'>{menu.src}</span>
                    <span
                      className={`ml-2 ${!open && 'hidden'} origin-left duration-300 group-hover:text-black`}
                    >
                      {menu.title}
                    </span>
                  </div>
                </div>
                {menu.hasSubcategories && (
                  <span className='text-xl group-hover:text-black' onClick={() => handleMenuClick(index)}>
                    {activeMenu === index ? <BsChevronUp /> : <BsChevronDown />}
                  </span>
                )}
                {!menu.hasSubcategories && (
                  <Link to={menu.path} className='text-xl group-hover:text-black'>
                    {/* No arrow for these menu items */}
                  </Link>
                )}
              </li>
              {menu.hasSubcategories && activeMenu === index && (
                <ul className={`pl-6`}>
                  {(menu.title === 'Contest Detail' ? SubcategoriesContest : Subcategories).map((subcategory, subIndex) => (
                    <li
                      key={subIndex}
                      className={`group flex items-center p-2 rounded-lg cursor-pointer hover:bg-white hover:text-black ${
                        location.pathname === subcategory.path && 'bg-black/10'
                      }`}
                      onClick={() => handleSubcategoryClick(subcategory.path)}
                    >
                      <span className='text-lg group-hover:text-black'>
                        <FaAngleRight />
                      </span>
                      <span
                        className={`ml-2 ${!open && 'hidden'} origin-left duration-300 group-hover:text-black`}
                      >
                        {subcategory.title}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>

      {/* Mobile/Medium Screen Menu */}
      <div className='pt-3 lg:hidden'>
        <HamburgerButton setMobileMenu={setMobileMenu} mobileMenu={mobileMenu} />
      </div>

      <div
        className={`lg:hidden text-xl ${
          mobileMenu ? 'flex' : 'hidden'
        } h-screen w-[340px] absolute z-50 flex-col items-start self-start py-8 mt-16 space-y-6 font-bold sm:w-auto left-0 right-6 ${
          theme === 'dark' ? 'bg-black' : 'bg-sky-600'
        } ${theme === 'dark' ? 'text-white' : 'text-white'} drop-shadow-md rounded-b-xl`}
      >
        {Menus.map((menu, index) => (
          <React.Fragment key={index}>
            <div className='w-full px-2'>
              <div
                className={`${
                  location.pathname === menu.path ? 'bg-gray-900' : ''
                } p-4 rounded-xl hover:bg-gray-900 flex items-center justify-between`}
                onClick={() => menu.hasSubcategories ? handleMenuClick(index) : handleNavigation(menu.path)}
              >
                <div className='flex items-center w-full'>
                  <span className='flex items-center'>
                    {menu.src}
                    <span className='ml-2'>{menu.title}</span>
                  </span>
                </div>
                {menu.hasSubcategories && (
                  <button
                    className='text-xl'
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event from bubbling
                      handleMenuClick(index);
                    }}
                  >
                    {activeMenu === index ? <BsChevronUp /> : <BsChevronDown />}
                  </button>
                )}
                {!menu.hasSubcategories && (
                  <Link to={menu.path} className='text-xl'>
                    {/* No arrow for these menu items */}
                  </Link>
                )}
              </div>
              {menu.hasSubcategories && activeMenu === index && (
                <ul className='pl-6'>
                  {(menu.title === 'Contest Detail' ? SubcategoriesContest : Subcategories).map((subcategory, subIndex) => (
                    <li
                      key={subIndex}
                      className={`group flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-900 ${
                        location.pathname === subcategory.path && 'bg-black/10'
                      }`}
                      onClick={() => handleSubcategoryClick(subcategory.path)}
                    >
                      <span className='text-lg'>
                        <FaAngleRight />
                      </span>
                      <span className='ml-2'>{subcategory.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
