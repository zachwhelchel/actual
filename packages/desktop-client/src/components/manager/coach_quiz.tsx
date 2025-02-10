import React, { useState, useEffect } from 'react';
import AirtableButton from './airtable-button'
import Airtable from 'airtable';

// const TEST_DATA = {
//   coaches: [
//     {
//       id: '1',
//       name: 'Sarah Johnson',
//       photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
//       price: 'Affordable',
//       niches: ['Career Development', 'Public Speaking', 'Leadership']
//     },
//     {
//       id: '2',
//       name: 'Michael Chen',
//       photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
//       price: 'Premium',
//       niches: ['Executive Coaching', 'Leadership', 'Business Strategy']
//     },
//     {
//       id: '3',
//       name: 'Lisa Rodriguez',
//       photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
//       price: 'Average',
//       niches: ['Work-Life Balance', 'Stress Management', 'Career Development']
//     },
//     {
//       id: '4',
//       name: 'James Wilson',
//       photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
//       price: 'Premium',
//       niches: ['Business Strategy', 'Sales Coaching', 'Leadership']
//     },
//     {
//       id: '5',
//       name: 'Emma Thompson',
//       photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
//       price: 'Affordable',
//       niches: ['Personal Development', 'Stress Management', 'Public Speaking']
//     }
//   ]
// };

const TEST_DATA = {
  coaches: [
  ]
};


const CoachQuiz = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [coaches, setCoaches] = useState([]);
  const [uniqueNiches, setUniqueNiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingTestData, setUsingTestData] = useState(false);
  const [showingAlternatives, setShowingAlternatives] = useState(false);
  
  // Store answers
  const [selectedNiches, setSelectedNiches] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedCoach, setSelectedCoach] = useState(null);
  
  // Contact form data
  const [formData, setFormData] = useState({
    name: '',
    foundUs: '',
    motivation: ''
  });

  // Progress bar component
  const ProgressBar = () => (
    <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
      <div 
        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${((currentStage + 1) / 3) * 100}%` }}
      />
    </div>
  );

  // Coach card component
  const CoachCard = ({ coach, isMainResult = false, hasMatch }) => {
    // Calculate matching criteria for this coach
    const matchingNiches = selectedNiches.filter(niche => coach.niches.includes(niche));
    const priceMatch = coach.price === selectedPrice;
    const hasAnyMatch = priceMatch || matchingNiches.length > 0;

    return (
      <div className={`text-center ${!isMainResult ? 'border-t py-6' : ''}`}>
        {coach.photo && (
          <div className="flex justify-center mb-4">
            <img 
              src={coach.photo} 
              alt={coach.name}
              className={`rounded-full object-cover ${isMainResult ? 'w-32 h-32' : 'w-32 h-32'}`}
            />
          </div>
        )}
        <h3 className={`font-semibold ${isMainResult ? 'text-xl mb-2' : 'text-xl mb-2'}`}>
          {coach.name}
        </h3>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-300">
          <p className="text-sm text-gray-700 italic mb-2">
            "{coach.quizQuote}"
          </p>
          <footer className="text-xs text-gray-500">
            — {coach.firstName}
          </footer>
        </div>

        <div className="mt-4 bg-blue-50 p-4 rounded-lg" style={{marginBottom: 20}}>
          {hasAnyMatch ? (
            <>
              <h4 className="font-semibold text-blue-800 mb-2">
                {isMainResult ? 'Why we matched you' : 'How they match'}
              </h4>
              <div className="space-y-2 text-sm">
                {priceMatch && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-blue-600">✓</span>
                    <span>Offers {coach.price.toLowerCase()} pricing</span>
                  </div>
                )}
                {matchingNiches.map(niche => (
                  <div key={niche} className="flex items-center justify-center gap-2">
                    <span className="text-blue-600">✓</span>
                    <span>Specializes in {niche}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-blue-800">
              We think {coach.name.split(' ')[0]} would be a great coach to help you achieve your goals.
            </p>
          )}
        </div>
        <AirtableButton coachName={coach.name} coachFirstName={coach.firstName} />
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const base = new Airtable({
          apiKey:'patMOyRhq0NRBgLsN.0399271203b563dfbb1d89d39df338828c48bc7defaf1e1b753e1e3821247081'
        }).base('appYAaDkGzB3ecOzl');

        const records = await base('Coaches').select({
          view: "viweKhfFeBYy0rvbf",
          fields: ["Name", "Price","Photo", "Niche", "Quiz", "First Name", "Quiz Quote"],
          filterByFormula: "{Quiz} = 1"
        }).all();
        
        // Format coach data
        const formattedCoaches = records.map(record => ({
          id: record.id,
          name: record.get('Name'),
          firstName: record.get('First Name'),
          quizQuote: record.get('Quiz Quote'),
          photo: record.fields.Photo ? record.fields.Photo[0]?.url : null,
          price: record.get('Price'),
          niches: record.get('Niche') || []
        }));

        // Get unique niches from all coaches
        const allNiches = formattedCoaches.flatMap(coach => coach.niches);
        const uniqueNichesList = [...new Set(allNiches)].sort();

        setCoaches(formattedCoaches);
        setUniqueNiches(uniqueNichesList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        
        // Fall back to test data
        setUsingTestData(true);
        const allTestNiches = TEST_DATA.coaches.flatMap(coach => coach.niches);
        const uniqueTestNiches = [...new Set(allTestNiches)].sort();
        
        setCoaches(TEST_DATA.coaches);
        setUniqueNiches(uniqueTestNiches);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNicheSelection = (niche) => {
    setSelectedNiches(prev => {
      if (prev.includes(niche)) {
        return prev.filter(n => n !== niche);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, niche];
    });
  };

  const findAllMatches = () => {
    const exactMatches = coaches.filter(coach => {
      const priceMatch = coach.price === selectedPrice;
      const nicheMatch = coach.niches.some(niche => selectedNiches.includes(niche));
      return priceMatch && nicheMatch;
    });

    const partialMatches = coaches.filter(coach => {
      const priceMatch = coach.price === selectedPrice;
      const nicheMatch = coach.niches.some(niche => selectedNiches.includes(niche));
      return (nicheMatch) && !exactMatches.includes(coach);
      //return (priceMatch || nicheMatch) && !exactMatches.includes(coach);
    });

    return {
      exactMatches,
      partialMatches
    };
  };

  const findMatchingCoach = () => {
    const { exactMatches, partialMatches } = findAllMatches();

    if (exactMatches.length > 0) {
      return {
        coach: exactMatches[Math.floor(Math.random() * exactMatches.length)],
        hasMatch: true,
        hasAlternatives: exactMatches.length > 1 || partialMatches.length > 0
      };
    }

    if (partialMatches.length > 0) {
      return {
        coach: partialMatches[Math.floor(Math.random() * partialMatches.length)],
        hasMatch: false,
        hasAlternatives: partialMatches.length > 1
      };
    }

    return {
      coach: coaches[Math.floor(Math.random() * coaches.length)],
      hasMatch: false,
      hasAlternatives: false
    };
  };

  const resetQuiz = () => {
    setCurrentStage(0);
    setSelectedNiches([]);
    setSelectedPrice(null);
    setShowingAlternatives(false);
  };

  const handleClick = () => {
    const baseUrl = "https://www.mybudgetcoach.com/coaches"

    // Get current URL parameters
    const currentParams = new URLSearchParams(window.location.search)
    
    // Convert to object to make it easier to work with
    const paramsObject = {}
    currentParams.forEach((value, key) => {
      paramsObject[key] = value
    })
    
    // Add or override our specific parameters
    const finalParams = {
      ...paramsObject
    }

    // Create new URLSearchParams with all parameters
    const params = new URLSearchParams(finalParams)
    
    const url = `${baseUrl}?${params.toString()}`
    window.location.href = url
  }

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
        <ProgressBar />
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  // Results page
  if (currentStage === 2) {
    const { coach: matchedCoach, hasMatch, hasAlternatives } = findMatchingCoach();
    const { exactMatches, partialMatches } = findAllMatches();

    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
        <ProgressBar />
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-4">Your Recommended Coach</h2>
          <CoachCard coach={matchedCoach} isMainResult={true} hasMatch={hasMatch} />
        </div>
        
        {usingTestData && (
          <div className="text-center text-sm text-gray-500 mb-4">
            No results found.
          </div>
        )}
        
        <div className="flex justify-center gap-4">
          <button
            onClick={resetQuiz}
            className="px-2 py-1 text-blue-600 underline hover:text-blue-800"
          >
            Start Over
          </button>
          {hasAlternatives && !showingAlternatives && (
            <button
              onClick={() => setShowingAlternatives(true)}
              className="px-2 py-1 text-blue-600 underline hover:text-blue-800"
            >
              See Other Matches
            </button>
          )}
          <button
            onClick={handleClick}
            className="px-2 py-1 text-blue-600 underline hover:text-blue-800"
          >
            Browse All Coaches
          </button>

        </div>

        {showingAlternatives && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-center mb-6">Other Potential Matches</h3>
            <div className="space-y-6">
              {[...exactMatches, ...partialMatches]
                .filter(coach => coach.id !== matchedCoach.id)
                .map(coach => (
                  <CoachCard key={coach.id} coach={coach} hasMatch={exactMatches.includes(coach)} />
                ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Niche selection page
if (currentStage === 0) {
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
      <ProgressBar />
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center mb-4">
          Select up to 3 that apply to you:
        </h2>
        {usingTestData && (
          <div className="text-center text-sm text-gray-500">
            No results found.
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {uniqueNiches.map((niche) => (
          <label 
            key={niche} 
            className={`
              flex items-center px-4 py-2 rounded-full border cursor-pointer
              transition-all duration-200
              ${selectedNiches.includes(niche) 
                ? 'bg-blue-100 border-blue-500 text-blue-700' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}
              ${selectedNiches.length >= 3 && !selectedNiches.includes(niche)
                ? 'opacity-50 cursor-not-allowed'
                : ''}
            `}
          >
            <input
              type="checkbox"
              checked={selectedNiches.includes(niche)}
              onChange={() => handleNicheSelection(niche)}
              disabled={selectedNiches.length >= 3 && !selectedNiches.includes(niche)}
              className="hidden"
            />
            <span>{niche}</span>
          </label>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Selected: {selectedNiches.length}/3
        </div>
        <button
          onClick={() => setCurrentStage(1)}
          disabled={selectedNiches.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
  // Price selection page
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
      <ProgressBar />
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center mb-4">
          What's your preferred price for 1-on-1 sessions?
        </h2>
        {usingTestData && (
          <div className="text-center text-sm text-gray-500">
            No results found.
          </div>
        )}
      </div>
      <div className="space-y-3 mb-6">
        {['Affordable', 'Average', 'Premium'].map((price) => (
          <label 
            key={price}
            className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="radio"
              name="price"
              value={price}
              checked={selectedPrice === price}
              onChange={() => setSelectedPrice(price)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-gray-700">{price}</span>
          </label>
        ))}
      </div>
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStage(0)}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => setCurrentStage(2)}
          disabled={!selectedPrice}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Find My Coach
        </button>
      </div>
    </div>
  );
};

export default CoachQuiz;