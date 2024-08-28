// import React, { useState, useEffect } from 'react';
// import Layout from '../../components/Layout';
// import { Dropdown } from 'primereact/dropdown';
// import axios from 'axios';
// import { status } from '../../Data/api'; 
// import { TreeTable } from "primereact/treetable";
// import { Column } from "primereact/column";
// import * as XLSX from "xlsx";
// import Cookies from 'js-cookie'
// import { useNavigate } from 'react-router-dom';

// function SubscriptionStatus() {
//   const [nodes, setNodes] = useState([]);
//   const [rows, setRows] = useState(5);
//   const [substatus, setSubStatus] = useState("");
//   const [length,setLength]=useState('')
//   const [value, setValues] = useState({ name: 'active', code: 'AC' });
//   const navigate = useNavigate();
//   const username = Cookies.get('username');

//   const checkuser = () => {
//     if (!username || username == null || username == undefined) {
//       navigate('/login');
//     }
//   };

//   const fields = [
//     { name: 'active', code: 'AC' },
//     { name: 'expired', code: 'EX' },
//     { name: 'pending', code: 'SS' },
//   ];

//   useEffect(() => {
//     checkuser();
//     handleSubmit(value); 
//   }, []);

//   useEffect(() => {
//     console.log("Rows state updated:", rows);
//   }, [rows]);

//   const handleSubmit = async (statusValue) => {
//     try {
//       const token = Cookies.get('token');
//       const data = {
//         status: statusValue.name,
//       };
//       console.log("url", `${status}`);
//       const response = await axios.post(status, data, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       setSubStatus(response.data);
//       console.log(response.data);
//       setLength(response.data.length)
//       console.log(response.data.length,"----length");

//       const transformedNodes = transformData(response.data);
//       setNodes(transformedNodes);
//     } catch (error) {
//       console.error('Error submitting status:', error);
//     }
//   };

//   const transformData = (data) => {
//     return data.map((user) => ({
//       key: user.id,
//       data: {
//         id: user.id,
//         msisdn: user.msisdn,
//         nextBilledDateTime: user.nextBilledDateTime || 0,
//         operator: user.operator,
//         pack_type: user.pack_type,
//         service_id: user.service_id,
//         service_name: user.service_name,
//         status: user.status,
//         subDateTime: user.subDateTime,
//       },
//     }));
//   };

//   const handleDropdownChange = (e) => {
//     setValues(e.value);
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     handleSubmit(value); // Trigger data fetch based on selected dropdown value when submit is clicked
//   };

//   const handleDownload = () => {
//     const tableData = nodes.map(node => node.data); // Extract the data from the nodes
//     const ws = XLSX.utils.json_to_sheet(tableData); // Convert the visible data to a sheet
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'subscriber statusdetail');
//     XLSX.writeFile(wb, 'subscriber statusdetail.xlsx');
//   };

//   return (
//     <Layout>
//       <div className="lg:ml-64">
//         <div className="flex justify-between">
//           <span className="font-semibold text-lg text-black">Subscription Status</span>
//         </div>
//       </div>
//       <div className="flex justify-center items-center mt-10">
//         <form
//           onSubmit={handleFormSubmit} // Use this submit handler
//           className="flex flex-col items-center space-y-4 bg-gray-100 p-6 rounded-lg lg:ml-48 shadow-lg w-[300px] lg:w-[400px]"
//         >
//           <div className="flex items-center space-x-4 w-full">
//             <span className='text-black'>Select option</span>
//             <div className="card flex justify-center lg:gap-8">
//               <Dropdown
//                 value={value}
//                 onChange={handleDropdownChange} // Handle dropdown value change
//                 options={fields}
//                 optionLabel="name"
//                 placeholder="Select an Option"
//                 className="w-full md:w-14rem lg:w-[140px]"
//               />
//             </div>
//           </div>
//           <button
//             type="submit"
//             className="bg-blue-500 text-white p-2 rounded hover:bg-blue-400 w-[90px] mt-4"
//           >
//             Submit
//           </button>
//         </form>
//       </div>

//       <div className="flex flex-col justify-center items-center mt-10 lg:ml-60 bg-white">
//         <div className="flex items-center justify-between w-full lg:px-10 px-4 mt-2 lg:mt-4 text-black">
//           <div className="flex items-center">
//             <span className="text-md font-semibold mr-2">Show</span>
//             <Dropdown
//               value={rows}
//               options={[5, 10, 15, 20]}
//               onChange={(e) => {
//                 console.log("Dropdown value selected:", e.value);
//                 setRows(e.value);
//               }}
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
//         <div>
//           <span><strong>Total {value.name} Count:</strong>{length}</span>
//         </div>
//         <TreeTable
//           className="w-[360px] sm:w-[660px] md:w-[790px] lg:w-[900px]"
//           key={rows}
//           value={nodes}
//           rows={rows}
//           paginator
//           rowsPerPageOptions={[5, 10, 15, 20]}
//           tableStyle={{ minWidth: "100rem", marginTop: "20px" }}
//         >
//           <Column field="id" header="SNO" style={{ width: "80px" }} />
//           <Column field="msisdn" header="Msisdn" />
//           <Column field="operator" header="Operator" />
//           <Column field="pack_type" header="Pack Type" />
//           <Column field="service_id" header="Service Id" />
//           <Column field="service_name" header="Service Name" />
//           <Column field="status" header="Status" />
//           <Column field="subDateTime" header="SubDateTime" style={{ width: "240px" }} />
//           <Column field="nextBilledDateTime" header="NextBilledDateTime" style={{ width: "240px" }} />
//         </TreeTable>
//       </div>
//     </Layout>
//   );
// }

// export default SubscriptionStatus;




import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { status } from '../../Data/api'; 
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import * as XLSX from "xlsx";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function SubscriptionStatus() {
  const [nodes, setNodes] = useState([]);
  const [rows, setRows] = useState(5);
  const [substatus, setSubStatus] = useState("");
  const [length, setLength] = useState('');
  const [value, setValues] = useState({ name: 'active', code: 'AC' });
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission state
  const navigate = useNavigate();
  const username = Cookies.get('username');

  const checkuser = () => {
    if (!username || username === null || username === undefined) {
      navigate('/login');
    }
  };

  const fields = [
    { name: 'active', code: 'AC' },
    { name: 'expired', code: 'EX' },
    { name: 'pending', code: 'SS' },
  ];

  useEffect(() => {
    checkuser();
    // Fetch data for the default value on component mount
    handleSubmit(value);
  }, []);

  useEffect(() => {
    console.log("Rows state updated:", rows);
  }, [rows]);

  const handleSubmit = async (statusValue) => {
    try {
      const token = Cookies.get('token');
      const data = {
        status: statusValue.name,
      };
      console.log("url", `${status}`);
      const response = await axios.post(status, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSubStatus(response.data);
      console.log(response.data);
      setLength(response.data.length);
      console.log(response.data.length, "----length");

      const transformedNodes = transformData(response.data);
      setNodes(transformedNodes);
      setIsSubmitted(true); // Set form as submitted
    } catch (error) {
      console.error('Error submitting status:', error);
    }
  };

  const transformData = (data) => {
    return data.map((user, index) => ({
      key: index + 1, // Sequential SNO starting from 1
      data: {
        sno: index + 1, // Sequential SNO starting from 1
        msisdn: user.msisdn,
        nextBilledDateTime: user.nextBilledDateTime || 0,
        operator: user.operator,
        pack_type: user.pack_type,
        service_id: user.service_id,
        service_name: user.service_name,
        status: user.status,
        subDateTime: user.subDateTime,
      },
    }));
  };

  const handleDropdownChange = (e) => {
    setValues(e.value);
    // Reset the submitted state when dropdown value changes
    setIsSubmitted(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(value); // Trigger data fetch based on selected dropdown value when submit is clicked
  };

  const handleDownload = () => {
    const tableData = nodes.map(node => node.data); // Extract the data from the nodes
    const ws = XLSX.utils.json_to_sheet(tableData); // Convert the visible data to a sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'subscriber statusdetail');
    XLSX.writeFile(wb, 'subscriber statusdetail.xlsx');
  };

  return (
    <Layout>
      <div className="lg:ml-64">
        <div className="flex justify-between">
          <span className="font-semibold text-lg text-black">Subscription Status</span>
        </div>
      </div>
      <div className="flex justify-center items-center mt-10">
        <form
          onSubmit={handleFormSubmit} // Use this submit handler
          className="flex flex-col items-center space-y-4 bg-gray-100 p-6 rounded-lg lg:ml-48 shadow-lg w-[300px] lg:w-[400px]"
        >
          <div className="flex items-center space-x-4 w-full">
            <span className='text-black'>Select option</span>
            <div className="card flex justify-center lg:gap-8">
              <Dropdown
                value={value}
                onChange={handleDropdownChange} // Handle dropdown value change
                options={fields}
                optionLabel="name"
                placeholder="Select an Option"
                className="w-full md:w-14rem lg:w-[140px]"
              />
            </div>
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
        {isSubmitted && (
          <div className='lg:mb-4 mb-2 mt-4'>
            <span className='border-2 border-gray-200 rounded-lg lg:px-2 lg:py-4 '><strong>Total {value.name} Count:  </strong>{length}</span>
          </div>
        )}
        <TreeTable
          className="w-[360px] sm:w-[660px] md:w-[790px] lg:w-[900px]"
          key={rows}
          value={nodes}
          rows={rows}
          paginator
          rowsPerPageOptions={[5, 10, 15, 20]}
          tableStyle={{ minWidth: "100rem", marginTop: "20px" }}
        >
          <Column field="sno" header="SNO" style={{ width: "80px" }} />
          <Column field="msisdn" header="Msisdn" />
          <Column field="operator" header="Operator" />
          <Column field="pack_type" header="Pack Type" />
          <Column field="service_id" header="Service Id" />
          <Column field="service_name" header="Service Name" />
          <Column field="status" header="Status" />
          <Column field="subDateTime" header="SubDateTime" style={{ width: "240px" }} />
          <Column field="nextBilledDateTime" header="NextBilledDateTime" style={{ width: "240px" }} />
        </TreeTable>
      </div>
    </Layout>
  );
}

export default SubscriptionStatus;
