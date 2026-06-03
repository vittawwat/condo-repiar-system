import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import liff from "@line/liff";

export default function Login() {

    const navigate = useNavigate();

    useEffect(() => {

        const run = async () => {

            try {

                await liff.init({
                    liffId: import.meta.env.VITE_LIFF_ID,
                });

                console.log("LIFF INIT SUCCESS");

                if (!liff.isLoggedIn()) {

                    liff.login();

                    return;
                }

                const profile = await liff.getProfile();
                const token = await liff.getIDToken();
                localStorage.setItem("token", token);

                const line_id = profile.userId;

                console.log("PROFILE:", profile);
                console.log("line_id", line_id);
                
                

                const response = await axios.get(`/api/residents/registration-status`,{
                    params:{
                        line_id: line_id, // ส่งไปในรูปแบบ Query Parameter (?line_id=xxx)
                    }
                });

                console.log("CHECK USER:", response.data);
                console.log("LOGIN PAGE");
                // user ใหม่
                if (response.data.newUser) {

                    navigate("/register", {
                        // ส่งค่า state ไปที่หน้า register
                        state: {
                            profile,
                        },
                    });

                }
                
                // user เก่า
                else {
                    console.log("GO DASHBOARD");
                    navigate("/home");

                }

            } catch (error) {

                console.log("LIFF ERROR:", error.message);

            }

        };

        run();

    }, []);

    return (
        <div>
            <h1>Login Page</h1>
        </div>
    );
}