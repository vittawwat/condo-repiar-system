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
                const line_token = await liff.getIDToken();
                localStorage.setItem("line_token", line_token);

                // const line_id = profile.userId;

                console.log("PROFILE:", profile); 
                // console.log("line_id", line_id);


                const response = await axios.get(`/api/residents/registration-status`, {
                    // params: {
                    //     line_id: line_id, // ส่งไปในรูปแบบ Query Parameter (?line_id=xxx)
                    // }
                    headers: {
                        Authorization: `Bearer ${line_token}`,
                    },
                });

                const data = response.data
                console.log("CHECK USER:", data);

                console.log("LOGIN PAGE");
                // user ใหม่
                if (!data.isRegistered) {

                    navigate("/register", {
                        // ส่งค่า state ไปที่หน้า register
                        state: {
                            profile,
                        },
                    });

                }

                // user เก่า
                else {
                    const loginResponse = await axios.post(
                        "/api/residents/login",
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${line_token}`
                            }
                        }
                    )
                    const jwt_Token = loginResponse.data.access_token
                    localStorage.setItem("token", jwt_Token)

                    console.log("GO DASHBOARD");
                    navigate("/create-ticket");
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