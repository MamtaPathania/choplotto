import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { contestTicketId, subscriptionMsisdn } from "../../Data/api";
import { Dropdown } from "primereact/dropdown";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css"; 
import "primeicons/primeicons.css"; 
import * as XLSX from "xlsx";
import '../styles.css';
import Cookies from 'js-cookie';
import  Lottie  from 'lottie-react';
import loaderAnimation from '../../assets/images/loader (2).json'; 
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';


const ContestByTicket = () => {
  const [nodes, setNodes] = useState([]);
  const [ticketId, setTicketId] = useState("");
  const [rows, setRows] = useState(5);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [length,setLength]=useState('')

  const navigate=useNavigate()
  const username = Cookies.get('username')
  // console.log("cookie num", username)

  const checkuser = () => {
    if (!username || username == null || username == undefined) {
      navigate('/login')
    }
  }

  useEffect(() => {
    checkuser()
  }, []);

  const transformData = (data) => {
    // console.log("Original Data:", data);
    const transformed = data.map((user,index) => ({
      key: index + 1,     
       data: {
        sno: index + 1,        
         msisdn: user.msisdn,
        serviceID: user.serviceID,
        service_name: user.service_name,
        text:user.text,
        status: user.status,
        ticket_id:user.ticket_id,
        amount: user.amount,
        deliveryDate: user.deliveryDate,
        datetime: user.datetime,
        quiz_date_time: user.quiz_date_time,
      },
    }));
    // console.log("Transformed Data:", transformed);
    return transformed;
  };
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('token');
      const response = await axios.post( contestTicketId, { ticketId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // console.log(response,"---res")
      const transformedNodes = transformData(response.data);
      setNodes(transformedNodes);
      // console.log(response.data.length,"===length===")
      setLength(response.data.length)
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Enter a valid ticketid")
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowTable(false);
    fetchData();
  };

  const handleDownload = () => {
    const tableData = nodes.map(node => node.data); 
    // console.log(tableData,"=======")
    const ws = XLSX.utils.json_to_sheet(tableData); 
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ticketid Detail');
    XLSX.writeFile(wb, 'TicketId_detail.xlsx');
  };

  return (
    <Layout>
       <ToastContainer style={{ marginTop: '80px' }} />
      <div className="lg:ml-64">
        <div className="flex justify-between">
          <span className="font-semibold text-lg text-black">Search By TicketId</span>
        </div>
      </div>

      <div className="flex justify-center items-center mt-10">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-4 bg-gray-100 p-6 rounded-lg lg:ml-48 shadow-lg w-[300px] lg:w-[400px]"
        >
          <div className="flex items-center space-x-4 w-full">
            <label htmlFor="msisdn" className="text-md text-black font-medium">
              TicketId
            </label>
            <input
              type="text"
              id="ticketId"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              placeholder="Enter TicketId"
              className="border-2 border-gray-300 p-2 rounded w-full px-4 text-black"
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

      {loading && (
        <div className="flex justify-center lg:mt-2 lg:ml-40">
          <Lottie animationData={loaderAnimation} style={{ width: 200, height: 200 }} />
        </div>
      )}

      {showTable && (
        <div className="flex flex-col justify-center items-center mt-10 lg:ml-60 bg-white">
          <div className="flex items-center justify-between w-full lg:px-10 px-4 mt-2 mb-2 lg:mt-4 text-black">
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
            <button
              onClick={handleDownload}
              className="bg-emerald-500 text-white p-2 rounded hover:bg-emerald-400"
            >
              Download 
            </button>
          </div>

          <div className='lg:mb-6 mb-4 mt-4'>
            <span className='border-2 border-gray-200 rounded-lg lg:px-2 lg:py-4 px-3 py-2 text-black '><strong>Total Count:  </strong>{length}</span>
          </div>

          <TreeTable
            className="w-[360px] sm:w-[660px] md:w-[790px] lg:w-[900px]"
            key={rows}
            value={nodes}
            paginator
            rows={rows}
            rowsPerPageOptions={[5, 10, 15, 20]}
          >
            <Column field="sno" header="SNo" style={{ width:"80px"}} />
            <Column field="msisdn" header="Msisdn" style={{ width: "180px" }}/>
            <Column field="serviceID" header="Service Id" style={{ width: "140px" }} />
            <Column field="service_name" header="Service Name" style={{ width: "180px" }} />
            <Column field="text" header="Text" style={{ width: "210px" }}/>
            <Column field="status" header="Status" style={{ width: "180px" }}/>
            <Column field="ticket_id" header="TicketId" style={{ width: "320px" }}/>
            <Column field="amount" header="Amount" style={{ width: "140px" }}/>
            <Column field="deliveryDate" header="DeliveryDate" style={{ width: "240px" }}/>
            <Column field="datetime" header="DateTime" style={{ width: "200px" }}/>
            <Column field="quiz_date_time" header="QuizDateTime" style={{ width: "230px" }}/>
          </TreeTable>
        </div>
      )}
    </Layout>
  );
};

export default ContestByTicket;
