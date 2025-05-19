const FAQList = ({data}) => {
    if (!data || typeof data !== "string") return null;
    return(
        <div id="answers" className="pb-20 space-y-4 max-w-3xl mx-auto">
        {data.split("\n\n").map((block, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded shadow">
            <p className="text-sm text-gray-200 whitespace-pre-wrap">{block}</p>
          </div>
        ))}
      </div>
    )
}

export default FAQList;