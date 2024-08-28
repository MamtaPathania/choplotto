

// import React, { useState, useEffect } from "react";
// import Layout from "../../components/Layout";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import axios from "axios";
// import { TreeTable } from "primereact/treetable";
// import { Column } from "primereact/column";
// import { Dropdown } from "primereact/dropdown";
// import "primereact/resources/themes/saga-blue/theme.css";
// import "primereact/resources/primereact.min.css"; 
// import "primeicons/primeicons.css"; 
// import * as XLSX from "xlsx";
// import Cookies from 'js-cookie'
// import { useNavigate } from "react-router-dom";
// import { revenueApi, getCountApi } from "../../Data/api";
// import  Lottie  from 'lottie-react';
// import loaderAnimation from '../../assets/images/loader (2).json'; 

// const formatDate = (date) => {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// };

// const Revenue = () => {
//   const [nodes, setNodes] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
//   const [rows, setRows] = useState(5);
//   const [activeTab, setActiveTab] = useState("revenue"); 
//   const [loading, setLoading] = useState(false); 
//   const [length,setLength]=useState('')

//   const navigate = useNavigate();
//   const username = Cookies.get('username');

//   const checkUser = () => {
//     if (!username) {
//       navigate('/login');
//     }
//   }

//   useEffect(() => {
//     fetchData(selectedDate, activeTab);
//     checkUser();
//   }, [activeTab]);

//   const fetchData = async (date, type) => {
//     setLoading(true); 
//     try {
//       const token = Cookies.get('token');
//       const apiUrl = type === "revenue" ? revenueApi : getCountApi;
//       const response = await axios.post(apiUrl, { date }, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       console.log(`${type} response:`, response);
//       const transformedNodes = transformData(response.data, type);
//       setNodes(transformedNodes);
//       setLength(response.data.length)
//     } catch (error) {
//       console.error(`Error fetching ${type} data:`, error);
//     } finally {
//       setLoading(false); 
//     }
//   };

//   const handleDateChange = (date) => {
//     const formattedDate = formatDate(date);
//     setSelectedDate(formattedDate);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     fetchData(selectedDate, activeTab);
//   };

//   const transformData = (data, type) => {
//     return data.map((item, index) => {
//       const key = item.ServiceId ? `${item.ServiceId}_${index}` : `fallback-key-${index}`;
//       return {
//         key: key,
//         data: {
//           ServiceId: item.ServiceId,
//           ...(type === "revenue" ? { totalRevenue: item.totalRevenue } : { Count: item.Count }),
//           Type: item.Type,
//         },
//       };
//     });
//   };

//   const handleDownload = () => {
//     const tableData = nodes.map(node => node.data); // Extract the data from the nodes
//     const ws = XLSX.utils.json_to_sheet(tableData); // Convert the visible data to a sheet
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, `${activeTab} Detail`);
//     XLSX.writeFile(wb, `${activeTab}_detail.xlsx`);
//   };

//   return (
//     <Layout>
//       <div className="lg:ml-64">
//         <div className="flex justify-between">
//           <span className="font-semibold text-lg text-black">Revenue and Count Report</span>
//         </div>
//       </div>

//       <div className="flex justify-center items-center mt-10">
//         <form
//           onSubmit={handleSubmit}
//           className="flex flex-col items-center space-y-4 bg-gray-100 p-6 rounded-lg lg:ml-48 shadow-lg w-[300px] lg:w-[400px]"
//         >
//           <div className="flex items-center space-x-4 w-full">
//             <label htmlFor="date-picker" className="text-md text-black font-medium">
//               Select Date:
//             </label>
//             <DatePicker
//               selected={new Date(selectedDate)}
//               onChange={handleDateChange}
//               dateFormat="yyyy-MM-dd"
//               className="border p-2 rounded w-full text-black"
//               id="date-picker"
//               placeholderText="Select a date"
//             />
//           </div>
//           <button
//             type="submit"
//             className="bg-blue-500 text-white p-2 rounded hover:bg-blue-400 w-[90px] mt-4"
//           >
//             Submit
//           </button>
//         </form>
//       </div>

//       <div className="px-1 py-1 mt-10 lg:ml-60 bg-white">
//         <div className="mt-1 space-x-1 border-b border-black">
//           <button
//             className={`p-2 rounded ${activeTab === "revenue" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
//             onClick={() => setActiveTab("revenue")}
//           >
//             Revenue
//           </button>
//           <button
//             className={`p-2 rounded ${activeTab === "count" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
//             onClick={() => setActiveTab("count")}
//           >
//             Count
//           </button>
//         </div>
//       </div>

//       <div className="flex flex-col justify-center items-center lg:ml-60 bg-white">
//         <div className="flex items-center justify-between w-full lg:px-10 px-4 mt-2 lg:mt-4 text-black">
//           <div className="flex items-center">
//             <span className="text-md font-semibold mr-2">Show</span>
//             <Dropdown
//               value={rows}
//               options={[5, 10, 15, 20]}
//               onChange={(e) => setRows(e.value)}
//               className="w-30 border-2 border-gray-200 rounded-lg"
//               placeholder="Select"
//             />
//             <span className="text-md font-semibold ml-2">Entries</span>
//           </div>
//           <button onClick={handleDownload}
//             className="bg-emerald-500 text-white p-2 rounded hover:bg-emerald-400">
//             Download
//           </button>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center w-full mt-10">
//           <Lottie animationData={loaderAnimation} style={{ width: 200, height: 200 }} />
//           </div>
//         ) : (
// <>
//           <div className='lg:mb-4 mb-4 mt-4'>
//           <span className='border-2 border-gray-200 rounded-lg lg:px-2 lg:py-4 px-3 py-2 '><strong>Total Count:  </strong>{length}</span>
//         </div>
//           <TreeTable
//             className="w-[360px] sm:w-[660px] md:w-[700px] lg:w-[900px]"
//             key={rows}
//             value={nodes}
//             paginator
//             rows={rows}
//             rowsPerPageOptions={[5, 10, 15, 20]}
//             tableStyle={{ minWidth: "50rem", marginTop: "20px" }}
//           >
//             <Column field="ServiceId" header="Service ID" />
//             {activeTab === "revenue" ? (
//               <Column field="totalRevenue" header="Total Revenue" />
//             ) : (
//               <Column field="Count" header="Count" />
//             )}
//             <Column field="Type" header="Type" />
//           </TreeTable>
//           </>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default Revenue;


import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css"; 
import "primeicons/primeicons.css"; 
import * as XLSX from "xlsx";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { revenueApi, getCountApi } from "../../Data/api";
import Lottie from 'lottie-react';
import loaderAnimation from '../../assets/images/loader (2).json'; 

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Revenue = () => {
  const [nodes, setNodes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [rows, setRows] = useState(5);
  const [activeTab, setActiveTab] = useState("revenue"); 
  const [loading, setLoading] = useState(false); 
  const [length, setLength] = useState('')

  const navigate = useNavigate();
  const username = Cookies.get('username');

  const checkUser = () => {
    if (!username) {
      navigate('/login');
    }
  }

  useEffect(() => {
    fetchData(selectedDate, activeTab);
    checkUser();
  }, [activeTab]);

  const fetchData = async (date, type) => {
    setLoading(true); 
    try {
      const token = Cookies.get('token');
      const apiUrl = type === "revenue" ? revenueApi : getCountApi;
      const response = await axios.post(apiUrl, { date }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(`${type} response:`, response);
      const transformedNodes = transformData(response.data, type);
      setNodes(transformedNodes);
      setLength(response.data.length);
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
    } finally {
      setLoading(false); 
    }
  };

  const handleDateChange = (date) => {
    const formattedDate = formatDate(date);
    setSelectedDate(formattedDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchData(selectedDate, activeTab);
  };

  const transformData = (data, type) => {
    return data.map((item, index) => {
      const key = item.ServiceId ? `${item.ServiceId}_${index}` : `fallback-key-${index}`;
      return {
        key: key,
        data: {
          ServiceId: item.ServiceId,
          ...(type === "revenue" ? { totalRevenue: item.totalRevenue } : { Count: item.Count }),
          Type: item.Type,
          mno: index+1,
        },
      };
    });
  };

  const handleDownload = () => {
    const tableData = nodes.map(node => node.data); // Extract the data from the nodes
    const ws = XLSX.utils.json_to_sheet(tableData); // Convert the visible data to a sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${activeTab} Detail`);
    XLSX.writeFile(wb, `${activeTab}_detail.xlsx`);
  };

  return (
    <Layout>
      <div className="lg:ml-64">
        <div className="flex justify-between">
          <span className="font-semibold text-lg text-black">Revenue and Count Report</span>
        </div>
      </div>

      <div className="flex justify-center items-center mt-10">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-4 bg-gray-100 p-6 rounded-lg lg:ml-48 shadow-lg w-[300px] lg:w-[400px]"
        >
          <div className="flex items-center space-x-4 w-full">
            <label htmlFor="date-picker" className="text-md text-black font-medium">
              Select Date:
            </label>
            <DatePicker
              selected={new Date(selectedDate)}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              className="border p-2 rounded w-full text-black"
              id="date-picker"
              placeholderText="Select a date"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-400 w-[90px] mt-4"
          >
            Submit
          </button>
        </form>
      </div>

      <div className="px-1 py-1 mt-10 lg:ml-60 bg-white">
        <div className="mt-1 space-x-1 border-b border-black">
          <button
            className={`p-2 rounded ${activeTab === "revenue" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
            onClick={() => setActiveTab("revenue")}
          >
            Revenue
          </button>
          <button
            className={`p-2 rounded ${activeTab === "count" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
            onClick={() => setActiveTab("count")}
          >
            Count
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center lg:ml-60 bg-white">
        <div className="flex items-center justify-between w-full lg:px-10 px-4 mt-2 lg:mt-4 text-black">
          <div className="flex items-center">
            <span className="text-md font-semibold mr-2">Show</span>
            <Dropdown
              value={rows}
              options={[5, 10, 15, 20]}
              onChange={(e) => setRows(e.value)}
              className="w-30 border-2 border-gray-200 rounded-lg"
              placeholder="Select"
            />
            <span className="text-md font-semibold ml-2">Entries</span>
          </div>
          <button onClick={handleDownload}
            className="bg-emerald-500 text-white p-2 rounded hover:bg-emerald-400">
            Download
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center w-full mt-10">
            <Lottie animationData={loaderAnimation} style={{ width: 200, height: 200 }} />
          </div>
        ) : (
          <>
            <div className='lg:mb-4 mb-4 mt-4'>
              <span className='border-2 border-gray-200 rounded-lg lg:px-2 lg:py-4 px-3 py-2 '><strong>Total Count:  </strong>{length}</span>
            </div>
            <TreeTable
              className="w-[360px] sm:w-[660px] md:w-[700px] lg:w-[900px]"
              key={rows}
              value={nodes}
              paginator
              rows={rows}
              rowsPerPageOptions={[5, 10, 15, 20]}
              tableStyle={{ minWidth: "50rem", marginTop: "20px" }}
            >
              <Column field="mno" header="MNO" />
              <Column field="ServiceId" header="Service ID" />
              {activeTab === "revenue" ? (
                <Column field="totalRevenue" header="Total Revenue" />
              ) : (
                <Column field="Count" header="Count" />
              )}
              <Column field="Type" header="Type" />
            </TreeTable>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Revenue;

