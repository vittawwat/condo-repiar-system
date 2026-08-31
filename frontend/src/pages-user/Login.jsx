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

                // สำคัญ: อ่าน query param "หลัง" liff.init() เสร็จเท่านั้น
                // เพราะรอบแรกที่หน้าโหลด ค่า ?redirect=... จะถูกซ่อนอยู่ใน ?liff.state=...
                // ต้องรอ LIFF SDK คืนค่า URL จริงก่อน ถึงจะอ่าน ?redirect ตรงๆ ได้
                // อ่านจาก window.location.search สดๆ ตรงนี้ ไม่ใช่จาก hook ที่ผูกกับตอน mount
                const redirectTo =
                    new URLSearchParams(window.location.search).get("redirect") ||
                    "/create-ticket";
                // console.log("URLSearchParams",window.location.search,redirectTo);
                
                if (!liff.isLoggedIn()) {

                    // liff.login();
                    liff.login({ redirectUri: window.location.href });
                    return;
                }

                const profile = await liff.getProfile();
                const line_token = await liff.getIDToken();
                localStorage.setItem("line_token", line_token);

                // const line_id = profile.userId;

                console.log("PROFILE:", profile); 
                // console.log("line_id", line_id);

                // params: {
                    //     line_id: line_id, // ส่งไปในรูปแบบ Query Parameter (?line_id=xxx)
                    // }
                const response = await axios.get(`/api/residents/registration-status`, {
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
                        // ส่งค่า state ไปที่หน้า register พร้อมปลายทางที่จะไปต่อหลังสมัครเสร็จ
                        state: {
                            profile,
                            redirectTo,
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

                    navigate(redirectTo);
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