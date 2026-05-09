import { useState, useEffect } from "react";
import { getMyProperties } from "../../services/propertyService";
import { getLandlordVisits, acceptVisit, rejectVisit } from "../../services/bookingService";

function VisitsRequestsPage() {
  const [visits, setVisits] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const props = await getMyProperties();
      const ids = props.map(p => p.propertyID);
      if (ids.length === 0) { setVisits([]); setLoading(false); return; }
      const data = await getLandlordVisits(ids);
      setVisits(data);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); },[]);

  const handleAccept = async (id) => {
    try { await acceptVisit(id); load(); } catch(e) { alert(e.message); }
  };
  const handleReject = async (id) => {
    try { await rejectVisit(id); load(); } catch(e) { alert(e.message); }
  };

  const filtered = filter==="All" ? visits : visits.filter(v=>v.status===filter);

  const statusBg = (s) => s==="Accepted"?"#2ecc71":s==="Rejected"?"#e74c3c":"var(--weldon-blue)";

  if (loading) return <div style={{padding:40,textAlign:"center"}}>Loading visit requests...</div>;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:16,padding:4}}>
      <div>
        <h1 style={{margin:0,fontSize:26,fontWeight:700}}>Visit Requests</h1>
        <p style={{fontSize:13,color:"#777",margin:0}}>Manage visit requests from tenants</p>
      </div>

      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        {["All","Pending","Accepted","Rejected"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{
            padding:"8px 14px",borderRadius:20,border:"1px solid #ddd",cursor:"pointer",
            background:filter===f?"var(--jellybean-blue)":"#fff",
            color:filter===f?"#fff":"#333",
          }}>{f}</button>
        ))}
      </div>

      {filtered.length===0 ? (
        <div style={{textAlign:"center",padding:60,color:"#999"}}>
          <p style={{fontSize:36}}>📅</p>
          <p>No visit requests found.</p>
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
          {filtered.map(v=>(
            <div key={v.requestID} style={{background:"#fff",padding:16,borderRadius:14,boxShadow:"0 3px 10px rgba(0,0,0,0.05)",display:"flex",flexDirection:"column",gap:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <p style={{margin:0,fontWeight:600}}>Property #{v.propertyID}</p>
                <span style={{background:statusBg(v.status),color:"#fff",padding:"4px 10px",borderRadius:20,fontSize:11}}>{v.status}</span>
              </div>
              <p style={{margin:0,fontSize:13,color:"#555"}}>👤 Tenant #{v.tenantID}</p>
              <p style={{margin:0,fontSize:13,color:"#555"}}>📅 {new Date(v.requestedDate).toLocaleString()}</p>
              {v.message && <p style={{margin:0,fontSize:12,color:"#888",background:"#f5f5f5",padding:"8px",borderRadius:8}}>💬 {v.message}</p>}
              {v.status==="Pending" && (
                <div style={{display:"flex",gap:8,marginTop:4}}>
                  <button onClick={()=>handleAccept(v.requestID)}
                    style={{flex:1,padding:"8px",background:"#2ecc71",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:600}}>
                    ✓ Accept
                  </button>
                  <button onClick={()=>handleReject(v.requestID)}
                    style={{flex:1,padding:"8px",background:"#e74c3c",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:600}}>
                    ✗ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default VisitsRequestsPage;
