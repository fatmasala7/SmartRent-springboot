import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPropertyById, updateProperty } from "../../services/propertyService";
import { MdSave, MdCancel } from "react-icons/md";

function EditPropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    getPropertyById(id)
      .then(p => setForm({ title:p.title, description:p.description, location:p.location, price:p.price, propertyType:p.propertyType||"Apartment" }))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setSaving(true); setApiError("");
    try {
      await updateProperty(id, { title:form.title, description:form.description, location:form.location, price:parseFloat(form.price), propertyType:form.propertyType });
      navigate("/landlord/properties");
    } catch(err) { setApiError(err.message||"Failed to save"); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{padding:40,textAlign:"center"}}>Loading...</div>;
  if (!form)   return <div style={{padding:40,textAlign:"center"}}>Property not found.</div>;

  return (
    <div style={{padding:24}}>
      <h1 style={{marginBottom:16,fontSize:20,fontWeight:600}}>Edit Property</h1>
      {apiError && <p style={{background:"#ffebee",color:"#c62828",padding:"10px",borderRadius:8,marginBottom:12}}>{apiError}</p>}
      <form onSubmit={handleSubmit} style={{background:"#fff",padding:20,borderRadius:14,boxShadow:"0 4px 14px rgba(0,0,0,0.06)"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
          <input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={inp}/>
          <input placeholder="Location" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} style={inp}/>
          <input placeholder="Price" type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} style={inp}/>
          <select value={form.propertyType} onChange={e=>setForm({...form,propertyType:e.target.value})} style={inp}>
            {["Apartment","Villa","Studio","Office","Shop","Chalet"].map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        <textarea placeholder="Description" value={form.description||""} onChange={e=>setForm({...form,description:e.target.value})}
          style={{...inp,minHeight:100,marginTop:12,width:"100%",boxSizing:"border-box"}}/>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:18}}>
          <button type="submit" disabled={saving} style={{background:"var(--jellybean-blue)",color:"#fff",border:"none",padding:"10px 20px",borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
            <MdSave/> {saving?"Saving...":"Save Changes"}
          </button>
          <button type="button" onClick={()=>navigate("/landlord/properties")} style={{background:"#999",color:"#fff",border:"none",padding:"10px 20px",borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
            <MdCancel/> Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
const inp = {width:"100%",padding:10,borderRadius:10,border:"1px solid #ddd",outline:"none",boxSizing:"border-box"};
export default EditPropertyPage;
