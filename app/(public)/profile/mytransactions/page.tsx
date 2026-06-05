"use client";

import React, { useState } from "react";

export default function MyTransactionsPage() {
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);
    const [data, setData] = useState<any | null>(null);

    async function fetchMyTransactions() {
        const userId = localStorage.getItem("ag_user_id");
        if (!userId) {
            setMsg("⚠️ No userId in localStorage. Please sign up or verify OTP first.");
            return;
        }

        setLoading(true);
        setMsg("Fetching transactions...");
        setData(null);

        try {
            const resp = await fetch("/api/payments/list", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    paymentListRequest: {
                        pageIndex: 0,
                        pageSize: 10,
                        sortingColumnId: 0,
                        sortingTypeId: 0,
                        userId,
                    },
                }),
            });

            const json = await resp.json();
            if (!resp.ok) {
                setMsg(`❌ Server returned ${resp.status}: ${JSON.stringify(json)}`);
                setLoading(false);
                return;
            }

            setData(json);
            setMsg("✅ Transactions loaded successfully.");
        } catch (err: any) {
            setMsg("Network error: " + (err?.message ?? String(err)));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ padding: 24, maxWidth: 980 }}>
            <h1>💳 My Transactions</h1>

            <div style={{ marginBottom: 16 }}>
                <button onClick={fetchMyTransactions} disabled={loading}>
                    {loading ? "Loading…" : "Fetch My Transactions"}
                </button>{" "}
                <button
                    onClick={() => {
                        setData(null);
                        setMsg(null);
                    }}
                >
                    Clear
                </button>
            </div>

            {msg && (
                <div
                    style={{
                        background: "#f5f5f5",
                        padding: "10px 14px",
                        borderRadius: 6,
                        marginBottom: 12,
                        fontFamily: "monospace",
                    }}
                >
                    {msg}
                </div>
            )}

            {data && data.paymentTransactionList && data.paymentTransactionList.length > 0 && (
                <table
                    style={{
                        borderCollapse: "collapse",
                        width: "100%",
                        fontSize: 14,
                        marginTop: 10,
                    }}
                >
                    <thead>
                        <tr style={{ background: "#fafafa" }}>
                            <th style={th}>#</th>
                            <th style={th}>Transaction ID</th>
                            <th style={th}>Amount</th>
                            <th style={th}>Date</th>
                            <th style={th}>Status</th>
                            <th style={th}>Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.paymentTransactionList.map((txn: any, i: number) => (
                            <tr key={txn.transactionId ?? i}>
                                <td style={td}>{i + 1}</td>
                                <td style={td}>
                                    <code>{txn.transactionId}</code>
                                </td>
                                <td style={td}>{txn.paymentAmount ?? "—"}</td>
                                <td style={td}>{txn.paymentDate ?? "—"}</td>
                                <td style={td}>{txn.paymentStatus ?? "—"}</td>
                                <td style={td}>{txn.paymentCategory ?? "—"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {data &&
                data.paymentTransactionList &&
                data.paymentTransactionList.length === 0 && (
                    <p>No transactions found.</p>
                )}

            {data && (
                <details style={{ marginTop: 20 }}>
                    <summary>🔍 Raw API Response</summary>
                    <pre
                        style={{
                            background: "#f7f7f7",
                            padding: 12,
                            borderRadius: 6,
                            maxHeight: 400,
                            overflow: "auto",
                            fontSize: 13,
                        }}
                    >
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </details>
            )}
        </div>
    );
}

const th: React.CSSProperties = {
    border: "1px solid #ddd",
    textAlign: "left",
    padding: "8px 10px",
};

const td: React.CSSProperties = {
    border: "1px solid #eee",
    padding: "8px 10px",
};
