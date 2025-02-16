interface MaterialCardProps {
  submission: Submission;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ submission }) => {
  return (
    <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition space-y-4">
      {/* Material Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          📘 {`Material ${submission.materialId}`}
        </h2>
        <p className="text-gray-500 text-sm">
          {/* Submitted on: {submission.submittedAt.toDateString()} */}
        </p>
      </div>

      {/* Record Times */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg border">
          <h4 className="text-blue-700 font-medium">Bionic Reading Time</h4>
          <p className="text-lg font-bold">{submission.recordTime.bionic} sec</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg border">
          <h4 className="text-green-700 font-medium">Non-Bionic Reading Time</h4>
          <p className="text-lg font-bold">{submission.recordTime.nonBionic} sec</p>
        </div>
      </div>

      {/* Score Section */}
      <div className="flex items-center gap-4 bg-yellow-50 p-3 rounded-lg border">
        <h4 className="text-yellow-600 font-semibold">🏅 Score:</h4>
        <span className="text-2xl font-bold text-yellow-700">
          {submission.score} / {Object.keys(submission.answers).length}
        </span>
      </div>

      {/* Answers */}
      <div className="bg-gray-100 p-3 rounded-lg border">
        <h4 className="text-md font-bold text-gray-700">📝 Answers:</h4>
        <ul className="space-y-2">
          {Object.entries(submission.answers).map(([question, answer], index) => (
            <li key={index} className="bg-white p-2 rounded-lg shadow-sm border">
              <p className="text-gray-700 font-medium">
                <strong>Q:</strong> {question}
              </p>
              <p className="text-green-600 font-semibold">
                <strong>A:</strong> {answer}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MaterialCard;