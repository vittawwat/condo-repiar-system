import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font
} from "@react-pdf/renderer";

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

// ปิด hyphenation ของ react-pdf ไม่ให้มันพยายามตัดคำไทยเอง
// (เป็นอีกสาเหตุที่ทำให้ตัวอักษรไทยดูแหว่ง/ตกหล่นเวลา wrap บรรทัด)
Font.registerHyphenationCallback((word) => [word]);


/* =========================
   Styles
========================= */

const styles = StyleSheet.create({

    /* =========================
       Page
    ========================= */

    page: {
        padding: 24,
        fontFamily: "Sarabun",
        fontSize: 8,
        color: "#1a1a1a",
    },


    /* =========================
       Header
    ========================= */

    headerRowTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 10,
    },

    headerLeft: {
        flexDirection: "column",
    },

    title: {
        fontSize: 15,
        fontWeight: "bold",
        lineHeight: 1.5,
        marginBottom: 2,
    },

    subtitle: {
        fontSize: 9,
        lineHeight: 1.5,
        color: "#444",
    },

    printDate: {
        fontSize: 8,
        lineHeight: 1.5,
        color: "#666",
        textAlign: "right",
    },


    /* =========================
       Summary
    ========================= */

    summaryContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 12,
    },

    summaryBox: {
        minWidth: 130,
        border: "1 solid #ccc",
        borderRadius: 3,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginLeft: 8,
    },

    summaryBoxHighlight: {
        backgroundColor: "#f2f6fc",
        borderColor: "#9db8dd",
    },

    summaryLabel: {
        fontSize: 8,
        lineHeight: 1.5,
        color: "#555",
        marginBottom: 2,
    },

    summaryValue: {
        fontSize: 12,
        fontWeight: "bold",
        lineHeight: 1.5,
    },


    /* =========================
       Table
    ========================= */

    table: {
        width: "100%",
        borderBottom: "none",
    },

    tableRow: {
        flexDirection: "row",
        alignItems: "stretch",
    },

    headerRow: {
        backgroundColor: "#e9edf3",
    },

    dataRowAlt: {
        backgroundColor: "#f7f8fa",
    },


    /* =========================
       Cell
    ========================= */

    cell: {
        paddingTop: 5,
        paddingBottom: 3,
        paddingHorizontal: 4,
        fontSize: 8,
        lineHeight: 1.5,
    },

    headerCell: {
        fontWeight: "bold",
        fontSize: 8,
        textAlign: "center",
    },


    /* =========================
       Column Width

       วันที่       12%
       ห้อง         8%
       เลขงาน       11%
       ประเภท       13%
       รายการซ่อม   41%
       จำนวนเงิน    15%

       รวม          100%
    ========================= */

    date: {
        width: "12%",
        textAlign: "center",
    },

    room: {
        width: "8%",
        textAlign: "center",
    },

    ticket: {
        width: "11%",
        textAlign: "center",
    },

    category: {
        width: "13%",
        textAlign: "center",
    },

    titleCell: {
        width: "41%",
    },

    cost: {
        width: "15%",
        textAlign: "right",
        borderRight: "none",
    },


    /* =========================
       No Data
    ========================= */

    noData: {
        width: "100%",
        textAlign: "center",
        paddingVertical: 14,
        fontSize: 9,
        lineHeight: 1.5,
        color: "#888",
    },

});

/* =========================
   PDF Component
========================= */

function RepairReportPDF({ report }) {

    return (

        <Document>

            <Page
                size="A4"
                orientation="landscape"
                style={styles.page}
            >

                {/* =========================
                    Header
                ========================= */}

                <View style={styles.headerRowTop}>

                    <View style={styles.headerLeft}>
                        <Text style={styles.title}>
                            รายงานค่าใช้จ่ายงานแจ้งซ่อม
                        </Text>

                        <Text style={styles.subtitle}>
                            ระหว่างวันที่ {formatDateOnly(report.start_date)}
                            {" ถึง "}
                            {formatDateOnly(report.end_date)}
                        </Text>
                    </View>

                    <Text style={styles.printDate}>
                        วันที่จัดทำเอกสาร{"\n"}{formatPrintDate()}
                    </Text>

                </View>


                {/* =========================
                    Summary
                    (แสดงค่าใช้จ่ายรวมที่นี่จุดเดียว
                     ไม่ซ้ำกับด้านล่างของตารางอีก)
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

                    <View style={[styles.summaryBox, styles.summaryBoxHighlight]}>
                        <Text style={styles.summaryLabel}>
                            ค่าใช้จ่ายรวม
                        </Text>
                        <Text style={styles.summaryValue}>
                            {formatMoney(report.summary?.total_cost || 0)} บาท
                        </Text>
                    </View>

                </View>


                {/* =========================
                    Table
                ========================= */}

                <View style={styles.table}>

                    {/* Header */}
                    <View style={[styles.tableRow, styles.headerRow]} fixed>

                        <Text style={[styles.cell, styles.date, styles.headerCell]}>
                            วันที่
                        </Text>

                        <Text style={[styles.cell, styles.room, styles.headerCell]}>
                            ห้อง
                        </Text>

                        <Text style={[styles.cell, styles.ticket, styles.headerCell]}>
                            เลขงาน
                        </Text>

                        <Text style={[styles.cell, styles.category, styles.headerCell]}>
                            ประเภท
                        </Text>

                        <Text style={[styles.cell, styles.titleCell, styles.headerCell]}>
                            รายการซ่อม
                        </Text>

                        <Text style={[styles.cell, styles.cost, styles.headerCell]}>
                            จำนวนเงิน{" "}
                        </Text>

                    </View>


                    {/* Data */}
                    {report.data?.length === 0 ? (

                        <View style={styles.tableRow}>
                            <Text style={styles.noData}>
                                ไม่พบข้อมูลในช่วงวันที่เลือก
                            </Text>
                        </View>

                    ) : (

                        report.data?.map((item, index) => (

                            <View
                                style={[
                                    styles.tableRow,
                                    index % 2 === 1 ? styles.dataRowAlt : null,
                                ]}
                                key={item.ticket_id}
                                wrap={false}
                            >

                                <Text style={[styles.cell, styles.date]}>
                                    {formatDateOnly(item.created_at)}
                                </Text>

                                <Text style={[styles.cell, styles.room]}>
                                    {item.room_number || "-"}
                                </Text>

                                <Text style={[styles.cell, styles.ticket]}>
                                    {formatTicketNumber(item.ticket_id)}
                                </Text>

                                <Text style={[styles.cell, styles.category]}>
                                    {checkCategory(item.category)}
                                </Text>

                                <Text style={[styles.cell, styles.titleCell]}>
                                    {item.title || "-"}
                                    {"  "}
                                </Text>

                                <Text style={[styles.cell, styles.cost]}>
                                    {formatMoney(item.total_cost || 0)} บาท
                                </Text>

                            </View>

                        ))

                    )}
                    

                </View>
                

            </Page>

        </Document>
    );
}


export default RepairReportPDF;