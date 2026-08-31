import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Register.css";

export default function RegisterPage() {

    const navigate = useNavigate();
    const location = useLocation();

    // รับ profile จาก Login ส่งมาเป็นข้อมูล state
    const profile = location.state?.profile;
    const redirectTo = location.state?.redirectTo || "/create-ticket";
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

            navigate(redirectTo);

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="register-page">
            <div className="register-card">

                <h1 className="register-title">Register</h1>
                <p className="register-subtitle">
                    Register to access the system
                </p>

                <form onSubmit={handleSubmit} className="register-form">

                    <div className="form-group">
                        <label>Full-Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Room Number</label>
                        <input
                            type="text"
                            placeholder="A-101"
                            value={room_number}
                            onChange={(e) => setRoomNumber(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            placeholder="08xxxxxxxx"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="submit-btn">
                        Register
                    </button>

                </form>

            </div>
        </div>

    );
}