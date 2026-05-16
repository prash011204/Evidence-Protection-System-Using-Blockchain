// // // src/Components/Upload.js

// // import React, { useEffect, useState } from "react";
// // import { message, Spin } from "antd";

// // export default function Upload() {

// //   useEffect(() => {
// //     document.title = "EPB | Upload";
// //   }, []);

// //   const [caseNo, setCaseNo] = useState("");
// //   const [caseName, setCaseName] = useState("");
// //   const [file, setFile] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   function containsOnlyNumbers(str) {
// //     return /^[0-9]+$/.test(str);
// //   }

// //   const handleSubmit = async (e) => {

// //     e.preventDefault();

// //     if (!containsOnlyNumbers(caseNo)) {
// //       message.error("Invalid Case number");
// //       return;
// //     }

// //     if (!file) {
// //       message.error("Please select a file");
// //       return;
// //     }

// //     setLoading(true);

// //     const formData = new FormData();
// //     formData.append("caseNo", caseNo);
// //     formData.append("caseName", caseName);
// //     formData.append("evidence", file);

// //     try {

// //       const response = await fetch("http://localhost:5000/api/upload", {
// //         method: "POST",
// //         headers: {
// //           Authorization: `Bearer ${sessionStorage.getItem("token")}`
// //         },
// //         body: formData
// //       });

// //       const data = await response.json();

// //       message[data.messageType](data.messageContent);

// //       setCaseNo("");
// //       setCaseName("");
// //       setFile(null);

// //     } catch (error) {

// //       console.error(error);
// //       message.error("Server Error");

// //     } finally {

// //       setLoading(false);

// //     }
// //   };

// //   return (

// //     <div className="upload-page">

// //       <div className="upload-card">

// //         <h2 className="upload-title">
// //           Upload Evidence
// //         </h2>

// //         <form onSubmit={handleSubmit} className="upload-form">

// //           <div className="upload-field">

// //             <label>Case Number</label>

// //             <input
// //               type="text"
// //               placeholder="Enter Case Number"
// //               value={caseNo}
// //               onChange={(e) => setCaseNo(e.target.value)}
// //               required
// //             />

// //           </div>

// //           <div className="upload-field">

// //             <label>Case Name</label>

// //             <input
// //               type="text"
// //               placeholder="Enter Case Name"
// //               value={caseName}
// //               onChange={(e) => setCaseName(e.target.value)}
// //               required
// //             />

// //           </div>

// //           <div className="upload-field">

// //             <label>Document</label>

// //             <input
// //               type="file"
// //               onChange={(e) => setFile(e.target.files[0])}
// //               required
// //             />

// //           </div>

// //           <button className="upload-button">

// //             {loading ? <Spin /> : "Upload"}

// //           </button>

// //         </form>

// //       </div>

// //     </div>

// //   );
// // }




// import React, { useEffect, useState } from "react";
// import { message, Spin } from "antd";

// export default function Upload() {

//   useEffect(() => {
//     document.title = "EPB | Upload";
//   }, []);

//   const [caseNo, setCaseNo] = useState("");
//   const [caseName, setCaseName] = useState("");
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // 🔥 debounce timer
//   useEffect(() => {

//     if (!caseNo) {
//       setCaseName("");
//       return;
//     }

//     const timer = setTimeout(async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/api/caseName/${caseNo}`);
//         const data = await res.json();

//         if (data.caseName) {
//           setCaseName(data.caseName);
//         } else {
//           setCaseName("");
//         }

//       } catch (err) {
//         console.error(err);
//       }
//     }, 300); // 🔥 delay

//     return () => clearTimeout(timer);

//   }, [caseNo]);

//   function containsOnlyNumbers(str) {
//     return /^[0-9]+$/.test(str);
//   }

//   const handleSubmit = async (e) => {

//     e.preventDefault();

//     if (!containsOnlyNumbers(caseNo)) {
//       message.error("Invalid Case number");
//       return;
//     }

//     if (!file) {
//       message.error("Please select a file");
//       return;
//     }

//     setLoading(true);

//     const formData = new FormData();
//     formData.append("caseNo", caseNo);
//     formData.append("caseName", caseName);
//     formData.append("evidence", file);

//     try {

//       const response = await fetch("http://localhost:5000/api/upload", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${sessionStorage.getItem("token")}`
//         },
//         body: formData
//       });

//       const data = await response.json();

//       message[data.messageType](data.messageContent);

//       setCaseNo("");
//       setCaseName("");
//       setFile(null);

//     } catch (error) {

//       console.error(error);
//       message.error("Server Error");

//     } finally {

//       setLoading(false);

//     }
//   };

//   return (

//     <div className="upload-page">

//       <div className="upload-card">

//         <h2 className="upload-title">
//           Upload Evidence
//         </h2>

//         <form onSubmit={handleSubmit} className="upload-form">

//           <div className="upload-field">

//             <label>Case Number</label>

//             <input
//               type="text"
//               placeholder="Enter Case Number"
//               value={caseNo}
//               onChange={(e) => setCaseNo(e.target.value)}
//               required
//             />

//           </div>

//           <div className="upload-field">

//             <label>Case Name</label>

//             <input
//               type="text"
//               value={caseName}
//               readOnly   // 🔥 auto-filled
//               placeholder="Auto fetched..."
//             />

//           </div>

//           <div className="upload-field">

//             <label>Document</label>

//             <input
//               type="file"
//               onChange={(e) => setFile(e.target.files[0])}
//               required
//             />

//           </div>

//           <button className="upload-button">
//             {loading ? <Spin /> : "Upload"}
//           </button>

//         </form>

//       </div>

//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import { message, Spin } from "antd";

export default function Upload() {

  useEffect(() => {
    document.title = "EPB | Upload";
  }, []);

  const [caseNo, setCaseNo] = useState("");
  const [caseName, setCaseName] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  function containsOnlyNumbers(str) {
    return /^[0-9]+$/.test(str);
  }

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!containsOnlyNumbers(caseNo)) {
      message.error("Invalid Case number");
      return;
    }

    if (!caseName.trim()) {
      message.error("Case name is required");
      return;
    }

    if (!file) {
      message.error("Please select a file");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("caseNo", caseNo);
    formData.append("caseName", caseName);
    formData.append("evidence", file);

    try {

      const token = sessionStorage.getItem("token");
      console.log("🔥 TOKEN:", token); // debug

      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      message[data.messageType](data.messageContent);

      setCaseNo("");
      setCaseName("");
      setFile(null);

    } catch (error) {

      console.error(error);
      message.error("Server Error");

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="upload-page">

      <div className="upload-card">

        <h2 className="upload-title">
          Upload Evidence
        </h2>

        <form onSubmit={handleSubmit} className="upload-form">

          <div className="upload-field">

            <label>Case Number</label>

            <input
              type="text"
              placeholder="Enter Case Number"
              value={caseNo}
              onChange={(e) => setCaseNo(e.target.value)}
              required
            />

          </div>

          <div className="upload-field">

            <label>Case Name</label>

            <input
              type="text"
              placeholder="Enter Case Name"
              value={caseName}
              onChange={(e) => setCaseName(e.target.value)}
              required
            />

          </div>

          <div className="upload-field">

            <label>Document</label>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />

          </div>

          <button className="upload-button">
            {loading ? <Spin /> : "Upload"}
          </button>

        </form>

      </div>

    </div>
  );
}