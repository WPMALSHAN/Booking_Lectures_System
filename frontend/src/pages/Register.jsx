import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email.trim());

export default function Register() {

  const navigate = useNavigate();

  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [emailError,setEmailError] = useState("");
  const [passwordError,setPasswordError] = useState("");

  const [formData,setFormData] = useState({
    firstname:"",
    lastname:"",
    email:"",
    password:"",
    role:"student",
    department:""
  });

  const filled = Object.entries(formData).filter(([k,v]) => k !== "role" && v !== "").length;
  const progress = Math.min(100,Math.round((filled/5)*100));

  const handleChange = (e) => {

    const {name,value} = e.target;
    let v = value;

    if(name==="firstname" || name==="lastname")
      v = value.replace(/[0-9]/g,"");

    if(name==="password"){
      v = value.slice(0,8);
      setPasswordError(v.length>0 && v.length!==8 ? "Password must be exactly 8 characters" : "");
    }

    if(name==="email"){
      setEmailError(
        !value.trim()
        ? "Email is required"
        : !validateEmail(value)
        ? "Please enter a valid Gmail address"
        : ""
      );
    }

    setFormData(p=>({...p,[name]:v}));
  };

  const handleRegister = async(e)=>{

    e.preventDefault();
    setError("");

    if(!formData.email.trim())
      return setEmailError("Email is required");

    if(!validateEmail(formData.email))
      return setEmailError("Please enter a valid Gmail address");

    if(!formData.firstname || !formData.lastname || !formData.password)
      return setError("Please fill all required fields");

    if(formData.password.length!==8)
      return setPasswordError("Password must be exactly 8 characters");

    try{

      setLoading(true);

      await API.post("/auth/register",formData);

      setFormData({
        firstname:"",
        lastname:"",
        email:"",
        password:"",
        role:"student",
        department:""
      });

      navigate("/login");

    }catch(err){

      setError(err.response?.data?.message || "Registration failed");

    }finally{
      setLoading(false);
    }
  };

  return(

<div style={{
fontFamily:"'DM Sans','Segoe UI',sans-serif",
minHeight:"100vh",
background:"#F8F7F4",
display:"flex",
alignItems:"center",
justifyContent:"center",
padding:24
}}>

<style>{`
*{box-sizing:border-box}

.auth-input{
width:100%;
padding:13px 16px 13px 44px;
background:white;
border:1.5px solid #E8E6E0;
border-radius:12px;
outline:none;
color:#1a1a2e;
font-size:.9rem;
}

.auth-input:focus{
border-color:#7c6af7;
box-shadow:0 0 0 3px rgba(124,106,247,0.12);
}

.auth-input.error{
border-color:#ef4444;
}

.auth-btn{
width:100%;
padding:14px;
border-radius:12px;
background:#1a1a2e;
color:white;
border:none;
cursor:pointer;
font-weight:600;
display:flex;
align-items:center;
justify-content:center;
gap:8px;
}

.auth-btn:hover:not(:disabled){
background:#2d2d4e;
}

.auth-btn:disabled{
opacity:.6;
cursor:not-allowed;
}

.icon-wrap{
position:absolute;
left:14px;
top:50%;
transform:translateY(-50%);
color:#bbb;
}

.field-wrap{position:relative}

.err-msg{
font-size:.78rem;
color:#ef4444;
margin-top:5px;
}

.spinner{animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

.rg-side-photo{
position:absolute;
inset:0;
background-image:url('https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80');
background-size:cover;
background-position:center;
opacity:.1;
}
`}</style>

<div style={{
width:"100%",
maxWidth:960,
display:"grid",
gridTemplateColumns:"1fr 1fr",
borderRadius:24,
overflow:"hidden",
boxShadow:"0 32px 80px rgba(26,26,46,0.15),0 0 0 1px #E8E6E0"
}}>

{/* FORM SIDE */}

<div style={{
background:"white",
padding:"44px 44px",
display:"flex",
flexDirection:"column",
justifyContent:"center"
}}>

{/* BACK BUTTON */}

<button
onClick={()=>navigate(-1)}
style={{
alignSelf:"flex-start",
marginBottom:16,
padding:"8px 14px",
borderRadius:10,
border:"1px solid #E8E6E0",
background:"#fff",
fontSize:"0.85rem",
fontWeight:600,
cursor:"pointer",
color:"#1a1a2e"
}}
>
← Back
</button>

{/* LOGO */}

<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:28}}>
<div style={{
width:30,
height:30,
borderRadius:8,
background:"#1a1a2e",
display:"flex",
alignItems:"center",
justifyContent:"center"
}}/>
<span style={{
fontWeight:700,
fontSize:"1rem",
color:"#1a1a2e"
}}>
AcadPortal
</span>
</div>

<h1 style={{
fontWeight:900,
fontSize:"1.9rem",
color:"#1a1a2e",
marginBottom:4
}}>
Create your account
</h1>

<p style={{fontSize:".88rem",color:"#888",marginBottom:20}}>
Fill in the details below to get started.
</p>

{/* PROGRESS BAR */}

<div style={{
height:4,
background:"#F0EEF9",
borderRadius:99,
marginBottom:24,
overflow:"hidden"
}}>
<div style={{
height:"100%",
background:"linear-gradient(90deg,#7c6af7,#a78bfa)",
width:`${progress}%`,
transition:"width .3s"
}}/>
</div>

{error && (
<div style={{
background:"#fef2f2",
border:"1px solid #fecaca",
borderRadius:10,
padding:"11px 14px",
marginBottom:18
}}>
<span style={{fontSize:".85rem",color:"#dc2626"}}>
{error}
</span>
</div>
)}

<form onSubmit={handleRegister} style={{display:"flex",flexDirection:"column",gap:12}}>

<input
type="text"
name="firstname"
placeholder="First name"
value={formData.firstname}
onChange={handleChange}
className="auth-input"
/>

<input
type="text"
name="lastname"
placeholder="Last name"
value={formData.lastname}
onChange={handleChange}
className="auth-input"
/>

<input
type="email"
name="email"
placeholder="Gmail address"
value={formData.email}
onChange={handleChange}
className={`auth-input ${emailError?"error":""}`}
/>

{emailError && <p className="err-msg">{emailError}</p>}

<input
type="password"
name="password"
placeholder="Password (8 characters)"
value={formData.password}
onChange={handleChange}
maxLength={8}
className={`auth-input ${passwordError?"error":""}`}
/>

{passwordError && <p className="err-msg">{passwordError}</p>}

<input
type="text"
name="department"
placeholder="Department (optional)"
value={formData.department}
onChange={handleChange}
className="auth-input"
/>

<button
type="submit"
disabled={loading || emailError || passwordError}
className="auth-btn"
>

{loading ? "Creating account..." : "Create account"}

</button>

</form>

<p style={{
textAlign:"center",
fontSize:".85rem",
color:"#999",
marginTop:22
}}>
Already have an account?{" "}
<span
onClick={()=>navigate("/login")}
style={{
color:"#7c6af7",
fontWeight:600,
cursor:"pointer"
}}
>
Sign in
</span>
</p>

</div>

{/* SIDE PANEL */}

<div className="rg-side" style={{
background:"#1a1a2e",
padding:"52px 44px",
position:"relative",
color:"white"
}}>

<div className="rg-side-photo"></div>

<h2 style={{
fontSize:"2rem",
fontWeight:800,
lineHeight:1.3,
position:"relative"
}}>
Join your academic community
</h2>

<p style={{
opacity:.6,
fontSize:".9rem",
marginTop:12,
position:"relative"
}}>
Create an account and start scheduling appointments instantly.
</p>

</div>

</div>
</div>
  );
}