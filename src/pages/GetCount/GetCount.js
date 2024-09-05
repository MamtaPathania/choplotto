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
// import './styles.css';
import Cookies from 'js-cookie'
import { useNavigate } from "react-router-dom";
import { getCountApi } from "../../Data/api";


const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const GetCount = () => {
  const [nodes, setNodes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [revenue, setRevenue] = useState("");
  const [total,setTotal]=useState("")
  const [rows,setRows]=useState(5)
//   console.log(revenue,"revenue====")
// console.log(total,"==total length")
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
    try {
      const token =Cookies.get('token')
      const response = await axios.post( getCountApi, { date },{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      // console.log(response,"====revenue response")
      setRevenue(response.data);
      setTotal(response.data.length)
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
    return data.map((user,index) => {
        const key = user.ServiceId ? `${user.ServiceId}_${index}` : `fallback-key-${index}`;
        return{
            key:key,
            data: {
                ServiceId :user.ServiceId,
                totalRevenue: user.totalRevenue,
                typeEvent: user.typeEvent,
            
              },
        }
      
    });
  };

  const handleDownload = () => {
    const tableData = nodes.map(node => node.data); // Extract the data from the nodes
    const ws = XLSX.utils.json_to_sheet(tableData); // Convert the visible data to a sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'getcount Detail');
    XLSX.writeFile(wb, 'getcount_detail.xlsx');
  };
  


  return (
    <Layout>
      <div className="lg:ml-64">
        <div className="flex justify-between">
        <span className="font-semibold text-lg text-black">Revenue Report</span>
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
        <TreeTable
          className="w-[360px] sm:w-[660px] md:w-[700px] lg:w-[900px]"
          key={rows}
          value={nodes}
          paginator
          rows={rows}
          rowsPerPageOptions={[5, 10, 15,20]}
          tableStyle={{ minWidth: "50rem", marginTop: "20px" }}
        >
          <Column field="ServiceId" header="Service ID" />
          <Column field="totalRevenue" header="Total Revenue" />
          <Column field="typeEvent" header="Type Event" />
        

        </TreeTable>
      </div>

  

    </Layout>
  );
};

export default GetCount;
