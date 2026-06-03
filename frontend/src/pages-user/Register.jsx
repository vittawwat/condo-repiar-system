import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function RegisterPage() {

    const navigate = useNavigate();
    const location = useLocation();

    // รับ profile จาก Login ส่งมาเป็นข้อมูล state
    const profile = location.state?.profile;
    const line_token = localStorage.getItem("line_token");
    
    const [fullname, setFullname] = useState("");
    const [room_number, setRoomNumber] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        console.log("Register PAGE");
        
        // console.log("line_PROFILE:", profile);
        // console.log("line_token:", line_token);
        // console.log(typeof localStorage.getItem("line_token"))

        if (!line_token) {
            navigate("/");
        }

    }, []);


    // submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(fullname);
        console.log(room_number);
        console.log(phone);
        try {

            const response = await axios.post("/api/residents/register",
                {
                    line_id: profile.userId,
                    fullname,
                    room_number,
                    phone
                }
            );

            console.log(response.data);

            alert("Register Success");

            navigate("/");

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div style={styles.container}>

            <h1>Register</h1>

            <form onSubmit={handleSubmit} style={styles.form} >

                <input type="text" placeholder="ชื่อ-นามสกุล" value={fullname} onChange={(e) => {
                    console.log("value:", e.target.value);
                    setFullname(e.target.value)
                }} />
                <input type="text" placeholder="หมายเลขห้อง" value={room_number} onChange={(e) =>
                    setRoomNumber(e.target.value)} />
                <input type="text" placeholder="เบอร์โทรศัพท์" value={phone} onChange={(e) =>
                    setPhone(e.target.value)} />

                <button type="submit"> Register </button>

            </form>

        </div>

    );
}

const styles = {

    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "300px",
    },

};