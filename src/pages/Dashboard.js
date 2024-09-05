



import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { drawWinner as drawWinnerURL } from "../Data/api";
import axios from "axios";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { GoDownload } from "react-icons/go";
import { TbActivityHeartbeat } from "react-icons/tb";
import * as XLSX from "xlsx";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import Cookies from 'js-cookie'
// import './styles.css';
import  Lottie  from 'lottie-react';
import loaderAnimation from '../assets/images/loader (2).json'; 

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css"; // Core CSS
import "primeicons/primeicons.css"; // Icons
import { useNavigate } from "react-router-dom";

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Dashboard = () => {
  const [nodes, setNodes] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [drawWinner, setDrawWinner] = useState("");
  const [rows, setRows] = useState(5); 
  const [loading,setLoading]=useState(false)
  const[length,setLength]=useState('')
  // console.log(drawWinner,"draw winner======")

  const navigate=useNavigate()
  const username = Cookies.get('username')
  // console.log("cookie num", username)

  const checkuser = () => {
    if (!username || username == null || username == undefined) {
      navigate('/login')
    }
  }
  useEffect(() => {
    fetchData(selectedDate);
    checkuser()

  }, []);

  useEffect(() => {
    // console.log("Rows state updated:", rows);
}, [rows]);


  const fetchData = async (date) => {
    setLoading(true)
    setNodes([]); // Clear previous data
    setDrawWinner(""); // Clear previous winner data
    setLength('')
    try {
      const token = Cookies.get('token'); 
      // console.log(token,"===token")
      const response = await axios.post(drawWinnerURL, { date },{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      setLoading(false)
      setDrawWinner(response.data);
      const transformedNodes = transformData(response.data);
      setNodes(transformedNodes);
      setLength(response.data.length)
    } catch (error) {
      console.error("Error fetching data:", error);
      
    }
  };

  const handleDateChange = (date) => {
    const formattedDate = formatDate(date);
    setSelectedDate(formattedDate);
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    
    fetchData(selectedDate);
  };

  const transformData = (data) => {
    return data.map((user,index) => ({
      // key: user.id,
      key:index+1,
      data: {
        // id: user.id,
        sno:index+1,
        datetime: user.datetime,
        drawTime: user.drawTime,
        percentage: user.percentage,
        totalRevenue: user.totalRevenue,
        sendAmount: user.sendAmount,
        drawNumber: user.drawNumber,
        redeemNumbers: user.redeemNumbers || 0,
        winningNumber:user.redeemNumbers.length,
        status: "Completed",
      },
    }));
  };

  const formatDataForTreeTable = (redeemNumbers) => {
    return redeemNumbers.map((item,index) => ({
      // key: item.id,
      key: index + 1,
      data: {
        // id: item.id,
        sno: index + 1, 
        msisdn: item.msisdn,
        count: item.count,
        drawnumber: item.drawnumber,
        serviceid: item.serviceid,
        user_request: item.user_request,
        prizeamount: item.prizeamount,
        prizestatus: item.prizestatus,
        quiztime: item.quiztime,
      },
      children: [], 
    }));
  };

  const handleDownload = (nodeData) => {
    const ws = XLSX.utils.json_to_sheet([nodeData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
    XLSX.writeFile(wb, "drawWinner_data.xlsx");
  };

  const handleAction = (nodeData) => {
    setModalData(nodeData);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalData(null);
  };

  const handleWinningDownload = (nodeData) => {
    const { datetime, drawNumber, drawTime, percentage, sendAmount, totalRevenue, redeemNumbers} = nodeData;
    
    const downloadData = redeemNumbers.map((redeem) => ({
        redeemID: redeem.id,
        msisdn: redeem.msisdn,
        user_request: redeem.user_request,
        redeemDrawNumber: redeem.drawnumber,
        serviceId: redeem.serviceid,
        prizeamount: redeem.prizeamount, 
        prizestatus: redeem.prizestatus, 
        quiztime: redeem.quiztime, 
        status:redeem.status,
        user_request:redeem.user_request,
        drawDetail:redeem.drawDetail,
        count:redeem.count
        
    }));
    // console.log(downloadData,"downloaddata=======")

    const ws = XLSX.utils.json_to_sheet(downloadData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Redeem Data");

    XLSX.writeFile(wb, "winning number.xlsx");
};


  const WinningNumberTemplate = (node) => {
    return (
      <div className="flex items-cente justify-start gap-4">
        <span>{node.data.winningNumber}</span>
        <div className="flex space-x-2">
          <Button className="bg-blue-500" onClick={() => handleAction(node.data)}>
            <TbActivityHeartbeat color="white" size={20}/>
          </Button>
          <Button className="bg-emerald-500" onClick={() => handleWinningDownload(node.data)}>
            <GoDownload color="white" size={20} />
          </Button>
        </div>
      </div>
    );
  };



  const DownloadTemplate = (node) => {
    return (
      <div className="flex space-x-6">
        <Button className="bg-blue-500" onClick={() => handleAction(node.data)}>
          <TbActivityHeartbeat color="white" size={25} />
        </Button>
        <Button
          className="bg-emerald-500"
          onClick={() => handleDownload(node.data)}
        >
          <GoDownload color="white" size={25} />
        </Button>
      </div>
    );
  };

  const StatusTemplate = (node) => {
    return (
      <button className="bg-emerald-500 text-white px-3 py-1 rounded">
        {node.data.status}
      </button>
    );
  };

  

  return (
    <Layout>

<div className="lg:ml-64">
        <div className="flex justify-between">
        <span className="font-semibold text-lg text-black">Draw Winning</span>
        </div>

      </div>
      <div className="flex justify-center items-center mt-10">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-4 bg-gray-100 p-6 rounded-lg lg:ml-48 shadow-lg lg:w-[400px]"
        >
          <div className="flex items-center space-x-4 w-full">
            <label
              htmlFor="date-picker"
              className="text-md text-black font-medium"
            >
              Select Date:
            </label>
            <DatePicker
              selected={new Date(selectedDate)}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              className="border p-2 rounded w-full text-black"
              id="date-picker"
              placeholderText="Select a date"
              // maxDate={new Date()} // Prevent selecting future dates

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

      {loading ? (
          <div className="flex justify-center items-center lg:ml-32 w-full mt-10">
          <Lottie animationData={loaderAnimation} style={{ width: 200, height: 200 }} />
          </div>
        ) : (
      <div className="flex flex-col justify-center items-center mt-10 lg:ml-60 bg-white">
      <div className="flex items-center justify-start w-full mb-2 lg:px-10 px-4 mt-2 lg:mt-4 text-black">
                        <span className="text-md font-semibold mr-2">Show</span>
                        <Dropdown
                            value={rows}
                            options={[5, 10, 15, 20]}
                            onChange={(e) => {
                                // console.log("Dropdown value selected:", e.value);
                                setRows(e.value);
                            }}
                            className="w-30 border-2 border-gray-200 rounded-lg"
                            placeholder="Select"
                        />
                        <span className="text-md font-semibold ml-2">Entries</span>
                    </div>

                    <div className='lg:mb-6 mb-4 mt-4'>
<span className='border-2 border-gray-200 rounded-lg lg:px-2 lg:py-4 px-3 py-2 text-black '><strong>Total Count:  </strong>{length}</span>
</div>
        <TreeTable
          className="w-[360px] sm:w-[660px] md:w-[790px] lg:w-[900px]"
          key={rows}
          value={nodes}
          rows={rows}
          paginator
          rowsPerPageOptions={[5, 10,15]}
          tableStyle={{ minWidth: "80rem" }}
        >
          <Column field="sno" header="SN" style={{ width: "80px" }}/>
          <Column field="drawNumber" header="Number" style={{ width: "160px" }} />
          <Column field="datetime" header="DateTime" style={{ width: "160px" }} />
          <Column
            field="winningNumber"
            header="Winning Number"
            style={{ width: "200px" }}
            body={WinningNumberTemplate}
          />
          <Column
            header="Status"
            body={StatusTemplate}
            style={{ width: "150px" }}
          />
          <Column field="drawTime" header="Draw Time"/>

          <Column field="totalRevenue" header="Revenue" />
          <Column field="sendAmount" header="WinSum" />
          <Column field="percentage" header="WinRatio" />
          
          <Column header="Actions" body={DownloadTemplate} />
        </TreeTable>
      </div>
        )}
    <Dialog
      header="Details"
      visible={modalIsOpen}
      style={{ width: "80vw", padding: "40px", marginTop: "60px" }}
      onHide={closeModal}
      className="lg:ml-64"
    >
      {modalData && (
        <TreeTable
        key={rows}
        rows={rows}
          paginator
          value={formatDataForTreeTable(modalData.redeemNumbers)}
          rowsPerPageOptions={[5, 10,15,20]}
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column field="sno" header="SNo" style={{ width: "100px" }} />
          <Column field="msisdn" header="MSISDN" style={{ width: "190px" }} />
          <Column field="count" header="Matching Count" style={{ width: "180px" }} />
          <Column field="drawnumber" header="Draw Number" style={{ width: "200px" }} />
          <Column field="serviceid" header="Service Id" style={{ width: "150px" }} />
          <Column field="user_request" header="User Request" style={{ width: "200px" }} />
          <Column field="prizeamount" header="Prize Amount" style={{ width: "150px" }} />
          <Column field="prizestatus" header="Prize Status" style={{ width: "150px" }} />
          <Column field="quiztime" header="Quiz Time" style={{ width: "150px" }} />
        </TreeTable>
        
      )}
    </Dialog>
  

    </Layout>
  );
};

export default Dashboard; 











// import React, { useState, useEffect } from "react";
// import Layout from "../components/Layout";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { drawWinner as drawWinnerURL } from "../Data/api";
// import axios from "axios";
// import { TreeTable } from "primereact/treetable";
// import { Column } from "primereact/column";
// import { GoDownload } from "react-icons/go";
// import { TbActivityHeartbeat } from "react-icons/tb";
// import * as XLSX from "xlsx";
// import { Dialog } from "primereact/dialog";
// import { Button } from "primereact/button";
// import { Dropdown } from "primereact/dropdown";
// import Cookies from "js-cookie";
// import Lottie from "lottie-react";
// import loaderAnimation from "../assets/images/loader (2).json";

// import "primereact/resources/themes/saga-blue/theme.css";
// import "primereact/resources/primereact.min.css"; // Core CSS
// import "primeicons/primeicons.css"; // Icons
// import { useNavigate } from "react-router-dom";

// const formatDate = (date) => {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// };

// const Dashboard = () => {
//   const [nodes, setNodes] = useState([]);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [modalData, setModalData] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
//   const [drawWinner, setDrawWinner] = useState("");
//   const [rows, setRows] = useState(5);
//   const [loading, setLoading] = useState(false);
//   const [length, setLength] = useState("");

//   const navigate = useNavigate();
//   const username = Cookies.get("username");

//   const checkUser = () => {
//     if (!username) {
//       navigate("/login");
//     }
//   };

//   useEffect(() => {
//     fetchData(selectedDate);
//     checkUser();
//   }, []);

//   useEffect(() => {
//     // console.log("Rows state updated:", rows);
//   }, [rows]);

//   const fetchData = async (date) => {
//     setLoading(true);
//     setNodes([]); // Clear previous data
//     setDrawWinner(""); // Clear previous winner data

//     try {
//       const token = Cookies.get("token");
//       const response = await axios.post(
//         drawWinnerURL,
//         { date },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setLoading(false);
      
//       if (response.data.length === 0) {
//         setLength(0);
//       } else {
//         setDrawWinner(response.data);
//         const transformedNodes = transformData(response.data);
//         setNodes(transformedNodes);
//         setLength(response.data.length);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setLoading(false);
//     }
//   };

//   const handleDateChange = (date) => {
//     const formattedDate = formatDate(date);
//     setSelectedDate(formattedDate);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     fetchData(selectedDate);
//   };

//   const transformData = (data) => {
//     return data.map((user, index) => ({
//       key: index + 1,
//       data: {
//         sno: index + 1,
//         datetime: user.datetime,
//         drawTime: user.drawTime,
//         percentage: user.percentage,
//         totalRevenue: user.totalRevenue,
//         sendAmount: user.sendAmount,
//         drawNumber: user.drawNumber,
//         redeemNumbers: user.redeemNumbers || 0,
//         winningNumber: user.redeemNumbers.length,
//         status: "Completed",
//       },
//     }));
//   };

//   const formatDataForTreeTable = (redeemNumbers) => {
//     return redeemNumbers.map((item, index) => ({
//       key: index + 1,
//       data: {
//         sno: index + 1,
//         msisdn: item.msisdn,
//         count: item.count,
//         drawnumber: item.drawnumber,
//         serviceid: item.serviceid,
//         user_request: item.user_request,
//         prizeamount: item.prizeamount,
//         prizestatus: item.prizestatus,
//         quiztime: item.quiztime,
//       },
//       children: [],
//     }));
//   };

//   const handleDownload = (nodeData) => {
//     const ws = XLSX.utils.json_to_sheet([nodeData]);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
//     XLSX.writeFile(wb, "subscription_data.xlsx");
//   };

//   const handleAction = (nodeData) => {
//     setModalData(nodeData);
//     setModalIsOpen(true);
//   };

//   const closeModal = () => {
//     setModalIsOpen(false);
//     setModalData(null);
//   };

//   const handleWinningDownload = (nodeData) => {
//     const {
//       redeemNumbers,
//     } = nodeData;

//     const downloadData = redeemNumbers.map((redeem) => ({
//       redeemID: redeem.id,
//       msisdn: redeem.msisdn,
//       user_request: redeem.user_request,
//       redeemDrawNumber: redeem.drawnumber,
//       serviceId: redeem.serviceid,
//       prizeamount: redeem.prizeamount,
//       prizestatus: redeem.prizestatus,
//       quiztime: redeem.quiztime,
//       status: redeem.status,
//       drawDetail: redeem.drawDetail,
//       count: redeem.count,
//     }));

//     const ws = XLSX.utils.json_to_sheet(downloadData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Redeem Data");

//     XLSX.writeFile(wb, "winning_number.xlsx");
//   };

//   const WinningNumberTemplate = (node) => {
//     return (
//       <div className="flex items-center justify-start gap-4">
//         <span>{node.data.winningNumber}</span>
//         <div className="flex space-x-2">
//           <Button className="bg-blue-500" onClick={() => handleAction(node.data)}>
//             <TbActivityHeartbeat color="white" size={20} />
//           </Button>
//           <Button className="bg-emerald-500" onClick={() => handleWinningDownload(node.data)}>
//             <GoDownload color="white" size={20} />
//           </Button>
//         </div>
//       </div>
//     );
//   };

//   const DownloadTemplate = (node) => {
//     return (
//       <div className="flex space-x-6">
//         <Button className="bg-blue-500" onClick={() => handleAction(node.data)}>
//           <TbActivityHeartbeat color="white" size={25} />
//         </Button>
//         <Button className="bg-emerald-500" onClick={() => handleDownload(node.data)}>
//           <GoDownload color="white" size={25} />
//         </Button>
//       </div>
//     );
//   };

//   const StatusTemplate = (node) => {
//     return (
//       <button className="bg-emerald-500 text-white px-3 py-1 rounded">
//         {node.data.status}
//       </button>
//     );
//   };

//   return (
//     <Layout>
//       <div className="lg:ml-64">
//         <div className="flex justify-between">
//           <span className="font-semibold text-lg text-black">Draw Winning</span>
//         </div>
//       </div>
//       <div className="flex justify-center items-center mt-10">
//         <form
//           onSubmit={handleSubmit}
//           className="flex flex-col items-center space-y-4 bg-gray-100 p-6 rounded-lg lg:ml-48 shadow-lg lg:w-[400px]"
//         >
//           <div className="flex items-center space-x-4 w-full">
//             <label
//               htmlFor="date-picker"
//               className="text-md text-black font-medium"
//             >
//               Select Date:
//             </label>
//             <DatePicker
//               selected={new Date(selectedDate)}
//               onChange={handleDateChange}
//               dateFormat="yyyy-MM-dd"
//               className="border p-2 rounded w-full text-black"
//               id="date-picker"
//               placeholderText="Select a date"
//               maxDate={new Date()} // Prevent selecting future dates
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

//       {loading ? (
//         <div className="flex justify-center items-center lg:ml-32 w-full mt-10">
//           <Lottie
//             animationData={loaderAnimation}
//             style={{ width: 200, height: 200 }}
//           />
//         </div>
//       ) : (
//         <div className="flex flex-col justify-center items-center mt-10 lg:ml-60 bg-white">
//           <div className="flex items-center justify-start w-full mb-4">
//             <span className="ml-2 text-md font-semibold">entries</span>
//           </div>
//           {nodes.length === 0 ? (
//             <div className="text-center text-black mt-4">No records found</div>
//           ) : (
//             <TreeTable
//               value={nodes}
//               tableStyle={{ minWidth: "50rem" }}
//               paginator
//               rows={rows}
//               emptyMessage="No records found"
//               paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
//               currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
//             >
//               <Column
//                 field="sno"
//                 header="S.no"
//                 body={(node) => <span className="text-black">{node.key}</span>}
//                 className="font-semibold"
//               ></Column>
//               <Column
//                 field="drawNumber"
//                 header="Draw Number"
//                 body={(node) => (
//                   <span className="text-black">{node.data.drawNumber}</span>
//                 )}
//                 className="font-semibold"
//               ></Column>
//               <Column
//                 field="datetime"
//                 header="Date/Time"
//                 body={(node) => (
//                   <span className="text-black">{node.data.datetime}</span>
//                 )}
//                 className="font-semibold"
//               ></Column>
//               <Column
//                 field="winningNumber"
//                 header="Winning Number Length"
//                 body={WinningNumberTemplate}
//                 className="font-semibold"
//               ></Column>
//               <Column
//                 field="totalRevenue"
//                 header="Total Revenue"
//                 body={(node) => (
//                   <span className="text-black">{node.data.totalRevenue}</span>
//                 )}
//                 className="font-semibold"
//               ></Column>
//               <Column
//                 field="percentage"
//                 header="Percentage"
//                 body={(node) => (
//                   <span className="text-black">{node.data.percentage}</span>
//                 )}
//                 className="font-semibold"
//               ></Column>
//               <Column
//                 field="drawTime"
//                 header="Draw Time"
//                 body={(node) => (
//                   <span className="text-black">{node.data.drawTime}</span>
//                 )}
//                 className="font-semibold"
//               ></Column>
//               <Column
//                 field="sendAmount"
//                 header="Send Amount"
//                 body={(node) => (
//                   <span className="text-black">{node.data.sendAmount}</span>
//                 )}
//                 className="font-semibold"
//               ></Column>
//               <Column
//                 field="status"
//                 header="Status"
//                 body={StatusTemplate}
//                 className="font-semibold"
//               ></Column>
//               <Column
//                 field="download"
//                 header="Winning Action"
//                 body={DownloadTemplate}
//                 className="font-semibold"
//               ></Column>
//             </TreeTable>
//           )}
//         </div>
//       )}

//       <Dialog
//         header="Redemption Number Details"
//         visible={modalIsOpen}
//         onHide={closeModal}
//         className="w-[60vw]"
//       >
//         {modalData ? (
//           <TreeTable value={formatDataForTreeTable(modalData.redeemNumbers)}>
//             <Column
//               field="sno"
//               header="S.no"
//               body={(node) => <span className="text-black">{node.key}</span>}
//               className="font-semibold"
//             ></Column>
//             <Column
//               field="msisdn"
//               header="MSISDN"
//               body={(node) => (
//                 <span className="text-black">{node.data.msisdn}</span>
//               )}
//               className="font-semibold"
//             ></Column>
//             <Column
//               field="count"
//               header="Count"
//               body={(node) => (
//                 <span className="text-black">{node.data.count}</span>
//               )}
//               className="font-semibold"
//             ></Column>
//             <Column
//               field="drawnumber"
//               header="Draw Number"
//               body={(node) => (
//                 <span className="text-black">{node.data.drawnumber}</span>
//               )}
//               className="font-semibold"
//             ></Column>
//             <Column
//               field="serviceid"
//               header="Service ID"
//               body={(node) => (
//                 <span className="text-black">{node.data.serviceid}</span>
//               )}
//               className="font-semibold"
//             ></Column>
//             <Column
//               field="user_request"
//               header="User Request"
//               body={(node) => (
//                 <span className="text-black">{node.data.user_request}</span>
//               )}
//               className="font-semibold"
//             ></Column>
//             <Column
//               field="prizeamount"
//               header="Prize Amount"
//               body={(node) => (
//                 <span className="text-black">{node.data.prizeamount}</span>
//               )}
//               className="font-semibold"
//             ></Column>
//             <Column
//               field="prizestatus"
//               header="Prize Status"
//               body={(node) => (
//                 <span className="text-black">{node.data.prizestatus}</span>
//               )}
//               className="font-semibold"
//             ></Column>
//             <Column
//               field="quiztime"
//               header="Quiz Time"
//               body={(node) => (
//                 <span className="text-black">{node.data.quiztime}</span>
//               )}
//               className="font-semibold"
//             ></Column>
//           </TreeTable>
//         ) : (
//           <div>No data available</div>
//         )}
//       </Dialog>
//     </Layout>
//   );
// };

// export default Dashboard;
