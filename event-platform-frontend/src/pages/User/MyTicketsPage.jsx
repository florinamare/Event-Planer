import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { TicketIcon, CheckCircle, Clock } from "lucide-react";

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
      console.log(" Bilete active:", tickets.active);
    }
    if (tickets.expired.length > 0) {
      console.log(" Bilete expirate:", tickets.expired);
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
  <TicketIcon className="w-7 h-7 text-[#2A9D8F]" />
  Biletele Mele
</h2>

  
      {/* Bilete active */}
      <section className="mb-10">
      <h3 className="text-2xl font-semibold text-[#2A9D8F] mb-4 flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-[#2A9D8F]" />
          Bilete Active
        </h3>

        {tickets.active.length === 0 ? (
          <p className="text-gray-500">Nu ai bilete pentru evenimente viitoare.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tickets.active.map((ticket) => (
              <div key={ticket._id} className="flex flex-col items-center">
                {/* zona PDF */}
                <div
                  id={`ticket-${ticket._id}`}
                  className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-6 text-center text-sm"
                >
                  <h4 className="text-lg font-semibold text-[#1D5C5F] mb-3">Bilet Eveniment</h4>
                  <p><span className="font-medium">Eveniment:</span> {ticket.event?.title}</p>
                  <p><span className="font-medium">Tip:</span> {ticket.ticketType}</p>
                  <p><span className="font-medium">Cantitate:</span> {ticket.quantity}</p>
                  <p><span className="font-medium">Preț:</span> {ticket.price} LEI</p>
                  <p><span className="font-medium">Total:</span> {ticket.price * ticket.quantity} LEI</p>
                  <p><span className="font-medium">Dată:</span> {new Date(ticket.event?.date).toLocaleDateString()}</p>
  
                  <div className="mt-4">
                    <img
                      src={ticket.qrCode}
                      alt="QR Code"
                      className="w-36 h-36 mx-auto border border-gray-200 bg-gray-50 p-2 rounded"
                    />
                  </div>
                </div>
  
                {/* buton PDF */}
                <button
                  onClick={() => generatePDF(ticket._id)}
                  className="mt-3 bg-[#C89459] hover:bg-[#b97d3e] text-white text-sm px-4 py-2 rounded-lg transition"
                >
                  Descarcă PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
  
      {/* Bilete expirate */}
      <section>
      <h3 className="text-2xl font-semibold text-gray-500 mb-4 flex items-center gap-2">
        <Clock className="w-6 h-6 text-gray-500" />
        Bilete Expirate
      </h3>

        {tickets.expired.length === 0 ? (
          <p className="text-gray-500">Nu ai bilete expirate.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tickets.expired.map((ticket) => (
              <div key={ticket._id} className="flex flex-col items-center">
                <div
                  id={`ticket-${ticket._id}`}
                  className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-6 text-center text-sm"
                >
                  <h4 className="text-lg font-semibold text-[#1D5C5F] mb-3">Bilet Eveniment</h4>
                  <p><span className="font-medium">Eveniment:</span> {ticket.event?.title}</p>
                  <p><span className="font-medium">Tip:</span> {ticket.ticketType}</p>
                  <p><span className="font-medium">Cantitate:</span> {ticket.quantity}</p>
                  <p><span className="font-medium">Preț:</span> {ticket.price} LEI</p>
                  <p><span className="font-medium">Dată:</span> {new Date(ticket.event?.date).toLocaleDateString()}</p>
  
                  <div className="mt-4">
                    <img
                      src={ticket.qrCode}
                      alt="QR Code"
                      className="w-36 h-36 mx-auto border border-gray-200 bg-gray-50 p-2 rounded"
                    />
                  </div>
                </div>
  
                <button
                  onClick={() => generatePDF(ticket._id)}
                  className="mt-3 bg-[#C89459] hover:bg-[#b97d3e] text-white text-sm px-4 py-2 rounded-lg transition"
                >
                  Descarcă PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
  
}

export default MyTicketsPage;
