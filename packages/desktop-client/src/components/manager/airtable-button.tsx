
const AirtableButton = ({ coachName, coachFirstName }) => {
  const handleClick = () => {
    const baseUrl = "https://airtable.com/appYAaDkGzB3ecOzl/shrlBSbx40n5FG8zR"
    
    // Get current URL parameters
    const currentParams = new URLSearchParams(window.location.search)
    
    // Convert to object to make it easier to work with
    const paramsObject = {}
    currentParams.forEach((value, key) => {
      paramsObject[key] = value
    })
    
    // Add or override our specific parameters
    const finalParams = {
      ...paramsObject,
      "prefill_Coach": coachName,
      "hide_utm_source": true,
      "hide_utm_medium": true,
      "hide_utm_campaign": true,
      "hide_utm_term": true,
      "hide_utm_content": true,
      "hide__fprom_tid": true,
      "hide__fprom_ref": true,
      ...(paramsObject.utm_source && { "prefill_utm_source": paramsObject.utm_source }),
      ...(paramsObject.utm_medium && { "prefill_utm_medium": paramsObject.utm_medium }),
      ...(paramsObject.utm_campaign && { "prefill_utm_campaign": paramsObject.utm_campaign }),
      ...(paramsObject.utm_term && { "prefill_utm_term": paramsObject.utm_term }),
      ...(paramsObject.utm_content && { "prefill_utm_content": paramsObject.utm_content }),
      ...(paramsObject._fprom_tid && { "prefill__fprom_tid": paramsObject._fprom_tid }),
      ...(paramsObject._fprom_ref && { "prefill__fprom_ref": paramsObject._fprom_ref }),
      "hide_Advisor": true,
    }

    // Create new URLSearchParams with all parameters
    const params = new URLSearchParams(finalParams)
    
    const url = `${baseUrl}?${params.toString()}`
    window.location.href = url
  }

  return (
    <div 
      onClick={handleClick}
      style={{
        padding: '0.75rem 1.5rem',    // px-6 py-3
        backgroundColor: 'rgb(37, 99, 235)',  // bg-blue-600
        color: 'white',
        fontSize: '1.125rem',         // text-lg
        fontWeight: 'bold',
        borderRadius: '0.5rem',       // rounded-lg
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // shadow-md
        transition: 'all 200ms',      // transition-all duration-200
        cursor: 'pointer'
      }}
    >
      Choose {coachFirstName}
    </div>
  )
}

export default AirtableButton