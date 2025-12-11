"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  ArrowLeft,
  FileText,
  Clock,
  Calendar,
  User,
  Share2,
  Eye,
  Download,
  Plus,
  ChevronRight,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { EvermindBadge } from "@/components/evermind-badge";

interface CaseDocument {
  id: string;
  name: string;
  type: "contract" | "correspondence" | "evidence" | "legal" | "financial";
  date: string;
  size: string;
}

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: "filing" | "hearing" | "deadline" | "update" | "meeting";
}

interface CaseData {
  id: string;
  title: string;
  type: string;
  status: "active" | "pending" | "closed";
  lawyer: string;
  lawyerFirm: string;
  startDate: string;
  lastUpdate: string;
  documents: CaseDocument[];
  timeline: TimelineEvent[];
  summary: string;
  billableHoursSaved: number;
}

const mockCase: CaseData = {
  id: "CASE-2024-0892",
  title: "Smith v. TechCorp Inc.",
  type: "Employment Dispute",
  status: "active",
  lawyer: "Sarah Mitchell",
  lawyerFirm: "Mitchell & Associates",
  startDate: "2024-01-15",
  lastUpdate: "2024-12-09",
  billableHoursSaved: 12.5,
  summary: `This employment dispute involves wrongful termination claims against TechCorp Inc. The client alleges that their termination on December 1, 2023 was in retaliation for reporting safety violations to management. Key evidence includes internal emails, performance reviews, and witness statements from coworkers.

The case has progressed through initial discovery, with depositions scheduled for early January. Settlement negotiations are ongoing, with the defendant offering $85,000, which the client has rejected. The next court date is set for February 15, 2024 for a motion hearing.

Notable strengths: Strong documentation of safety complaints, consistent positive performance reviews prior to reporting, corroborating witness statements.

Areas of concern: Need to establish clear timeline of retaliation, defendant claims business restructuring as reason for termination.`,
  documents: [
    { id: "1", name: "Employment Contract", type: "contract", date: "2020-03-15", size: "245 KB" },
    { id: "2", name: "Performance Reviews (2020-2023)", type: "evidence", date: "2023-11-01", size: "1.2 MB" },
    { id: "3", name: "Safety Complaint Email Chain", type: "correspondence", date: "2023-10-15", size: "89 KB" },
    { id: "4", name: "Termination Letter", type: "legal", date: "2023-12-01", size: "56 KB" },
    { id: "5", name: "Witness Statement - J. Thompson", type: "evidence", date: "2024-02-20", size: "123 KB" },
    { id: "6", name: "Settlement Offer", type: "legal", date: "2024-11-15", size: "78 KB" },
    { id: "7", name: "Legal Fees Summary", type: "financial", date: "2024-12-01", size: "45 KB" },
  ],
  timeline: [
    { id: "1", date: "2023-10-15", title: "Safety Complaint Filed", description: "Client reported safety violations to management", type: "update" },
    { id: "2", date: "2023-12-01", title: "Termination", description: "Client received termination notice", type: "update" },
    { id: "3", date: "2024-01-15", title: "Case Filed", description: "Wrongful termination complaint filed with court", type: "filing" },
    { id: "4", date: "2024-03-20", title: "Discovery Phase Begins", description: "Initial discovery requests submitted", type: "update" },
    { id: "5", date: "2024-06-15", title: "Depositions Completed", description: "All key depositions have been completed", type: "meeting" },
    { id: "6", date: "2024-11-15", title: "Settlement Offer Received", description: "$85,000 settlement offer from defendant", type: "update" },
    { id: "7", date: "2025-01-10", title: "Deposition Scheduled", description: "Client deposition scheduled", type: "deadline" },
    { id: "8", date: "2025-02-15", title: "Motion Hearing", description: "Hearing on motion to compel additional discovery", type: "hearing" },
  ],
};

export default function LegalMemoryPage() {
  const { authenticated, ready, login } = usePrivy();
  const [activeTab, setActiveTab] = useState<"summary" | "documents" | "timeline">("summary");
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareGenerated, setShareGenerated] = useState(false);

  const getDocTypeIcon = (type: CaseDocument["type"]) => {
    switch (type) {
      case "contract": return "📄";
      case "correspondence": return "📧";
      case "evidence": return "📋";
      case "legal": return "⚖️";
      case "financial": return "💰";
      default: return "📁";
    }
  };

  const getEventTypeColor = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "filing": return "bg-blue-100 text-blue-600";
      case "hearing": return "bg-purple-100 text-purple-600";
      case "deadline": return "bg-red-100 text-red-600";
      case "update": return "bg-gray-100 text-gray-600";
      case "meeting": return "bg-green-100 text-green-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const handleGenerateShare = async () => {
    // Simulate AI summary generation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setShareGenerated(true);
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-blue-500">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white theme-legal">
        <header className="fixed top-0 left-0 right-0 z-50 glass">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
            <EvermindBadge size="sm" />
          </div>
        </header>

        <div className="relative min-h-screen flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-6">
              <Scale className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-gray-900 mb-3">
              Legal Memory
            </h1>
            <p className="text-gray-600 mb-8">
              Own your case context. Share smart summaries with your lawyer.
            </p>
            <button
              onClick={login}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              Sign In to View Your Case
            </button>
          </motion.div>

          <div className="absolute bottom-8">
            <EvermindBadge variant="light" size="md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white theme-legal">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-semibold text-gray-900">Legal Memory</span>
          </div>
          <EvermindBadge size="sm" />
        </div>
      </header>

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Case Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    mockCase.status === "active" ? "bg-green-100 text-green-700" :
                    mockCase.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {mockCase.status.charAt(0).toUpperCase() + mockCase.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-400">{mockCase.id}</span>
                </div>
                <h1 className="font-display text-2xl font-semibold text-gray-900 mb-1">
                  {mockCase.title}
                </h1>
                <p className="text-gray-500">{mockCase.type}</p>
              </div>
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share with Lawyer
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-400 mb-1">Assigned Lawyer</p>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">{mockCase.lawyer}</span>
                </div>
                <p className="text-xs text-gray-400">{mockCase.lawyerFirm}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Case Started</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">{mockCase.startDate}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Last Updated</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">{mockCase.lastUpdate}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Hours Saved</p>
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">{mockCase.billableHoursSaved}h</span>
                </div>
                <p className="text-xs text-gray-400">~${(mockCase.billableHoursSaved * 350).toLocaleString()} saved</p>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-6 w-fit"
          >
            {[
              { id: "summary", label: "AI Summary" },
              { id: "documents", label: `Documents (${mockCase.documents.length})` },
              { id: "timeline", label: "Timeline" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm"
          >
            {activeTab === "summary" && (
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="font-semibold text-gray-900">AI-Generated Case Summary</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  {mockCase.summary.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="text-gray-600 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900 mb-1">Your Data, Your Control</p>
                      <p className="text-sm text-blue-700">
                        This summary is generated from documents you've uploaded. You control who sees this information.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "documents" && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">Case Documents</h2>
                  <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Document
                  </button>
                </div>
                <div className="space-y-2">
                  {mockCase.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getDocTypeIcon(doc.type)}</span>
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-400">{doc.date} • {doc.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-white rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-white rounded-lg transition-colors">
                          <Download className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="p-6">
                <h2 className="font-semibold text-gray-900 mb-6">Case Timeline</h2>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
                  <div className="space-y-6">
                    {mockCase.timeline.map((event, index) => {
                      const isPast = new Date(event.date) < new Date();
                      return (
                        <div key={event.id} className="relative pl-10">
                          <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            isPast ? "bg-green-100" : "bg-gray-100"
                          }`}>
                            {isPast ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Clock className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getEventTypeColor(event.type)}`}>
                                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                              </span>
                              <span className="text-xs text-gray-400">{event.date}</span>
                            </div>
                            <h3 className="font-medium text-gray-900 mb-1">{event.title}</h3>
                            <p className="text-sm text-gray-600">{event.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowShareModal(false);
              setShareGenerated(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-gray-900">
                    Share with Lawyer
                  </h2>
                  <p className="text-sm text-gray-500">Generate a summary to share</p>
                </div>
              </div>

              {!shareGenerated ? (
                <>
                  <p className="text-gray-600 mb-6">
                    Generate an AI-powered summary of your case that your lawyer can review quickly, saving billable hours on case review.
                  </p>

                  <div className="bg-green-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Timer className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">Estimated Savings</span>
                    </div>
                    <p className="text-sm text-green-700">
                      This summary could save approximately 2-3 billable hours (~$700-$1,050) in lawyer review time.
                    </p>
                  </div>

                  <button
                    onClick={handleGenerateShare}
                    className="w-full py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    Generate Shareable Summary
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="font-medium text-gray-900 mb-2">Summary Generated</p>
                    <p className="text-sm text-gray-600 mb-4">
                      A comprehensive summary has been created including case status, key documents, upcoming deadlines, and strategic notes.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>End-to-end encrypted</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button className="w-full py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Copy Share Link
                    </button>
                    <button className="w-full py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Download PDF Summary
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Badge */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
        <EvermindBadge variant="light" size="md" />
      </div>
    </div>
  );
}
