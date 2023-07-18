import React from "react";

const TaskItemPriorityBadge = ({ priorityTask }) => {
  console.log('proooooooooooooiority')

  const renderClassesAccordingToPrority = () => {
    const classes = "text-xs rounded px-1 pb-0.5";

    if ( priorityTask === "High") {
      return classes + " text-red-700 border border-red-700";
    }

    if ( priorityTask === "Medium") {
      return classes + " text-orange-700 border border-orange-700";
    }

    if ( priorityTask === "Low") {
      return classes + " text-yellow-700 border border-yellow-700";
    }

    if ( priorityTask === "Lowest") {
      return classes + " text-gray-700 border border-gray-700";
    }

    return classes;
  };

  return <span className={renderClassesAccordingToPrority()}>{ priorityTask }</span>;
};

export default TaskItemPriorityBadge;
