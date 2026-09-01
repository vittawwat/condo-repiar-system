import { useEffect, useState } from "react";
import axios from "axios";
import TechnicianModalDetail from "../components/TechnicianModalDetail";
import AddTechnicianModal from "../components/AddTechnicianModal";
import Pagination from "../components/Pagination";
import "./Technicians.css";
import { checkCategory } from "../utils/ticketUtils";
export default function Technicians() {
  const [technicians, setTechnicians] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [showModalTech,setshowModalTech] = useState(false);
  const [showModalAddTech,setshowModalAddTech] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const fetchTechnicians = async () => {
    try {
      const response = await axios.get("/api/technician");
      if(!response){
        console.log(response);
        alert("ไม่พบข้อมูลช่าง")
      }
      console.log("resTechnicain",response.data.Alltechnicians);
      
      setTechnicians(response.data.Alltechnicians || response.data);
    } catch (error) {
      console.error(error);
      alert("โหลดข้อมูลช่างไม่สำเร็จ");
    }
  };

   useEffect(() => {
    fetchTechnicians();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [technicians]);

  const paginatedTechnicians = technicians.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="technicians-page">

      <div className="page-header">
        <h2>จัดการข้อมูลช่าง</h2>

        <button
          className="add-btn"
          onClick={() => setshowModalAddTech(true)}
        >
          เพิ่มข้อมูลช่าง
        </button>
      </div>

      <div className="table-wrapper">

        <table className="tech-table">

          <thead>
            <tr>
              <th>ชื่อช่าง</th>
              <th>ตำแหน่งช่าง</th>
              <th>เบอร์โทร</th>
              <th>จัดการ</th>
            </tr>
          </thead>

          <tbody>
            {paginatedTechnicians.map((tech) => (
              <tr key={tech.technician_id}>

                <td>{tech.firstname} {tech.lastname}</td>

                <td>{checkCategory(tech.skill)}</td>

                <td>{tech.phone }</td>

                <td>
                  <button
                    className="detail-btn"
                    onClick={() => {
                      setSelectedTech(tech)
                      setshowModalTech(true)
                    }}
                  >
                    ดูรายละเอียด
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

        <Pagination
          currentPage={currentPage}
          totalItems={technicians.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />

      </div>

      {selectedTech && showModalTech &&(
        <TechnicianModalDetail
          technician={selectedTech}
          onClose={() => setshowModalTech(false)}
        />
      )}

      {showModalAddTech && (
        <AddTechnicianModal
          onClose={() => setshowModalAddTech(false)}
          onSuccess={fetchTechnicians}
        />
      )
      }

    </div>
  );
}