import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyById, addPropertyImage, deletePropertyImage, addPropertyAmenity, removePropertyAmenity, getAllAmenities } from "../../services/propertyService";

function LandlordPropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [allAmenities, setAllAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [isMain, setIsMain] = useState(false);

  const load = () => {
    setLoading(true);
    getPropertyById(id).then(setProperty).catch(console.error).finally(()=>setLoading(false));
  };
  useEffect(()=>{ load(); getAllAmenities().then(setAllAmenities).catch(console.error); },[id]);

  const handleAddImage = async () => {
    if (!imageUrl.trim()) return;
    try { await addPropertyImage(id, { imageUrl, isMain }); setImageUrl(""); setIsMain(false); load(); }
    catch(e) { alert(e.message); }
  };
  const handleDelImage = async (imgId) => {
    try { await deletePropertyImage(id, imgId); load(); } catch(e) { alert(e.message); }
  };
  const handleAddAmenity = async (amenityId) => {
    try { await addPropertyAmenity(id, amenityId); load(); } catch(e) { alert(e.message); }
  };
  const handleRemoveAmenity = async (amenityId) => {
    try { await removePropertyAmenity(id, amenityId); load(); } catch(e) { alert(e.message); }
  };

  if (loading) return <div style={{padding:40,textAlign:"center"}}>Loading...</div>;
  if (!property) return <div style={{padding:40,textAlign:"center"}}>Property not found.</div>;

  const amenityIdOf = (a) => a?.amenityID ?? a?.amenityId ?? a?.id;
  const existingAmenityIds = (property.amenities || []).map(amenityIdOf).filter(Boolean);
  const availableToAdd = (allAmenities || []).filter(a => !existingAmenityIds.includes(amenityIdOf(a)));

  return (
    <div style={{padding:24,display:"flex",flexDirection:"column",gap:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <h1 style={{margin:0,fontSize:22,fontWeight:700}}>{property.title}</h1>
          <p style={{margin:"4px 0",color:"#666"}}>📍 {property.location} • {Number(property.price).toLocaleString()} EGP/mo</p>
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <span style={{background:property.isApproved?"#e8f5e9":"#fff8e1",color:property.isApproved?"#2e7d32":"#b8860b",padding:"4px 10px",borderRadius:20,fontSize:12}}>
              {property.isApproved?"✓ Approved":"⏳ Pending Approval"}
            </span>
            <span style={{background:"#e3f2fd",color:"#1565c0",padding:"4px 10px",borderRadius:20,fontSize:12}}>{property.rentalStatus}</span>
          </div>
        </div>
        <button onClick={()=>navigate(`/landlord/edit-property/${id}`)}
          style={{background:"var(--jellybean-blue)",color:"#fff",border:"none",padding:"10px 16px",borderRadius:10,cursor:"pointer"}}>
          Edit Property
        </button>
      </div>

      {/* Images */}
      <div style={{background:"#fff",padding:20,borderRadius:14,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
        <h3 style={{marginTop:0}}>Images ({property.images?.length||0})</h3>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
          {property.images?.map(img=>(
            <div key={img.imageID} style={{position:"relative"}}>
              <img src={img.imageUrl} alt="" style={{width:120,height:80,objectFit:"cover",borderRadius:8,border:img.isMain?"2px solid var(--jellybean-blue)":"2px solid transparent"}}/>
              {img.isMain && <span style={{position:"absolute",top:4,left:4,background:"var(--jellybean-blue)",color:"#fff",fontSize:9,padding:"2px 5px",borderRadius:4}}>MAIN</span>}
              <button onClick={()=>handleDelImage(img.imageID)}
                style={{position:"absolute",top:4,right:4,background:"#c62828",color:"#fff",border:"none",borderRadius:"50%",width:18,height:18,cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <input placeholder="Image URL" value={imageUrl} onChange={e=>setImageUrl(e.target.value)}
            style={{flex:1,minWidth:200,padding:"8px 12px",borderRadius:8,border:"1px solid #ddd",outline:"none"}}/>
          <label style={{display:"flex",alignItems:"center",gap:4,fontSize:13,cursor:"pointer"}}>
            <input type="checkbox" checked={isMain} onChange={e=>setIsMain(e.target.checked)}/> Set as main
          </label>
          <button onClick={handleAddImage}
            style={{padding:"8px 14px",background:"var(--jellybean-blue)",color:"#fff",border:"none",borderRadius:8,cursor:"pointer"}}>
            Add Image
          </button>
        </div>
      </div>

      {/* Amenities */}
      <div style={{background:"#fff",padding:20,borderRadius:14,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
        <h3 style={{marginTop:0}}>Amenities</h3>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
          {(property.amenities || []).map(a=>{
            const aid = amenityIdOf(a);
            return (
            <span key={aid} style={{background:"#e3f2fd",color:"#1565c0",padding:"5px 12px",borderRadius:20,fontSize:13,display:"flex",alignItems:"center",gap:6}}>
              {a.amenityName || a.name}
              <span onClick={()=>handleRemoveAmenity(aid)} style={{cursor:"pointer",color:"#c62828",fontWeight:700}}>×</span>
            </span>
          );})}
        </div>
        {availableToAdd.length>0 && (
          <div>
            <p style={{fontSize:13,color:"#666",marginBottom:8}}>Add amenity:</p>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {availableToAdd.map(a=>{
                const aid = amenityIdOf(a);
                return (
                <button key={aid} onClick={()=>handleAddAmenity(aid)}
                  style={{padding:"5px 12px",background:"#f5f5f5",border:"1px solid #ddd",borderRadius:20,cursor:"pointer",fontSize:13}}>
                  + {a.amenityName || a.name}
                </button>
              );})}
            </div>
          </div>
        )}
      </div>

      {property.description && (
        <div style={{background:"#fff",padding:20,borderRadius:14,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
          <h3 style={{marginTop:0}}>Description</h3>
          <p style={{color:"#555",lineHeight:1.6}}>{property.description}</p>
        </div>
      )}
    </div>
  );
}
export default LandlordPropertyDetailsPage;
