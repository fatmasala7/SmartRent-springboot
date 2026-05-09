import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdSave, MdCancel } from "react-icons/md";
import { createProperty, getAllAmenities, addPropertyImage, addPropertyAmenity } from "../../services/propertyService";

function amenityIdOf(a) {
  return a?.amenityID ?? a?.amenityId ?? a?.id;
}

function CreatePropertyPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:"", description:"", location:"", price:"", propertyType:"Apartment", imageUrl:"" });
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    getAllAmenities()
      .then((items) => setAmenitiesList(Array.isArray(items) ? items : []))
      .catch(console.error);
  }, []);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = "Valid positive price required";
    if (!form.description.trim()) e.description = "Description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const toggleAmenity = (id) => {
    setSelectedAmenityIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true); setApiError("");
    try {
      const created = await createProperty({
        title: form.title,
        description: form.description,
        location: form.location,
        price: parseFloat(form.price),
        propertyType: form.propertyType,
      });
      const propertyId = created?.propertyID || created?.propertyId || created?.id;
      if (!propertyId) throw new Error("Property was created but no property id was returned");

      if (form.imageUrl.trim()) {
        await addPropertyImage(propertyId, { imageUrl: form.imageUrl.trim(), isMain: true });
      }

      for (const amenityId of selectedAmenityIds) {
        await addPropertyAmenity(propertyId, amenityId);
      }

      navigate(`/landlord/properties/${propertyId}`);
    } catch(err) {
      setApiError(err.message || "Failed to create property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{padding:24}}>
      <h1 style={{marginBottom:15,fontSize:20,fontWeight:600}}>Create New Property</h1>
      {apiError && <p style={{background:"#ffebee",color:"#c62828",padding:"10px 14px",borderRadius:8,marginBottom:12}}>{apiError}</p>}
      <form onSubmit={handleSubmit} style={{background:"#fff",padding:20,borderRadius:14,boxShadow:"0 4px 14px rgba(0,0,0,0.06)"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
          <div>
            <input placeholder="Title *" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={inp} />
            {errors.title && <p style={err}>{errors.title}</p>}
          </div>
          <div>
            <input placeholder="Location *" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} style={inp} />
            {errors.location && <p style={err}>{errors.location}</p>}
          </div>
          <div>
            <input placeholder="Price (EGP/month) *" type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} style={inp} />
            {errors.price && <p style={err}>{errors.price}</p>}
          </div>
          <select value={form.propertyType} onChange={e=>setForm({...form,propertyType:e.target.value})} style={inp}>
            {["Apartment","Villa","Studio","Office","Shop","Chalet"].map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        <div style={{marginTop:12}}>
          <textarea placeholder="Description *" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{...inp,minHeight:100}} />
          {errors.description && <p style={err}>{errors.description}</p>}
        </div>
        <div style={{marginTop:12}}>
          <input placeholder="Main image URL (optional)" value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})} style={inp} />
          <p style={{fontSize:12,color:"#888",marginTop:5}}>Paste a direct image URL to show this property image across the app.</p>
        </div>

        <div style={{marginTop:18}}>
          <h3 style={{fontSize:16,color:"var(--blackberry)",margin:"0 0 10px"}}>Amenities</h3>
          {amenitiesList.length === 0 ? (
            <p style={{fontSize:13,color:"#888"}}>No amenities available yet. Default amenities will be created automatically when the property service starts.</p>
          ) : (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10}}>
              {amenitiesList.map((a) => {
                const id = amenityIdOf(a);
                return (
                  <label key={id} style={{background:"#f9f9f9",padding:10,borderRadius:8,cursor:"pointer",border:selectedAmenityIds.includes(id)?"1px solid var(--jellybean-blue)":"1px solid #eee"}}>
                    <input type="checkbox" checked={selectedAmenityIds.includes(id)} onChange={() => toggleAmenity(id)} />
                    <span style={{marginLeft:8}}>{a.amenityName || a.name}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div style={{display:"flex",justifyContent:"space-between",marginTop:18}}>
          <button type="submit" disabled={loading} style={{background:"var(--jellybean-blue)",color:"#fff",border:"none",padding:"10px 20px",borderRadius:10,cursor:"pointer"}}>
            <MdSave /> {loading?"Saving...":"Save Property"}
          </button>
          <button type="button" onClick={()=>navigate("/landlord/properties")} style={{background:"#999",color:"#fff",border:"none",padding:"10px 20px",borderRadius:10,cursor:"pointer"}}>
            <MdCancel /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
const inp = {width:"100%",padding:10,borderRadius:10,border:"1px solid #ddd",outline:"none",boxSizing:"border-box"};
const err = {color:"red",fontSize:12,marginTop:2};
export default CreatePropertyPage;
