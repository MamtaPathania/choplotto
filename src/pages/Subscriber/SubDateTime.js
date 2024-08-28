import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { TreeTable } from 'primereact/treetable';
import { Dropdown } from "primereact/dropdown";
import { Column } from 'primereact/column';
import { subdatetime } from '../../Data/api';
import * as XLSX from "xlsx";
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';


const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

function SubDateTime() {
    const [nodes, setNodes] = useState([]);
    const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
    const [data,setData]=useState('')
    const [rows, setRows] = useState(5);
    const[length,setLength]=useState('')

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        fetchData(selectedDate);
    };

    const handleDateChange = (date) => {
        const formattedDate = formatDate(date);
        setSelectedDate(formattedDate);
    };

    const fetchData = async (date) => {
        try {
            const token=Cookies.get('token')
            const response = await axios.post(subdatetime, { subDateTime: date },{
                headers:{
                    Authorization:`Bearer ${token}`
                  }
            });
            console.log(response.data, "response");
            setData(response.data)
            setLength(response.data.length)
            console.log(response.data.length)
            const transformedNodes = transformData(response.data);
            setNodes(transformedNodes);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const transformData = (data) => {
        return data.map((item,index) => ({
            key: index + 1,            data: {
                sno: index + 1,                 msisdn: item.msisdn,
                service_id: item.service_id,
                subDateTime: item.subDateTime,
                amount: item.amount,
                pack_type: item.pack_type,
                service_name: item.service_name,
                status: item.status,
                nextBilledDateTime: item.nextBilledDateTime,
                lastBilledDateTime: item.lastBilledDateTime,
                operator: item.operator,
            },
            children: [] // Set children to an empty array if no hierarchical data
        }));
    };
 

    const handleDownload = () => {
        const tableData = nodes.map(node => node.data); // Extract the data from the nodes
        const ws = XLSX.utils.json_to_sheet(tableData); // Convert the visible data to a sheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'subscription Detail');
        XLSX.writeFile(wb, 'subscription_detail.xlsx');
      };
      
    return (
        <Layout>
             <div className="lg:ml-64">
        <div className="flex justify-between">
        <span className="font-semibold text-lg text-black">Subscription By Date</span>
         {/* <GoHome size={25}/>/unsubscription */}
        </div>

      </div>
            <div className='text-center'>
                <div className="flex justify-center items-center mt-10">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col items-center space-y-4 bg-gray-100 p-6 rounded-lg lg:ml-48 shadow-lg lg:w-[400px]"
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
                <div className="flex items-center justify-between w-full lg:px-10 px-4 mb-2 mt-2 lg:mt-4 text-black">
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
                        key={rows} 
                        value={nodes}
                        className="w-[360px] sm:w-[660px] md:w-[790px] lg:w-[900px]"
                        paginator
                        rows={rows}
                        rowsPerPageOptions={[5, 10, 15, 20]}
                        // tableStyle={{ minWidth: "160rem" }}
                    >
                      <Column field="sno" header="SNO" style={{ width: "80px" }}/>
                        <Column field="msisdn" header="Msisdn" style={{ width: "180px" }} />
                        <Column field="service_id" header="Service ID" style={{ width: "140px" }} />
                        <Column field="amount" header="Amount" style={{ width: "140px" }}/>
                        <Column field="pack_type" header="Pack Type"style={{ width: "140px" }} />
                        <Column field="service_name" header="Service Name" style={{ width: "200px" }}/>
                        <Column field="status" header="Status" style={{ width: "140px" }}/>
                        <Column field="operator" header="Operator" style={{ width: "140px" }}/>
                        <Column field="subDateTime" header="Subscription Date Time" style={{ width: "240px" }}/>
                        <Column field="nextBilledDateTime" header="Next Billed Date Time" style={{ width: "240px" }} />
                        <Column field="lastBilledDateTime" header="Last Billed Date Time" style={{ width: "240px" }}/>
                    </TreeTable>
                </div>
            </div>
        </Layout>
    );
}

export default SubDateTime;
