import { useState } from "react";
import axios from "axios";
import "./Reports.css";

import {
    formatTicketNumber,
    checkCategory,
    formatDateOnly,
    formatMoney
} from "../utils/ticketUtils";

import { PDFDownloadLink } from "@react-pdf/renderer";
import RepairReportPDF from "../components/RepairReportPDF";
import DateDropdown from "../components/DateDropdown";
import Pagination from "../components/Pagination";

function Reports() {

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [report, setReport] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 10;


    // =========================
    // ค้นหารายงาน
    // =========================
    const handleSearch = async (start, end) => {

        if (!start || !end) {
            alert("กรุณาเลือกวันที่เริ่มต้นและวันที่สิ้นสุด");
            return;
        }

        if (start > end) {
            alert("วันที่เริ่มต้นต้องไม่มากกว่าวันที่สิ้นสุด");
            return;
        }

        try {

            const response = await axios.get(
                "/api/reports/repair",
                {
                    params: {
                        start_date: start,
                        end_date: end
                    }
                }
            );

            setReport(response.data);
            setCurrentPage(1);

        } catch (error) {

            console.error("Report error:", error);

            alert(
                error.response?.data?.message ||
                "ไม่สามารถโหลดรายงานได้"
            );
        }
    };
    
    const paginatedData = report
        ? report.data.slice(
            (currentPage - 1) * PAGE_SIZE,
            currentPage * PAGE_SIZE
        )
        : [];

    return (

        <div className="reports-page">

            {/* =========================
                Header
            ========================= */}

            <div className="reports-header">

                <div>

                    <h2>
                        รายงานค่าใช้จ่าย
                    </h2>

                    <p>
                        สรุปค่าใช้จ่ายงานแจ้งซ่อมตามช่วงวันที่
                    </p>

                </div>

            </div>


            {/* =========================
                Filter
            ========================= */}

            <div className="report-filter">

                <DateDropdown
                    onSearch={({ startDate, endDate }) => {

                        setStartDate(startDate);
                        setEndDate(endDate);

                        handleSearch(startDate, endDate);
                    }}

                    onReset={() => {

                        setStartDate("");
                        setEndDate("");
                        setReport(null);

                    }}
                />

            </div>


            {/* =========================
                Report
            ========================= */}

            {report && (

                <>

                    {/* =========================
                        Summary
                    ========================= */}

                    <div className="report-summary">

                        <div className="summary-card">

                            <div className="summary-label">
                                จำนวนรายการ
                            </div>

                            <div className="summary-value">

                                {Number(
                                    report.summary.total_items
                                ).toLocaleString("th-TH")}

                            </div>

                            <div className="summary-unit">
                                รายการ
                            </div>

                        </div>


                        <div className="summary-card total-cost-card">

                            <div className="summary-label">
                                ค่าใช้จ่ายรวม
                            </div>

                            <div className="summary-value">

                                {formatMoney(
                                    report.summary.total_cost
                                )}

                            </div>

                            <div className="summary-unit">
                                บาท
                            </div>

                        </div>

                    </div>


                    {/* =========================
                        Report Period
                    ========================= */}

                    <div className="report-period">

                        รายงานระหว่างวันที่{" "}

                        <strong>
                            {formatDateOnly(report.start_date)}
                        </strong>

                        {" "}ถึง{" "}

                        <strong>
                            {formatDateOnly(report.end_date)}
                        </strong>

                    </div>


                    {/* =========================
                        PDF
                    ========================= */}

                    <PDFDownloadLink
                        document={<RepairReportPDF report={report} />}
                        fileName={`repair-report-${report.start_date}-${report.end_date}.pdf`}
                        className="export-pdf-btn"
                    >
                       Export PDF
                    </PDFDownloadLink>


                    {/* =========================
                        Table
                    ========================= */}

                    <div className="report-table-container">

                        <table className="report-table">

                            <thead>

                                <tr>

                                    <th>
                                        วันที่
                                    </th>

                                    <th>
                                        ห้อง
                                    </th>

                                    <th>
                                        เลขงาน
                                    </th>

                                    <th>
                                        ประเภท
                                    </th>

                                    <th>
                                        รายการซ่อม
                                    </th>

                                    <th>
                                        จำนวนเงิน
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {report.data.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="no-data"
                                        >
                                            ไม่พบข้อมูลในช่วงวันที่เลือก
                                        </td>

                                    </tr>

                                ) : (

                                    paginatedData.map((item) => (

                                        <tr
                                            key={item.ticket_id}
                                        >

                                            {/* วันที่ */}

                                            <td>
                                                {formatDateOnly(
                                                    item.created_at
                                                )}
                                            </td>


                                            {/* ห้อง */}

                                            <td>

                                                <span className="room-badge">

                                                    {item.room_number}

                                                </span>

                                            </td>


                                            {/* เลขงาน */}

                                            <td>

                                                <strong>
                                                    {formatTicketNumber(
                                                        item.ticket_id
                                                    )}
                                                </strong>

                                            </td>


                                            {/* ประเภท */}

                                            <td>

                                                <span className="category-badge">

                                                    {checkCategory(
                                                        item.category
                                                    )}

                                                </span>

                                            </td>


                                            {/* รายการซ่อม */}

                                            <td>
                                                {item.title}
                                            </td>


                                            {/* จำนวนเงิน */}

                                            <td className="cost-cell">

                                                {formatMoney(
                                                    item.total_cost
                                                )}{" "}
                                                บาท

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                        <Pagination
                            currentPage={currentPage}
                            totalItems={report.data.length}
                            pageSize={PAGE_SIZE}
                            onPageChange={setCurrentPage}
                        />

                    </div>

                </>

            )}

        </div>

    );
}

export default Reports;