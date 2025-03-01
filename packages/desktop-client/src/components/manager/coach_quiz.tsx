import React, { useState, useEffect } from 'react';
import AirtableButton from './airtable-button'
import Airtable from 'airtable';
import { type State } from 'loot-core/client/state-types';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonWithLoading } from '../common/Button2';
import {
  send,
} from 'loot-core/src/platform/client/fetch';

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


const CoachQuiz = ({ jumpToUser = false, firstName, lastName, email }) => {
  const [currentStage, setCurrentStage] = useState(jumpToUser ? 3 : 0);
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
  

  const [formData, setFormData] = useState({
    firstName: firstName || '',
    lastName: lastName || '',
    email: email || '',
    foundUs: '',
    motivation: '',
    language: ''
  });


  


  const userData = useSelector((state: State) => state.user.data);

  // Contact form data
  // const [formData, setFormData] = useState({
  //   name: '',
  //   foundUs: '',
  //   motivation: ''
  // });

  // Progress bar component
  const ProgressBar = () => (
    <div style={{
      width: '100%',
      backgroundColor: 'rgb(229, 231, 235)', // bg-gray-200
      height: '0.5rem',                      // h-2
      borderRadius: '9999px',                // rounded-full
      marginBottom: '1.5rem'                 // mb-6
    }}>
      <div 
        style={{
          backgroundColor: '#8719e0', // bg-blue-500
          height: '0.5rem',                     // h-2
          borderRadius: '9999px',               // rounded-full
          transition: 'all 300ms',              // transition-all duration-300
          width: `${((currentStage + 1) / 4) * 100}%`
        }}
      />
    </div>
  );





  const selectThisCoach = async (coachName) => {

    if (userData?.userId !== null) {
      await updateUserCoachRelationship(userData?.userId, coachName);

    }




    setCurrentStage(3);
  };



  const handleSubmit = async () => {

    if (userData?.userId !== null) {
      await updateUserData(userData?.userId);
    }

    window.location.reload()

  };



  const updateUserCoachRelationship = async (userId, coachId) => {
    let url = String(window.location.href);
    const results = await send('airtable-update-coach', {url: url, coachId: coachId});
    console.log('updateUserCoachRelationship');
    console.log(results);
  };



  const updateUserData = async (userId) => {

    let url = String(window.location.href);
    const storedParams = localStorage.getItem('urlParams');
    let params = storedParams ? JSON.parse(storedParams) : null;

    const results = await send('airtable-update-user', {url: url, first_name: formData.firstName, last_name: formData.lastName, email: formData.email, found_us: formData.foundUs, motivation: formData.motivation, language: formData.language, fprom_tid: params?.fprom_tid, fprom_ref: params?.fprom_ref, utm_campaign: params?.utm_campaign, utm_medium: params?.utm_medium, utm_source: params?.utm_source, utm_term: params?.utm_term, utm_content: params?.utm_content});
    console.log('updateUserCoachRelationship');
    console.log(results);

    localStorage.removeItem('urlParams');
  };







  // Coach card component
  const CoachCard = ({ coach, isMainResult = false, hasMatch }) => {
    // Calculate matching criteria for this coach
    const matchingNiches = selectedNiches.filter(niche => coach.niches.includes(niche));
    const priceMatch = coach.price === selectedPrice;
    const hasAnyMatch = priceMatch || matchingNiches.length > 0;

    return (
      <div style={{
        textAlign: 'center',
        ...((!isMainResult) ? {
          borderTop: '1px solid #e5e7eb',
          paddingTop: '1.5rem',
          paddingBottom: '1.5rem'
        } : {})
      }}>
        {coach.photo && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <img 
              src={coach.photo} 
              alt={coach.name}
              style={{
                borderRadius: '9999px',
                objectFit: 'cover',
                width: '8rem',
                height: '8rem'
              }}
            />
          </div>
        )}
        <h3 style={{
          fontWeight: 600,
          fontSize: '1.25rem',
          marginBottom: '0.5rem'
        }}>
          {coach.name}
        </h3>
        <div style={{
          backgroundColor: 'rgb(249, 250, 251)',
          padding: '1.0rem',
          borderRadius: '0.5rem',
          border: '1px solid rgb(209, 213, 219)'
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: 'rgb(55, 65, 81)',
            fontStyle: 'italic',
            marginBottom: '0.5rem'
          }}>
            "{coach.quizQuote}"
          </p>
          <footer style={{
            fontSize: '0.75rem',
            color: 'rgb(107, 114, 128)',
            paddingBottom: '0.2rem'
          }}>
            — {coach.firstName}
          </footer>
        </div>
        <div style={{
          marginTop: '1rem',
          backgroundColor: 'rgb(239, 246, 255)',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '20px'
        }}>
          {hasAnyMatch ? (
            <>
              <h4 style={{
                fontWeight: 600,
                marginTop: 0,
                color: 'rgb(30, 64, 175)',
                marginBottom: '0.5rem'
              }}>
                {isMainResult ? 'Why we matched you' : 'How they match'}
              </h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.875rem',
                marginBottom: '0px'
              }}>
                {priceMatch && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ color: 'black' }}>✓</span>
                    <span>Offers {coach.price.toLowerCase()} pricing</span>
                  </div>
                )}
                {matchingNiches.map(niche => (
                  <div key={niche} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ color: 'black' }}>✓</span>
                    <span>Specializes in {niche}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p style={{ color: 'rgb(30, 64, 175)' }}>
              We think {coach.name.split(' ')[0]} would be a great coach to help you achieve your goals.
            </p>
          )}
        </div>

        <button
          onClick={() => selectThisCoach(coach.recordId)}
          style={{
            padding: '0.7rem 1rem',
            width: '100%',
            fontSize: '15px',
            fontWeight: 'bold',
            backgroundColor: selectedNiches.length === 0 ? 'rgb(209, 213, 219)' : '#8719e0',
            color: 'white',
            borderRadius: '0.5rem',
            transition: 'background-color 150ms',
            cursor: selectedNiches.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          Choose {coach.firstName}
        </button>





      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const base = new Airtable({
          apiKey:'patesb8ApiuPgnTkp.f0f41936aedd9e96ccf7c5ea24d447d3596b3e117f67a14abe8a7176d3dd7107'
        }).base('appgjreoARDMPmznt');

        const records = await base('Coaches').select({
          view: "viwU2P9LzwQMPB2lV",
          fields: ["Name", "Price","Photo", "Niche", "Quiz", "First Name", "Quiz Quote", "Record Id"],
          filterByFormula: "{Quiz} = 1"
        }).all();
        
        // Format coach data
        const formattedCoaches = records.map(record => ({
          id: record.id,
          name: record.get('Name'),
          firstName: record.get('First Name'),
          quizQuote: record.get('Quiz Quote'),
          recordId: record.get('Record Id'),
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
      // <div style={{
      //   maxWidth: '36rem',        // max-w-xl
      //   marginLeft: 'auto',       // mx-auto
      //   marginRight: 'auto',      // mx-auto
      //   padding: '1.5rem',        // p-6
      //   backgroundColor: 'white', // bg-white
      //   borderRadius: '0.5rem',   // rounded-lg
      //   boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' // shadow
      // }}>
      //   <ProgressBar />
      //   <div style={{
      //     textAlign: 'center',    // text-center
      //     paddingTop: '2rem',     // py-8
      //     paddingBottom: '2rem'   // py-8
      //   }}>
      //     Loading...
      //   </div>
      // </div>
      <div/>
    );
  }

  // Results page
  if (currentStage === 2) {
    const { coach: matchedCoach, hasMatch, hasAlternatives } = findMatchingCoach();
    const { exactMatches, partialMatches } = findAllMatches();

    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: 20,
        paddingBottom: 20,
        minHeight: '100vh',
        overflow: 'auto',    // Add this to enable scrolling
        backgroundColor: '#f5f5f5'  // Optional: adds a background color to the page
      }}>

      <div style={{
        width: '60%',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
      }}>
        <ProgressBar />
        <div style={{
          textAlign: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            Your Recommended Coach
          </h2>
          <CoachCard coach={matchedCoach} isMainResult={true} hasMatch={hasMatch} />
        </div>
        
        {usingTestData && (
          <div style={{
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'rgb(107, 114, 128)',
            marginBottom: '1rem'
          }}>
            No results found.
          </div>
        )}
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          <button
            onClick={resetQuiz}
            style={{
              padding: '0.25rem 0.5rem',
              color: 'black',
              ':hover': {
                color: 'rgb(30, 64, 175)'
              }
            }}
          >
            Start Over
          </button>
          {hasAlternatives && !showingAlternatives && (
            <button
              onClick={() => setShowingAlternatives(true)}
              style={{
                padding: '0.25rem 0.5rem',
                color: 'black',
                ':hover': {
                  color: 'rgb(30, 64, 175)'
                }
              }}
            >
              See Other Matches
            </button>
          )}
        </div>

        {showingAlternatives && (
          <div style={{
            marginTop: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              Other Potential Matches
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              {[...exactMatches, ...partialMatches]
                .filter(coach => coach.id !== matchedCoach.id)
                .map(coach => (
                  <CoachCard key={coach.id} coach={coach} hasMatch={exactMatches.includes(coach)} />
                ))}
            </div>
          </div>
        )}
      </div>
      </div>
    );
  }


if (currentStage === 3) {
  return (

    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: 20,
      paddingBottom: 20,
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'  // Optional: adds a background color to the page
    }}>


    <div style={{
      width: '60%',
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: '1.5rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
    }}>

      {!jumpToUser && <ProgressBar />}
      <div style={{
        textAlign: 'center',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>
          About You
        </h2>

        <form style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          margin: '0 auto',
          textAlign: 'left'
        }}>
          <div style={{
            display: 'flex',
            gap: '1rem'
          }}>
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                fontSize: '1.0rem',
                fontWeight: 500,
                color: 'rgb(55, 65, 81)',
                marginBottom: '0.25rem'
              }}>
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                disabled={firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid rgb(209, 213, 219)',
                  fontSize: '1.0rem'
                }}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                fontSize: '1.0rem',
                fontWeight: 500,
                color: 'rgb(55, 65, 81)',
                marginBottom: '0.25rem'
              }}>
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                disabled={lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid rgb(209, 213, 219)',
                  fontSize: '1.0rem'
                }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '1.0rem',
              fontWeight: 500,
              color: 'rgb(55, 65, 81)',
              marginBottom: '0.25rem'
            }}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              disabled={email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid rgb(209, 213, 219)',
                fontSize: '1.0rem'
              }}
              required
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '1.0rem',
              fontWeight: 500,
              color: 'rgb(55, 65, 81)',
              marginBottom: '0.25rem'
            }}>
              How did you find us?
            </label>
            <p style={{
              fontSize: '1.0rem',
              color: 'rgb(107, 114, 128)',
              marginBottom: '0.5rem'
            }}>
              How did you learn about MyBudgetCoach and your chosen coach on the platform? Please be specific as this helps us reach more people who want to get their finances in order.
            </p>
            <textarea
              value={formData.foundUs}
              onChange={(e) => setFormData(prev => ({ ...prev, foundUs: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid rgb(209, 213, 219)',
                fontSize: '1.0rem',
                minHeight: '6rem',
                resize: 'vertical'
              }}
              required
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '1.0rem',
              fontWeight: 500,
              color: 'rgb(55, 65, 81)',
              marginBottom: '0.25rem'
            }}>
              What is your motivation for seeking coaching?
            </label>
            <p style={{
              fontSize: '1.0rem',
              color: 'rgb(107, 114, 128)',
              marginBottom: '0.5rem'
            }}>
              We'll share this with your coach so they know a bit more about your hopes and desires for your finances.
            </p>
            <textarea
              value={formData.motivation}
              onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid rgb(209, 213, 219)',
                fontSize: '1.0rem',
                minHeight: '6rem',
                resize: 'vertical'
              }}
              required
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '1.0rem',
              fontWeight: 500,
              color: 'rgb(55, 65, 81)',
              marginBottom: '0.25rem'
            }}>
              Preferred Language
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid rgb(209, 213, 219)',
                fontSize: '1.0rem',
                backgroundColor: 'white'
              }}
              required
            >
              <option value="">Select a language</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: !jumpToUser ? 'space-between': 'right',
            marginTop: '1rem'
          }}>

            {!jumpToUser && 

              <button
                type="button"
                onClick={() => setCurrentStage(2)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid rgb(209, 213, 219)',
                  borderRadius: '0.375rem',
                  backgroundColor: 'white',
                  transition: 'background-color 150ms'
                }}
              >
                Back
              </button>
            }
            <button
              type="button" 
              onClick={handleSubmit}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#8719e0',
                color: 'white',
                borderRadius: '0.375rem',
                transition: 'background-color 150ms'
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}



  // Niche selection page
if (currentStage === 0) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: 20,
      paddingBottom: 20,
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'  // Optional: adds a background color to the page
    }}>

    <div style={{
      width: '60%',
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: '1.5rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
    }}>
      <ProgressBar />
      <div style={{
        marginBottom: '1.5rem'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          Select up to 3 that apply to you:
        </h2>
        {usingTestData && (
          <div style={{
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'rgb(107, 114, 128)'
          }}>
            No results found.
          </div>
        )}
      </div>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '1.5rem'
      }}>
        {uniqueNiches.map((niche) => (
          <label 
            key={niche} 
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              border: '1px solid',
              cursor: 'pointer',
              transition: 'all 200ms',
              ...selectedNiches.includes(niche) 
                ? {
                    backgroundColor: 'rgb(219, 234, 254)',
                    borderColor: 'rgb(59, 130, 246)',
                    color: 'rgb(29, 78, 216)'
                  }
                : {
                    backgroundColor: 'white',
                    borderColor: 'rgb(229, 231, 235)',
                    color: 'rgb(55, 65, 81)'
                  },
              ...(selectedNiches.length >= 3 && !selectedNiches.includes(niche)
                ? {
                    opacity: 0.5,
                    cursor: 'not-allowed'
                  }
                : {})
            }}
          >
            <input
              type="checkbox"
              checked={selectedNiches.includes(niche)}
              onChange={() => handleNicheSelection(niche)}
              disabled={selectedNiches.length >= 3 && !selectedNiches.includes(niche)}
              style={{ display: 'none' }}
            />
            <span>{niche}</span>
          </label>
        ))}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '0.875rem',
          color: 'rgb(107, 114, 128)'
        }}>
          Selected: {selectedNiches.length}/3
        </div> 


        <button
          onClick={() => setCurrentStage(1)}
          disabled={selectedNiches.length === 0}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: selectedNiches.length === 0 ? 'rgb(209, 213, 219)' : '#8719e0',
            color: 'white',
            borderRadius: '0.25rem',
            transition: 'background-color 150ms',
            cursor: selectedNiches.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          Next
        </button>



      </div>
    </div>
    </div>

  );
}
  // Price selection page
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: 20,
      paddingBottom: 20,
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'  // Optional: adds a background color to the page
    }}>

    <div style={{
      width: '60%',
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: '1.5rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
    }}>
      <ProgressBar />
      <div style={{
        marginBottom: '1.5rem'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          What's your preferred price for 1-on-1 sessions?
        </h2>
        {usingTestData && (
          <div style={{
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'rgb(107, 114, 128)'
          }}>
            No results found.
          </div>
        )}
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        {['Affordable', 'Average', 'Premium'].map((price) => (
          <label 
            key={price}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            <input
              type="radio"
              name="price"
              value={price}
              checked={selectedPrice === price}
              onChange={() => setSelectedPrice(price)}
              style={{
                width: '1rem',
                height: '1rem',
                color: '#8719e0'
              }}
            />
            <span style={{ color: 'rgb(55, 65, 81)' }}>{price}</span>
          </label>
        ))}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between'
      }}>


        <button
          onClick={() => setCurrentStage(0)}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid rgb(209, 213, 219)',
            borderRadius: '0.25rem',
            transition: 'background-color 150ms'
          }}
        >
          Back
        </button>
        <button
          onClick={() => setCurrentStage(2)}
          disabled={!selectedPrice}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: !selectedPrice ? 'rgb(209, 213, 219)' : '#8719e0',
            color: 'white',
            borderRadius: '0.25rem',
            transition: 'background-color 150ms',
            cursor: !selectedPrice ? 'not-allowed' : 'pointer'
          }}
        >
          Find My Coach
        </button>

      </div>
    </div>
    </div>
  );
};

export default CoachQuiz;