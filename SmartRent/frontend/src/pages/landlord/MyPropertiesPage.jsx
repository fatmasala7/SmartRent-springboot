import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdEdit, MdDelete, MdAdd, MdVisibility } from "react-icons/md";
import { getMyProperties, deleteProperty } from "../../services/propertyService";
import { getImageUrlFromProperty, formatCurrency } from "../../utils/displayHelpers";

function MyPropertiesPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getMyProperties().then(setProperties).catch(console.error).finally(()=>setLoading(false));
  };
  useEffect(()=>{ load(); },[]);

  const filtered = properties.filter(p=>{
    const q = search.toLowerCase();
    return p.title?.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q);
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    try { await deleteProperty(id); load(); }
    catch(e) { alert(e.message); }
  };

  const statusColor = (s) => s==="Available"?"#2e7d32":s==="Rented"?"#c62828":"#b8860b";

  if (loading) return <div style={{padding:40,textAlign:"center"}}>Loading properties...</div>;

  return (
    <div style={{padding:24,display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h1 style={{margin:0,fontSize:26,fontWeight:700}}>My Properties</h1>
          <p style={{fontSize:13,color:"#777",margin:0}}>{properties.length} total</p>
        </div>
        <button onClick={()=>navigate("/landlord/create-property")}
          style={{background:"var(--jellybean-blue)",color:"#fff",border:"none",padding:"10px 18px",borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
          <MdAdd/> Add Property
        </button>
      </div>

      <input placeholder="Search by title or location..."
        value={search} onChange={e=>setSearch(e.target.value)}
        style={{padding:"10px 14px",borderRadius:10,border:"1px solid #ddd",outline:"none",maxWidth:360}} />

      {filtered.length===0 ? (
        <div style={{textAlign:"center",padding:60,color:"#999"}}>
          <p style={{fontSize:40}}>🏠</p>
          <p>No properties yet. <span style={{color:"var(--jellybean-blue)",cursor:"pointer"}} onClick={()=>navigate("/landlord/create-property")}>Add your first one!</span></p>
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
          {filtered.map(p=>{
            const img = getImageUrlFromProperty(p);
            return (
              <div key={p.propertyID} style={{background:"#fff",borderRadius:14,overflow:"hidden",boxShadow:"0 3px 12px rgba(0,0,0,0.07)"}}>
                <img src={img} alt={p.title} style={{width:"100%",height:160,objectFit:"cover"}} />
                <div style={{padding:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <h3 style={{margin:0,fontSize:15,fontWeight:600}}>{p.title}</h3>
                    <span style={{background:p.isApproved?"#e8f5e9":"#fff8e1",color:p.isApproved?"#2e7d32":"#b8860b",padding:"3px 8px",borderRadius:20,fontSize:11}}>
                      {p.isApproved?"Approved":"Pending"}
                    </span>
                  </div>
                  <p style={{margin:"4px 0",fontSize:13,color:"#666"}}>📍 {p.location}</p>
                  <p style={{margin:"4px 0",fontSize:13,fontWeight:600,color:"var(--jellybean-blue)"}}>
                    {formatCurrency(p.price, "EGP/mo")}
                  </p>
                  <span style={{fontSize:11,color:statusColor(p.rentalStatus),fontWeight:600}}>{p.rentalStatus}</span>
                  <div style={{display:"flex",gap:8,marginTop:12}}>
                    <button onClick={()=>navigate(`/landlord/properties/${p.propertyID}`)}
                      style={{flex:1,padding:"8px",borderRadius:8,border:"1px solid var(--jellybean-blue)",background:"#fff",color:"var(--jellybean-blue)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                      <MdVisibility size={14}/> View
                    </button>
                    <button onClick={()=>navigate(`/landlord/edit-property/${p.propertyID}`)}
                      style={{flex:1,padding:"8px",borderRadius:8,border:"none",background:"var(--jellybean-blue)",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                      <MdEdit size={14}/> Edit
                    </button>
                    <button onClick={()=>handleDelete(p.propertyID)}
                      style={{padding:"8px 10px",borderRadius:8,border:"none",background:"#ffebee",color:"#c62828",cursor:"pointer"}}>
                      <MdDelete size={14}/>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default MyPropertiesPage;
