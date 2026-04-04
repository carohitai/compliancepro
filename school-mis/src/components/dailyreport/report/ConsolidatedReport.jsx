import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { CLASS_LIST, VEHICLE_LIST, FEE_TYPES } from "../../../data/schoolConfig";
import {
  fetchBookStock, fetchAdmissions, fetchAdmissionsCumulative,
  fetchEnquiries, fetchEnquirySummary, fetchEnquiryMonthly,
  fetchBusForms, fetchBusCumulative,
  fetchFeeCollection, fetchStaffAttendance,
} from "../../../lib/dailyReport";
import SummaryCard from "../shared/SummaryCard";

const PIE_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function ConsolidatedReport({ reportId, reportDate, notes }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  useEffect(() => {
    if (!reportId) return;
    loadAll();
  }, [reportId]);

  async function loadAll() {
    setLoading(true);
    const [bookStock, admissions, admCum, enquiries, enqSummary, enqMonthly,
           busForms, busCum, fees, attendance] = await Promise.all([
      fetchBookStock(reportId),
      fetchAdmissions(reportId),
      fetchAdmissionsCumulative(),
      fetchEnquiries(reportId),
      fetchEnquirySummary(),
      fetchEnquiryMonthly(),
      fetchBusForms(reportId),
      fetchBusCumulative(),
      fetchFeeCollection(reportId),
      fetchStaffAttendance(reportId),
    ]);
    setData({
      bookStock, admissions, admCum, enquiries, enqSummary,
      enqMonthly: enqMonthly.map((m) => ({ month: m.month, Converted: m.converted, "Not Converted": m.not_converted })),
      busForms, busCum, fees, attendance,
    });
    setLoading(false);
  }

  function handlePrint() {
    window.print();
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading report...</div>;
  if (!data) return null;

  const bookTotals = data.bookStock.reduce((a, r) => ({
    opening: a.opening + r.opening_stock, purchased: a.purchased + r.purchased,
    sold: a.sold + r.sold, closing: a.closing + r.closing_stock,
  }), { opening: 0, purchased: 0, sold: 0, closing: 0 });

  const admTotals = data.admissions.reduce((a, r) => ({
    total: a.total + r.new_admissions, finance: a.finance + r.finance_count,
    oneTime: a.oneTime + r.one_time_count, amount: a.amount + r.amount_collected,
  }), { total: 0, finance: 0, oneTime: 0, amount: 0 });

  const busTodayTotals = data.busForms.reduce((a, r) => ({
    forms: a.forms + r.forms_filled, fees: a.fees + r.bus_fees_collected,
  }), { forms: 0, fees: 0 });

  const feesByType = FEE_TYPES.map((ft) => ({
    name: ft.abbr,
    value: data.fees.filter((f) => f.fee_type === ft.key).reduce((s, f) => s + f.amount, 0),
  })).filter((f) => f.value > 0);

  const feeGrandTotal = feesByType.reduce((s, f) => s + f.value, 0);

  const absent = data.attendance ? Math.max(0, data.attendance.total_staff - data.attendance.present - data.attendance.on_leave) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between no-print">
        <h3 className="text-lg font-bold text-gray-800">
          Consolidated Report — {new Date(reportDate + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </h3>
        <button onClick={handlePrint} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all">
          Print / PDF
        </button>
      </div>

      <div ref={printRef} className="space-y-6">

        {/* Header for print */}
        <div className="hidden print:block text-center mb-4">
          <h1 className="text-xl font-bold">School MIS - Daily Report</h1>
          <p className="text-sm text-gray-600">{reportDate}</p>
        </div>

        {/* Top-level summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SummaryCard label="Books Sold" value={bookTotals.sold} color="blue" />
          <SummaryCard label="Admissions" value={admTotals.total} color="green" />
          <SummaryCard label="Enquiries" value={data.enquiries.length} color="purple" />
          <SummaryCard label="Fees Collected" value={`₹${feeGrandTotal.toLocaleString()}`} color="amber" />
        </div>

        {/* Section 1: Book Stock */}
        <section>
          <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">1. Book Stock & Sales (Librarian)</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="bg-gray-50">
                <th className="text-left px-2 py-1.5">Standard</th>
                <th className="text-center px-2 py-1.5">Opening</th>
                <th className="text-center px-2 py-1.5">Purchased</th>
                <th className="text-center px-2 py-1.5">Sold</th>
                <th className="text-center px-2 py-1.5 text-indigo-600">Closing</th>
              </tr></thead>
              <tbody>
                {data.bookStock.map((r) => (
                  <tr key={r.standard_class} className="border-t border-gray-100">
                    <td className="px-2 py-1">{r.standard_class}</td>
                    <td className="text-center px-2 py-1">{r.opening_stock}</td>
                    <td className="text-center px-2 py-1">{r.purchased}</td>
                    <td className="text-center px-2 py-1">{r.sold}</td>
                    <td className="text-center px-2 py-1 font-bold text-indigo-600">{r.closing_stock}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr className="border-t-2 font-bold bg-gray-50">
                <td className="px-2 py-1">TOTAL</td>
                <td className="text-center px-2 py-1">{bookTotals.opening}</td>
                <td className="text-center px-2 py-1">{bookTotals.purchased}</td>
                <td className="text-center px-2 py-1">{bookTotals.sold}</td>
                <td className="text-center px-2 py-1 text-indigo-600">{bookTotals.closing}</td>
              </tr></tfoot>
            </table>
          </div>
        </section>

        {/* Section 2: Admissions */}
        <section>
          <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">2. Admissions</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-xs">
            <div className="bg-blue-50 rounded-lg p-2 text-center"><p className="font-bold text-lg text-blue-700">{admTotals.total}</p><p className="text-blue-600">Today</p></div>
            <div className="bg-amber-50 rounded-lg p-2 text-center"><p className="font-bold text-lg text-amber-700">{admTotals.finance}</p><p className="text-amber-600">Finance</p></div>
            <div className="bg-green-50 rounded-lg p-2 text-center"><p className="font-bold text-lg text-green-700">{admTotals.oneTime}</p><p className="text-green-600">One-Time</p></div>
            <div className="bg-purple-50 rounded-lg p-2 text-center"><p className="font-bold text-lg text-purple-700">₹{admTotals.amount.toLocaleString()}</p><p className="text-purple-600">Collected</p></div>
          </div>
        </section>

        {/* Section 3: Enquiries */}
        <section>
          <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">3. Enquiries</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-xs">
            <div className="bg-blue-50 rounded-lg p-2 text-center"><p className="font-bold text-lg text-blue-700">{data.enqSummary.total}</p><p className="text-blue-600">Total Till Date</p></div>
            <div className="bg-purple-50 rounded-lg p-2 text-center"><p className="font-bold text-lg text-purple-700">{data.enquiries.length}</p><p className="text-purple-600">Today</p></div>
            <div className="bg-green-50 rounded-lg p-2 text-center"><p className="font-bold text-lg text-green-700">{data.enqSummary.converted}</p><p className="text-green-600">Converted</p></div>
            <div className="bg-red-50 rounded-lg p-2 text-center"><p className="font-bold text-lg text-red-700">{data.enqSummary.notConverted}</p><p className="text-red-600">Not Converted</p></div>
          </div>
          {data.enqMonthly.length > 0 && (
            <div className="bg-white rounded-xl border p-3 no-print">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.enqMonthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Converted" fill="#22c55e" stackId="a" />
                  <Bar dataKey="Not Converted" fill="#ef4444" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* Section 4: Bus */}
        <section>
          <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">4. School Bus</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="bg-gray-50">
                <th className="text-left px-2 py-1.5">Bus</th>
                <th className="text-center px-2 py-1.5">Forms Today</th>
                <th className="text-center px-2 py-1.5">Total Forms</th>
                <th className="text-center px-2 py-1.5">Students</th>
                <th className="text-center px-2 py-1.5">Fees Today</th>
                <th className="text-center px-2 py-1.5">Total Fees</th>
              </tr></thead>
              <tbody>
                {VEHICLE_LIST.map((v) => {
                  const today = data.busForms.find((b) => b.bus_number === v.bus_number);
                  const cum = data.busCum.find((c) => c.bus_number === v.bus_number);
                  return (
                    <tr key={v.bus_number} className="border-t border-gray-100">
                      <td className="px-2 py-1 font-medium">{v.bus_number}</td>
                      <td className="text-center px-2 py-1">{today?.forms_filled || 0}</td>
                      <td className="text-center px-2 py-1">{cum?.total_forms_filled || 0}</td>
                      <td className="text-center px-2 py-1 font-semibold">{cum?.total_forms_filled || 0}</td>
                      <td className="text-center px-2 py-1">₹{(today?.bus_fees_collected || 0).toLocaleString()}</td>
                      <td className="text-center px-2 py-1">₹{(cum?.total_fees_collected || 0).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot><tr className="border-t-2 font-bold bg-gray-50">
                <td className="px-2 py-1">TOTAL</td>
                <td className="text-center px-2 py-1">{busTodayTotals.forms}</td>
                <td className="text-center px-2 py-1">{data.busCum.reduce((s, c) => s + (c.total_forms_filled || 0), 0)}</td>
                <td className="text-center px-2 py-1">{data.busCum.reduce((s, c) => s + (c.total_forms_filled || 0), 0)}</td>
                <td className="text-center px-2 py-1">₹{busTodayTotals.fees.toLocaleString()}</td>
                <td className="text-center px-2 py-1">₹{data.busCum.reduce((s, c) => s + (c.total_fees_collected || 0), 0).toLocaleString()}</td>
              </tr></tfoot>
            </table>
          </div>
        </section>

        {/* Section 5: Fee Collection */}
        <section>
          <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">5. Fee Collection Summary</h4>
          {feesByType.length > 0 ? (
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex-1 w-full">
                <table className="w-full text-xs">
                  <thead><tr className="bg-gray-50">
                    <th className="text-left px-2 py-1.5">Fee Type</th>
                    <th className="text-center px-2 py-1.5">Amount</th>
                  </tr></thead>
                  <tbody>
                    {feesByType.map((f) => (
                      <tr key={f.name} className="border-t border-gray-100">
                        <td className="px-2 py-1">{f.name}</td>
                        <td className="text-center px-2 py-1">₹{f.value.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot><tr className="border-t-2 font-bold bg-gray-50">
                    <td className="px-2 py-1">GRAND TOTAL</td>
                    <td className="text-center px-2 py-1">₹{feeGrandTotal.toLocaleString()}</td>
                  </tr></tfoot>
                </table>
              </div>
              <div className="w-48 h-48 no-print">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={feesByType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name }) => name}>
                      {feesByType.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400">No fee collection data for this date.</p>
          )}
        </section>

        {/* Section 6: Staff Attendance */}
        {data.attendance && (
          <section>
            <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">6. Staff Attendance</h4>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="bg-blue-50 rounded-lg p-2 text-center"><p className="font-bold text-lg text-blue-700">{data.attendance.total_staff}</p><p className="text-blue-600">Total</p></div>
              <div className="bg-green-50 rounded-lg p-2 text-center"><p className="font-bold text-lg text-green-700">{data.attendance.present}</p><p className="text-green-600">Present</p></div>
              <div className="bg-amber-50 rounded-lg p-2 text-center"><p className="font-bold text-lg text-amber-700">{data.attendance.on_leave}</p><p className="text-amber-600">Leave</p></div>
              <div className="bg-red-50 rounded-lg p-2 text-center"><p className="font-bold text-lg text-red-700">{absent}</p><p className="text-red-600">Absent</p></div>
            </div>
          </section>
        )}

        {/* Section 7: Notes */}
        {notes && (
          <section>
            <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">7. Daily Notes</h4>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{notes}</p>
          </section>
        )}
      </div>
    </div>
  );
}
