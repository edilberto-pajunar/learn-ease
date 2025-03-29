"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { month: 'Jan', comprehension: 65, reading: 70 },
    { month: 'Feb', comprehension: 72, reading: 75 },
    { month: 'Mar', comprehension: 78, reading: 80 },
    { month: 'Apr', comprehension: 81, reading: 85 },
    { month: 'May', comprehension: 85, reading: 88 },
    { month: 'Jun', comprehension: 89, reading: 90 },
];

export function StudentProgressChart() {
    return (
        <div style={{ width: '100%', height: 400 }}>
            <h2>Student Progress in Comprehension & Reading</h2>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[60, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="comprehension" stroke="#8884d8" name="Comprehension" />
                    <Line type="monotone" dataKey="reading" stroke="#82ca9d" name="Reading" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
