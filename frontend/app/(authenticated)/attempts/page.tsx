"use client";

import { useGetAllUserAttempts } from "@/hooks/history/useGetAllUserAttempts";
import HistoryTable from "@/views/admin/dataTables/components/HistoryTable";

const AttemptList = () => {
  const { attempts } = useGetAllUserAttempts();
  const tableData = attempts.map((attempt) => ({
    name: attempt.roomName,
    attemptId: attempt.attemptId,
    language: attempt.language.label,
    date: attempt.updatedAt || "No record",
  }));

  return <HistoryTable tableData={tableData} />;
};

export default AttemptList;
