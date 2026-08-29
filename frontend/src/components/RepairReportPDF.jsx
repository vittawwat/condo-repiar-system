import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import {
    checkCategory,
    formatTicketNumber,
    formatDateOnly,
    formatMoney,
    formatPrintDate,
} from "../utils/ticketUtils";


/* =========================
   Font
========================= */

Font.register({
    family: "Sarabun",
    fonts: [
        {
            src: "/fonts/Sarabun-Regular.ttf",
            fontWeight: "normal"
        },
        {
            src: "/fonts/Sarabun-Bold.ttf",
            fontWeight: "bold"
        }
    ]
});


/* =========================
   Styles
========================= */

const styles = StyleSheet.create({

    page: {
        padding: 30,
        fontFamily: "Sarabun",
        fontSize: 10
    },

    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 6
    },

    subtitle: {
        fontSize: 11,
        textAlign: "center",
        marginBottom: 20
    },


    /* =========================
       Summary
    ========================= */

    summaryContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 20
    },

    summaryBox: {
        width: 180,
        border: "1 solid #999",
        padding: 10,
        marginLeft: 10
    },

    summaryLabel: {
        fontSize: 10,
        marginBottom: 4
    },

    summaryValue: {
        fontSize: 15,
        fontWeight: "bold"
    },


    /* =========================
       Table
    ========================= */

    table: {
        width: "100%",
        border: "1 solid #000"
    },

    tableRow: {
        flexDirection: "row",
        borderBottom: "1 solid #999",
        minHeight: 30,
        alignItems: "center"
    },

    headerRow: {
        backgroundColor: "#eeeeee"
    },

    cell: {
        padding: 0,
        borderRight: "0 solid #999",
        fontSize: 9
    },


    /* =========================
       Column Width
    ========================= */

    ticket: {
        width: "9%",
        textAlign: "center"
    },

    date: {
        width: "11%",
        textAlign: "center"
    },

    room: {
        width: "7%",
        textAlign: "center"
    },

    titleCell: {
        width: "17%"
    },

    category: {
        width: "10%",
        textAlign: "center"
    },

    technician: {
        width: "13%"
    },

    reason: {
        width: "23%"
    },

    cost: {
        width: "10%",
        textAlign: "right",
        borderRight: "none"
    },


    /* =========================
       Total
    ========================= */

    totalRow: {
        marginTop: 15,
        alignItems: "flex-end"
    },

    totalText: {
        fontSize: 13,
        fontWeight: "bold"
    }

});


/* =========================
   PDF Component
========================= */

function RepairReportPDF({ report }) {
    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                {/* =========================
                    Header
                ========================= */}
                <Text style={styles.title}>
                    รายงานค่าใช้จ่ายงานแจ้งซ่อม
                </Text>

                <Text style={styles.subtitle}>
                    ระหว่างวันที่{" "}{formatDateOnly(report.start_date)}{" ถึง "}{formatDateOnly(report.end_date)}
                </Text>

                <Text style={styles.printDate}>
                    วันที่จัดทำเอกสาร: {formatPrintDate()}
                </Text>

                {/* =========================
                    Summary
                ========================= */}
                <View style={styles.summaryContainer}>

                    <View style={styles.summaryBox}>
                        <Text style={styles.summaryLabel}>
                            จำนวนรายการ
                        </Text>

                        <Text style={styles.summaryValue}>
                            {Number(report.summary?.total_items || 0).toLocaleString("th-TH")} รายการ
                        </Text>
                    </View>


                    <View style={styles.summaryBox}>
                        <Text style={styles.summaryLabel}>
                            ค่าใช้จ่ายรวม
                        </Text>

                        <Text style={styles.summaryValue}>
                            {formatMoney(report.summary?.total_cost)} บาท
                        </Text>
                    </View>
                </View>


                {/* =========================
                    Table
                ========================= */}

                <View style={styles.table}>
                    {/* Table Header */}
                    <View style={[styles.tableRow, styles.headerRow]} >

                        <Text style={[styles.cell, styles.ticket]}>
                            เลขงาน
                        </Text>

                        <Text style={[styles.cell, styles.date]}>
                            วันที่แจ้ง
                        </Text>

                        <Text style={[styles.cell, styles.room]}>
                            ห้อง
                        </Text>

                        <Text style={[styles.cell, styles.titleCell]}>
                            รายการซ่อม
                        </Text>

                        <Text style={[styles.cell, styles.category]}>
                            ประเภท
                        </Text>

                        <Text style={[styles.cell, styles.technician]}>
                            ช่าง
                        </Text>

                        <Text style={[styles.cell, styles.reason]}>
                            รายละเอียด
                        </Text>

                        <Text style={[styles.cell, styles.cost]}>
                            ค่าใช้จ่าย
                        </Text>

                    </View>

                    {/* Table Data */}
                    {report.data?.map((item) => (

                        <View
                            style={styles.tableRow}
                            key={item.ticket_id}
                        >
                            {/* Ticket Number */}
                            <Text style={[styles.cell, styles.ticket]}>
                                {formatTicketNumber(item.ticket_id)}
                            </Text>

                            {/* Date */}
                            <Text style={[styles.cell, styles.date]}>
                                {formatDateOnly(item.created_at)}
                            </Text>

                            {/* Room */}
                            <Text style={[styles.cell, styles.room]}>
                                {item.room_number || "-"}
                            </Text>

                            {/* Title */}
                            <Text style={[styles.cell, styles.titleCell]}>
                                {item.title || "-"}
                            </Text>

                            {/* Category */}
                            <Text style={[styles.cell, styles.category]}>
                                {checkCategory(item.category)}
                            </Text>

                            {/* Technician */}
                            <Text style={[styles.cell, styles.technician]}>
                                {item.technician_name || "-"}
                            </Text>

                            {/* Reason */}
                            <Text style={[styles.cell, styles.reason]}>
                                {item.reason || "-"}
                            </Text>

                            {/* Cost */}
                            <Text style={[styles.cell, styles.cost]}>
                                {formatMoney(item.total_cost)}
                            </Text>

                        </View>
                    ))}
                </View>


                {/* =========================
                    Total
                ========================= */}

                <View style={styles.totalRow}>

                    <Text style={styles.totalText}>
                        รวมค่าใช้จ่ายทั้งหมด:{" "}{formatMoney(report.summary?.total_cost)} บาท
                    </Text>

                </View>

            </Page>

        </Document>

    );

}


export default RepairReportPDF;