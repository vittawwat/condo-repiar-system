import { useState } from 'react';

export default function DateDropdown({ onSearch, onReset }) {

    // วันที่เริ่มต้น
    const [startDay, setStartDay] = useState('');
    const [startMonth, setStartMonth] = useState('');
    const [startYear, setStartYear] = useState('');

    // วันที่สิ้นสุด
    const [endDay, setEndDay] = useState('');
    const [endMonth, setEndMonth] = useState('');
    const [endYear, setEndYear] = useState('');

    const today = new Date();

    // พ.ศ. -> ค.ศ.
    const toCE = (day, month, year) => {
        const ceYear = Number(year) - 543;

        return `${ceYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const handleSearch = () => {
        // ต้องมีอย่างน้อยเดือนและปีเริ่มต้น
        if (!startMonth || !startYear) {
            alert('กรุณาเลือกเดือนและปีเริ่มต้น');
            return;
        }

        // ถ้าไม่เลือกวันเริ่มต้น ใช้วันที่ 1
        const sDay = startDay || '1';

        // ถ้ามี endMonth/endYear แต่ไม่เลือกวันสิ้นสุด ให้ใช้วันสุดท้ายของเดือน
        let eDay = endDay;
        if (endMonth && endYear && !eDay) {
            const ceYear = Number(endYear) - 543;
            eDay = String(new Date(ceYear, Number(endMonth), 0).getDate());
        }

        const payload = {
            startDate: toCE(sDay, startMonth, startYear)
        };

        // ส่ง endDate เฉพาะเมื่อเลือกเดือนและปีสิ้นสุด
        if (endMonth && endYear) {
            payload.endDate = toCE(eDay, endMonth, endYear);
        }

        onSearch(payload);
    };

    const resetAll = () => {
        setStartDay('');
        setStartMonth('');
        setStartYear('');

        setEndDay('');
        setEndMonth('');
        setEndYear('');

        onReset();
    };

    const months = [
        '01', '02', '03', '04',
        '05', '06', '07', '08',
        '09', '10', '11', '12'
    ];

    const years = Array.from({ length: 5 }, (_, i) =>
        String(today.getFullYear() + 543 - i)
    );

    return (
        <div className="date-search">

            <div className="date-group">
                <span>จาก</span>

                <select value={startDay} onChange={(e) => setStartDay(e.target.value)}>
                    <option value="">วัน</option>
                    {Array.from({ length: 31 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1)}>
                            {i + 1}
                        </option>
                    ))}
                </select>

                <select value={startMonth} onChange={(e) => setStartMonth(e.target.value)}>
                    <option value="">เดือน</option>
                    {months.map((m, i) => (
                        <option key={i + 1} value={String(i + 1)}>
                            {m}
                        </option>
                    ))}
                </select>

                <select value={startYear} onChange={(e) => setStartYear(e.target.value)}>
                    <option value="">ปี</option>
                    {years.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>

            <div className="date-group">
                <span>ถึง</span>

                <select value={endDay} onChange={(e) => setEndDay(e.target.value)}>
                    <option value="">วัน</option>
                    {Array.from({ length: 31 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1)}>
                            {i + 1}
                        </option>
                    ))}
                </select>

                <select value={endMonth} onChange={(e) => setEndMonth(e.target.value)}>
                    <option value="">เดือน</option>
                    {months.map((m, i) => (
                        <option key={i + 1} value={String(i + 1)}>
                            {m}
                        </option>
                    ))}
                </select>

                <select value={endYear} onChange={(e) => setEndYear(e.target.value)}>
                    <option value="">ปี</option>
                    {years.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>

            <button className="search-btn" onClick={handleSearch}>
                ค้นหา
            </button>

            <button className="reset-btn" onClick={resetAll}>
                รีเซ็ต
            </button>

        </div>
    );
}