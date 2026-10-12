import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../assets/Govigyan_banner_1.png'; 
import { useNavigate } from 'react-router-dom';
import '../styles/ViewBills.css';

const Bills = () => {
    const [bills, setBills] = useState([]);

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const billsSnapshot = await getDocs(collection(db, 'bills'));
                const billsData = billsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setBills(billsData);
            } catch (error) {
                console.error("Error fetching bills:", error);
            }
        };

        fetchBills();
    }, []);

    const generatePDF = (bill) => {
        const {
            userName,
            date,
            products,
            sgst,
            cgst,
            grandTotal,
            totalWithGST
        } = bill;

        const docPdf = new jsPDF();

        docPdf.setFontSize(22);
        docPdf.text('GOVIGYAAN', 105, 15, { align: 'center' });
        docPdf.setFontSize(16);
        docPdf.text('BILL SUMMARY', 105, 30, { align: 'center' });

        autoTable(docPdf, {
            head: [['Item Name', 'Price', 'Quantity', 'Subtotal']],
            body: products.map(item => [
                item.name,
                `₹${item.price}`,
                item.quantity,
                `₹${item.price * item.quantity}`
            ]),
            startY: 40,
            theme: 'grid',
            styles: { halign: 'center' },
            headStyles: { fillColor: [0, 128, 0], textColor: [255, 255, 255] },
        });

        let y = docPdf.lastAutoTable.finalY + 10;

        docPdf.setFontSize(12);
        docPdf.text(`Cashier: ${userName}`, 14, y);
        y += 8;
        docPdf.text(`Date: ${new Date(date).toLocaleString()}`, 14, y);
        y += 8;
        docPdf.text(`Grand Total: ₹${grandTotal.toFixed(2)}`, 14, y);
        y += 8;
        docPdf.text(`SGST (${sgst}%): ₹${(grandTotal * (sgst / 100)).toFixed(2)}`, 14, y);
        y += 8;
        docPdf.text(`CGST (${cgst}%): ₹${(grandTotal * (cgst / 100)).toFixed(2)}`, 14, y);
        y += 8;
        docPdf.text(`Total with GST: ₹${totalWithGST.toFixed(2)}`, 14, y);

        docPdf.setFontSize(12);
        docPdf.text('THANK YOU FOR VISITING', 105, y + 15, { align: 'center' });

        docPdf.save(`${userName}_bill_${bill.id}.pdf`);
    };

    const navigate = useNavigate();


    return (
        <div className="view-bills-page">
          <div className="navbar">
          <span className="back-arrow" onClick={() => navigate(-1)}>&larr;</span>
          <img src={logo} alt="Logo" className="logo" />
                </div>
            <h1>All Bills</h1>
            <div className="bill-list">
                {bills.map((bill) => (
                    <div key={bill.id} className="bill-card">
                        <h3>Cashier: {bill.userName}</h3>
                        <p>Date: {new Date(bill.date).toLocaleString()}</p>
                        <p>Total: ₹{bill.totalWithGST.toFixed(2)}</p>

                        <details>
                            <summary>View Details</summary>
                            <ul>
                                {bill.products.map((item, idx) => (
                                    <li key={idx}>
                                        {item.name} - ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
                                    </li>
                                ))}
                            </ul>
                            <p>SGST: {bill.sgst}%</p>
                            <p>CGST: {bill.cgst}%</p>
                            <p>GST Amount: ₹{bill.gstAmount.toFixed(2)}</p>
                        </details>

                        <div className="bill-actions">
                            <button className="bill-button" onClick={() => generatePDF(bill)}>Download PDF</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Bills;
