import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

export default function CreateTicket() {
  const [user, setUser] = useState('');
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchData = async () => {

      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.get("/api/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

        .then((res) => {
          console.log(res.data.result);
          // ทำการ setUser โดยใช้ token ว่าเป็นuserที่เข้ามาใช้งานจริงไหม
          setUser(res.data.result)

        })
        .catch(() => {
          localStorage.removeItem('token');
          console.log("กรุณา login ");

        })

    }
    fetchData();
  }, [])

  // useEffect(() => {

  //   console.log(user);

  // }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!title || !detail || !category){
      alert("กรุณากรอกข้อมูลให้ครบ")
    }

    try {
      const response = await axios.post("/api/create-ticket",
        {
          user_id: user.user_id,
          title,
          detail,
          category
        });
      console.log("Create-ticket success", response.data);
      alert("แจ้งซ้อมสำเร็จ")

    } catch (error) {
      console.log(error);

    }
  }


  return (
    <div>
      <h1>CREATE TICKET</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label> title </label>
          <input type="text" value={title} onChange={(e) => {
            console.log(e.target.value);
            setTitle(e.target.value)
          }}></input>
        </div>
        <br />
        <div>
          <label> detail </label>
          <input type="text" value={detail} onChange={(e) => setDetail(e.target.value)}></input>
        </div>
        <br />
        <div>
          <label> category </label>
          <select value={category} onChange={(e) => {
            console.log(e.target.value);
            setCategory(e.target.value)}}>
            <option value="">  เลือกประเภท </option>
            <option value="electric"> ไฟฟ้า </option>
            <option value="plumbing"> ประปา </option>
            <option value="aircon"> แอร์ </option>
            <option value="other"> อื่นๆ </option>
          </select>
        </div>

        <button type="submit"> CreateTicket </button>
      </form>
    </div>
  );
}
