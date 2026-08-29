import "./DateTimePicker.css";

export default function DateTimePicker({
    value,
    onChange,
    label = "วันนัดหมาย",
    showTime = true
}) {

    const date = value?.split("T")[0] || "";
    const time = value?.split("T")[1] || "";

    const handleDateChange = (e) => {

        const newDate = e.target.value;

        if (showTime) {
            onChange(
                `${newDate}T${time || "09:00"}`
            );
        } else {
            onChange(newDate);
        }
    };


    const handleTimeChange = (e) => {

        const newTime = e.target.value;

        onChange(
            `${date}T${newTime}`
        );
    };


    return (
        <div className="datetime-picker">

            <label className="datetime-picker__label">
                {label}
            </label>

            <div className="datetime-picker__inputs">

                {/* วันที่ */}
                <div className="datetime-picker__field">

                    <span>วันที่</span>

                    <input
                        type="date"
                        value={date}
                        onChange={handleDateChange}
                    />

                </div>


                {/* เวลา */}
                {showTime && (
                    <div className="datetime-picker__field">

                        <span>เวลา</span>

                        <input
                            type="time"
                            value={time}
                            onChange={handleTimeChange}
                        />

                    </div>
                )}

            </div>

        </div>
    );
}