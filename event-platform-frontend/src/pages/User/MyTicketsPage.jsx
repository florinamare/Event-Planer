import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function MyTicketsPage() {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState({ active: [], expired: [] });
  const [loading, setLoading] = useState(true);
  const totalActive = tickets.active.reduce((sum, t) => sum + t.price * t.quantity, 0);
  const totalExpired = tickets.expired.reduce((sum, t) => sum + t.price * t.quantity, 0);

  const generatePDF = async (ticketId) => {
    const element = document.getElementById(`ticket-${ticketId}`);
    if (!element) return;
  
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });
  
    const imgData = canvas.toDataURL("image/png");
  
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`bilet-${ticketId}.pdf`);
  };
  
  

  useEffect(() => {
    if (!user) return;
    if (tickets.active.length > 0) {
      console.log("🟢 Bilete active:", tickets.active);
    }
    if (tickets.expired.length > 0) {
      console.log("🔴 Bilete expirate:", tickets.expired);
    }

    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/tickets/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setTickets(data);
        } else {
          console.error("Eroare la preluarea biletelor:", data.message);
        }
      } catch (err) {
        console.error("Eroare server:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  if (!user) return <p>Nu ești autentificat.</p>;
  if (loading) return <p>Se încarcă biletele...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Biletele Mele</h2>

      {/* 🔵 Bilete actuale */}
      <section style={{ marginBottom: "2rem" }}>
        <h3 style={{ color: "#0056b3" }}>🎫 Bilete Active</h3>
        {tickets.active.length === 0 ? (
                <p>Nu ai bilete pentru evenimente viitoare.</p>
              ) : (
                <ul>
                  {tickets.active.map((ticket) => (
                    
        <div key={ticket._id} style={{ marginBottom: "2rem" }}>

          {/* zona PDF – doar această parte se salvează */}
          <div
            id={`ticket-${ticket._id}`}
            style={{
              maxWidth: "500px",
              margin: "0 auto",
              padding: "1.5rem",
              backgroundColor: "#ffffff",
              border: "1px solid #ddd",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              fontFamily: "Arial, sans-serif",
              color: "#333",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "#0056b3", marginBottom: "1rem" }}>Bilet Eveniment</h3>
            <p><strong>Eveniment:</strong> {ticket.event?.title}</p>
            <p><strong>Tip:</strong> {ticket.ticketType}</p>
            <p><strong>Cantitate:</strong> {ticket.quantity}</p>
            <p><strong>Preț:</strong> {ticket.price} EUR</p>
            <p><strong>Total tranzacție:</strong> {ticket.price * ticket.quantity} EUR</p>
            <p><strong>Dată:</strong> {new Date(ticket.event?.date).toLocaleDateString()}</p>
            

            <div style={{ marginTop: "1.5rem" }}>
              <img
                src={ticket.qrCode}
                alt="QR Code"
                style={{
                  width: "150px",
                  height: "150px",
                  border: "1px solid #eee",
                  padding: "5px",
                  backgroundColor: "#fafafa",
                }}
              />
            </div>
          </div>

          {/* buton în afara div-ului PDF */}
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <button
              className="auth-button"
              onClick={() => generatePDF(ticket._id)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#ff7f00",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Descarcă PDF
            </button>
          </div>
        </div>
      ))}


          </ul>
        )}
      </section>

      {/* 🔴 Bilete expirate */}
      <section>
        <h3 style={{ color: "#888" }}>🕘 Bilete Expirate</h3>
        {tickets.expired.length === 0 ? (
          <p>Nu ai bilete expirate.</p>
        ) : (
          <ul>
            {tickets.expired.map((ticket) => (
               <div key={ticket._id} style={{ marginBottom: "2rem" }}>
               {/* zona PDF – doar această parte se salvează */}
               <div
                 id={`ticket-${ticket._id}`}
                 style={{
                   maxWidth: "500px",
                   margin: "0 auto",
                   padding: "1.5rem",
                   backgroundColor: "#ffffff",
                   border: "1px solid #ddd",
                   borderRadius: "12px",
                   boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                   fontFamily: "Arial, sans-serif",
                   color: "#333",
                   textAlign: "center",
                 }}
               >
                 <h3 style={{ color: "#0056b3", marginBottom: "1rem" }}>Bilet Eveniment</h3>
                 <p><strong>Eveniment:</strong> {ticket.event?.title}</p>
                 <p><strong>Tip:</strong> {ticket.ticketType}</p>
                 <p><strong>Cantitate:</strong> {ticket.quantity}</p>
                 <p><strong>Preț:</strong> {ticket.price} EUR</p>
                 <p style={{ fontWeight: "bold", fontSize: "18px", marginTop: "1rem", color: "#999" }}>
                Total plătit pentru bilete expirate: {totalExpired.toFixed(2)} EUR
              </p>

                 <p><strong>Dată:</strong> {new Date(ticket.event?.date).toLocaleDateString()}</p>
           
                 <div style={{ marginTop: "1.5rem" }}>
                   <img
                     src={ticket.qrCode}
                     alt="QR Code"
                     style={{
                       width: "150px",
                       height: "150px",
                       border: "1px solid #eee",
                       padding: "5px",
                       backgroundColor: "#fafafa",
                     }}
                   />
                 </div>
               </div>
           
               {/* buton în afara div-ului PDF */}
               <div style={{ textAlign: "center", marginTop: "10px" }}>
                 <button
                   className="auth-button"
                   onClick={() => generatePDF(ticket._id)}
                   style={{
                     padding: "8px 16px",
                     backgroundColor: "#ff7f00",
                     color: "white",
                     border: "none",
                     borderRadius: "6px",
                     cursor: "pointer",
                   }}
                 >
                   Descarcă PDF
                 </button>
               </div>
             </div>
           ))}
            
          </ul>
        )}
      </section>
    </div>
  );
}

export default MyTicketsPage;
