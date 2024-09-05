import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { unsubapi } from "../Data/api";
import { Dropdown } from "primereact/dropdown";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css"; 
import "primeicons/primeicons.css"; 
import * as XLSX from "xlsx";
import './styles.css';
import Cookies from 'js-cookie'
import { GoHome } from 'react-icons/go';
import { useNavigate } from "react-router-dom";


const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Unsubscription = () => {
  const [nodes, setNodes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [unsub, setUnsub] = useState("");
  const [rows,setRows]=useState(5)
  const [length,setLength]=useState('')
  // console.log(unsub,"unsubscrption====")

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
    setNodes([]);
    setLength(" ")
    try {
      const token =Cookies.get('token')
      const response = await axios.post(unsubapi, { date },{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      // console.log(response,"====unsub response")
      setUnsub(response.data);
      // console.log(response.data.length,"===length")
      setLength(response.data.length)
      const transformedNodes = transformData(response.data);
      setNodes(transformedNodes);
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
      key: index + 1,    
        data: {
          sno: index + 1,     
              msisdn: user.msisdn,
        service_id: user.service_id,
        datetime: user.datetime,
        // deactivation_date: user.deactivation_date,
        service_name: user.service_name,
        type_event:user.type_event

      },
    }));
  };

  const handleDownload = () => {
    const tableData = nodes.map(node => node.data); // Extract the data from the nodes
    const ws = XLSX.utils.json_to_sheet(tableData); // Convert the visible data to a sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Unsubscription Detail');
    XLSX.writeFile(wb, 'unsubscription_detail.xlsx');
  };
  


  return (
    <Layout>
      <div className="lg:ml-64">
        <div className="flex justify-between">
        <span className="font-semibold text-lg text-black">UnSubscription Report</span>
         {/* <GoHome size={25}/>/unsubscription */}
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
      <div className="flex flex-col justify-center items-center mt-10 lg:ml-60 bg-white">
      <div className="flex items-center justify-between w-full lg:px-10 px-4 mt-2 lg:mt-4 text-black">
          <div className="flex items-center">
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
          <button onClick={handleDownload}
          className="bg-emerald-500 text-white p-2 rounded hover:bg-emerald-400">
            Download 
          </button>
        </div>

        <div className='lg:mb-4 mb-4 mt-4'>
            <span className='border-2 border-gray-200 rounded-lg lg:px-2 lg:py-4 px-3 py-2 text-black '><strong>Total Count:  </strong>{length}</span>
          </div>
          
        <TreeTable
          className="w-[360px] sm:w-[660px] md:w-[790px] lg:w-[900px]"
          key={rows}
          value={nodes}
          paginator
          rows={rows}
          rowsPerPageOptions={[5, 10, 15,20]}
          tableStyle={{ minWidth: "70rem", marginTop: "20px" }}
        >
          <Column field="sno" header="SNo" style={{ width:"80px"}}/>
          <Column field="msisdn" header="Msisdn" />
          <Column field="service_id" header="Service ID" />
          <Column field="service_name" header="Sservice Name" />
          <Column field="type_event" header="Type Event" />
          <Column field="datetime" header="Deactivate Date" />
          {/* <Column field="deactivation_date" header="DEACTIVATE DATE" style={{ width:"200px"}}/> */}
        

        </TreeTable>
      </div>

  

    </Layout>
  );
};

export default Unsubscription;
