import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { contestdetail } from "../../Data/api";
import axios from "axios";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import * as XLSX from "xlsx";
import Cookies from 'js-cookie'

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css"; 
import "primeicons/primeicons.css"; 
import { useNavigate } from "react-router-dom";

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ContestByDate = () => {
  const [nodes, setNodes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [contest, setContest] = useState("");
  const [rows, setRows] = useState(5);
  const [length,setLength]=useState('')
  console.log(length,"length")
console.log(contest,"=====contest")
console.log(nodes,"==nodes")
  console.log(rows,"=rows")

  const navigate=useNavigate()
  const username = Cookies.get('username')
  console.log("cookie num", username)

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
    console.log("Rows state updated:", rows);
  }, [rows]);

  const fetchData = async (date) => {
    try {
      const token=Cookies.get('token')
      const response = await axios.post(contestdetail, { date },{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      setContest(response.data);
      console.log(response.data.length,"-----length")
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
        quiz_date_time: user.quiz_date_time,
        datetime: user.datetime,
        status: user.status,
        service_name: user.service_name,
        amount: user.amount,
        serviceID: user.serviceID,
        text: user.text,
        ticket_id:user.ticket_id
      },
    }));
  };



const handleDownload = () => {
  const tableData = nodes.map(node => node.data); 
  const ws = XLSX.utils.json_to_sheet(tableData); 
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'contest Detail');
  XLSX.writeFile(wb, 'contest_detail.xlsx');
};

//  status column
const statusBodyTemplate = (rowData) => {
  return rowData.data.status == 0 ? "Pending" : rowData.data.status;
};

  return (
    <Layout>
       <div className="lg:ml-64">
        <div className="flex justify-between">
        <span className="font-semibold text-lg text-black">Contest ByDate</span>
            </div>

      </div>
      <div className="flex justify-center items-center mt-10">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-4 bg-gray-100 p-6 rounded-lg lg:ml-48 shadow-lg lg:w-[400px]"
        >
          <div className="flex items-center space-x-4 w-full">
            <label htmlFor="date-picker" className="text-md font-medium text-black">
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
                console.log("Dropdown value selected:", e.value);
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
            <span className='border-2 border-gray-200 rounded-lg lg:px-2 lg:py-4 px-3 py-2 '><strong>Total Count:  </strong>{length}</span>
          </div>

        <TreeTable
          className="w-[360px] sm:w-[660px] md:w-[790px] lg:w-[900px]"
          key={rows}
          value={nodes}
          rows={rows}
          paginator
          rowsPerPageOptions={[5, 10, 15, 20]}
          tableStyle={{ minWidth: "100rem", marginTop: "20px" }}
        >
         <Column field="sno" header="SNo" style={{ width: "100px" }} />
          <Column field="msisdn" header="MSISDN" style={{ width: "180px" }} />
          <Column field="quiz_date_time" header="QUIZ DATETIME" style={{ width: "180px" }}/>
          <Column field="datetime" header="DATETIME" style={{ width: "180px" }}/>
          <Column field="status" header="STATUS" body={statusBodyTemplate} style={{ width: "180px" }} />

          {/* <Column field="status" header="STATUS" /> */}
          <Column field="service_name" header="SERVICE NAME" style={{ width: "180px" }} />
          <Column field="amount" header="AMOUNT" style={{ width: "180px" }}/>
          <Column field="serviceID" header="SERVICE ID" style={{ width: "180px" }}/>
          <Column field="text" header="TEXT" style={{ width: "240px" }}/>
          <Column field="ticket_id" header="Ticket ID" style={{ width: "330px" }}/>

        </TreeTable>
      </div>
    </Layout>
  );
};

export default ContestByDate;
