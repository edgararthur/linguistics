import React, { useState } from 'react';
import Modal from '../../components/shared/Modal';
import Button from '../../components/shared/Button';
import { ReportType } from '../../types';
import { financeService } from '../../services/financeService';
import { FileText, Users, PieChart, Loader, Download, TrendingUp } from 'lucide-react';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const REPORT_TYPES: { value: ReportType; label: string; description: string; icon: React.ReactNode }[] = [
    {
        value: 'income_statement',
        label: 'Income Statement',
        description: 'Revenue breakdown by source (dues, donations, events)',
        icon: <TrendingUp className="w-6 h-6" />
    },
    {
        value: 'expense_summary',
        label: 'Expense Summary',
        description: 'Expenses categorized by type',
        icon: <PieChart className="w-6 h-6" />
    },
    {
        value: 'dues_report',
        label: 'Dues Report',
        description: 'Member dues status (paid, pending, overdue)',
        icon: <Users className="w-6 h-6" />
    },
    {
        value: 'full_financial',
        label: 'Full Financial Report',
        description: 'Complete income vs expenses overview',
        icon: <FileText className="w-6 h-6" />
    },
];



export default function ReportModal({ isOpen, onClose }: ReportModalProps) {
    const [selectedReport, setSelectedReport] = useState<ReportType>('income_statement');
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        setReportData(null);

        try {
            const data = await financeService.generateReport(selectedReport, startDate, endDate);
            setReportData(data);
        } catch (err: any) {
            console.error('Error generating report:', err);
            setError(err.message || 'Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!reportData) return;

        // Generate CSV content based on report type
        let csvContent = '';
        const reportTitle = REPORT_TYPES.find(r => r.value === selectedReport)?.label || 'Report';

        if (selectedReport === 'income_statement') {
            csvContent = `${reportTitle}\nPeriod: ${startDate} to ${endDate}\n\nSource,Amount (GHS)\n`;
            reportData.breakdown?.forEach((item: any) => {
                csvContent += `${item.type},${item.total}\n`;
            });
            csvContent += `\nTotal Income,${reportData.totalIncome}\n`;
        } else if (selectedReport === 'expense_summary') {
            csvContent = `${reportTitle}\nPeriod: ${startDate} to ${endDate}\n\nCategory,Amount (GHS)\n`;
            reportData.breakdown?.forEach((item: any) => {
                csvContent += `${item.category},${item.total}\n`;
            });
            csvContent += `\nTotal Expenses,${reportData.totalExpenses}\n`;
        } else if (selectedReport === 'dues_report') {
            csvContent = `${reportTitle}\nPeriod: ${startDate} to ${endDate}\n\nStatus,Count,Amount (GHS)\n`;
            csvContent += `Paid,${reportData.paidCount},${reportData.paidAmount}\n`;
            csvContent += `Pending,${reportData.pendingCount},${reportData.pendingAmount}\n`;
        } else if (selectedReport === 'full_financial') {
            csvContent = `${reportTitle}\nPeriod: ${startDate} to ${endDate}\n\n`;
            csvContent += `Total Income,${reportData.totalIncome}\n`;
            csvContent += `Total Expenses,${reportData.totalExpenses}\n`;
            csvContent += `Net Balance,${reportData.netBalance}\n`;
        }

        // Download the CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${selectedReport}_${startDate}_${endDate}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleClose = () => {
        setReportData(null);
        setError(null);
        onClose();
    };

    const renderReportPreview = () => {
        if (!reportData) return null;

        return (
            <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">
                    {REPORT_TYPES.find(r => r.value === selectedReport)?.label}
                </h4>

                {selectedReport === 'income_statement' && (
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {reportData.breakdown?.map((item: any) => (
                                <div key={item.type} className="flex justify-between bg-white p-2 rounded">
                                    <span className="capitalize text-gray-600">{item.type.replace('_', ' ')}</span>
                                    <span className="font-medium">GH₵ {item.total.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between border-t pt-3 font-bold">
                            <span>Total Income</span>
                            <span className="text-green-600">GH₵ {reportData.totalIncome.toLocaleString()}</span>
                        </div>
                    </div>
                )}

                {selectedReport === 'expense_summary' && (
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {reportData.breakdown?.map((item: any) => (
                                <div key={item.category} className="flex justify-between bg-white p-2 rounded">
                                    <span className="capitalize text-gray-600">{item.category}</span>
                                    <span className="font-medium">GH₵ {item.total.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between border-t pt-3 font-bold">
                            <span>Total Expenses</span>
                            <span className="text-red-600">GH₵ {reportData.totalExpenses.toLocaleString()}</span>
                        </div>
                    </div>
                )}

                {selectedReport === 'dues_report' && (
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-50 p-3 rounded-lg">
                                <p className="text-sm text-green-700">Paid Dues</p>
                                <p className="text-xl font-bold text-green-800">{reportData.paidCount} members</p>
                                <p className="text-sm text-green-600">GH₵ {reportData.paidAmount.toLocaleString()}</p>
                            </div>
                            <div className="bg-yellow-50 p-3 rounded-lg">
                                <p className="text-sm text-yellow-700">Pending Dues</p>
                                <p className="text-xl font-bold text-yellow-800">{reportData.pendingCount} members</p>
                                <p className="text-sm text-yellow-600">GH₵ {reportData.pendingAmount.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                )}

                {selectedReport === 'full_financial' && (
                    <div className="space-y-3">
                        <div className="flex justify-between p-2 bg-green-50 rounded">
                            <span className="text-green-700">Total Income</span>
                            <span className="font-bold text-green-700">GH₵ {reportData.totalIncome.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-red-50 rounded">
                            <span className="text-red-700">Total Expenses</span>
                            <span className="font-bold text-red-700">GH₵ {reportData.totalExpenses.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-blue-100 rounded-lg border-t-2 border-blue-300">
                            <span className="font-semibold text-blue-800">Net Balance</span>
                            <span className={`font-bold text-lg ${reportData.netBalance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                GH₵ {reportData.netBalance.toLocaleString()}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Generate Financial Report">
            <div className="space-y-6">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Report Type Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Select Report Type</label>
                    <div className="grid grid-cols-2 gap-3">
                        {REPORT_TYPES.map(report => (
                            <button
                                key={report.value}
                                type="button"
                                onClick={() => {
                                    setSelectedReport(report.value);
                                    setReportData(null);
                                }}
                                className={`p-3 rounded-lg border-2 text-left transition-all ${selectedReport === report.value
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <div className={`mb-2 ${selectedReport === report.value ? 'text-blue-600' : 'text-gray-500'}`}>
                                    {report.icon}
                                </div>
                                <p className="font-medium text-sm text-gray-900">{report.label}</p>
                                <p className="text-xs text-gray-500 mt-1">{report.description}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input
                            type="date"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                setReportData(null);
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                        <input
                            type="date"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                setReportData(null);
                            }}
                        />
                    </div>
                </div>

                {/* Report Preview */}
                {renderReportPreview()}

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button variant="outline" onClick={handleClose} type="button">
                        Close
                    </Button>
                    {reportData && (
                        <Button variant="outline" onClick={handleDownload} type="button">
                            <Download className="w-4 h-4 mr-2" />
                            Download CSV
                        </Button>
                    )}
                    <Button onClick={handleGenerate} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            'Generate Report'
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
