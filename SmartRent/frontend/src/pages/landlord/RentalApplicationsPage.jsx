import { useState, useEffect } from "react";
import { getLandlordApplications, acceptApplication, rejectApplication } from "../../services/bookingService";
import { formatCurrency, formatDate } from "../../utils/displayHelpers";

const statusStyle = (s) => ({
  Pending:  { bg:"#fff8e1", color:"#b8860b" },
  Accepted: { bg:"#e8f5e9", color:"#2e7d32" },
  Rejected: { bg:"#ffebee", color:"#c62828" },
}[s] || { bg:"#f5f5f5", color:"#333" });

function RentalApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await getLandlordApplications();
      setApplications(data);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); },[]);

  const handleAccept = async (id) => {
    if (!window.confirm("Accept this application? A rental will be created automatically.")) return;
    try { await acceptApplication(id); load(); setSelected(null); } catch(e) { alert(e.message); }
  };
  const handleReject = async (id) => {
    if (!window.confirm("Reject this application?")) return;
    try { await rejectApplication(id); load(); setSelected(null); } catch(e) { alert(e.message); }
  };

  const filtered = filter==="All" ? applications : applications.filter(a=>a.status===filter);
  const counts = {
    All: applications.length,
    Pending:  applications.filter(a=>a.status==="Pending").length,
    Accepted: applications.filter(a=>a.status==="Accepted").length,
    Rejected: applications.filter(a=>a.status==="Rejected").length,
  };

  if (loading) return <div style={{padding:40,textAlign:"center"}}>Loading applications...</div>;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:16,padding:4}}>
      <div>
        <h1 style={{margin:0,fontSize:26,fontWeight:700}}>Rental Applications</h1>
        <p style={{fontSize:13,color:"#777",margin:0}}>{applications.length} total applications</p>
      </div>

      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        {["All","Pending","Accepted","Rejected"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{
            padding:"8px 14px",borderRadius:20,border:"1px solid #ddd",cursor:"pointer",
            background:filter===f?"var(--jellybean-blue)":"#fff",
            color:filter===f?"#fff":"#333",
          }}>{f} ({counts[f]})</button>
        ))}
      </div>

      {filtered.length===0 ? (
        <div style={{textAlign:"center",padding:60,color:"#999"}}>
          <p style={{fontSize:36}}>📋</p><p>No applications found.</p>
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
          {filtered.map(a=>{
            const st = statusStyle(a.status);
            return (
              <div key={a.applicationID} style={{background:"#fff",padding:16,borderRadius:14,boxShadow:"0 3px 10px rgba(0,0,0,0.06)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <span style={{fontWeight:600,fontSize:15}}>Application #{a.applicationID}</span>
                  <span style={{background:st.bg,color:st.color,padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:600}}>{a.status}</span>
                </div>
                <p style={{margin:"4px 0",fontSize:13,color:"#555"}}>🏠 {a.propertyTitle || `Property #${a.propertyID}`}</p>
                <p style={{margin:"4px 0",fontSize:13,color:"#555"}}>📍 {a.propertyLocation || "-"} · {formatCurrency(a.propertyPrice)}</p>
                <p style={{margin:"4px 0",fontSize:13,color:"#555"}}>👤 Tenant #{a.tenantID}</p>
                <p style={{margin:"4px 0",fontSize:13,color:"#555"}}>📅 {a.startDate} → {a.endDate}</p>
                <p style={{margin:"4px 0",fontSize:11,color:"#999"}}>Submitted: {formatDate(a.createdAt)}</p>
                <div style={{display:"flex",gap:8,marginTop:12}}>
                  <button onClick={()=>setSelected(a)}
                    style={{flex:1,padding:"8px",background:"#f5f5f5",border:"none",borderRadius:8,cursor:"pointer"}}>
                    View Details
                  </button>
                  {a.status==="Pending" && (<>
                    <button onClick={()=>handleAccept(a.applicationID)}
                      style={{flex:1,padding:"8px",background:"#2e7d32",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:600}}>
                      ✓ Accept
                    </button>
                    <button onClick={()=>handleReject(a.applicationID)}
                      style={{flex:1,padding:"8px",background:"#c62828",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:600}}>
                      ✗ Reject
                    </button>
                  </>)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",background:"rgba(0,0,0,0.5)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:999}}
          onClick={()=>setSelected(null)}>
          <div style={{background:"#fff",padding:24,borderRadius:16,width:420,maxWidth:"90%"}} onClick={e=>e.stopPropagation()}>
            <h2 style={{marginTop:0}}>Application #{selected.applicationID}</h2>
            <p>🏠 {selected.propertyTitle || `Property #${selected.propertyID}`}</p>
            <p>👤 Tenant #{selected.tenantID}</p>
            <p>📅 {formatDate(selected.startDate)} → {formatDate(selected.endDate)}</p>
            <p>Status: <strong>{selected.status}</strong></p>
            <p style={{fontSize:12,color:"#999"}}>Documents: {selected.documents?.length||0} uploaded</p>
            {selected.documents?.length > 0 && (
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:10,marginBottom:8}}>
                {selected.documents.map((doc) => (
                  doc.documentUrl?.startsWith("data:image") ? (
                    <a key={doc.documentID || doc.documentUrl} href={doc.documentUrl} target="_blank" rel="noreferrer" title="Open uploaded image">
                      <img src={doc.documentUrl} alt={doc.documentType || "Application document"} style={{width:72,height:56,objectFit:"cover",borderRadius:8,border:"1px solid #ddd"}} />
                    </a>
                  ) : (
                    <a key={doc.documentID || doc.documentUrl} href={doc.documentUrl} target="_blank" rel="noreferrer" style={{fontSize:12,color:"#417C9C"}}>{doc.documentType || "Document"}</a>
                  )
                ))}
              </div>
            )}
            <div style={{display:"flex",gap:8,marginTop:16}}>
              {selected.status==="Pending" && (<>
                <button onClick={()=>handleAccept(selected.applicationID)}
                  style={{flex:1,padding:"10px",background:"#2e7d32",color:"#fff",border:"none",borderRadius:10,cursor:"pointer",fontWeight:600}}>
                  ✓ Accept
                </button>
                <button onClick={()=>handleReject(selected.applicationID)}
                  style={{flex:1,padding:"10px",background:"#c62828",color:"#fff",border:"none",borderRadius:10,cursor:"pointer",fontWeight:600}}>
                  ✗ Reject
                </button>
              </>)}
              <button onClick={()=>setSelected(null)}
                style={{flex:1,padding:"10px",background:"#f5f5f5",border:"none",borderRadius:10,cursor:"pointer"}}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default RentalApplicationsPage;
